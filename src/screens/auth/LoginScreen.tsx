// src/screens/auth/LoginScreen.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as authLogin } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await authLogin(username, password);
      login(user);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
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
                placeholder="Seu usuário"
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
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          {error && <p className="has-text-danger has-text-centered">{error}</p>}
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