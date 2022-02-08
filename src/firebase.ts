// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = {
    apiKey: "AIzaSyB1ted-wRkWuHdKsd0PHDCDN9qwwNDxLqs",
    authDomain: "traq-it-b8b7d.firebaseapp.com",
    projectId: "traq-it-b8b7d",
    storageBucket: "traq-it-b8b7d.appspot.com",
    messagingSenderId: "400453062456",
    appId: "1:400453062456:web:f13a2a2f373d324dbabbcd",
    measurementId: "G-LZPR2BHPB2"
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





