/* eslint-disable @next/next/no-img-element */
import { useEffect, useContext, useState, Fragment } from "react";
import { useRouter } from "next/router";


import { FirebaseContext } from '../../firebase/index';
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import Layout from '../../components/layout/Layout';
import Error404  from '../../components/layout/Error404';

import { Campo, InputSubmit } from '../../components/UI/Formulario';
import Boton  from '../../components/UI/Boton';


//Style components:

const ContenedorProducto = styled.div`
  @media (min-width: 768px){
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;

const ComentarioProducto = styled.p`
    padding: 0.5rem 2rem;
    background-color: #DA552F;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;

const Producto = () => {

    // States Locales:
    const[ producto, guardarProducto ] = useState({});
    const[ error, guardarError ] = useState(false);
    const[ comentario, guardarComentatio ] = useState({});
    const[ consultarDB, guardarContultarDb ] = useState(true);

    // Router para obtener el ID actucal:
    const router = useRouter();

    // Obtenemos el ID:
    const{ query: { id } } = router;

    const { firebase, usuario } = useContext(FirebaseContext);

    // Porque el Id inicial es undefined:
    useEffect(() => {

       if(id && consultarDB) {
            const obtenerProducto = async () => {

                //Consulta a la base de datos:
                const productoQuery = await firebase.db.collection('productos').doc(id);
                const productoDB = await productoQuery.get();
                if( productoDB.exists ) {
                    guardarProducto(productoDB.data());
                    guardarContultarDb(false);
            
                } else {
                    guardarError(true);
                    guardarContultarDb(false);
                }
            }
            obtenerProducto();
       }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    if(Object.keys(producto).length === 0 && !error) return 'Cargando...';

    //Aplicamos Destructuring al objeto de producto:
     const{
            nombre, 
            empresa, 
            url, 
            creado, 
            descripcion, 
            urlImagen, 
            comentarios, 
            votos,
            creador,
            haVotado
         } = producto;


    // Funcion para agregar votos de manera local y a la DB de firebase:
    const votarProducto = ()=> {
        
        if(!usuario){
            return router.push('/');
        }

        // Sumar voto al producto:
        const nuevoTotal = votos + 1;
        
        // Verificar si el usuario actual ha votado:
        if(haVotado.includes(usuario.uid)) return;

        // Guardar el usuario que ha votado:
        const nuevoHaVotado = [...haVotado, usuario.uid];

        // ACtualizamos la DB:
        firebase.db.collection('productos').doc(id).update({
            votos: nuevoTotal,
            haVotado: nuevoHaVotado
        })

        // Actualizamos el state que es local:
        guardarProducto({
            ...producto, 
            votos: nuevoTotal
        })

        guardarContultarDb(true); //Si hay nuevo voto consulta nuevamente a la DB
    } 

    // Funcion para crear comentarios, este actualiza el state local:
    const comentarioChange = e => {
        guardarComentatio({
            ...comentario,
            [e.target.name]: e.target.value
        })
    }

    // Verificar si el comentrio es el del creador del producto:
    const creadorComentario = (id) => {
        if(creador.id === id) {
            return true;
        }
    }

    //Funcion para agregar comentario a la DB de firebase:
    const agregarComentario = e => {
        e.preventDefault();

        // Aunque los comentarios no se muestran a usuarios no autenticados es una capa extra de seguridad:
        if(!usuario){
            return router.push('/');
        }

        // Agregando información al state local de comentario: (Ojo el no usa el hook para guardar)
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;
        comentario.id = Date.now();

        // Tomar copia del comentario y lo agrego a arreglo de comentarios que viene de la DB de firebase:
        const nuevoComentario = [...comentarios, comentario];

        // Actualizamos el State local del producto:
        guardarProducto({
            ...producto,
            comentarios: nuevoComentario
        });

         // ACtualizamos la DB:
        firebase.db.collection('productos').doc(id).update({
            comentarios: nuevoComentario
        })

        guardarContultarDb(true); //Si hay nuevo comentario consulta nuevamente a la DB
    }

    // Función que revisa si el creador es el mismo que esta autenticado:
    const puedeBorrar = () => {
        if(!usuario) return false;

        if(creador.id === usuario.uid){
            return true;
        } 
    }

    // Función que elimina el producto:
    const eliminarProducto = async () => {

        // Capa extra de seguridad:
        if(!usuario) {
            return router.push('/login');
            };

         // Capa extra de seguridad:
        if(creador.id !== usuario.uid){
            return router.push('/');
        } 

        try {

            await firebase.db.collection('productos').doc(id).delete();
            router.push('/');
            
        } catch (error) {
            console.log(error);
        }

    }

    return (  

        <Layout>
            <Fragment>
                 { error? <Error404 /> :(
                    <div css={
                     css`
                        max-width: 1200px;
                        width: 95%;
                        padding: 5rem 0;
                        margin: 0 auto;
                     `
                 }>
                     <h1
                        css={
                            css`
                               text-align: center ;
                               margin-top: 5rem;
                            `
                        }
                     >
                         {nombre}
                     </h1>

                     <ContenedorProducto>
                         <div>
                            <p>Publicado Hace: {formatDistanceToNow( new Date(creado), { locale: es })}</p>
                            <p>Creado por: {creador.nombre} de {empresa}</p>
                            <img src={urlImagen} alt={nombre} />
                            <p>{descripcion}</p>

                          { usuario && (
                              <Fragment>
                                  <h2>Agrega tu Comentatio</h2>
                                <form 
                                    onSubmit={agregarComentario} >
                                    <Campo>
                                        <input 
                                            type="text" 
                                            name="mensaje"
                                            onChange={comentarioChange}/> 
                                    </Campo>

                                    <InputSubmit
                                        type= "submit"
                                        value="Agrega comentario"
                                    />
                                </form>
                              </Fragment>
                          )}

                            <h2 css={
                                css`
                                 margin: 2rem 0;
                                `
                            }> Comentarios:</h2>

                            <ul >

                                {comentarios.length === 0 ? (<p>No hay comentarios aun</p>):
                                (comentarios.map(comentario => {
                                   return (
                                        <li key={comentario.id}
                                         css={
                                            css`
                                                border: 1px solid #e1e1e1;
                                                padding: 2rem;
                                                margin-top: 1.5rem;
                                            `}
                                        >
                                            <p> {comentario.mensaje} </p>
                                            {creadorComentario(comentario.usuarioId) && <ComentarioProducto>Es creador</ComentarioProducto>}
                                            <p> Escrito por: <span css={css`font-weight: bold`}>{ comentario.usuarioNombre} </span> </p>
                                        </li>
                                       
                                    )
                                  } 
                                ))}

                            </ul>

                         </div>

                         <aside>
                                <Boton
                                    bgColor="true"
                                    target="_blank"
                                    href={url}
                                >
                                    Visitar Url
                                </Boton>

                                {usuario&& (
                                    <Boton
                                        onClick={votarProducto}
                                    >
                                        Votar
                                    </Boton>
                                )}
                                

                                <p css={css`text-align:center;`}>{votos} Votos</p>
                         </aside>
                     </ContenedorProducto>
                     { puedeBorrar() && <Boton onClick={()=> eliminarProducto()}>Eliminar</Boton>}
                 </div>
                 )}
            </Fragment>
        </Layout>
    );
}
 
export default Producto;