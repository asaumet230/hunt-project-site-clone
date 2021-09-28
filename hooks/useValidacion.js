import { useState, useEffect } from "react";

const useValidacion = (stateInicial, validar, fn) => {

    const [ valores, guardarValores ] = useState(stateInicial);
    const [ errores, guardarErrores ] = useState({});
    const [ submitForm, guardarSubmitFomr ] = useState(false);

    useEffect(() => {
        if(submitForm){
            const noErrores = Object.keys(errores).length === 0;

            if(noErrores){
                fn(); // Fn = Función que se ejecuta en el componente ('Crear Sección, Login ó Crear Producto')
            }

            guardarSubmitFomr(false); // Para parar la función y evitar que no se ejecute todo el tiempo
        }
   
   
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errores]);

    // Función que se ejecuta conforme el usuario escribe:
    const handleChange = (e) => {
        guardarValores({
            ...valores,
            [e.target.name] : e.target.value
        });
    };

    // Funcion que se ejecuta cuando el usuario hace submit:
    const handleSubmit = (e) => {
        e.preventDefault();
        const erroresValidacion = validar(valores);
        guardarErrores( erroresValidacion );
        guardarSubmitFomr(true);
    };

    //Validacion en timepo real:
    const handleBlur = () => {
        const erroresValidacion = validar(valores);
        guardarErrores( erroresValidacion );
    }

    return {
        valores,
        errores,
        handleChange,
        handleSubmit,
        handleBlur
    };
}
 
export default useValidacion;