// src/screens/auth/NewPasswordScreen.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createNewPassword as authCreateNewPassword } from '../../services/auth';

const NewPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      await authCreateNewPassword(email, newPassword);
      setMessage('Senha redefinida com sucesso. Redirecionando para o login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container is-flex is-justify-content-center is-align-items-center" style={{ minHeight: '100vh' }}>
      <div className="box" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 className="title is-5 has-text-centered">Criar Nova Senha</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input
                className="input"
                type="email"
                placeholder="Email utilizado na recuperação"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Nova Senha</label>
            <div className="control">
              <input
                className="input"
                type="password"
                placeholder="Sua nova senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Confirmar Senha</label>
            <div className="control">
              <input
                className="input"
                type="password"
                placeholder="Confirme sua nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          {message && <p className="has-text-success has-text-centered">{message}</p>}
          {error && <p className="has-text-danger has-text-centered">{error}</p>}
          <div className="field">
            <div className="control has-text-centered">
              <button
                type="submit"
                className={`button is-info is-fullwidth ${loading ? 'is-loading' : ''}`}
                disabled={loading}
              >
                Redefinir Senha
              </button>
            </div>
          </div>
        </form>
        <hr />
        <div className="has-text-centered">
          <Link to="/login">Voltar para o Login</Link>
        </div>
      </div>
    </div>
  );
};

export default NewPasswordScreen;