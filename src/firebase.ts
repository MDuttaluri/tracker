// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = {
    apiKey: "AIzaSyCpAipEUN30yCPLDo1yNBxL2qnvIcJsEPk",
    authDomain: "tracker-1ed54.firebaseapp.com",
    projectId: "tracker-1ed54",
    storageBucket: "tracker-1ed54.appspot.com",
    messagingSenderId: "431266305593",
    appId: "1:431266305593:web:ee6f80ef46e8d1acf15fe8",
    measurementId: "G-6VNSSJZ2DJ"
};

// Initialize Firebase
export function initaliseFirebase() {
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    //const auth = getAuth();
    //onAuthStateChanged(auth, (user) => authStateChangeHandler)
}


//function authStateChangeHandler(user: User) {
//    console.log(`user status changed...`);

//}





