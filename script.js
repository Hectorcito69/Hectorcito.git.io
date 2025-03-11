
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyAhaC3BhMkaRECppVD86t-ToG_oGm6XDn4",
  authDomain: "votacionpagina.firebaseapp.com",
  projectId: "votacionpagina",
  storageBucket: "votacionpagina.firebasestorage.app",
  messagingSenderId: "525356536098",
  appId: "1:525356536098:web:5dfa7faef91bd216a7d57b",
  measurementId: "G-FT0D8H10LH"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();


async function register() {
    let email = document.getElementById("regEmail").value;
    let password = document.getElementById("regPassword").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        alert("Registro exitoso, inicia sesión.");
    } catch (error) {
        alert("Error: " + error.message);
    }
}


async function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "votacion.html"; 
    } catch (error) {
        alert("Error: " + error.message);
    }
}


async function logout() {
    try {
        await signOut(auth);
        window.location.href = "index.html"; 
    } catch (error) {
        alert("Error al cerrar sesión: " + error.message);
    }
}


async function votar(imagen) {
    let user = auth.currentUser;
    if (!user) {
        alert("Debes iniciar sesión para votar.");
        return;
    }

    let userId = user.uid;
    let votoRef = doc(db, "votos", userId);

    try {
        const docSnap = await getDoc(votoRef);
        if (docSnap.exists()) {
            document.getElementById("mensaje").innerText = "Ya has votado antes.";
        } else {
            await setDoc(votoRef, { imagen: imagen });
            document.getElementById("mensaje").innerText = "Voto registrado correctamente.";
        }
    } catch (error) {
        alert("Error al registrar voto: " + error.message);
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Usuario autenticado:", user.email);
    } else {
        console.log("Usuario no autenticado.");
    }
});
