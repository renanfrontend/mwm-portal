import React, { useState, useEffect, useCallback } from 'react';
import { MdSave, MdAddCircleOutline } from 'react-icons/md';
import { toast } from 'react-toastify';
import { 
  fetchQualidadeDejetosData, 
  createAnaliseQualidade, 
  fetchCooperadosData, 
  type QualidadeDejetosItem, 
  type CooperadoItem 
} from '../services/api';

// Definição das abas
type Tab = 'Abastecimento' | 'Análise' | 'Qualidade dos Dejetos' | 'Qualidade das Amostras';
type AmostraOrigem = 'cooperado' | 'pontoDeColeta';

const Qualidade: React.FC = () => {
  // Controle de Abas
  const [activeTab, setActiveTab] = useState<Tab>('Análise');

  // Dados Gerais
  const [dejetosData, setDejetosData] = useState<QualidadeDejetosItem[]>([]);
  const [cooperados, setCooperados] = useState<CooperadoItem[]>([]);
  
  // Estados de Controle
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // --- FORMULÁRIO ANÁLISE (Existente) ---
  const [formStep, setFormStep] = useState(0); 
  const [amostraOrigem, setAmostraOrigem] = useState<AmostraOrigem>();
  const [formData, setFormData] = useState<Partial<QualidadeDejetosItem>>({});

  // --- FORMULÁRIO ABASTECIMENTO ---
  const [abastecimentoForm, setAbastecimentoForm] = useState({
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

  // Cálculo automático do Total Recebido
  useEffect(() => {
    const inicial = parseFloat(abastecimentoForm.medicaoInicial);
    const final = parseFloat(abastecimentoForm.medicaoFinal);
    
    if (!isNaN(inicial) && !isNaN(final)) {
        // Calcula a diferença absoluta
        const total = Math.abs(inicial - final);
        setAbastecimentoForm(prev => ({
            ...prev,
            totalRecebido: total.toFixed(2)
        }));
    }
  }, [abastecimentoForm.medicaoInicial, abastecimentoForm.medicaoFinal]);

  // Loaders
  const loadListData = useCallback(async () => {
      if (activeTab === 'Qualidade dos Dejetos') {
          setLoading(true);
          try {
              const data = await fetchQualidadeDejetosData();
              setDejetosData(data || []);
          } catch (err) { 
              toast.error("Falha ao carregar dados."); 
          } finally { 
              setLoading(false); 
          }
      }
  }, [activeTab]);

  useEffect(() => { loadListData(); }, [loadListData]);
  
  useEffect(() => {
    const loadCooperados = async () => {
      try {
        const data = await fetchCooperadosData();
        setCooperados(data || []);
      } catch (error) {
        toast.error("Falha ao carregar lista de cooperados.");
      }
    };
    if (activeTab === 'Análise' || activeTab === 'Abastecimento') { 
        loadCooperados(); 
    }
  }, [activeTab]);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAbastecimentoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAbastecimentoForm(prev => ({ ...prev, [name]: value }));
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

  const handleSaveAbastecimento = async () => {
      setSaving(true);
      try {
          console.log(abastecimentoForm);
          await new Promise(resolve => setTimeout(resolve, 500));
          toast.success("Abastecimento salvo com sucesso!");
          setAbastecimentoForm({
            cooperado: '', data: '', medicaoInicial: '', medicaoFinal: '', totalRecebido: '0.00',
            densidade: '', ms: '', nitrogenio: '', fosfato: '', oxidoPotassio: ''
          });
      } catch(e) {
          toast.error("Erro ao salvar abastecimento");
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
            <li className={activeTab === 'Abastecimento' ? 'is-active' : ''}>
              <a onClick={() => setActiveTab('Abastecimento')}>
                <span>Abastecimento</span>
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
      
      {/* --- ABA: ABASTECIMENTO (Formulário) --- */}
      {activeTab === 'Abastecimento' && (
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
                                            value={abastecimentoForm.cooperado} 
                                            onChange={handleAbastecimentoChange}
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
                                        value={abastecimentoForm.data} 
                                        onChange={handleAbastecimentoChange} 
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
                                        value={abastecimentoForm.medicaoInicial} 
                                        onChange={handleAbastecimentoChange} 
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
                                        value={abastecimentoForm.medicaoFinal} 
                                        onChange={handleAbastecimentoChange} 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* --- TOTAL RECEBIDO (Ajustado: Título Maior e Alinhamento) --- */}
                        <div className="column is-12">
                            <div className="field">
                                <div className="control">
                                    <div className="notification is-success p-4" style={{ borderRadius: '4px' }}>
                                        <p className="is-size-5 has-text-white mb-1 has-text-weight-bold">
                                            Total recebido (Kg):
                                        </p>
                                        <p className="is-size-4 has-text-weight-bold has-text-white has-text-left">
                                            {abastecimentoForm.totalRecebido}
                                        </p>
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
                                            value={abastecimentoForm.densidade} 
                                            onChange={handleAbastecimentoChange}
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
                                        value={abastecimentoForm.ms} 
                                        onChange={handleAbastecimentoChange} 
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
                                        value={abastecimentoForm.nitrogenio} 
                                        onChange={handleAbastecimentoChange} 
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
                                        value={abastecimentoForm.fosfato} 
                                        onChange={handleAbastecimentoChange} 
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
                                        value={abastecimentoForm.oxidoPotassio} 
                                        onChange={handleAbastecimentoChange} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="field is-grouped is-justify-content-flex-end mt-5">
                        <p className="control">
                            <button 
                                className={`button is-info ${saving ? 'is-loading' : ''}`} 
                                onClick={handleSaveAbastecimento}
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

      {/* --- ABA: LISTA --- */}
      {activeTab === 'Qualidade dos Dejetos' && (
        <section className="section pt-4 pb-6">
          <div className="box">
            <h2 className="title is-5 mb-4">Registros de Qualidade</h2>
            {loading ? (
                <div className="has-text-centered py-6">
                    <button className="button is-loading is-white is-large">Carregando</button>
                </div>
            ) : (
                dejetosData.length > 0 ? (
                    <div className="table-container">
                        <table className="table is-fullwidth is-striped is-hoverable">
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Cooperado/Ponto</th>
                                    <th>PH</th>
                                    <th>Densidade</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dejetosData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.dataColeta ? new Date(item.dataColeta).toLocaleDateString() : '-'}</td>
                                        <td>{item.cooperado}</td>
                                        <td>{item.ph}</td>
                                        <td>{item.densidade}</td>
                                        <td><span className="tag is-success is-light">Concluído</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="notification is-light has-text-centered">
                        Nenhum registro encontrado.
                    </div>
                )
            )}
          </div>
        </section>
      )}

      {/* --- ABA: AMOSTRAS --- */}
      {activeTab === 'Qualidade das Amostras' && (
        <section className="section pt-4 pb-6">
            <div className="box has-text-centered py-6 has-text-grey-light border-dashed">
                <span className="icon is-large mb-3"><MdAddCircleOutline size={48} /></span>
                <p className="is-size-5">Template de Amostras em Desenvolvimento</p>
                <p className="is-size-7">Esta aba será implementada na próxima etapa.</p>
            </div>
        </section>
      )}
    </>
  );
};

export default Qualidade;