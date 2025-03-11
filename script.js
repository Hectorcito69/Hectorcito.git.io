// Importar módulos de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAhaC3BhMkaRECppVD86t-ToG_oGm6XDn4",
  authDomain: "votacionpagina.firebaseapp.com",
  projectId: "votacionpagina",
  storageBucket: "votacionpagina.appspot.com",
  messagingSenderId: "525356536098",
  appId: "1:525356536098:web:5dfa7faef91bd216a7d57b",
  measurementId: "G-FT0D8H10LH"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

console.log("Firebase inicializado correctamente.");

// REGISTRO DE USUARIO
async function register() {
    let email = document.getElementById("regEmail").value;
    let password = document.getElementById("regPassword").value;

    console.log("Intentando registrar usuario con email:", email);

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Registro exitoso:", userCredential.user);
        alert("Registro exitoso, inicia sesión.");
    } catch (error) {
        console.error("Error en registro:", error.code, error.message);
        alert("Error: " + error.message);
    }
}

// LOGIN
async function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    console.log("Intentando iniciar sesión con:", email);

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Inicio de sesión exitoso:", userCredential.user);
        window.location.href = "votacion.html"; // Redirige a la página de votación
    } catch (error) {
        console.error("Error en login:", error.code, error.message);
        alert("Error: " + error.message);
    }
}

// LOGOUT
async function logout() {
    try {
        await signOut(auth);
        console.log("Sesión cerrada.");
        window.location.href = "index.html"; // Redirige al login
    } catch (error) {
        console.error("Error al cerrar sesión:", error.message);
        alert("Error al cerrar sesión: " + error.message);
    }
}

// VOTACIÓN
async function votar(imagen) {
    let user = auth.currentUser;
    if (!user) {
        alert("Debes iniciar sesión para votar.");
        return;
    }

    let userId = user.uid;
    let votoRef = doc(db, "votos", userId);

    console.log(`Usuario ${userId} está intentando votar por ${imagen}`);

    try {
        const docSnap = await getDoc(votoRef);
        if (docSnap.exists()) {
            document.getElementById("mensaje").innerText = "Ya has votado antes.";
        } else {
            await setDoc(votoRef, { imagen: imagen });
            document.getElementById("mensaje").innerText = "Voto registrado correctamente.";
        }
    } catch (error) {
        console.error("Error al registrar voto:", error.message);
        alert("Error al registrar voto: " + error.message);
    }
}

// MONITOREAR SESIÓN DEL USUARIO
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Usuario autenticado:", user.email);
    } else {
        console.log("Usuario no autenticado.");
    }
});

// Exportar funciones globalmente para HTML
window.register = register;
window.login = login;
window.logout = logout;
window.votar = votar;
