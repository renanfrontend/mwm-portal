import React, { useState, useEffect } from 'react';
import { MdSave, MdAddCircleOutline } from 'react-icons/md';
import { toast } from 'react-toastify';
import { 
  createAnaliseQualidade, 
  fetchCooperadosData, 
  type QualidadeDejetosItem, 
  type CooperadoItem 
} from '../services/api';

// Definição das abas
type Tab = 'Entrega de dejetos' | 'Análise' | 'Qualidade dos Dejetos' | 'Qualidade das Amostras';
type AmostraOrigem = 'cooperado' | 'pontoDeColeta';

const Qualidade: React.FC = () => {
  // Controle de Abas
  const [activeTab, setActiveTab] = useState<Tab>('Análise');

  // Dados Gerais
  const [cooperados, setCooperados] = useState<CooperadoItem[]>([]);
  
  // Estados de Controle
  const [saving, setSaving] = useState(false);
  
  // --- FORMULÁRIO ANÁLISE (Existente) ---
  const [formStep, setFormStep] = useState(0); 
  const [amostraOrigem, setAmostraOrigem] = useState<AmostraOrigem>();
  const [formData, setFormData] = useState<Partial<QualidadeDejetosItem>>({});

  // --- FORMULÁRIO ENTREGA DE DEJETOS ---
  const [entregaDejetosForm, setEntregaDejetosForm] = useState({
    cooperado: '',
    data: '',
    medicaoInicial: '',
    medicaoFinal: '',
    totalRecebido: '0.00',
    densidade: '',
    ms: '',
    nitrogenio: '',
    fosfato: '',
    oxidoPotassio: ''
  });

  // Dados Mockados para visualização das tabelas
  const mockDejetosList = [
    {
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

  // Cálculo automático do Total Recebido
  useEffect(() => {
    const inicial = parseFloat(entregaDejetosForm.medicaoInicial);
    const final = parseFloat(entregaDejetosForm.medicaoFinal);
    
    if (!isNaN(inicial) && !isNaN(final)) {
        const total = Math.abs(inicial - final);
        setEntregaDejetosForm(prev => ({
            ...prev,
            totalRecebido: total.toFixed(2)
        }));
    }
  }, [entregaDejetosForm.medicaoInicial, entregaDejetosForm.medicaoFinal]);

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
    if (activeTab === 'Análise' || activeTab === 'Entrega de dejetos') { 
        loadCooperados(); 
    }
  }, [activeTab]);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEntregaDejetosChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEntregaDejetosForm(prev => ({ ...prev, [name]: value }));
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

  const handleSaveEntregaDejetos = async () => {
      setSaving(true);
      try {
          console.log(entregaDejetosForm);
          await new Promise(resolve => setTimeout(resolve, 500));
          toast.success("Entrega de dejetos salva com sucesso!");
          setEntregaDejetosForm({
            cooperado: '', data: '', medicaoInicial: '', medicaoFinal: '', totalRecebido: '0.00',
            densidade: '', ms: '', nitrogenio: '', fosfato: '', oxidoPotassio: ''
          });
      } catch(e) {
          toast.error("Erro ao salvar entrega de dejetos");
      } finally {
          setSaving(false);
      }
  }

  // Opções de densidade
  const densidadeOptions = Array.from({length: 11}, (_, i) => 1010 + i);

  return (
    <>
      <nav className="level is-mobile mb-4">
        <div className="level-left">
          <div className="level-item">
            <h1 className="title is-4">Controle de Qualidade</h1>
          </div>
        </div>
      </nav>

      <section className="section py-0 pt-3">
        {/* ABAS */}
        <div className="tabs is-toggle is-medium is-centered is-fullwidth">
          <ul>
            <li className={activeTab === 'Entrega de dejetos' ? 'is-active' : ''}>
              <a onClick={() => setActiveTab('Entrega de dejetos')}>
                <span>Entrega de dejetos</span>
              </a>
            </li>
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
      
      {/* --- ABA: ENTREGA DE DEJETOS (Formulário) --- */}
      {activeTab === 'Entrega de dejetos' && (
        <section className="section pt-4 pb-6">
            <div className="box">
                <div className="animate-fade-in">
                    
                    {/* Seção: Volume de material recebido */}
                    <h2 className="title is-5 mb-4 has-text-weight-bold" style={{ borderBottom: '1px solid #dbdbdb', paddingBottom: '0.5rem' }}>
                        Volume de material recebido
                    </h2>
                    
                    <div className="columns is-multiline">
                        <div className="column is-12">
                            <div className="field">
                                <label className="label">Cooperado:</label>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                        <select 
                                            name="cooperado" 
                                            value={entregaDejetosForm.cooperado} 
                                            onChange={handleEntregaDejetosChange}
                                        >
                                            <option value="">Selecionar</option>
                                            {cooperados.map(c => (
                                                <option key={c.id} value={c.motorista}>{c.motorista}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="column is-12">
                            <div className="field">
                                <label className="label">Data:</label>
                                <div className="control">
                                    <input 
                                        className="input" 
                                        type="date" 
                                        name="data" 
                                        value={entregaDejetosForm.data} 
                                        onChange={handleEntregaDejetosChange} 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="column is-6">
                            <div className="field">
                                <label className="label">Medição inicial (Kg):</label>
                                <div className="control">
                                    <input 
                                        className="input" 
                                        type="number" 
                                        name="medicaoInicial" 
                                        value={entregaDejetosForm.medicaoInicial} 
                                        onChange={handleEntregaDejetosChange} 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="column is-6">
                            <div className="field">
                                <label className="label">Medição final (Kg):</label>
                                <div className="control">
                                    <input 
                                        className="input" 
                                        type="number" 
                                        name="medicaoFinal" 
                                        value={entregaDejetosForm.medicaoFinal} 
                                        onChange={handleEntregaDejetosChange} 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* --- TOTAL RECEBIDO --- */}
                        <div className="column is-12">
                            <div className="field">
                                <div className="control">
                                    <div style={{ 
                                        backgroundColor: '#e4f7ee',
                                        borderRadius: '6px',
                                        padding: '1rem 1.5rem',
                                        color: 'black',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start'
                                    }}>
                                        <span style={{ 
                                            fontSize: '0.9rem', 
                                            fontWeight: 'bold', 
                                            marginBottom: '0.25rem',
                                            opacity: 0.9
                                        }}>
                                            Total recebido (Kg):
                                        </span>
                                        <span style={{ 
                                            fontSize: '1.8rem', 
                                            fontWeight: 'bold' 
                                        }}>
                                            {entregaDejetosForm.totalRecebido}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Seção: Análise de densidade */}
                    <h2 className="title is-5 mt-5 mb-4 has-text-weight-bold" style={{ borderBottom: '1px solid #dbdbdb', paddingBottom: '0.5rem' }}>
                        Análise de densidade
                    </h2>

                    <div className="columns is-multiline">
                        <div className="column is-12">
                            <div className="field">
                                <label className="label">Densidade:</label>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                        <select 
                                            name="densidade" 
                                            value={entregaDejetosForm.densidade} 
                                            onChange={handleEntregaDejetosChange}
                                        >
                                            <option value="">Selecionar</option>
                                            {densidadeOptions.map(val => (
                                                <option key={val} value={val}>{val}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="column is-6">
                            <div className="field">
                                <label className="label">MS (%):</label>
                                <div className="control">
                                    <input 
                                        className="input" 
                                        type="text" 
                                        name="ms" 
                                        value={entregaDejetosForm.ms} 
                                        onChange={handleEntregaDejetosChange} 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="column is-6">
                            <div className="field">
                                <label className="label">Nitrogênio (N)(mg/L):</label>
                                <div className="control">
                                    <input 
                                        className="input" 
                                        type="text" 
                                        name="nitrogenio" 
                                        value={entregaDejetosForm.nitrogenio} 
                                        onChange={handleEntregaDejetosChange} 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="column is-6">
                            <div className="field">
                                <label className="label">Fosfato (P205)(mg/L):</label>
                                <div className="control">
                                    <input 
                                        className="input" 
                                        type="text" 
                                        name="fosfato" 
                                        value={entregaDejetosForm.fosfato} 
                                        onChange={handleEntregaDejetosChange} 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="column is-6">
                            <div className="field">
                                <label className="label">Óxido de potássio (K20)(mg/L):</label>
                                <div className="control">
                                    <input 
                                        className="input" 
                                        type="text" 
                                        name="oxidoPotassio" 
                                        value={entregaDejetosForm.oxidoPotassio} 
                                        onChange={handleEntregaDejetosChange} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="field is-grouped is-justify-content-flex-end mt-5">
                        <p className="control">
                            <button 
                                className={`button is-info ${saving ? 'is-loading' : ''}`} 
                                onClick={handleSaveEntregaDejetos}
                            >
                                <span className="icon"><MdSave /></span>
                                <span>Salvar</span>
                            </button>
                        </p>
                    </div>

                </div>
            </div>
        </section>
      )}

      {/* --- ABA: ANÁLISE (Mantido) --- */}
      {activeTab === 'Análise' && (
        <section className="section pt-4 pb-6">
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
                  Ecoponto
                </button>
              </div>
            </div>

            {amostraOrigem && (
              <div className="animate-fade-in">
                {amostraOrigem === 'cooperado' && (
                  <>
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
                          <label className="label">Data da análise</label>
                          <div className="control">
                            <input className="input" type="date" name="dataColeta" value={formData.dataColeta || ''} onChange={handleInputChange} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="columns">
                        <div className="column"><div className="field"><label className="label">Entrega Referência</label><div className="control"><div className="select is-fullwidth"><select name="entregaReferencia" value={formData.entregaReferencia || ''} onChange={handleInputChange}><option value="">Selecionar Referência</option></select></div></div></div></div>
                        <div className="column"><div className="field"><label className="label">PH</label><div className="control"><div className="select is-fullwidth"><select name="ph" value={formData.ph || ''} onChange={handleInputChange}><option value="">Selecionar PH</option></select></div></div></div></div>
                        <div className="column"><div className="field"><label className="label">Densidade</label><div className="control"><div className="select is-fullwidth"><select name="densidade" value={formData.densidade || ''} onChange={handleInputChange}><option value="">Selecionar Densidade</option></select></div></div></div></div>
                    </div>
                  </>
                )}
                {amostraOrigem === 'pontoDeColeta' && (
                  <div className="columns">
                    <div className="column"><div className="field"><label className="label">Ecoponto</label><div className="control"><div className="select is-fullwidth"><select name="cooperado" value={formData.cooperado || ''} onChange={handleInputChange}><option value="">Selecionar Ponto</option></select></div></div></div></div>
                    <div className="column"><div className="field"><label className="label">PH</label><div className="control"><div className="select is-fullwidth"><select name="ph" value={formData.ph || ''} onChange={handleInputChange}><option value="">Selecionar PH</option></select></div></div></div></div>
                    <div className="column"><div className="field"><label className="label">Densidade</label><div className="control"><div className="select is-fullwidth"><select name="densidade" value={formData.densidade || ''} onChange={handleInputChange}><option value="">Selecionar Densidade</option></select></div></div></div></div>
                  </div>
                )}

                {/* ETAPAS FORMULARIO ORIGINAL */}
                {formStep >= 1 && (
                  <>
                    <hr />
                    <div className="columns">
                      <div className="column">
                        <p className="label has-text-centered has-text-info">AMOSTRA</p>
                        <div className="field"><label className="label">ID Recipiente</label><div className="control"><input className="input" type="text" name="id_recipiente_amostra" value={formData.id_recipiente_amostra || ''} onChange={handleInputChange}/></div></div>
                        <div className="field"><label className="label">Peso do Recip.:</label><div className="control"><input className="input" type="text" name="peso_recip_amostra" value={formData.peso_recip_amostra || ''} onChange={handleInputChange}/></div></div>
                        <div className="field"><label className="label">Recip. + Amostra:</label><div className="control"><input className="input" type="text" name="pesagem_p2_amostra" value={formData.pesagem_p2_amostra || ''} onChange={handleInputChange}/></div></div>
                      </div>
                      <div className="column">
                        <p className="label has-text-centered has-text-info">DUPLICATA</p>
                        <div className="field"><label className="label">ID Recipiente</label><div className="control"><input className="input" type="text" name="id_recipiente_duplicata" value={formData.id_recipiente_duplicata || ''} onChange={handleInputChange}/></div></div>
                        <div className="field"><label className="label">Peso do Recip.:</label><div className="control"><input className="input" type="text" name="peso_recip_duplicata" value={formData.peso_recip_duplicata || ''} onChange={handleInputChange}/></div></div>
                        <div className="field"><label className="label">Recip. + Amostra</label><div className="control"><input className="input" type="text" name="pesagem_p2_duplicata" value={formData.pesagem_p2_duplicata || ''} onChange={handleInputChange}/></div></div>
                      </div>
                    </div>
                  </>
                )}
                
                {formStep >= 2 && (
                   <>
                    <hr />
                    <div className="columns">
                      <div className="column">
                        <p className="label has-text-centered has-text-info">AMOSTRA</p>
                        <div className="field"><label className="label">Pesagem P3:</label><div className="control"><input className="input" type="text" name="pesagem_p3_amostra" value={formData.pesagem_p3_amostra || ''} onChange={handleInputChange}/></div></div>
                      </div>
                      <div className="column">
                        <p className="label has-text-centered has-text-info">DUPLICATA</p>
                        <div className="field"><label className="label">Recip. + ST:</label><div className="control"><input className="input" type="text" name="recip_st_duplicata" value={formData.recip_st_duplicata || ''} onChange={handleInputChange}/></div></div>
                      </div>
                    </div>
                  </>
                )}
                
                {formStep >= 3 && (
                   <>
                    <hr />
                    <div className="columns">
                      <div className="column">
                        <p className="label has-text-centered has-text-info">AMOSTRA</p>
                        <div className="field"><label className="label">Pesagem P4:</label><div className="control"><input className="input" type="text" name="pesagem_p4_amostra" value={formData.pesagem_p4_amostra || ''} onChange={handleInputChange}/></div></div>
                      </div>
                      <div className="column">
                        <p className="label has-text-centered has-text-info">DUPLICATA</p>
                        <div className="field"><label className="label">Recip. + SF:</label><div className="control"><input className="input" type="text" name="recip_sf_duplicata" value={formData.recip_sf_duplicata || ''} onChange={handleInputChange}/></div></div>
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
        </section>
      )}

      {/* --- ABA: LISTA DE DEJETOS (ATUALIZADA) --- */}
      {activeTab === 'Qualidade dos Dejetos' && (
        <section className="section pt-4 pb-6">
          <div className="box">
            <h2 className="title is-5 mb-4">Qualidade dos dejetos por cooperado</h2>
            <div className="table-container">
                <table className="table is-fullwidth is-striped is-hoverable is-bordered is-size-7">
                    <thead>
                        <tr className="has-background-light">
                            <th>Data</th>
                            <th>Cooperado</th>
                            <th>Status</th>
                            <th>Peso Inicial</th>
                            <th>Peso Final</th>
                            <th>Total Recebido</th>
                            <th>Densidade</th>
                            <th>MS (%)</th>
                            <th>N (mg/L)</th>
                            <th>P2O5 (mg/L)</th>
                            <th>K2O (mg/L)</th>
                            <th>ST (mg/L)</th>
                            <th>SV (mg/L)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockDejetosList.map((item, index) => (
                            <tr key={index}>
                                <td>{item.data}</td>
                                <td>{item.cooperado}</td>
                                <td>
                                    <span className={`tag ${item.status === 'Concluído' ? 'is-success' : 'is-warning'} is-light`}>
                                        {item.status}
                                    </span>
                                </td>
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
        </section>
      )}

      {/* --- ABA: AMOSTRAS (ATUALIZADA) --- */}
      {activeTab === 'Qualidade das Amostras' && (
        <section className="section pt-4 pb-6">
            <div className="box">
                <h2 className="title is-5 mb-4">Qualidade das amostras por ponto de coleta</h2>
                <div className="table-container">
                    <table className="table is-fullwidth is-striped is-hoverable is-bordered is-size-7">
                        <thead>
                            <tr className="has-background-light">
                                <th>Data</th>
                                <th>Ecoponto</th>
                                <th>Status</th>
                                <th>Referência</th>
                                <th>Recepiente</th>
                                <th>ST (%)</th>
                                <th>SV/ST (%)</th>
                                <th>ST (mg/L)</th>
                                <th>ST Var. (%)</th>
                                <th>SV Var. (%)</th>
                                <th>MV/MF (%)</th>
                                <th>Var. (%)</th>
                                <th>Data Análise</th>
                                <th>P1 (g)</th>
                                <th>P2 (g)</th>
                                <th>P3 (g)</th>
                                <th>P4 (g)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockAmostrasList.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.data}</td>
                                    <td>{item.ecoponto}</td>
                                    <td>
                                        <span className={`tag ${item.status === 'Concluído' ? 'is-success' : 'is-warning'} is-light`}>
                                            {item.status}
                                        </span>
                                    </td>
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
        </section>
      )}
    </>
  );
};

export default Qualidade;