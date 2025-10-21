// src/screens/Qualidade.tsx

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MdSearch, MdFilterList, MdArrowBack, MdDelete, MdAdd, MdSave } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { QualidadeDejetosListItem } from '../components/QualidadeDejetosListItem';
import { fetchQualidadeDejetosData, createAnaliseQualidade, fetchCooperadosData, type QualidadeDejetosItem, type CooperadoItem } from '../services/api';

type Tab = 'Análise' | 'Qualidade dos Dejetos' | 'Qualidade das Amostras';
type AmostraOrigem = 'cooperado' | 'pontoDeColeta';

const Qualidade: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Análise');
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const [dejetosData, setDejetosData] = useState<QualidadeDejetosItem[]>([]);
  const [cooperados, setCooperados] = useState<CooperadoItem[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formStep, setFormStep] = useState(0);
  const [amostraOrigem, setAmostraOrigem] = useState<AmostraOrigem>();
  const [formData, setFormData] = useState<Partial<QualidadeDejetosItem>>({});

  const loadListData = useCallback(async () => { /* ... */ }, [activeTab]);
  useEffect(() => { loadListData(); }, [loadListData]);
  
  useEffect(() => {
    const loadCooperados = async () => {
      const data = await fetchCooperadosData();
      setCooperados(data);
    };
    if (activeTab === 'Análise') { loadCooperados(); }
  }, [activeTab]);

  const filteredDejetosData = useMemo(() => (dejetosData || []).filter(item => item.cooperado.toLowerCase().includes(searchTerm.toLowerCase()) || item.placa.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm, dejetosData]);

  const handleSave = async () => { /* ... (lógica de salvar) ... */ };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => { /* ... (lógica de resetar form) ... */ };

  return (
    <>
      <nav className="level is-mobile mb-4">
        <div className="level-left">
          <div className="level-item">
            <div className="buttons">
              <button className="button is-white" onClick={() => navigate(-1)}>
                <span className="icon"><MdArrowBack /></span>
              </button>
              <h1 className="title is-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Qualidade</h1>
            </div>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <button className="button is-link">
              <span className="icon"><MdAdd /></span>
            </button>
          </div>
        </div>
      </nav>

      <section className="section py-0">
        <div className="tabs is-toggle is-medium is-centered is-fullwidth">
          <ul>
            <li className={activeTab === 'Análise' ? 'is-active' : ''}><a onClick={resetForm}><span>Análise</span></a></li>
            <li className={activeTab === 'Qualidade dos Dejetos' ? 'is-active' : ''}><a onClick={() => setActiveTab('Qualidade dos Dejetos')}><span>Qualidade dos Dejetos</span></a></li>
            <li className={activeTab === 'Qualidade das Amostras' ? 'is-active' : ''}><a onClick={() => setActiveTab('Qualidade das Amostras')}><span>Qualidade das Amostras</span></a></li>
          </ul>
        </div>
      </section>
      
      {activeTab === 'Análise' && (
        <section className="section pt-4 pb-6">
          <div className="box">
            <h2 className="title is-5">Entrada da amostra</h2>
            
            <div className="field">
              <div className="control">
                <label className="radio"><input type="radio" name="amostraOrigem" checked={amostraOrigem === 'cooperado'} onChange={() => setAmostraOrigem('cooperado')} /> Cooperado</label>
                <label className="radio"><input type="radio" name="amostraOrigem" checked={amostraOrigem === 'pontoDeColeta'} onChange={() => setAmostraOrigem('pontoDeColeta')} /> Ponto de coleta</label>
              </div>
            </div>

            {/* --- FLUXO PARA COOPERADO (COM SELECTS CORRIGIDOS) --- */}
            {amostraOrigem === 'cooperado' && (
              <>
                <div className="columns">
                  <div className="column"><div className="field"><label className="label">Nome do cooperado</label><div className="control"><div className="select is-fullwidth"><select name="cooperado" onChange={handleInputChange}><option>Selecionar</option>{cooperados.map(c => <option key={c.id} value={c.motorista}>{c.motorista}</option>)}</select></div></div></div></div>
                  <div className="column"><div className="field"><label className="label">Data da análise</label><div className="control"><input className="input" type="date" name="dataColeta" onChange={handleInputChange} /></div></div></div>
                </div>
                <div className="columns">
                    <div className="column">
                        <div className="field">
                            <label className="label">Entrega Referência</label>
                            <div className="control"><div className="select is-fullwidth"><select name="entregaReferencia" onChange={handleInputChange}><option>Selecionar Referência</option></select></div></div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="field">
                            <label className="label">PH</label>
                            <div className="control"><div className="select is-fullwidth"><select name="ph" onChange={handleInputChange}><option>Selecionar PH</option></select></div></div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="field">
                            <label className="label">Densidade</label>
                            <div className="control"><div className="select is-fullwidth"><select name="densidade" onChange={handleInputChange}><option>Selecionar Densidade</option></select></div></div>
                        </div>
                    </div>
                </div>
              </>
            )}
            
            {/* --- FLUXO PARA PONTO DE COLETA (JÁ ESTAVA CORRETO) --- */}
            {amostraOrigem === 'pontoDeColeta' && (
              <div className="columns">
                <div className="column"><div className="field"><label className="label">Ponto de Coleta</label><div className="control"><div className="select is-fullwidth"><select name="pontoColeta" onChange={handleInputChange}><option>Selecionar Ponto</option></select></div></div></div></div>
                <div className="column"><div className="field"><label className="label">PH</label><div className="control"><div className="select is-fullwidth"><select name="ph" onChange={handleInputChange}><option>Selecionar PH</option></select></div></div></div></div>
                <div className="column"><div className="field"><label className="label">Densidade</label><div className="control"><div className="select is-fullwidth"><select name="densidade" onChange={handleInputChange}><option>Selecionar Densidade</option></select></div></div></div></div>
              </div>
            )}

            {/* ETAPAS ADICIONAIS DE PESAGEM */}
            {formStep >= 1 && (<><hr /><div className="columns"><div className="column"><div className="field"><label className="label">Pesagem 1 (P1)</label><div className="control"><input className="input" type="text" name="pesagem1" onChange={handleInputChange}/></div></div></div><div className="column"><div className="field"><label className="label">Pesagem 1 (duplicata)</label><div className="control"><input className="input" type="text" name="pesagem1_dup" onChange={handleInputChange}/></div></div></div></div><div className="columns"><div className="column"><div className="field"><label className="label">Pesagem 2 (P2)</label><div className="control"><input className="input" type="text" name="pesagem2" onChange={handleInputChange}/></div></div></div><div className="column"><div className="field"><label className="label">Pesagem 2 (duplicata)</label><div className="control"><input className="input" type="text" name="pesagem2_dup" onChange={handleInputChange}/></div></div></div></div></>)}
            {formStep >= 2 && (<><hr /><div className="columns"><div className="column"><div className="field"><label className="label">Pesagem 3 (P3)</label><div className="control"><input className="input" type="text" name="pesagem3" onChange={handleInputChange}/></div></div></div><div className="column"><div className="field"><label className="label">Pesagem 3 (duplicata)</label><div className="control"><input className="input" type="text" name="pesagem3_dup" onChange={handleInputChange}/></div></div></div></div></>)}
            {formStep >= 3 && (<><hr /><div className="columns"><div className="column"><div className="field"><label className="label">Pesagem 4 (P4)</label><div className="control"><input className="input" type="text" name="pesagem4" onChange={handleInputChange}/></div></div></div><div className="column"><div className="field"><label className="label">Pesagem 4 (duplicata)</label><div className="control"><input className="input" type="text" name="pesagem4_dup" onChange={handleInputChange}/></div></div></div></div></>)}
            
            {/* BOTÕES CONDICIONAIS */}
            {amostraOrigem && (
              <div className="field is-grouped is-justify-content-flex-end">
                {formStep === 0 && <p className="control"><button className="button is-light" onClick={() => setFormStep(1)}>+ Informações</button></p>}
                {formStep === 1 && <p className="control"><button className="button is-light" onClick={() => setFormStep(2)}>Próximo Passo</button></p>}
                {formStep === 2 && <p className="control"><button className="button is-light" onClick={() => setFormStep(3)}>Próximo Passo</button></p>}
                <p className="control">
                  <button className={`button is-info ${saving ? 'is-loading' : ''}`} onClick={handleSave}>
                    <span className="icon"><MdSave /></span>
                    <span>Salvar</span>
                  </button>
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {activeTab === 'Qualidade dos Dejetos' && (
        <section className="section pt-4 pb-6">{/* ... (código da lista) ... */}</section>
      )}
    </>
  );
};

export default Qualidade;