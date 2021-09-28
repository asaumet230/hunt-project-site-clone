import React, { Fragment } from 'react';
import { css } from '@emotion/react';
import Layout from '../components/layout/Layout';
import DetallesProducto from '../components/layout/DetallesProducto';
import useProductos from '../hooks/useProductos';


const Populares = () => {

 const {productos} = useProductos('votos');

  return (

    <Fragment>
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
                {productos.map(producto => (
                   <DetallesProducto
                     key= {producto.id}
                     producto={producto}
                   />
                ))}
              </ul>
            </div>
          </div>
        </Layout>
    </Fragment>

  )
}

export default Populares;