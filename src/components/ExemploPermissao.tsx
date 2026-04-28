import React from 'react';
import { useAuth } from '../context/AuthContext';
import { temPermissao } from '../utils/permissao';

const ExemploPermissao: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2>Exemplo de Permissão</h2>
      {temPermissao('PORTARIA_EXCLUIR', user) && (
        <button>Excluir</button>
      )}
      {!temPermissao('PORTARIA_EXCLUIR', user) && (
        <span>Você não tem permissão para excluir.</span>
      )}
    </div>
  );
};

export default ExemploPermissao;
