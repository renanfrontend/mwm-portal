// src/components/TransportadoraList.tsx

import React, { useState } from 'react';
import { MdSearch, MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import { type TransportadoraItem } from '../types/models';
import useTheme from '../hooks/useTheme';

const mockTransportadoras: TransportadoraItem[] = [
  { id: '1', nomeFantasia: 'Primato', razaoSocial: 'Primato Cooperativa Agroindustrial', cnpj: '07.456.789/0001-12', telefone: '(45) 3376-1170', email: 'contato@primato.com.br', cidade: 'Toledo', uf: 'PR' },
  { id: '2', nomeFantasia: 'Agrocampo', razaoSocial: 'Agrocampo Transportes Ltda', cnpj: '12.345.678/0001-90', telefone: '(45) 3225-4455', email: 'logistica@agrocampo.com', cidade: 'Cascavel', uf: 'PR' },
  { id: '3', nomeFantasia: 'MWM', razaoSocial: 'MWM Transportes e Logística', cnpj: '98.765.432/0001-00', telefone: '(41) 3030-2020', email: 'sac@mwm.com.br', cidade: 'Curitiba', uf: 'PR' },
  { id: '4', nomeFantasia: 'Tupy', razaoSocial: 'Tupy Transportes S.A.', cnpj: '11.222.333/0001-44', telefone: '(47) 3441-8000', email: 'contato@tupy.com.br', cidade: 'Joinville', uf: 'SC' },
];

export const TransportadoraList: React.FC = () => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#a0aec0' : '#363636';
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = mockTransportadoras.filter(item => 
    item.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.cnpj.includes(searchTerm)
  );

  return (
    <div>
      <div className="level mb-4">
        <div className="level-left">
          <div className="field has-addons">
            <div className="control has-icons-left">
              <input 
                className="input" 
                type="text" 
                placeholder="Buscar transportadora..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="icon is-small is-left"><MdSearch /></span>
            </div>
            <div className="control"><button className="button is-light">Buscar</button></div>
          </div>
        </div>
        <div className="level-right">
          <button className="button is-link"><span className="icon"><MdAdd /></span><span>Adicionar</span></button>
        </div>
      </div>
      <div className="table-container">
        <table className="table is-fullwidth is-hoverable is-striped">
          <thead>
            <tr>
              <th style={{ color: textColor }}>Nome Fantasia</th>
              <th style={{ color: textColor }}>Razão Social</th>
              <th style={{ color: textColor }}>CNPJ</th>
              <th style={{ color: textColor }}>Telefone</th>
              <th style={{ color: textColor }}>E-mail</th>
              <th style={{ color: textColor }}>Cidade/UF</th>
              <th style={{ color: textColor, textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td style={{ verticalAlign: 'middle' }}><span className="has-text-weight-semibold">{item.nomeFantasia}</span></td>
                <td style={{ verticalAlign: 'middle' }}>{item.razaoSocial}</td>
                <td style={{ verticalAlign: 'middle' }}>{item.cnpj}</td>
                <td style={{ verticalAlign: 'middle' }}>{item.telefone}</td>
                <td style={{ verticalAlign: 'middle' }}>{item.email}</td>
                <td style={{ verticalAlign: 'middle' }}>{item.cidade} - {item.uf}</td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <button className="button is-small is-ghost" title="Editar"><span className="icon is-small"><MdEdit /></span></button>
                  <button className="button is-small is-ghost has-text-danger" title="Excluir"><span className="icon is-small"><MdDelete /></span></button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && <tr><td colSpan={7} className="has-text-centered py-5 has-text-grey">Nenhuma transportadora encontrada.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};