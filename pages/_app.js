import App from 'next/app';
import firebase, { FirebaseContext } from '../firebase/index';
import useAutenticacion from '../hooks/useAutenticacion';

const MyApp = (props) => {

  const usuario = useAutenticacion(); //Cargas el hook se lo pasas al provider y con el contex accedes a el
  // console.log(usuario);

  const { Component, pagesProps } = props;
  
   return (

    <FirebaseContext.Provider
      value={{
            firebase,
            usuario
        }}
    >
      <Component{ ...pagesProps }/>

    </FirebaseContext.Provider>

   );
}

export default MyApp
