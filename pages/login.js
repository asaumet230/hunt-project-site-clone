import { Fragment, useState} from 'react';
import { css } from '@emotion/react';

import firebase from '../firebase/firebase';
import Router from 'next/router';

import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/UI/Formulario';

// Validación:
import useValidacion from '../hooks/useValidacion';
import validarIniciarSesion from '../validators/validarIniciarSesion';

// State Inicial:
const STATE_INICIAL = {
  email: '',
  password: ''
}

const Login = () => {

  const [error, guardarError ] = useState(false);

  const  { 
          valores,
          errores,
          handleChange,
          handleSubmit,
          handleBlur } = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion );

  // Extraer los valores del Hook:
  const { email, password } = valores;

  async function iniciarSesion () {

    try {
    
      await firebase.login(email, password);
      Router.push('/');


    } catch (error) {

      console.error('Hubo un error al autenticar el usuario', error.message);

    }


  }

  return (

    <div 
      css ={
        css`
         margin-bottom: 10rem;
        `
      }>
        <Layout>
          <Fragment>
            <h1 css={
              css`
               text-align: center;
               margin-top: 5rem;
              `
            }>Iniciar Sesión</h1>
            <Formulario
              onSubmit={handleSubmit}
            >
              <Campo>
                <label htmlFor="email">Email</label>
                <input 
                  type="email"
                  id="email"
                  placeholder="Tu email"
                  name="email" 
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}/>
              </Campo>

              {errores.email && <Error>{errores.email}</Error>}

              <Campo>
                <label htmlFor="password">Password</label>
                <input 
                  type="password"
                  id="password"
                  placeholder="Tu Password"
                  name="password"
                  value={password}
                  onChange={handleChange} 
                  onBlur={handleBlur}/>
              </Campo>

              {errores.password && <Error>{errores.password}</Error>}
              {error && <Error>{error}</Error>}

              <InputSubmit 
                type="submit"
                value="Iniciar Sesión" />

            </Formulario>
          </Fragment>
        </Layout>
    </div>


  )
}

export default Login;