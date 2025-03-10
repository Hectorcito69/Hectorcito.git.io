import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth();

document.getElementById("registro").addEventListener("submit", async (e) => {
    e.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    
    try {
        const credenciales = await createUserWithEmailAndPassword(auth, email, password);
        alert("Usuario registrado 🎉");
    } catch (error) {
        alert(error.message);
    }
});

document.getElementById("login").addEventListener("submit", async (e) => {
    e.preventDefault();
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Inicio de sesión exitoso 🎉");
    } catch (error) {
        alert(error.message);
    }
});

async function votar(opcion) {
    const user = auth.currentUser;
    if (!user) {
        alert("Debes iniciar sesión para votar.");
        return;
    }

    const docRef = doc(db, "votos", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        alert("Ya has votado ❌");
    } else {
        await setDoc(docRef, { opcion });
        alert("Voto registrado ✅");
        mostrarResultados();
    }
}

async function mostrarResultados() {
    const querySnapshot = await getDocs(collection(db, "votos"));
    let conteo = {};

    querySnapshot.forEach((doc) => {
        let opcion = doc.data().opcion;
        conteo[opcion] = (conteo[opcion] || 0) + 1;
    });

    document.getElementById("resultados").textContent = JSON.stringify(conteo, null, 2);
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        mostrarResultados();
    }
});

window.votar = votar;
