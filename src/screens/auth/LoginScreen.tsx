import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as authLogin } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth(); // Agora 'login' não será undefined
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // 1. Chama o serviço de API
      const response = await authLogin(username, password);
      console.log('Resposta do login:', response);
      // Garante que o objeto salvo no contexto tenha token e usuario
      const userData = {
        token: response.token || '',
        usuario: response.usuario || {
          id: 0,
          nome: username,
          perfil: 'ADMIN',
        },
      };
      console.log('UserData salvo:', userData);
      login(userData);
      navigate('/');
    } catch (err: any) {
      console.error('Erro no login:', err);
      setError(err?.message || 'Erro ao realizar login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container is-flex is-justify-content-center is-align-items-center" style={{ minHeight: '100vh' }}>
      <div className="box" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 className="title is-4 has-text-centered">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="field">
            <label className="label">Usuário</label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Senha</label>
            <div className="control">
              <input
                className="input"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          {error && <p className="has-text-danger has-text-centered mb-3">{error}</p>}
          <div className="field">
            <div className="control has-text-centered">
              <button
                type="submit"
                className={`button is-info is-fullwidth ${loading ? 'is-loading' : ''}`}
                disabled={loading}
              >
                Entrar
              </button>
            </div>
          </div>
        </form>
        <hr />
        <div className="has-text-centered">
          <Link to="/forgot-password">Esqueci minha senha</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;