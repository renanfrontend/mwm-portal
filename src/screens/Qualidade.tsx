// src/screens/Qualidade.tsx

// CORREÇÃO: Removido 'useMemo' (TS6133)
import React, { useState, useEffect, useCallback } from 'react';
// CORREÇÃO: Removidos ícones não utilizados (TS6133)
import { MdSave, MdAddCircleOutline } from 'react-icons/md';
// CORREÇÃO: Removido 'useNavigate' (TS6133)
import { toast } from 'react-toastify';
// CORREÇÃO: Removido 'QualidadeDejetosListItem' (TS6133)
import { fetchQualidadeDejetosData, createAnaliseQualidade, fetchCooperadosData, type QualidadeDejetosItem, type CooperadoItem } from '../services/api';

type Tab = 'Análise' | 'Qualidade dos Dejetos' | 'Qualidade das Amostras';
type AmostraOrigem = 'cooperado' | 'pontoDeColeta';

const Qualidade: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Análise');
  // CORREÇÃO: Removido 'navigate' (TS6133)
  // CORREÇÃO: Removido 'searchTerm' e 'setSearchTerm' (TS6133)

  // CORREÇÃO: 'dejetosData' não é lido, então foi removido (TS6133)
  const [, setDejetosData] = useState<QualidadeDejetosItem[]>([]);
  const [cooperados, setCooperados] = useState<CooperadoItem[]>([]);
  
  // CORREÇÃO: 'loading' não é lido, então foi removido (TS6133)
  // E 'setLoading' agora é corretamente pego do 'useState' (Corrige TS2349)
  const [, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // --- CONTROLE DO FLUXO DO FORMULÁRIO CORRIGIDO ---
  const [formStep, setFormStep] = useState(0); // 0: Básico, 1: P1/P2, 2: P3, 3: P4
  const [amostraOrigem, setAmostraOrigem] = useState<AmostraOrigem>();
  const [formData, setFormData] = useState<Partial<QualidadeDejetosItem>>({});

  const loadListData = useCallback(async () => {
      if (activeTab === 'Qualidade dos Dejetos') {
          // CORREÇÃO: Chamada correta para setLoading (TS2349)
          setLoading(true);
          try {
              const data = await fetchQualidadeDejetosData();
              setDejetosData(data || []);
          } catch (err) { toast.error("Falha ao carregar dados."); }
          // CORREÇÃO: Chamada correta para setLoading (TS2349)
          finally { setLoading(false); }
      }
  }, [activeTab, setDejetosData, setLoading]); // Adicionado setLoading e setDejetosData às dependências

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
    if (activeTab === 'Análise') { loadCooperados(); }
  }, [activeTab]);

  // CORREÇÃO: Removido 'filteredDejetosData' (TS6133)

  const handleSave = async () => {
    setSaving(true);
    try {
        await createAnaliseQualidade(formData);
        toast.success("Amostra armazenada com sucesso!");
        resetForm();
        setActiveTab('Qualidade dos Dejetos');
    } catch (error) { toast.error("Erro ao armazenar a amostra."); }
    finally { setSaving(false); }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setActiveTab('Análise');
    setFormStep(0);
    setFormData({});
    setAmostraOrigem(undefined);
  };

  const handleOrigemSelect = (origem: AmostraOrigem) => {
    setAmostraOrigem(origem);
    setFormStep(0);
    setFormData({}); 
  };

  return (
    <>
      <nav className="level is-mobile mb-4">
        {/* ... (cabeçalho da página) ... */}
      </nav>

      <section className="section py-0">
        <div className="tabs is-toggle is-medium is-centered is-fullwidth">
          {/* ... (abas de navegação) ... */}
        </div>
      </section>
      
      {activeTab === 'Análise' && (
        <section className="section pt-4 pb-6">
          <div className="box">
            <h2 className="title is-5">Entrada da amostra</h2>
            
            <div className="field">
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

            {/* Renderiza o restante do formulário APENAS se a origem foi selecionada */}
            {amostraOrigem && (
              <>
                {/* --- ETAPA 0: DADOS BÁSICOS --- */}
                {amostraOrigem === 'cooperado' && (
                  <>
                    <div className="columns">
                      <div className="column"><div className="field"><label className="label">Nome do cooperado</label><div className="control"><div className="select is-fullwidth"><select name="cooperado" value={formData.cooperado || ''} onChange={handleInputChange}><option value="">Selecionar</option>{cooperados.map(c => <option key={c.id} value={c.motorista}>{c.motorista}</option>)}</select></div></div></div></div>
                      <div className="column"><div className="field"><label className="label">Data da análise</label><div className="control"><input className="input" type="date" name="dataColeta" value={formData.dataColeta || ''} onChange={handleInputChange} /></div></div></div>
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

                {/* --- ETAPA 1: P1 E P2 (Fiel ao print) --- */}
                {formStep >= 1 && (
                  <>
                    <hr />
                    <div className="columns">
                      <div className="column">
                        <p className="label has-text-centered">AMOSTRA</p>
                        <div className="field"><label className="label">ID Recipiente</label><div className="control"><input className="input" type="text" name="id_recipiente_amostra" value={formData.id_recipiente_amostra || ''} onChange={handleInputChange}/></div></div>
                        <div className="field"><label className="label">Peso do Recip.:</label><div className="control"><input className="input" type="text" name="peso_recip_amostra" value={formData.peso_recip_amostra || ''} onChange={handleInputChange}/></div></div>
                        <div className="field"><label className="label">Recip. + Amostra:</label><div className="control"><input className="input" type="text" name="pesagem_p2_amostra" value={formData.pesagem_p2_amostra || ''} onChange={handleInputChange}/></div></div>
                      </div>
                      <div className="column">
                        <p className="label has-text-centered">DUPLICATA</p>
                        <div className="field"><label className="label">ID Recipiente</label><div className="control"><input className="input" type="text" name="id_recipiente_duplicata" value={formData.id_recipiente_duplicata || ''} onChange={handleInputChange}/></div></div>
                        <div className="field"><label className="label">Peso do Recip.:</label><div className="control"><input className="input" type="text" name="peso_recip_duplicata" value={formData.peso_recip_duplicata || ''} onChange={handleInputChange}/></div></div>
                        <div className="field"><label className="label">Recip. + Amostra</label><div className="control"><input className="input" type="text" name="pesagem_p2_duplicata" value={formData.pesagem_p2_duplicata || ''} onChange={handleInputChange}/></div></div>
                      </div>
                    </div>
                  </>
                )}
                {/* --- ETAPA 2: P3 (Fiel ao print) --- */}
                {formStep >= 2 && (
                   <>
                    <hr />
                    <div className="columns">
                      <div className="column">
                        <p className="label has-text-centered">AMOSTRA</p>
                        <div className="field"><label className="label">Pesagem P3:</label><div className="control"><input className="input" type="text" name="pesagem_p3_amostra" value={formData.pesagem_p3_amostra || ''} onChange={handleInputChange}/></div></div>
                      </div>
                      <div className="column">
                        <p className="label has-text-centered">DUPLICATA</p>
                        <div className="field"><label className="label">Recip. + ST:</label><div className="control"><input className="input" type="text" name="recip_st_duplicata" value={formData.recip_st_duplicata || ''} onChange={handleInputChange}/></div></div>
                      </div>
                    </div>
                  </>
                )}
                {/* --- ETAPA 3: P4 (Fiel ao print) --- */}
                {formStep >= 3 && (
                   <>
                    <hr />
                    <div className="columns">
                      <div className="column">
                        <p className="label has-text-centered">AMOSTRA</p>
                        <div className="field"><label className="label">Pesagem P4:</label><div className="control"><input className="input" type="text" name="pesagem_p4_amostra" value={formData.pesagem_p4_amostra || ''} onChange={handleInputChange}/></div></div>
                      </div>
                      <div className="column">
                        <p className="label has-text-centered">DUPLICATA</p>
                        <div className="field"><label className="label">Recip. + SF:</label><div className="control"><input className="input" type="text" name="recip_sf_duplicata" value={formData.recip_sf_duplicata || ''} onChange={handleInputChange}/></div></div>
                      </div>
                    </div>
                  </>
                )}
                
                {/* BOTÕES CONDICIONAIS CORRIGIDOS */}
                <div className="field is-grouped is-justify-content-flex-end">
                  {formStep === 0 && <p className="control"><button className="button is-light" onClick={() => setFormStep(1)}><span className="icon is-small"><MdAddCircleOutline /></span><span>Infos</span></button></p>}
                  {formStep === 1 && <p className="control"><button className="button is-light" onClick={() => setFormStep(2)}>Próximo Passo</button></p>}
                  {formStep === 2 && <p className="control"><button className="button is-light" onClick={() => setFormStep(3)}>Próximo Passo</button></p>}
                  <p className="control">
                    <button className={`button is-info ${saving ? 'is-loading' : ''}`} onClick={handleSave}>
                      <span className="icon"><MdSave /></span>
                      <span>Salvar</span>
                    </button>
                  </p>
                </div>
              </>
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