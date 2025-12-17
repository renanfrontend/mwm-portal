// src/screens/Qualidade.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { MdSave, MdAddCircleOutline, MdArrowBack, MdSearch, MdDelete, MdFilterList, MdAdd } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { 
  createAnaliseQualidade, 
  fetchCooperadosData, 
  type QualidadeDejetosItem, 
  type CooperadoItem 
} from '../services/api';

// Definição das abas
type Tab = 'Análise' | 'Qualidade dos Dejetos' | 'Qualidade das Amostras';
type AmostraOrigem = 'cooperado' | 'pontoDeColeta';

// --- DADOS MOCKADOS PARA OS SELECTS ---
const mockEntradasReferencia = [
    { id: 'ENT-001', label: 'ENT-001 - Ademir Engelsing - 13/10/2025' },
    { id: 'ENT-002', label: 'ENT-002 - Ademir Marchioro - 13/10/2025' },
    { id: 'ENT-003', label: 'ENT-003 - Arseno Weschendeider - 13/10/2025' },
    { id: 'ENT-004', label: 'ENT-004 - Carlos Jaime Pauly - 13/10/2025' },
    { id: 'ENT-005', label: 'ENT-005 - Delcio Rossetto - 13/10/2025' },
];

const phOptions = Array.from({ length: 21 }, (_, i) => (6.0 + i * 0.1).toFixed(1));
const densidadeSelectOptions = Array.from({ length: 6 }, (_, i) => 1010 + i);

// --- OPÇÕES PARA ID RECIPIENTE (01 a 24) ---
const recipienteOptions = Array.from({ length: 24 }, (_, i) => (i + 1).toString().padStart(2, '0'));

