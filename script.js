import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, get, set, update, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Configuración de Firebase (REEMPLAZA con tus datos)
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROYECTO.firebaseapp.com",
    databaseURL: "https://TU_PROYECTO.firebaseio.com",
    projectId: "TU_PROYECTO",
    storageBucket: "TU_PROYECTO.appspot.com",
    messagingSenderId: "TU_MENSAJERIA",
    appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Registrar usuario
function register() {
    let email = document.getElementById("newEmail").value;
    let password = document.getElementById("newPassword").value;
    
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Registro exitoso");
            window.location.href = "index.html"; // Redirige a la página de votación
        })
        .catch((error) => {
            alert(error.message);
        });
}

// Iniciar sesión
function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            window.location.href = "index.html"; // Redirige a la página de votación
        })
        .catch((error) => {
            alert(error.message);
        });
}

// Cerrar sesión
function logout() {
    signOut(auth).then(() => {
        alert("Sesión cerrada");
        window.location.href = "login.html";
    });
}

// Votar
function votar(imagenId) {
    let user = auth.currentUser;
    
    if (!user) {
        alert("Debes iniciar sesión para votar");
        return;
    }

    let userId = user.uid;
    let userVoteRef = ref(db, 'usuarios/' + userId);

    get(userVoteRef).then((snapshot) => {
        if (snapshot.exists()) {
            alert("Ya has votado");
        } else {
            let votosRef = ref(db, 'votos/' + imagenId);
            get(votosRef).then((snapshot) => {
                let votos = snapshot.val() || 0;
                update(ref(db, 'votos/'), { [imagenId]: votos + 1 });
                set(userVoteRef, { voto: imagenId });
                alert("Voto registrado");
                document.querySelectorAll(".vote-btn").forEach(btn => btn.disabled = true);
            });
        }
    });
}

// Mostrar votos en tiempo real
function actualizarResultados() {
    onValue(ref(db, 'votos/'), (snapshot) => {
        const data = snapshot.val() || {};
        document.getElementById('votos1').innerText = data.img1 || 0;
        document.getElementById('votos2').innerText = data.img2 || 0;
        document.getElementById('votos3').innerText = data.img3 || 0;
    });
}

actualizarResultados();
