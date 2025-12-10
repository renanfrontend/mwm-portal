// src/components/TransportadoraCreateModal.tsx

import React, { useState } from 'react';
import type { TransportadoraItem } from '../types/models';
import useTheme from '../hooks/useTheme';
import { MdSave } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid'; // Import para gerar ID fictício

interface Props {
  isActive: boolean;
  onClose: () => void;
  onCreate: (item: TransportadoraItem) => void;
}

const TransportadoraCreateModal: React.FC<Props> = ({ isActive, onClose, onCreate }) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#a0aec0' : '#363636';

  // Estados dos Campos (Iniciam vazios)
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [razaoSocial, setRazaoSocial] = useState(''); // Adicionado campo Razão Social
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [telefoneComercial, setTelefoneComercial] = useState('');
  const [emailComercial, setEmailComercial] = useState('');
  const [categoria, setCategoria] = useState('');
  
  // Contatos Detalhados
  const [contatoPrincipalNome, setContatoPrincipalNome] = useState('');
  const [contatoPrincipalTel, setContatoPrincipalTel] = useState('');
  const [contatoPrincipalEmail, setContatoPrincipalEmail] = useState('');

  const [contatoComercialNome, setContatoComercialNome] = useState('');
  const [contatoComercialTel, setContatoComercialTel] = useState('');
  const [contatoComercialEmail, setContatoComercialEmail] = useState('');

  const [contatoFinanceiroNome, setContatoFinanceiroNome] = useState('');
  const [contatoFinanceiroTel, setContatoFinanceiroTel] = useState('');
  const [contatoFinanceiroEmail, setContatoFinanceiroEmail] = useState('');

  const [contatoJuridicoNome, setContatoJuridicoNome] = useState('');
  const [contatoJuridicoTel, setContatoJuridicoTel] = useState('');
  const [contatoJuridicoEmail, setContatoJuridicoEmail] = useState('');

  // Limpar campos ao abrir
  React.useEffect(() => {
      if (isActive) {
          setNomeFantasia(''); setRazaoSocial(''); setCnpj(''); setEndereco(''); setCidade(''); setUf('');
          setTelefoneComercial(''); setEmailComercial(''); setCategoria('');
          setContatoPrincipalNome(''); setContatoPrincipalTel(''); setContatoPrincipalEmail('');
          setContatoComercialNome(''); setContatoComercialTel(''); setContatoComercialEmail('');
          setContatoFinanceiroNome(''); setContatoFinanceiroTel(''); setContatoFinanceiroEmail('');
          setContatoJuridicoNome(''); setContatoJuridicoTel(''); setContatoJuridicoEmail('');
      }
  }, [isActive]);

  const handleSubmit = () => {
    // Cria o novo objeto transportadora
    const newItem: TransportadoraItem = {
        id: uuidv4(), // Gera um ID temporário
        nomeFantasia,
        razaoSocial,
        cnpj,
        telefone: telefoneComercial,
        email: emailComercial,
        cidade,
        uf,
        endereco,
        categoria,
        contatoPrincipal: { nome: contatoPrincipalNome, telefone: contatoPrincipalTel, email: contatoPrincipalEmail },
        contatoComercial: { nome: contatoComercialNome, telefone: contatoComercialTel, email: contatoComercialEmail },
        contatoFinanceiro: { nome: contatoFinanceiroNome, telefone: contatoFinanceiroTel, email: contatoFinanceiroEmail },
        contatoJuridico: { nome: contatoJuridicoNome, telefone: contatoJuridicoTel, email: contatoJuridicoEmail },
        veiculos: [] // Inicia sem veículos
    };
    onCreate(newItem);
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ maxWidth: '800px', width: '100%' }}>
        
        <header className="modal-card-head" style={{ borderBottom: '1px solid #ededed', padding: '1.5rem', backgroundColor: '#fff' }}>
          <p className="modal-card-title has-text-weight-bold" style={{ color: textColor }}>Adicionar Transportadora</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>

        <section className="modal-card-body" style={{ padding: '2rem' }}>
          
          <h6 className="title is-6 mb-3">Dados da Empresa</h6>
          <div className="columns is-multiline">
              <div className="column is-half">
                  <div className="field"><label className="label is-small">Nome Fantasia</label><div className="control"><input className="input" value={nomeFantasia} onChange={e => setNomeFantasia(e.target.value)} /></div></div>
              </div>
              <div className="column is-half">
                  <div className="field"><label className="label is-small">Razão Social</label><div className="control"><input className="input" value={razaoSocial} onChange={e => setRazaoSocial(e.target.value)} /></div></div>
              </div>
              <div className="column is-half">
                  <div className="field"><label className="label is-small">CNPJ</label><div className="control"><input className="input" value={cnpj} onChange={e => setCnpj(e.target.value)} /></div></div>
              </div>
               <div className="column is-half">
                  <div className="field"><label className="label is-small">Categoria</label><div className="control"><input className="input" value={categoria} onChange={e => setCategoria(e.target.value)} placeholder="Ex: Logística Geral" /></div></div>
              </div>
          </div>

          <h6 className="title is-6 mb-3 mt-4">Endereço e Contato Comercial</h6>
          <div className="columns is-multiline">
             <div className="column is-full">
                  <div className="field"><label className="label is-small">Endereço Completo</label><div className="control"><input className="input" value={endereco} onChange={e => setEndereco(e.target.value)} /></div></div>
              </div>
              <div className="column is-half">
                  <div className="field"><label className="label is-small">Cidade</label><div className="control"><input className="input" value={cidade} onChange={e => setCidade(e.target.value)} /></div></div>
              </div>
              <div className="column is-half">
                  <div className="field"><label className="label is-small">UF</label><div className="control"><input className="input" value={uf} onChange={e => setUf(e.target.value)} maxLength={2} /></div></div>
              </div>
              <div className="column is-half">
                  <div className="field"><label className="label is-small">Telefone Comercial</label><div className="control"><input className="input" value={telefoneComercial} onChange={e => setTelefoneComercial(e.target.value)} /></div></div>
              </div>
              <div className="column is-half">
                  <div className="field"><label className="label is-small">Email Comercial</label><div className="control"><input className="input" value={emailComercial} onChange={e => setEmailComercial(e.target.value)} /></div></div>
              </div>
          </div>

          <hr className="divider my-5" />
          <h6 className="title is-6 mb-3">Contatos Específicos</h6>
          
          {/* Contato Principal */}
          <div className="box has-background-light p-3 mb-3">
              <label className="label is-small mb-2">Contato Principal</label>
              <div className="columns is-multiline is-mobile is-variable is-1">
                  <div className="column is-4"><input className="input is-small" placeholder="Nome" value={contatoPrincipalNome} onChange={e => setContatoPrincipalNome(e.target.value)} /></div>
                  <div className="column is-4"><input className="input is-small" placeholder="Telefone" value={contatoPrincipalTel} onChange={e => setContatoPrincipalTel(e.target.value)} /></div>
                  <div className="column is-4"><input className="input is-small" placeholder="Email" value={contatoPrincipalEmail} onChange={e => setContatoPrincipalEmail(e.target.value)} /></div>
              </div>
          </div>

          {/* Contato Comercial */}
           <div className="box has-background-light p-3 mb-3">
              <label className="label is-small mb-2">Contato Comercial</label>
              <div className="columns is-multiline is-mobile is-variable is-1">
                  <div className="column is-4"><input className="input is-small" placeholder="Nome" value={contatoComercialNome} onChange={e => setContatoComercialNome(e.target.value)} /></div>
                  <div className="column is-4"><input className="input is-small" placeholder="Telefone" value={contatoComercialTel} onChange={e => setContatoComercialTel(e.target.value)} /></div>
                  <div className="column is-4"><input className="input is-small" placeholder="Email" value={contatoComercialEmail} onChange={e => setContatoComercialEmail(e.target.value)} /></div>
              </div>
          </div>

           {/* Contato Financeiro */}
           <div className="box has-background-light p-3 mb-3">
              <label className="label is-small mb-2">Contato Financeiro</label>
              <div className="columns is-multiline is-mobile is-variable is-1">
                  <div className="column is-4"><input className="input is-small" placeholder="Nome" value={contatoFinanceiroNome} onChange={e => setContatoFinanceiroNome(e.target.value)} /></div>
                  <div className="column is-4"><input className="input is-small" placeholder="Telefone" value={contatoFinanceiroTel} onChange={e => setContatoFinanceiroTel(e.target.value)} /></div>
                  <div className="column is-4"><input className="input is-small" placeholder="Email" value={contatoFinanceiroEmail} onChange={e => setContatoFinanceiroEmail(e.target.value)} /></div>
              </div>
          </div>

           {/* Contato Jurídico */}
           <div className="box has-background-light p-3 mb-3">
              <label className="label is-small mb-2">Contato Jurídico</label>
              <div className="columns is-multiline is-mobile is-variable is-1">
                  <div className="column is-4"><input className="input is-small" placeholder="Nome" value={contatoJuridicoNome} onChange={e => setContatoJuridicoNome(e.target.value)} /></div>
                  <div className="column is-4"><input className="input is-small" placeholder="Telefone" value={contatoJuridicoTel} onChange={e => setContatoJuridicoTel(e.target.value)} /></div>
                  <div className="column is-4"><input className="input is-small" placeholder="Email" value={contatoJuridicoEmail} onChange={e => setContatoJuridicoEmail(e.target.value)} /></div>
              </div>
          </div>

        </section>

        <footer className="modal-card-foot is-justify-content-flex-end" style={{ borderTop: '1px solid #ededed', backgroundColor: 'white', padding: '1.5rem', gap: '10px' }}>
          <button className="button" onClick={onClose}>Cancelar</button>
          <button className="button is-success" onClick={handleSubmit}><span className="icon is-small"><MdSave /></span><span>Cadastrar Transportadora</span></button>
        </footer>
      </div>
    </div>
  );
};

export default TransportadoraCreateModal;