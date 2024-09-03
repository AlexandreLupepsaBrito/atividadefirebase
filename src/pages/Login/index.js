import React ,{ useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { db, auth } from '../../firebaseConnection';

import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';


function Login() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdPost] = useState('');

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [usuario, setUsuario] =useState('');
  const [detalhesUsuario, setDetalhesUsuario] = useState({});

  const [post, setPost] = useState([]);

  useEffect(() => {
    async function carregarPost() {
      const dados = onSnapshot(collection(db, "posts"), (Snapshot) => {
        let listaPost = [];

        Snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          });
        });
        setPost(listaPost);
      });
    }
    carregarPost(); 
  }, []);
  useEffect(()=>{
    async function verificarLogin(){

      onAuthStateChanged(auth, (user) => {
        if(user){
          //tem usuario logado
          setUsuario(true);
          setDetalhesUsuario({
            uid: user.uid,
            email: user.email
          })
        } else{
          // não possui usuario logado
          setUsuario(false);
          setDetalhesUsuario({});
        }
      })

    }
    verificarLogin();
  },[])

async function novoUsuario(){
  await createUserWithEmailAndPassword (auth, email, senha)
  .then(()=>{
    alert("Usuário cadastrado com sucesso!")
    setEmail(""); 
    setSenha("");
  }).catch((error)=>{
    if(error.code === 'auth/weak-password'){
      alert("Senha muito fraca ")
    } else if (error.code === 'auth/email-already-in-use'){
      alert("E-mail já existe")
    }
  })
}

async function logarUsuario(){
  await signInWithEmailAndPassword(auth, email, senha)
  .then((value)=>{
    alert("usuario logado com sucesso")

    setUsuario(true);
    setDetalhesUsuario({
      uid: value.user.uid,
      email: value.user.email,
    });
    setEmail("");
    setSenha("");
  })
  .catch(()=>{
    alert("Erro ao fazer login")
  })
}

async function fazerLogout(){
  await signOut(auth)
  setUsuario(false)
  setDetalhesUsuario({})
}


function Login() {
  return (
    <div className="container-carrinho">
    <div className="formulario-login">
      <div className="login">
        <div className="centralizar">
          <div className="img-container">
            <img src="/imagens/LogoFeiraGreen.png" alt="Logo Feira Green" />
          </div>

          <form>
            <label htmlFor="username">
              <b>Nome de usuário</b>
            </label>
            <input
              type="email"
              placeholder="Digite um email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">
              <b>Senha</b>
            </label>
            <input
              type='password'
              placeholder="Digite uma senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            <button onClick={novoUsuario}>Cadastrar</button>
            <button onClick={logarUsuario}>Login</button>
          </form>

          <div className="links">
            <Link to="/">Esqueceu a senha?</Link>
            <Link to="/">Criar uma conta</Link>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}}

export default Login;