const Qualidade: React.FC = () => {
  const navigate = useNavigate();

  // Controle de Abas
  const [activeTab, setActiveTab] = useState<Tab>('Análise');

  // Dados Gerais
  const [cooperados, setCooperados] = useState<CooperadoItem[]>([]);
  
  // Estados de Controle
  const [saving, setSaving] = useState(false);
  
  // Estados de Lista (Busca e Seleção)
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
  
  // --- FORMULÁRIO ANÁLISE ---
  const [formStep, setFormStep] = useState(0); 
  const [amostraOrigem, setAmostraOrigem] = useState<AmostraOrigem>();
  const [formData, setFormData] = useState<Partial<QualidadeDejetosItem>>({});

  // Dados Mockados para visualização das tabelas
  const mockDejetosList = [
    {
        id: 1,
        data: '2025-02-20',
        cooperado: 'Ademir Engelsing',
        status: 'Concluído',
        pesoInicial: '1500',
        pesoFinal: '1000',
        totalRecebido: '500',
        densidade: '1015',
        ms: '5.2',
        n: '250',
        p: '120',
        k: '180',
        st: '5000',
        sv: '4200'
    },
    {
        id: 2,
        data: '2025-02-21',
        cooperado: 'João da Silva',
        status: 'Em Análise',
        pesoInicial: '2000',
        pesoFinal: '1200',
        totalRecebido: '800',
        densidade: '1012',
        ms: '4.8',
        n: '-',
        p: '-',
        k: '-',
        st: '-',
        sv: '-'
    }
  ];

  const mockAmostrasList = [
    {
        id: 101,
        data: '2025-02-22',
        ecoponto: 'Ecoponto Central',
        status: 'Concluído',
        referencia: 'REF-2024/01',
        recipiente: 'A-01',
        st_perc: '12.5',
        sv_st_perc: '85.0',
        st_mg: '450',
        st_var: '0.5',
        sv_var: '0.2',
        mv_mf: '92.0',
        var_perc: '1.1',
        data_analise: '2025-02-23',
        p1: '10.5',
        p2: '20.1',
        p3: '15.2',
        p4: '12.0'
    }
  ];

  // Limpa estados ao mudar de aba
  useEffect(() => {
      setSearchTerm('');
      setIsDeleteMode(false);
      setSelectedItems([]);
  }, [activeTab]);

  // Loaders
  useEffect(() => {
    const loadCooperados = async () => {
      try {
        const data = await fetchCooperadosData();
        setCooperados(data || []);
      } catch (error) {
        toast.error("Falha ao carregar lista de cooperados.");
      }
    };
    if (activeTab === 'Análise') { 
        loadCooperados(); 
    }
  }, [activeTab]);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormStep(0);
    setFormData({});
    setAmostraOrigem(undefined);
  };

  const handleOrigemSelect = (origem: AmostraOrigem) => {
    setAmostraOrigem(origem);
    setFormStep(0);
    setFormData({}); 
  };

  const handleSave = async () => {
    setSaving(true);
    try {
        await createAnaliseQualidade(formData);
        toast.success("Amostra armazenada com sucesso!");
        resetForm();
        setActiveTab('Qualidade dos Dejetos');
    } catch (error) { 
        toast.error("Erro ao armazenar a amostra."); 
    } finally { 
        setSaving(false); 
    }
  };

  const handleSelectItem = (id: number | string) => {
      setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleDeleteSelected = () => {
      toast.success("Itens excluídos com sucesso!");
      setSelectedItems([]);
      setIsDeleteMode(false);
  };

  // Filtros
  const filteredDejetos = useMemo(() => {
      return mockDejetosList.filter(item => 
          item.cooperado.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [searchTerm]);

  const filteredAmostras = useMemo(() => {
      return mockAmostrasList.filter(item => 
          item.ecoponto.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [searchTerm]);

  return (
    <div className="screen-container" style={{ backgroundColor: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* Header Fixo */}
      <nav className="level is-mobile mb-0 px-4 py-3" style={{ borderBottom: '1px solid #dbdbdb', flexShrink: 0 }}>
        <div className="level-left">
          <div className="level-item">
             <button 
                className="button is-white mr-2" 
                onClick={() => navigate(-1)} 
                title="Voltar"
             >
                <span className="icon"><MdArrowBack size={24} /></span>
             </button>
             <h1 className="title is-4 mb-0">Controle de Qualidade</h1>
          </div>
        </div>
      </nav>

      {/* Tabs Fixas */}
      <section className="section py-0 pt-3" style={{ flexShrink: 0 }}>
        <div className="tabs is-toggle is-medium is-centered is-fullwidth mb-0">
          <ul>
            <li className={activeTab === 'Análise' ? 'is-active' : ''}>
              <a onClick={() => setActiveTab('Análise')}>
                <span>Análise</span>
              </a>
            </li>
            <li className={activeTab === 'Qualidade dos Dejetos' ? 'is-active' : ''}>
              <a onClick={() => setActiveTab('Qualidade dos Dejetos')}>
                <span>Qualidade dos Dejetos</span>
              </a>
            </li>
            <li className={activeTab === 'Qualidade das Amostras' ? 'is-active' : ''}>
              <a onClick={() => setActiveTab('Qualidade das Amostras')}>
                <span>Qualidade das Amostras</span>
              </a>
            </li>
          </ul>
        </div>
      </section>
      
      {/* --- ÁREA DE CONTEÚDO COM SCROLL AUTOMÁTICO --- */}
      <div className="screen-content p-5" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>

        {/* --- ABA: ANÁLISE --- */}
        {activeTab === 'Análise' && (
          <div className="box">
            <div className="field">
              <label className="label">Selecione a entrada da amostra</label>
              <div className="buttons has-addons">
                <button 
                  className={`button ${amostraOrigem === 'cooperado' ? 'is-info is-selected' : ''}`}
                  onClick={() => handleOrigemSelect('cooperado')}
                >
                  Cooperado
                </button>
                <button 
                  className={`button ${amostraOrigem === 'pontoDeColeta' ? 'is-info is-selected' : ''}`}
                  onClick={() => handleOrigemSelect('pontoDeColeta')}
                >
                  Ponto de Medição
                </button>
              </div>
            </div>

            {amostraOrigem && (
              <div className="animate-fade-in">
                {/* --- CAMPOS COMUNS (PARTE FIXA) --- */}
                {amostraOrigem === 'cooperado' && (
                  <div className="columns">
                      <div className="column">
                        <div className="field">
                          <label className="label">Nome do cooperado</label>
                          <div className="control">
                            <div className="select is-fullwidth">
                              <select name="cooperado" value={formData.cooperado || ''} onChange={handleInputChange}>
                                <option value="">Selecionar</option>
                                {cooperados.map(c => <option key={c.id} value={c.motorista}>{c.motorista}</option>)}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="column">
                          <div className="field">
                              <label className="label">Entrega Referência</label>
                              <div className="control">
                                  <div className="select is-fullwidth">
                                      <select name="entregaReferencia" value={formData.entregaReferencia || ''} onChange={handleInputChange}>
                                          <option value="">Selecionar Referência</option>
                                          {mockEntradasReferencia.map(opt => (
                                              <option key={opt.id} value={opt.id}>{opt.label}</option>
                                          ))}
                                      </select>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                )}

                {amostraOrigem === 'pontoDeColeta' && (
                   <div className="columns">
                      <div className="column">
                          <div className="field">
                              <label className="label">Local/Equipamento</label>
                              <div className="control">
                                  <div className="select is-fullwidth">
                                      <select name="cooperado" value={formData.cooperado || ''} onChange={handleInputChange}>
                                          <option value="">Selecionar</option>
                                          <option value="Biodigestor 1">Biodigestor 1</option>
                                          <option value="Biodigestor 2">Biodigestor 2</option>
                                      </select>
                                  </div>
                              </div>
                          </div>
                      </div>
                   </div>
                )}

                {/* --- CAMPOS FIXOS: DATA, PH, DENSIDADE --- */}
                <div className="columns">
                    <div className="column">
                      <div className="field">
                        <label className="label">Data</label>
                        <div className="control">
                          <input className="input" type="date" name="dataColeta" value={formData.dataColeta || ''} onChange={handleInputChange} />
                        </div>
                      </div>
                    </div>
                    <div className="column">
                        <div className="field">
                            <label className="label">PH</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select name="ph" value={formData.ph || ''} onChange={handleInputChange}>
                                        <option value="">Selecionar</option>
                                        {phOptions.map(ph => (
                                            <option key={ph} value={ph}>{ph}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="field">
                            <label className="label">Densidade</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select name="densidade" value={formData.densidade || ''} onChange={handleInputChange}>
                                        <option value="">Selecionar</option>
                                        {densidadeSelectOptions.map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- ETAPA 1 (PESAGENS) --- */}
                {formStep >= 1 && (
                  <>
                    <hr />
                    <div className="columns">
                      <div className="column">
                        <p className="label has-text-centered has-text-info">AMOSTRA</p>
                        
                        <div className="field">
                            <label className="label">ID Recipiente</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select name="id_recipiente_amostra" value={formData.id_recipiente_amostra || ''} onChange={handleInputChange}>
                                        <option value="">Selecionar</option>
                                        {recipienteOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Primeira pesagem</label>
                            <div className="control">
                                <input className="input" type="text" name="peso_recip_amostra" value={formData.peso_recip_amostra || ''} onChange={handleInputChange}/>
                            </div>
                            <p className="help has-text-grey is-size-7" style={{ marginTop: '0' }}>Recipiente</p>
                        </div>
                        
                        <div className="field">
                            <label className="label">Segunda pesagem</label>
                            <div className="control">
                                <input className="input" type="text" name="pesagem_p2_amostra" value={formData.pesagem_p2_amostra || ''} onChange={handleInputChange}/>
                            </div>
                            <p className="help has-text-grey is-size-7" style={{ marginTop: '0' }}>Recipiente + Amostra</p>
                        </div>
                      </div>
                      
                      <div className="column">
                        <p className="label has-text-centered has-text-info">DUPLICATA</p>
                        
                        <div className="field">
                            <label className="label">ID Recipiente</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select name="id_recipiente_duplicata" value={formData.id_recipiente_duplicata || ''} onChange={handleInputChange}>
                                        <option value="">Selecionar</option>
                                        {recipienteOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Primeira pesagem</label>
                            <div className="control">
                                <input className="input" type="text" name="peso_recip_duplicata" value={formData.peso_recip_duplicata || ''} onChange={handleInputChange}/>
                            </div>
                            <p className="help has-text-grey is-size-7" style={{ marginTop: '0' }}>Recipiente</p>
                        </div>
                        
                        <div className="field">
                            <label className="label">Segunda pesagem</label>
                            <div className="control">
                                <input className="input" type="text" name="pesagem_p2_duplicata" value={formData.pesagem_p2_duplicata || ''} onChange={handleInputChange}/>
                            </div>
                            <p className="help has-text-grey is-size-7" style={{ marginTop: '0' }}>Recipiente + Amostra</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {/* --- ETAPA 2 (TERCEIRA PESAGEM) --- */}
                {formStep >= 2 && (
                   <>
                    <hr />
                    <div className="columns">
                      <div className="column">
                        <p className="label has-text-centered has-text-info">AMOSTRA</p>
                        
                        <div className="field">
                            <label className="label">ID Recipiente</label>
                            <div className="control">
                                <input className="input" type="text" value={formData.id_recipiente_amostra || ''} disabled />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Terceira pesagem</label>
                            <div className="control">
                                <input className="input" type="text" name="pesagem_p3_amostra" value={formData.pesagem_p3_amostra || ''} onChange={handleInputChange}/>
                            </div>
                            <p className="help has-text-grey is-size-7" style={{ marginTop: '0' }}>Recipiente + Sólidos totais</p>
                        </div>
                      </div>
                      
                      <div className="column">
                        <p className="label has-text-centered has-text-info">DUPLICATA</p>
                        
                        <div className="field">
                            <label className="label">ID Recipiente</label>
                            <div className="control">
                                <input className="input" type="text" value={formData.id_recipiente_duplicata || ''} disabled />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Terceira pesagem</label>
                            <div className="control">
                                <input className="input" type="text" name="recip_st_duplicata" value={formData.recip_st_duplicata || ''} onChange={handleInputChange}/>
                            </div>
                            <p className="help has-text-grey is-size-7" style={{ marginTop: '0' }}>Recipiente + Sólidos totais</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {/* --- ETAPA 3 (QUARTA PESAGEM) --- */}
                {formStep >= 3 && (
                   <>
                    <hr />
                    <div className="columns">
                      <div className="column">
                        <p className="label has-text-centered has-text-info">AMOSTRA</p>
                        
                        <div className="field">
                            <label className="label">ID Recipiente</label>
                            <div className="control">
                                <input className="input" type="text" value={formData.id_recipiente_amostra || ''} disabled />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Quarta pesagem</label>
                            <div className="control">
                                <input className="input" type="text" name="pesagem_p4_amostra" value={formData.pesagem_p4_amostra || ''} onChange={handleInputChange}/>
                            </div>
                            <p className="help has-text-grey is-size-7" style={{ marginTop: '0' }}>Recipiente + Sólidos fixos</p>
                        </div>
                      </div>
                      
                      <div className="column">
                        <p className="label has-text-centered has-text-info">DUPLICATA</p>
                        
                        <div className="field">
                            <label className="label">ID Recipiente</label>
                            <div className="control">
                                <input className="input" type="text" value={formData.id_recipiente_duplicata || ''} disabled />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Quarta pesagem</label>
                            <div className="control">
                                <input className="input" type="text" name="recip_sf_duplicata" value={formData.recip_sf_duplicata || ''} onChange={handleInputChange}/>
                            </div>
                            <p className="help has-text-grey is-size-7" style={{ marginTop: '0' }}>Recipiente + Sólidos fixos</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="field is-grouped is-justify-content-flex-end mt-5">
                  {formStep === 0 && (
                    <p className="control">
                      <button className="button is-light" onClick={() => setFormStep(1)}>
                        <span className="icon is-small"><MdAddCircleOutline /></span>
                        <span>Infos</span>
                      </button>
                    </p>
                  )}
                  {formStep === 1 && <p className="control"><button className="button is-light" onClick={() => setFormStep(2)}>Próximo Passo</button></p>}
                  {formStep === 2 && <p className="control"><button className="button is-light" onClick={() => setFormStep(3)}>Próximo Passo</button></p>}
                  
                  <p className="control">
                    <button className={`button is-info ${saving ? 'is-loading' : ''}`} onClick={handleSave}>
                      <span className="icon"><MdSave /></span>
                      <span>Salvar</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- ABA: LISTA DE DEJETOS --- */}
        {activeTab === 'Qualidade dos Dejetos' && (
          <div className="container is-fluid px-0">
            {/* TOOLBAR */}
            <div className="is-flex is-justify-content-space-between is-align-items-center mb-5">
                <div className="control has-icons-right">
                    <input 
                        className="input" 
                        type="text" 
                        placeholder="Buscar..." 
                        style={{ width: '300px' }} 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                    />
                    <span className="icon is-right"><MdSearch /></span>
                </div>
                <div className="buttons">
                    <button className={`button is-white border ${isDeleteMode ? 'is-danger' : ''}`} onClick={() => setIsDeleteMode(!isDeleteMode)}>
                        <span className="icon"><MdDelete /></span>
                    </button>
                    <button className="button is-white border">
                        <span className="icon"><MdFilterList /></span>
                        <span>Filtrar</span>
                    </button>
                    <button className="button is-primary border-0" style={{ backgroundColor: '#4f46e5', color: '#ffffff' }} onClick={() => setActiveTab('Análise')}>
                        <span className="icon"><MdAdd /></span>
                        <span>Adicionar</span>
                    </button>
                </div>
            </div>

            {isDeleteMode && selectedItems.length > 0 && (
                <div className="notification is-danger is-light mb-4">
                    <button className="button is-small is-danger" onClick={handleDeleteSelected}>Excluir Selecionados</button>
                </div>
            )}

            <div className="box">
                <h2 className="title is-5 mb-4">Qualidade dos dejetos por cooperado</h2>
                <div className="table-container">
                    <table className="table is-fullwidth is-striped is-hoverable is-bordered is-size-7">
                        <thead>
                            <tr className="has-background-light">
                                {isDeleteMode && <th style={{ width: '40px' }}></th>}
                                <th>Data</th><th>Cooperado</th><th>Status</th><th>Peso Inicial</th><th>Peso Final</th><th>Total Recebido</th><th>Densidade</th><th>MS (%)</th><th>N (mg/L)</th><th>P2O5 (mg/L)</th><th>K2O (mg/L)</th><th>ST (mg/L)</th><th>SV (mg/L)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDejetos.map((item, index) => (
                                <tr key={item.id}>
                                    {isDeleteMode && (
                                        <td>
                                            <label className="checkbox">
                                                <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => handleSelectItem(item.id)} />
                                            </label>
                                        </td>
                                    )}
                                    <td>{item.data}</td>
                                    <td>{item.cooperado}</td>
                                    <td><span className={`tag ${item.status === 'Concluído' ? 'is-success' : 'is-warning'} is-light`}>{item.status}</span></td>
                                    <td>{item.pesoInicial}</td>
                                    <td>{item.pesoFinal}</td>
                                    <td>{item.totalRecebido}</td>
                                    <td>{item.densidade}</td>
                                    <td>{item.ms}</td>
                                    <td>{item.n}</td>
                                    <td>{item.p}</td>
                                    <td>{item.k}</td>
                                    <td>{item.st}</td>
                                    <td>{item.sv}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        )}

        {/* --- ABA: AMOSTRAS --- */}
        {activeTab === 'Qualidade das Amostras' && (
            <div className="container is-fluid px-0">
                {/* TOOLBAR */}
                <div className="is-flex is-justify-content-space-between is-align-items-center mb-5">
                    <div className="control has-icons-right">
                        <input 
                            className="input" 
                            type="text" 
                            placeholder="Buscar..." 
                            style={{ width: '300px' }} 
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)} 
                        />
                        <span className="icon is-right"><MdSearch /></span>
                    </div>
                    <div className="buttons">
                        <button className={`button is-white border ${isDeleteMode ? 'is-danger' : ''}`} onClick={() => setIsDeleteMode(!isDeleteMode)}>
                            <span className="icon"><MdDelete /></span>
                        </button>
                        <button className="button is-white border">
                            <span className="icon"><MdFilterList /></span>
                            <span>Filtrar</span>
                        </button>
                        <button className="button is-primary border-0" style={{ backgroundColor: '#4f46e5', color: '#ffffff' }} onClick={() => setActiveTab('Análise')}>
                            <span className="icon"><MdAdd /></span>
                            <span>Adicionar</span>
                        </button>
                    </div>
                </div>

                {isDeleteMode && selectedItems.length > 0 && (
                    <div className="notification is-danger is-light mb-4">
                        <button className="button is-small is-danger" onClick={handleDeleteSelected}>Excluir Selecionados</button>
                    </div>
                )}

                <div className="box">
                    <h2 className="title is-5 mb-4">Qualidade das amostras por ponto de coleta</h2>
                    <div className="table-container">
                        <table className="table is-fullwidth is-striped is-hoverable is-bordered is-size-7">
                            <thead>
                                <tr className="has-background-light">
                                    {isDeleteMode && <th style={{ width: '40px' }}></th>}
                                    <th>Data</th><th>Ecoponto</th><th>Status</th><th>Referência</th><th>Recepiente</th><th>ST (%)</th><th>SV/ST (%)</th><th>ST (mg/L)</th><th>ST Var. (%)</th><th>SV Var. (%)</th><th>MV/MF (%)</th><th>Var. (%)</th><th>Data Análise</th><th>P1 (g)</th><th>P2 (g)</th><th>P3 (g)</th><th>P4 (g)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAmostras.map((item, index) => (
                                    <tr key={item.id}>
                                        {isDeleteMode && (
                                            <td>
                                                <label className="checkbox">
                                                    <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => handleSelectItem(item.id)} />
                                                </label>
                                            </td>
                                        )}
                                        <td>{item.data}</td>
                                        <td>{item.ecoponto}</td>
                                        <td><span className={`tag ${item.status === 'Concluído' ? 'is-success' : 'is-warning'} is-light`}>{item.status}</span></td>
                                        <td>{item.referencia}</td>
                                        <td>{item.recipiente}</td>
                                        <td>{item.st_perc}</td>
                                        <td>{item.sv_st_perc}</td>
                                        <td>{item.st_mg}</td>
                                        <td>{item.st_var}</td>
                                        <td>{item.sv_var}</td>
                                        <td>{item.mv_mf}</td>
                                        <td>{item.var_perc}</td>
                                        <td>{item.data_analise}</td>
                                        <td>{item.p1}</td>
                                        <td>{item.p2}</td>
                                        <td>{item.p3}</td>
                                        <td>{item.p4}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Qualidade;