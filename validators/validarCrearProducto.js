
export default function validarCrearProducto( valores ) {

    let errores = {};

    // Validar Nombre:
    if(!valores.nombre) {
        errores.nombre = 'El nombre es obligatorio';
    }

    // Validar Empresa:
    if(!valores.empresa) {
        errores.empresa = 'El nombre de empresa es obligatorio';
    }

     // Validar url:
    if(!valores.url) {
        errores.url = 'La url es obligatoria';
    } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)){
        errores.url = 'La url no tiene formato valido';
    }

    // Validar descripción:
    if(!valores.descripcion) {
        errores.descripcion = 'Agrega descripción a tu producto';
    }

    return errores;
}