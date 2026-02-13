// src/components/TransportadoraEditModal.tsx

import React, { useState, useEffect } from 'react';
import type { TransportadoraItem } from '../types/models';
import useTheme from '../hooks/useTheme';
import { MdSave } from 'react-icons/md';
import { fetchCategorias, type CategoriaOption } from '../services/api';

interface Props {
  isActive: boolean;
  onClose: () => void;
  onSave: (item: TransportadoraItem) => void;
  data: TransportadoraItem | null;
}

const TransportadoraEditModal: React.FC<Props> = ({ isActive, onClose, onSave, data }) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#a0aec0' : '#363636';
  const [categorias, setCategorias] = useState<CategoriaOption[]>([]);

  // Carregar categorias ao montar
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const data = await fetchCategorias();
        setCategorias(data);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
      }
    };
    loadCategorias();
  }, []);

  // --- ESTADOS DA EMPRESA ---
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const [categoria, setCategoria] = useState('');
  
  // --- ESTADOS DOS CONTATOS ---
  // Contato Principal
  const [contatoPrincipalNome, setContatoPrincipalNome] = useState('');
  const [contatoPrincipalTel, setContatoPrincipalTel] = useState('');
  const [contatoPrincipalEmail, setContatoPrincipalEmail] = useState('');

  // Contato Comercial
  const [contatoComercialNome, setContatoComercialNome] = useState('');
  const [contatoComercialTel, setContatoComercialTel] = useState('');
  const [contatoComercialEmail, setContatoComercialEmail] = useState('');

  // Contato Financeiro
  const [contatoFinanceiroNome, setContatoFinanceiroNome] = useState('');
  const [contatoFinanceiroTel, setContatoFinanceiroTel] = useState('');
  const [contatoFinanceiroEmail, setContatoFinanceiroEmail] = useState('');

  // Contato Jurídico
  const [contatoJuridicoNome, setContatoJuridicoNome] = useState('');
  const [contatoJuridicoTel, setContatoJuridicoTel] = useState('');
  const [contatoJuridicoEmail, setContatoJuridicoEmail] = useState('');

  // Carregar Dados
  useEffect(() => {
    if (data) {
      setNomeFantasia(data.nomeFantasia);
      setCnpj(data.cnpj);
      setEndereco(data.endereco || '');
      setCategoria(data.categoria || '');
      
      // Carregar Principal
      setContatoPrincipalNome(data.contatoPrincipal?.nome || '');
      setContatoPrincipalTel(data.contatoPrincipal?.telefone || '');
      setContatoPrincipalEmail(data.contatoPrincipal?.email || '');

      // Carregar Comercial
      setContatoComercialNome(data.contatoComercial?.nome || '');
      setContatoComercialTel(data.contatoComercial?.telefone || '');
      setContatoComercialEmail(data.contatoComercial?.email || '');

      // Carregar Financeiro
      setContatoFinanceiroNome(data.contatoFinanceiro?.nome || '');
      setContatoFinanceiroTel(data.contatoFinanceiro?.telefone || '');
      setContatoFinanceiroEmail(data.contatoFinanceiro?.email || '');

      // Carregar Jurídico
      setContatoJuridicoNome(data.contatoJuridico?.nome || '');
      setContatoJuridicoTel(data.contatoJuridico?.telefone || '');
      setContatoJuridicoEmail(data.contatoJuridico?.email || '');
    }
  }, [data, isActive]);

  if (!data) return null;

  const handleSubmit = () => {
    const updated: TransportadoraItem = {
      ...data,
      nomeFantasia,
      cnpj,
      endereco,
      categoria,
      contatoPrincipal: { nome: contatoPrincipalNome, telefone: contatoPrincipalTel, email: contatoPrincipalEmail },
      contatoComercial: { nome: contatoComercialNome, telefone: contatoComercialTel, email: contatoComercialEmail },
      contatoFinanceiro: { nome: contatoFinanceiroNome, telefone: contatoFinanceiroTel, email: contatoFinanceiroEmail },
      contatoJuridico: { nome: contatoJuridicoNome, telefone: contatoJuridicoTel, email: contatoJuridicoEmail }
    };
    onSave(updated);
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ maxWidth: '800px', width: '100%' }}>
        
        <header className="modal-card-head" style={{ borderBottom: '1px solid #ededed', padding: '1.5rem', backgroundColor: '#fff' }}>
          <p className="modal-card-title has-text-weight-bold" style={{ color: textColor }}>Informações cadastrais</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>

        <section className="modal-card-body" style={{ padding: '2rem' }}>
          
          {/* DADOS DA EMPRESA */}
          <h6 className="title is-6 mb-3 has-text-grey">Dados da Empresa</h6>
          <div className="columns is-multiline mb-5">
              <div className="column is-full">
                  <div className="field">
                    <label className="label is-small">Empresa</label>
                    <div className="control"><input className="input" value={nomeFantasia} onChange={e => setNomeFantasia(e.target.value)} /></div>
                  </div>
              </div>
              <div className="column is-half">
                  <div className="field">
                    <label className="label is-small">CNPJ</label>
                    <div className="control"><input className="input" value={cnpj} onChange={e => setCnpj(e.target.value)} /></div>
                  </div>
              </div>
              <div className="column is-half">
                  <div className="field">
                    <label className="label is-small">Categoria</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select value={categoria} onChange={e => setCategoria(e.target.value)}>
                          <option value="">-- Selecione --</option>
                          {categorias && categorias.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
              </div>
              <div className="column is-half">
                  <div className="field">
                    <label className="label is-small">Endereço</label>
                    <div className="control"><input className="input" value={endereco} onChange={e => setEndereco(e.target.value)} /></div>
                  </div>
              </div>
          </div>

          <hr className="divider my-5" />
          <h6 className="title is-6 mb-4 has-text-grey">Contatos</h6>
          
          {/* GRUPO DE CONTATOS */}
          <div className="columns is-multiline">
             
             {/* Contato Principal */}
             <div className="column is-half">
                 <div className="box has-background-light p-3 h-100" style={{ height: '100%' }}>
                    <p className="subtitle is-6 has-text-weight-bold mb-3">Contato Principal</p>
                    <div className="field mb-2">
                        <div className="control"><input className="input is-small" placeholder="Nome" value={contatoPrincipalNome} onChange={e => setContatoPrincipalNome(e.target.value)} /></div>
                    </div>
                    <div className="field mb-2">
                        <div className="control"><input className="input is-small" placeholder="Telefone" value={contatoPrincipalTel} onChange={e => setContatoPrincipalTel(e.target.value)} /></div>
                    </div>
                    <div className="field mb-0">
                        <div className="control"><input className="input is-small" placeholder="Email" value={contatoPrincipalEmail} onChange={e => setContatoPrincipalEmail(e.target.value)} /></div>
                    </div>
                 </div>
             </div>

             {/* Contato Comercial */}
             <div className="column is-half">
                 <div className="box has-background-light p-3 h-100" style={{ height: '100%' }}>
                    <p className="subtitle is-6 has-text-weight-bold mb-3">Contato Comercial</p>
                    <div className="field mb-2">
                        <div className="control"><input className="input is-small" placeholder="Nome" value={contatoComercialNome} onChange={e => setContatoComercialNome(e.target.value)} /></div>
                    </div>
                    <div className="field mb-2">
                        <div className="control"><input className="input is-small" placeholder="Telefone" value={contatoComercialTel} onChange={e => setContatoComercialTel(e.target.value)} /></div>
                    </div>
                    <div className="field mb-0">
                        <div className="control"><input className="input is-small" placeholder="Email" value={contatoComercialEmail} onChange={e => setContatoComercialEmail(e.target.value)} /></div>
                    </div>
                 </div>
             </div>

             {/* Contato Financeiro */}
             <div className="column is-half">
                 <div className="box has-background-light p-3 h-100" style={{ height: '100%' }}>
                    <p className="subtitle is-6 has-text-weight-bold mb-3">Contato Financeiro</p>
                    <div className="field mb-2">
                        <div className="control"><input className="input is-small" placeholder="Nome" value={contatoFinanceiroNome} onChange={e => setContatoFinanceiroNome(e.target.value)} /></div>
                    </div>
                    <div className="field mb-2">
                        <div className="control"><input className="input is-small" placeholder="Telefone" value={contatoFinanceiroTel} onChange={e => setContatoFinanceiroTel(e.target.value)} /></div>
                    </div>
                    <div className="field mb-0">
                        <div className="control"><input className="input is-small" placeholder="Email" value={contatoFinanceiroEmail} onChange={e => setContatoFinanceiroEmail(e.target.value)} /></div>
                    </div>
                 </div>
             </div>

             {/* Contato Jurídico */}
             <div className="column is-half">
                 <div className="box has-background-light p-3 h-100" style={{ height: '100%' }}>
                    <p className="subtitle is-6 has-text-weight-bold mb-3">Contato Jurídico</p>
                    <div className="field mb-2">
                        <div className="control"><input className="input is-small" placeholder="Nome" value={contatoJuridicoNome} onChange={e => setContatoJuridicoNome(e.target.value)} /></div>
                    </div>
                    <div className="field mb-2">
                        <div className="control"><input className="input is-small" placeholder="Telefone" value={contatoJuridicoTel} onChange={e => setContatoJuridicoTel(e.target.value)} /></div>
                    </div>
                    <div className="field mb-0">
                        <div className="control"><input className="input is-small" placeholder="Email" value={contatoJuridicoEmail} onChange={e => setContatoJuridicoEmail(e.target.value)} /></div>
                    </div>
                 </div>
             </div>

          </div>

        </section>

        <footer className="modal-card-foot is-justify-content-flex-end" style={{ borderTop: '1px solid #ededed', backgroundColor: 'white', padding: '1.5rem', gap: '10px' }}>
          <button className="button" onClick={onClose}>Cancelar</button>
          <button className="button is-success" onClick={handleSubmit}>
              <span className="icon is-small"><MdSave /></span>
              <span>Salvar</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default TransportadoraEditModal;