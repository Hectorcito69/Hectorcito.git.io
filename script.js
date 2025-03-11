// Importamos Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAhaC3BhMkaRECppVD86t-ToG_oGm6XDn4",
    authDomain: "votacionpagina.firebaseapp.com",
    projectId: "votacionpagina",
    storageBucket: "votacionpagina.firebasestorage.app",
    messagingSenderId: "525356536098",
    appId: "1:525356536098:web:5dfa7faef91bd216a7d57b",
    measurementId: "G-FT0D8H10LH"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// REGISTRAR USUARIO
document.getElementById("btnRegister")?.addEventListener("click", () => {
    let email = document.getElementById("regEmail").value;
    let password = document.getElementById("regPassword").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            alert("Registro exitoso, inicia sesión.");
        })
        .catch(error => alert(error.message));
});

// INICIAR SESIÓN
document.getElementById("btnLogin")?.addEventListener("click", () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            window.location.href = "votacion.html"; // Redirige a la votación
        })
        .catch(error => alert(error.message));
});

// CERRAR SESIÓN
document.getElementById("btnLogout")?.addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.href = "index.html"; // Redirige al login
    });
});

// FUNCIÓN PARA VOTAR
function votar(imagen) {
    const user = auth.currentUser;
    if (!user) {
        alert("Debes iniciar sesión para votar.");
        return;
    }

    const userId = user.uid;
    const votoRef = doc(db, "votos", userId);

    getDoc(votoRef).then(docSnap => {
        if (docSnap.exists()) {
            document.getElementById("mensaje").innerText = "Ya has votado antes.";
        } else {
            setDoc(votoRef, { imagen: imagen }).then(() => {
                document.getElementById("mensaje").innerText = "Voto registrado correctamente.";
            });
        }
    });
}

// COMPROBAR SI EL USUARIO ESTÁ AUTENTICADO
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Usuario autenticado:", user.email);
    } else {
        console.log("No hay usuario autenticado.");
    }
});
