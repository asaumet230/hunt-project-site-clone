import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { css } from '@emotion/react';

import Layout from '../components/layout/Layout';
import useProductos from '../hooks/useProductos';
import DetallesProducto from '../components/layout/DetallesProducto';


const Buscar = () => {

  // state Local:
  const [ resultado, guardarResultado ] = useState([]);

  const router = useRouter();
  const{ query: { q } } = router;
  // console.log(q);

  const { productos } = useProductos('creado');

  useEffect(() => {

    // Pasamos la busqueda a minúscula:
    const busqueda = q.toLocaleLowerCase();

    // Filtramos los productos:
    const filtro = productos.filter( producto => {
        return (
          producto.nombre.toLocaleLowerCase().includes(busqueda) ||
          producto.descripcion.toLocaleLowerCase().includes(busqueda)
        );
    });

    guardarResultado(filtro);

    
  }, [q, productos])

  return (

    <div>
       <Layout>
          <div css={
            css`
              background-color: #f3f3f3;
            `
          }>
            <div css= {
              css`
                max-width: 1200px;
                width: 95%;
                padding: 5rem 0;
                margin: 0 auto;
              `
            }>
              <ul css= {
                css`
                  background-color: #fff;
                `
              }>
                {resultado.map(producto => (
                   <DetallesProducto
                     key= {producto.id}
                     producto={producto}
                   />
                ))}
              </ul>
            </div>
          </div>
        </Layout>
    </div>

  )
}

export default Buscar;