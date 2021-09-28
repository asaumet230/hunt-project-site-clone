import { Fragment, useState, useContext} from 'react';
import { css } from '@emotion/react';
import { useRouter } from 'next/router'
import FileUploader from "react-firebase-file-uploader";

import { FirebaseContext } from '../firebase/index';


import Error404 from '../components/layout/Error404';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/UI/Formulario';

// Validación:
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validators/validarCrearProducto';

// State Inicial:
const STATE_INICIAL = {
  nombre: '',
  empresa:'',
  imagen: '',
  url: '',
  descripcion:''
}


const NuevoProducto = () => {

  // States de la imagen:
  const [nombreImagen, guardarNombre] = useState('');
  const [subiendo, guardarSubiendo] = useState(false);
  const [progreso, guardarProgreso] = useState(0);
  const [urlImagen, guardarUrlImagen] = useState('');

  // State del Error:
  const [error, guardarError ] = useState(false);

  const  {
          valores,
          errores,
          handleChange,
          handleSubmit,
          handleBlur } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto );

  // Extraer los valores del Hook:
  const { nombre, empresa, imagen, url, descripcion } = valores;

  // Hook para redireccionar (otra forma de hacerlo):
  const router = useRouter();

  // Context par la funcionalidad del Firebase es decir el CRUD:
  const { usuario, firebase } = useContext(FirebaseContext);

  // console.log(usuario);


  async function crearProducto() {

    if(!usuario) {
      return router.push('/login');
    }

    // Creamos objeto de nuevo producto:
    const producto = {
      nombre,
      empresa,
      url,
      urlImagen,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador:{
        id: usuario.uid,
        nombre: usuario.displayName
      },
      haVotado: []
    };

    // Insertar el objeto en la base de datos (la colección o la tabla que se crea es productos):
      firebase.db.collection('productos').add(producto);

      return router.push('/');

  }

  // Funciones del modulo de FileUploader:

  const handleUploadStart = () => {
    guardarProgreso(0);
    guardarSubiendo(true);
  };

  const handleProgress = progreso => guardarProgreso({progreso});

  const handleUploadError = error => {
    guardarSubiendo(true);
    console.error(error);
  }

  const handleUploadSuccess = nombre => {
    guardarProgreso(100);
    guardarSubiendo(false);
    guardarNombre(nombre);
    firebase
     .storage
     .ref("productos")
     .child(nombre)
     .getDownloadURL()
     .then(url => {
       console.log(url);
       guardarUrlImagen(url);
      });
  }


  return (

    <div
      css ={
        css`
         margin-bottom: 10rem;
        `
      }>
        <Layout>
          {!usuario? (<Error404 />):(
            <Fragment>
              <h1 css={
                css`
                text-align: center;
                margin-top: 5rem;
                `
              }>Nuevo Producto</h1>

              <Formulario
                onSubmit={handleSubmit}
              >

              <fieldset>
                <legend>Información General</legend>

                <Campo>
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    placeholder="Nombre del producto"
                    name="nombre"
                    value={nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}/>
                </Campo>

                {errores.nombre && <Error>{errores.nombre}</Error>}

                  <Campo>
                  <label htmlFor="empresa">Empresa</label>
                  <input
                    type="text"
                    id="empresa"
                    placeholder="Nombre de empresa o compañia"
                    name="empresa"
                    value={empresa}
                    onChange={handleChange}
                    onBlur={handleBlur}/>
                </Campo>

                {errores.empresa && <Error>{errores.empresa}</Error>}

                <Campo>
                  <label htmlFor="imagen">Imagen</label>
                  <FileUploader
                    accept="image/*" // Este prop ayuda a subir imagenes de cualquier formato del modulo FileUploader
                    randomizeFilename
                    storageRef={firebase.storage.ref('productos')}
                    onUploadStart={handleUploadStart}
                    onProgress={handleProgress}
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={handleUploadError}
                    id="imagen"
                    name="imagen"/>
                </Campo>

                <Campo>
                  <label htmlFor="url">URL</label>
                  <input
                    type="text"
                    id="url"
                    placeholder= "url de la empresa"
                    name="url"
                    value={url}
                    onChange={handleChange}
                    onBlur={handleBlur}/>
                </Campo>

                {errores.url && <Error>{errores.url}</Error>}

              </fieldset>

              <fieldset>
                <legend>Sobre tu producto</legend>

              <Campo>
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  name="descripcion"
                  id="descripcion"
                  value={descripcion}
                  onChange={handleChange}
                  onBlur={handleBlur}>
                </textarea>
              </Campo>

              {errores.descripcion && <Error>{errores.descripcion}</Error>}

              </fieldset>


                {error && <Error>{error}</Error>}

                <InputSubmit
                  type="submit"
                  value="Crear Producto" />

              </Formulario>
          </Fragment>
            
          )}
         
        </Layout>
    </div>

  )
}

export default NuevoProducto;