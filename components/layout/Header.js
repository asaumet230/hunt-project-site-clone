/* eslint-disable @next/next/link-passhref */
import { Fragment, useContext } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { FirebaseContext } from '../../firebase/index';

//Components
import Buscar from "../UI/Buscar";
import Navegacion from "./Navegacion";

//CSS component
import Boton from "../UI/Boton";

const ContenedorHeader = styled.div`
    max-width: 1200px;
    width: 95%;
    margin: 0 auto;
    @media (min-width: 768px){
      display: flex;
      justify-content: space-between;
    }
`; 

const Logo  = styled.a`
    color: #DA552F;  
    font-size: 4rem;
    line-height: 0;
    font-weight: 700;
    font-family: 'Roboto Slab', sans-serif;
    margin-right: 2rem;
    cursor: pointer;
`;


const Header = () => {

    const { usuario, firebase } = useContext(FirebaseContext);

    return ( 
        <header
            css={css`
                    border-bottom: 2px solid #e1e1e1;
                    padding: 1rem 0;
                `}
        >
            <ContenedorHeader>
                <div css={
                    css`
                        display: flex;
                        align-items: center;
                    `
                }>
                    
                    <Link href="/">
                     <Logo>P</Logo>
                    </Link>
                   
                    <Buscar/>
                    
                    <Navegacion/>
                </div>

                <div css={
                    css`
                        display: flex;
                        align-items: center;
                    `}>

                    {usuario? 
                     (<Fragment>
                            <p css={
                            css`
                                margin-right: 2rem;
                            `}>
                                 Hola: { usuario.displayName }
                            </p>

                            <Boton 
                                bgColor={true}
                                onClick={ ()=> firebase.cerrarSesion() } >
                                Cerrar Sesión
                            </Boton>
                        </Fragment>): 
                    (<Fragment>
                        <Link href="/login">
                            <Boton bgColor={true} >
                                Login
                            </Boton>    
                        </Link>

                        <Link href="/crear-cuenta">
                            <Boton>
                                Crear Cuenta
                            </Boton>
                        </Link>
                    </Fragment>)}
                </div>
            </ContenedorHeader>
        </header>
     );
}
 
export default Header;