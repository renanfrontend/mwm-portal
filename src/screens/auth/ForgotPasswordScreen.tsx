// src/screens/auth/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword as authForgotPassword } from '../../services/auth';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await authForgotPassword(email);
      setMessage('Um email de redefinição de senha foi enviado para você.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container is-flex is-justify-content-center is-align-items-center" style={{ minHeight: '100vh' }}>
      <div className="box" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 className="title is-5 has-text-centered">Recuperação de Senha</h1>
        <p className="has-text-centered mb-4">
          Digite seu email para receber as instruções de redefinição.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input
                className="input"
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                Enviar
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

export default ForgotPasswordScreen;