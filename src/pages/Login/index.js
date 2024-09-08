import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db, storage } from '../../firebaseConnection';
import './Login.css';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [novoNome, setNovoNome] = useState('');
  const [novoCpf, setNovoCpf] = useState('');
  const [editarPerfil, setEditarPerfil] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [cadastroCompleto, setCadastroCompleto] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'usuarios', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const dados = docSnap.data();
          if (dados.nome && dados.cpf && dados.fotoPerfil) {
            setCadastroCompleto(true);
            setUsuario({
              uid: user.uid,
              email: user.email,
              nome: dados.nome,
              cpf: dados.cpf,
              fotoPerfil: dados.fotoPerfil,
            });
          } else {
            setCadastroCompleto(false);
            setUsuario({
              uid: user.uid,
              email: user.email,
            });
          }
        } else {
          setCadastroCompleto(false);
          setUsuario({
            uid: user.uid,
            email: user.email,
          });
        }
      } else {
        setUsuario(null);
      }
    });

    return () => unsubscribe();
  }, []);

  async function novoUsuario(e) {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      setUsuario({
        uid: user.uid,
        email: user.email,
      });

      setCadastroCompleto(false);

      alert('Usuário cadastrado com sucesso! Por favor, complete o cadastro.');
      setEmail('');
      setSenha('');
    } catch (error) {
      if (error.code === 'auth/weak-password') {
        alert('Senha muito fraca');
      } else if (error.code === 'auth/email-already-in-use') {
        alert('E-mail já existe');
      } else {
        alert('Erro ao criar usuário: ' + error.message);
      }
    }
  }

  async function logarUsuario(e) {
    e.preventDefault();
    try {
      const value = await signInWithEmailAndPassword(auth, email, senha);
      const user = value.user;

      const docRef = doc(db, 'usuarios', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const dados = docSnap.data();
        if (dados.nome && dados.cpf && dados.fotoPerfil) {
          setCadastroCompleto(true);
          setUsuario({
            uid: user.uid,
            email: user.email,
            nome: dados.nome,
            cpf: dados.cpf,
            fotoPerfil: dados.fotoPerfil,
          });
        } else {
          setCadastroCompleto(false);
        }
      } else {
        setCadastroCompleto(false);
      }
      setEmail('');
      setSenha('');
      alert('Usuário logado com sucesso');
    } catch (error) {
      alert('Erro ao fazer login: ' + error.message);
    }
  }

  async function fazerLogout() {
    await signOut(auth);
    setUsuario(null);
    alert('Usuário deslogado com sucesso!');
  }

  async function completarCadastro(e) {
    e.preventDefault();

    if (!nome || !cpf || !fotoPerfil) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const user = auth.currentUser;

      const fotoRef = ref(storage, `fotosPerfil/${user.uid}`);
      await uploadBytes(fotoRef, fotoPerfil);
      const fotoURL = await getDownloadURL(fotoRef);

      await setDoc(doc(db, 'usuarios', user.uid), {
        nome: nome,
        cpf: cpf,
        fotoPerfil: fotoURL,
      });

      await updateProfile(user, {
        displayName: nome,
      });

      alert('Cadastro completo com sucesso!');
      setCadastroCompleto(true);
      setUsuario({
        uid: user.uid,
        email: user.email,
        nome: nome,
        cpf: cpf,
        fotoPerfil: fotoURL,
      });
    } catch (error) {
      alert('Erro ao completar o cadastro: ' + error.message);
    }
  }

  function handleFotoPerfilChange(e) {
    if (e.target.files[0]) {
      setFotoPerfil(e.target.files[0]);
    }
  }

  async function atualizarPerfil(e) {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      const docRef = doc(db, 'usuarios', user.uid);

      const updates = {};
      if (novoNome) updates.nome = novoNome;
      if (novoCpf) updates.cpf = novoCpf;

      if (fotoPerfil) {
        const fotoRef = ref(storage, `fotosPerfil/${user.uid}`);
        await uploadBytes(fotoRef, fotoPerfil);
        updates.fotoPerfil = await getDownloadURL(fotoRef);
      }

      await setDoc(docRef, updates, { merge: true });

      if (novoNome) {
        await updateProfile(user, {
          displayName: novoNome,
        });
      }

      alert('Perfil atualizado com sucesso!');
      setUsuario((prev) => ({
        ...prev,
        ...updates,
      }));
      setEditarPerfil(false);
    } catch (error) {
      alert('Erro ao atualizar perfil: ' + error.message);
    }
  }

  return (
    <div className="container-carrinho">
      <div className="formulario-login">
        <div className="login">
          <div className="centralizar">
            <div className="img-container">
              <img src="/imagens/LogoFeiraGreen.png" alt="Logo Feira Green" />
            </div>

            {!usuario ? (
              <form>
                <label htmlFor="email">
                  <b>Email</b>
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
                  type="password"
                  placeholder="Digite uma senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />

                <button onClick={novoUsuario}>Cadastrar</button>
                <button onClick={logarUsuario}>Login</button>
              </form>
            ) : cadastroCompleto ? (
              <div>
                <h2>Bem-vindo, {usuario.nome}!</h2>
                <p>CPF: {usuario.cpf}</p>
                <img src={usuario.fotoPerfil} alt="Foto de Perfil" className="foto-perfil" />
                <button onClick={fazerLogout}>Logout</button>
                <button onClick={() => setEditarPerfil(true)}>Editar Perfil</button>
              </div>
            ) : (
              <form onSubmit={completarCadastro}>
                <h2>Complete seu cadastro</h2>

                <label htmlFor="nome">
                  <b>Nome</b>
                </label>
                <input
                  type="text"
                  placeholder="Digite seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />

                <label htmlFor="cpf">
                  <b>CPF</b>
                </label>
                <input
                  type="text"
                  placeholder="Digite seu CPF"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                />

                <label htmlFor="fotoPerfil">
                  <b>Foto de Perfil</b>
                </label>
                <input type="file" onChange={handleFotoPerfilChange} />

                <button type="submit">Salvar Informações</button>
              </form>
            )}

            {editarPerfil && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close-button" onClick={() => setEditarPerfil(false)}>&times;</span>
                  <h2>Editar Perfil</h2>

                  <form onSubmit={atualizarPerfil}>
                    <label htmlFor="novoNome">
                      <b>Nome</b>
                    </label>
                    <input
                      type="text"
                      placeholder="Digite seu novo nome"
                      value={novoNome}
                      onChange={(e) => setNovoNome(e.target.value)}
                    />

                    <label htmlFor="novoCpf">
                      <b>CPF</b>
                    </label>
                    <input
                      type="text"
                      placeholder="Digite seu novo CPF"
                      value={novoCpf}
                      onChange={(e) => setNovoCpf(e.target.value)}
                    />

                    <label htmlFor="fotoPerfil">
                      <b>Foto de Perfil</b>
                    </label>
                    <input type="file" onChange={handleFotoPerfilChange} />

                    <button type="submit">Salvar Alterações</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
