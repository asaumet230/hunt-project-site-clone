import app from "firebase/app"; //Libreria de firebase
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import firebaseConfig from "./config";


class Firebase {

    constructor(){

        if(!app.apps.length){
             app.initializeApp(firebaseConfig);
        }

        // Habilita los metodos de autneticación de Firebase:
        this.auth = app.auth();

        // Habilira el uso de las bases de datos de Firestore en Firebase y lo nombramos this.db:
        this.db = app.firestore();

        // Habilita el almacenamiento en el storage de firebase:
        this.storage = app.storage();
       
    }

    // Registrar un usuario:
    async registrar(nombre, email, password) {
        
        const nuevoUsuario = await this.auth.createUserWithEmailAndPassword(email, password)
        
        return await nuevoUsuario.user.updateProfile({
            displayName: nombre
        })
    }

    // Login Usuario ó autenticación en Firebase:
    async login(email, password) {
        
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    // Cerrar Sesión del usuario:
    async cerrarSesion(){
        
         await this.auth.signOut();
    }

}

const firebase = new Firebase();

export default firebase;