import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyA57TGMtVjnOx7L_is66mlDMt49pbVbubM",
  authDomain: "whatsapp-clone-94847.firebaseapp.com",
  projectId: "whatsapp-clone-94847",
  storageBucket: "whatsapp-clone-94847.appspot.com",
  messagingSenderId: "800015449000",
  appId: "1:800015449000:web:03220af3925e1d56de7b9d",
  measurementId: "G-WQDFNXDHPP"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

export {auth, googleProvider};
export default db;
