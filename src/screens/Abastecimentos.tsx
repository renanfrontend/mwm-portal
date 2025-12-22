import React, { useState, useMemo } from 'react';
import { MdAdd, MdSearch, MdFilterList, MdDelete, MdTimer, MdCheckCircle, MdOutlineLocalGasStation, MdSave } from 'react-icons/md';
import { toast } from 'react-toastify';
// Importação direta do Recharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

// --- INTERFACES ---
interface AbastecimentoItem {
  id: string;
  data: string;
  horaInicio: string;
  horaTermino?: string;
  tipoAbastecimento: string;
  produto: string;
  placa: string;
  transportadora: string;
  odometro: string;
  pressaoInicial: string;
  pressaoFinal?: string;
  volumeAbastecido?: string;
  status: 'Em andamento' | 'Concluído';
}

interface PrecificacaoItem {
  id: string;
  preco: string; // Ex: "R$ 4,50"
  produto: string;
  mesAnp: string;
  mesFatura: string;
  usuario: string;
  data: string; // Data de cadastro
}

// --- CONSTANTES ---
const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const placasOptions = [
    { placa: 'ABC-1D23', transportadora: 'Primato' }, 
    { placa: 'EFG-4H56', transportadora: 'Translog' }, 
    { placa: 'IJK-7L89', transportadora: 'Rapidão' },
    { placa: 'MNO-1P01', transportadora: 'Loggi' },
    { placa: 'QRS-1T12', transportadora: 'Braspress' },
    { placa: 'UVX-1Z31', transportadora: 'Jadlog' }
];

const initialPrecificacaoData: PrecificacaoItem[] = [
    { id: '1', preco: 'R$ 6,15', produto: 'Diesel', mesAnp: 'Novembro', mesFatura: 'Dezembro', usuario: 'Carlos', data: '20/12/2025' },
    { id: '2', preco: 'R$ 4,45', produto: 'Biometano', mesAnp: 'Dezembro', mesFatura: 'Janeiro', usuario: 'Ana', data: '05/01/2026' },
    { id: '3', preco: 'R$ 2,10', produto: 'CO²', mesAnp: 'Dezembro', mesFatura: 'Janeiro', usuario: 'Renan', data: '10/01/2026' },
    { id: '4', preco: 'R$ 6,20', produto: 'Diesel', mesAnp: 'Janeiro', mesFatura: 'Fevereiro', usuario: 'Carlos', data: '14/01/2026' },
    { id: '5', preco: 'R$ 4,50', produto: 'Biometano', mesAnp: 'Janeiro', mesFatura: 'Fevereiro', usuario: 'Renan', data: '15/01/2026' },
];

const Abastecimentos: React.FC = () => {
  
  // --- ESTADOS ---
  const [activeTab, setActiveTab] = useState('Abastecimento');
  const [abastecimentosList, setAbastecimentosList] = useState<AbastecimentoItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // ESTADO ÚNICO DE DADOS (TABELA E GRÁFICO USAM ISSO)
  const [precificacaoList, setPrecificacaoList] = useState<PrecificacaoItem[]>(initialPrecificacaoData);

  // Estados dos Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'finish'>('create');
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

  // Formulário Abastecimento
  const [formData, setFormData] = useState({
    data: '',
    horaInicio: '',
    tipoAbastecimento: '',
    produto: '',
    placa: '',
    odometro: '',
    pressaoInicial: '',
    pressaoFinal: '',
    volumeAbastecido: '',
    horaTermino: ''
  });

  // Formulário Precificação
  const [priceFormData, setPriceFormData] = useState({
      preco: '',
      produto: '',
      mesAnp: '',
      mesFatura: ''
  });

  // --- LÓGICA REATIVA DO GRÁFICO ---
  const chartData = useMemo(() => {
    return precificacaoList.map(item => {
        const precoLimpo = item.preco.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
        const precoNumber = parseFloat(precoLimpo) || 0;

        const [dia, mes, ano] = item.data.split('/');
        const dataObj = new Date(Number(ano), Number(mes) - 1, Number(dia));
        
        const mesAno = !isNaN(dataObj.getTime()) 
            ? dataObj.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }) 
            : 'N/A';

        return {
            name: `${mesAno} (${item.produto})`,
            preco: precoNumber,
            rawDate: dataObj.getTime()
        };
    }).sort((a, b) => a.rawDate - b.rawDate);
  }, [precificacaoList]);

  // --- HANDLERS ---

  // Salvar Preço
  const handleSavePrice = () => {
      // Validação
      if (!priceFormData.preco || !priceFormData.produto || !priceFormData.mesAnp || !priceFormData.mesFatura) {
          toast.warn("Preencha todos os campos do formulário de preço.");
          return;
      }

      const newItem: PrecificacaoItem = {
          id: Date.now().toString(),
          preco: `R$ ${priceFormData.preco.replace('.', ',')}`, // Formatação simples
          produto: priceFormData.produto,
          mesAnp: priceFormData.mesAnp,
          mesFatura: priceFormData.mesFatura,
          usuario: 'Sistema',
          data: new Date().toLocaleDateString('pt-BR') // Data de hoje
      };

      setPrecificacaoList([...precificacaoList, newItem]);
      toast.success("Preço inserido com sucesso!");
      setIsPriceModalOpen(false);
      
      // Reset form
      setPriceFormData({
          preco: '',
          produto: '',
          mesAnp: '',
          mesFatura: ''
      });
  };

  const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setPriceFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handlers de Abastecimento
  const openCreateModal = () => {
    const now = new Date();
    setFormData({
        data: now.toISOString().split('T')[0],
        horaInicio: now.toTimeString().slice(0, 5),
        tipoAbastecimento: '',
        produto: '',
        placa: '',
        odometro: '',
        pressaoInicial: '',
        pressaoFinal: '',
        volumeAbastecido: '',
        horaTermino: ''
    });
    setModalMode('create');
    setIsModalOpen(true);
  };

  const openFinishModal = (item: AbastecimentoItem) => {
    const now = new Date();
    setFormData({
        ...item, 
        pressaoFinal: '',
        volumeAbastecido: '',
        horaTermino: now.toTimeString().slice(0, 5)
    } as any);
    setCurrentItemId(item.id);
    setModalMode('finish');
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (modalMode === 'create') {
        if (!formData.placa || !formData.tipoAbastecimento || !formData.pressaoInicial) {
            toast.warn("Preencha os campos obrigatórios.");
            return;
        }
        const transportadora = placasOptions.find(p => p.placa === formData.placa)?.transportadora || 'N/A';
        const newItem: AbastecimentoItem = {
            id: Date.now().toString(),
            ...formData,
            transportadora,
            status: 'Em andamento'
        };
        setAbastecimentosList(prev => [newItem, ...prev]);
        toast.success("Abastecimento iniciado!");
    } else {
        if (!formData.pressaoFinal || !formData.volumeAbastecido || !formData.horaTermino) {
            toast.warn("Preencha os dados de finalização.");
            return;
        }
        setAbastecimentosList(prev => prev.map(item => {
            if (item.id === currentItemId) {
                return {
                    ...item,
                    pressaoFinal: formData.pressaoFinal,
                    volumeAbastecido: formData.volumeAbastecido,
                    horaTermino: formData.horaTermino,
                    status: 'Concluído'
                };
            }
            return item;
        }));
        toast.success("Abastecimento finalizado!");
    }
    setIsModalOpen(false);
  };

  const filteredList = useMemo(() => {
      return abastecimentosList.filter(item => 
        item.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.transportadora.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [abastecimentosList, searchTerm]);

  const customSidebarBlue = '#4f46e5';

  return (
    <div className="screen-container" style={{ backgroundColor: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* HEADER */}
      <nav className="level is-mobile mb-0 px-4 py-3" style={{ borderBottom: '1px solid #dbdbdb', flexShrink: 0 }}>
        <div className="level-left">
          <div className="level-item">
             <h1 className="title is-4 mb-0 text-gray-700">Abastecimento</h1>
          </div>
        </div>
      </nav>

      {/* TABS */}
      <section className="section py-0 pt-3" style={{ flexShrink: 0 }}>
        <div className="tabs is-toggle is-medium is-centered is-fullwidth mb-0">
          <ul>
            <li className={activeTab === 'Abastecimento' ? 'is-active' : ''}>
                <a onClick={() => setActiveTab('Abastecimento')} className={activeTab === 'Abastecimento' ? 'has-background-link has-text-white' : ''} style={{ borderColor: activeTab === 'Abastecimento' ? '#3273dc' : '' }}>
                    <span>Abastecimento</span>
                </a>
            </li>
            <li className={activeTab === 'Relatórios' ? 'is-active' : ''}>
                <a onClick={() => setActiveTab('Relatórios')}>
                    <span>Relatórios</span>
                </a>
            </li>
            <li className={activeTab === 'Precificação' ? 'is-active' : ''}>
                <a onClick={() => setActiveTab('Precificação')} className={activeTab === 'Precificação' ? 'has-background-link has-text-white' : ''} style={{ borderColor: activeTab === 'Precificação' ? '#3273dc' : '' }}>
                    <span>Precificação</span>
                </a>
            </li>
          </ul>
        </div>
      </section>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="screen-content p-5" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', backgroundColor: '#f9fafb' }}>
        
        {/* === ABA: PRECIFICAÇÃO === */}
        {activeTab === 'Precificação' && (
            <div className="container is-fluid px-0">
                
                {/* TOOLBAR */}
                <div className="box mb-4" style={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: 'none' }}>
                    <div className="is-flex is-justify-content-space-between is-align-items-center">
                        <div className="control has-icons-right">
                            <input className="input" type="text" placeholder="Buscar..." style={{ width: '300px', borderRadius: '4px' }} />
                            <span className="icon is-right"><MdSearch /></span>
                        </div>
                        <div className="buttons">
                            <button className="button is-white border" style={{ borderRadius: '4px' }}><span className="icon"><MdDelete /></span></button>
                            <button className="button is-white border" style={{ borderRadius: '4px' }}><span className="icon"><MdFilterList /></span> <span>Filtrar</span></button>
                            
                            <button className="button is-link" style={{ borderRadius: '4px' }} onClick={() => setIsPriceModalOpen(true)}>
                                <span className="icon"><MdAdd /></span> <span>Adicionar</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="columns is-variable is-4">
                    {/* ESQUERDA: GRÁFICO DINÂMICO */}
                    <div className="column is-5">
                        <div className="box" style={{ height: '100%', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: 'none', minHeight: '400px' }}>
                            <h3 className="title is-6 mb-4 has-text-grey-dark">Evolução de Preços (Dinâmico)</h3>
                            <div style={{ width: '100%', height: '350px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={chartData}
                                        margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#6b7280', fontSize: 11 }} 
                                            dy={10}
                                            interval={0}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#6b7280', fontSize: 12 }}
                                            domain={[0, 'auto']} 
                                        />
                                        <Tooltip 
                                            cursor={{ fill: '#f9fafb' }}
                                            formatter={(value: number, _name: string, props: any) => [`R$ ${value.toFixed(2)}`, props.payload.produto]}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        />
                                        <Bar 
                                            dataKey="preco" 
                                            name="Preço"
                                            fill={customSidebarBlue} 
                                            radius={[4, 4, 0, 0]} 
                                            barSize={40} 
                                        >
                                            <LabelList 
                                                dataKey="preco" 
                                                position="top" 
                                                formatter={(value: number) => `R$ ${value.toFixed(2)}`} 
                                                style={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }} 
                                            />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* DIREITA: TABELA (FONTE DOS DADOS) */}
                    <div className="column is-7">
                        <div className="box p-0" style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: 'none' }}>
                            <table className="table is-fullwidth is-hoverable is-size-7">
                                <thead>
                                    <tr style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>
                                        <th className="py-3 pl-4">Preço</th>
                                        <th className="py-3">Produto</th>
                                        <th className="py-3">Mês ANP</th>
                                        <th className="py-3">Mês Fatura</th>
                                        <th className="py-3">Usuário</th>
                                        <th className="py-3">Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {precificacaoList.length > 0 ? precificacaoList.map(item => (
                                        <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                            <td className="is-vcentered py-3 pl-4 has-text-weight-bold has-text-success">{item.preco}</td>
                                            <td className="is-vcentered py-3">{item.produto}</td>
                                            <td className="is-vcentered py-3">{item.mesAnp}</td>
                                            <td className="is-vcentered py-3">{item.mesFatura}</td>
                                            <td className="is-vcentered py-3">{item.usuario}</td>
                                            <td className="is-vcentered py-3">{item.data}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={6} className="has-text-centered py-4 text-grey">Nenhum registro encontrado.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* === ABA: ABASTECIMENTO === */}
        {activeTab === 'Abastecimento' && (
            <>
                <div className="box mb-4" style={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: 'none' }}>
                    <div className="is-flex is-justify-content-space-between is-align-items-center">
                        <div className="control has-icons-right">
                            <input className="input" type="text" placeholder="Digite nome, empresa, veic..." style={{ width: '300px', borderRadius: '4px' }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <span className="icon is-right"><MdSearch /></span>
                        </div>
                        <div className="buttons">
                            <button className="button is-white border" style={{ borderRadius: '4px' }}><span className="icon"><MdDelete /></span></button>
                            <button className="button is-white border" style={{ borderRadius: '4px' }}><span className="icon"><MdFilterList /></span> <span>Filtrar</span></button>
                            <button className="button is-link" style={{ borderRadius: '4px' }} onClick={openCreateModal}>
                                <span className="icon"><MdAdd /></span> <span>Adicionar</span>
                            </button>
                        </div>
                    </div>
                </div>

                <p className="is-size-7 has-text-weight-semibold mb-3 has-text-grey-dark">
                    Abastecimentos no período: de 01/01/2026 à 30/01/2026
                </p>

                {abastecimentosList.length === 0 ? (
                    <div className="has-text-centered p-6 mt-4" style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px dashed #dbdbdb' }}>
                        <div className="icon is-large has-text-grey mb-3"><MdOutlineLocalGasStation size={48} /></div>
                        <p className="is-size-5 has-text-grey mb-2">Não há registros lançados</p>
                        <p className="is-size-7 has-text-grey-light mb-5">Você pode incluir manualmente o registro de entrada.</p>
                        <button className="button is-light" style={{ color: customSidebarBlue, borderColor: customSidebarBlue, backgroundColor: '#eef2ff' }} onClick={openCreateModal}>
                            <span className="icon"><MdAdd /></span><span>Registrar Abastecimento</span>
                        </button>
                    </div>
                ) : (
                    <div className="box p-0" style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: 'none' }}>
                        <table className="table is-fullwidth is-hoverable is-size-7">
                            <thead>
                                <tr style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>
                                    <th className="py-3">Data</th>
                                    <th className="py-3">Horário de início</th>
                                    <th className="py-3">Tipo de abastecimento</th>
                                    <th className="py-3">Produto</th>
                                    <th className="py-3">Transportadora</th>
                                    <th className="py-3">Placa</th>
                                    <th className="py-3">Status</th>
                                    <th className="py-3">Ação pendente</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredList.map(item => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td className="is-vcentered py-3">{item.data}</td>
                                        <td className="is-vcentered py-3">{item.horaInicio}</td>
                                        <td className="is-vcentered py-3">{item.tipoAbastecimento}</td>
                                        <td className="is-vcentered py-3">{item.produto}</td>
                                        <td className="is-vcentered py-3">{item.transportadora}</td>
                                        <td className="is-vcentered py-3 has-text-weight-bold">{item.placa}</td>
                                        <td className="is-vcentered py-3">
                                            <span className={`tag ${item.status === 'Em andamento' ? 'is-light' : 'is-success is-light'}`} style={{ borderRadius: '4px', fontWeight: '500' }}>{item.status}</span>
                                        </td>
                                        <td className="is-vcentered py-3">
                                            {item.status === 'Em andamento' ? (
                                                <button className="button is-small is-white border-0 has-text-success" onClick={() => openFinishModal(item)}>
                                                    <span className="icon is-small mr-1"><MdCheckCircle /></span><span>Finalizar</span>
                                                </button>
                                            ) : (
                                                <span className="has-text-grey-light">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </>
        )}

      {/* --- MODAL UNIFICADO (ABASTECIMENTO) --- */}
      {isModalOpen && (
        <div className="modal is-active">
            <div className="modal-background" onClick={() => setIsModalOpen(false)}></div>
            <div className="modal-card" style={{ width: '550px', maxHeight: '95vh', borderRadius: '8px' }}>
                <header className="modal-card-head has-background-white pt-5 px-5 pb-0" style={{ borderBottom: 'none' }}>
                    <p className="modal-card-title is-size-5 has-text-weight-normal text-gray-700">
                        {modalMode === 'create' ? 'Inserir abastecimento' : 'Finalizar abastecimento'}
                    </p>
                    <button className="delete" aria-label="close" onClick={() => setIsModalOpen(false)}></button>
                </header>
                <section className="modal-card-body px-5 py-4">
                    <div className="field"><label className="label is-size-7 has-text-weight-medium">Data</label><div className="control"><input className="input" type="date" name="data" value={formData.data} onChange={handleInputChange} disabled={modalMode === 'finish'} /></div></div>
                    <div className="field"><label className="label is-size-7 has-text-weight-medium">Horário de inicio</label><div className="control has-icons-right"><input className="input" type="time" name="horaInicio" value={formData.horaInicio} onChange={handleInputChange} disabled={modalMode === 'finish'} /><span className="icon is-small is-right"><MdTimer /></span></div></div>
                    <div className="field"><label className="label is-size-7 has-text-weight-medium">Tipo de abastecimento</label><div className="control"><div className="select is-fullwidth"><select name="tipoAbastecimento" value={formData.tipoAbastecimento} onChange={handleInputChange} disabled={modalMode === 'finish'}><option value="">Selecionar</option><option value="Bomba de abastecimento">Bomba de abastecimento</option><option value="Cilindro de abastecimento">Cilindro de abastecimento</option></select></div></div></div>
                    <div className="field"><label className="label is-size-7 has-text-weight-medium">Produto</label><div className="control"><div className="select is-fullwidth"><select name="produto" value={formData.produto} onChange={handleInputChange} disabled={modalMode === 'finish'}><option value="">Selecionar</option><option value="Biometano">Biometano</option><option value="CO²">CO²</option></select></div></div></div>
                    <div className="field"><label className="label is-size-7 has-text-weight-medium">Placa do veículo</label><div className="control"><div className="select is-fullwidth"><select name="placa" value={formData.placa} onChange={handleInputChange} disabled={modalMode === 'finish'}><option value="">Selecionar</option>{placasOptions.map(p => <option key={p.placa} value={p.placa}>{p.placa}</option>)}</select></div></div></div>
                    <div className="field"><label className="label is-size-7 has-text-weight-medium">Odomêtro:</label><div className="control"><input className="input" type="number" name="odometro" placeholder="000000000" value={formData.odometro} onChange={handleInputChange} disabled={modalMode === 'finish'} /></div></div>
                    <div className="field"><label className="label is-size-7 has-text-weight-medium">Pressão inicial:</label><div className="control"><input className="input" type="number" name="pressaoInicial" value={formData.pressaoInicial} onChange={handleInputChange} disabled={modalMode === 'finish'} /></div><p className="help has-text-grey is-size-7 mt-1">Bares (Pa)</p></div>
                    {modalMode === 'finish' && (
                        <>
                            <hr className="my-4" />
                            <div className="field"><label className="label is-size-7 has-text-weight-medium">Pressão final:</label><div className="control"><input className="input" type="number" name="pressaoFinal" value={formData.pressaoFinal} onChange={handleInputChange} /></div><p className="help has-text-grey is-size-7 mt-1">Bares (Pa)</p></div>
                            <div className="field"><label className="label is-size-7 has-text-weight-medium">Volume abastecido:</label><div className="control"><input className="input" type="number" name="volumeAbastecido" value={formData.volumeAbastecido} onChange={handleInputChange} /></div><p className="help has-text-grey is-size-7 mt-1">Metros cúbico (m³)</p></div>
                            <div className="field"><label className="label is-size-7 has-text-weight-medium">Horário de término:</label><div className="control has-icons-right"><input className="input" type="time" name="horaTermino" value={formData.horaTermino} onChange={handleInputChange} /><span className="icon is-small is-right"><MdTimer /></span></div></div>
                        </>
                    )}
                </section>
                <footer className="modal-card-foot has-background-white is-justify-content-flex-end px-5 pb-5 pt-2" style={{ borderTop: 'none' }}>
                    <button className="button" style={{ borderRadius: '4px' }} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                    <button className={`button ${modalMode === 'create' ? 'is-link' : 'is-success'}`} style={{ borderRadius: '4px' }} onClick={handleSubmit}>
                        {modalMode === 'create' ? 'Iniciar abastecimento' : 'Finalizar abastecimento'}
                    </button>
                </footer>
            </div>
        </div>
      )}

      {/* --- MODAL DE INSERIR PREÇO (NOVO) --- */}
      {isPriceModalOpen && (
          <div className="modal is-active">
              <div className="modal-background" onClick={() => setIsPriceModalOpen(false)}></div>
              <div className="modal-card" style={{ width: '500px', borderRadius: '8px' }}>
                  <header className="modal-card-head has-background-white pt-5 px-5 pb-0" style={{ borderBottom: 'none' }}>
                      <p className="modal-card-title is-size-5 has-text-weight-normal text-gray-700">Inserir preço</p>
                      <button className="delete" aria-label="close" onClick={() => setIsPriceModalOpen(false)}></button>
                  </header>
                  <section className="modal-card-body px-5 py-4">
                      
                      {/* PREÇO */}
                      <div className="field">
                          <label className="label is-size-7 has-text-weight-medium">Preço</label>
                          <div className="control">
                              <input 
                                className="input" 
                                type="number" 
                                step="0.01" 
                                name="preco" 
                                placeholder="0.00"
                                value={priceFormData.preco} 
                                onChange={handlePriceInputChange} 
                              />
                          </div>
                      </div>

                      {/* PRODUTO */}
                      <div className="field">
                          <label className="label is-size-7 has-text-weight-medium">Produto</label>
                          <div className="control">
                              <div className="select is-fullwidth">
                                  <select name="produto" value={priceFormData.produto} onChange={handlePriceInputChange}>
                                      <option value="">Selecionar</option>
                                      <option value="Biometano">Biometano</option>
                                      <option value="CO²">CO²</option>
                                  </select>
                              </div>
                          </div>
                      </div>

                      {/* MÊS ANP */}
                      <div className="field">
                          <label className="label is-size-7 has-text-weight-medium">Mês ANP</label>
                          <div className="control">
                              <div className="select is-fullwidth">
                                  <select name="mesAnp" value={priceFormData.mesAnp} onChange={handlePriceInputChange}>
                                      <option value="">Selecionar</option>
                                      {months.map(m => <option key={m} value={m}>{m}</option>)}
                                  </select>
                              </div>
                          </div>
                      </div>

                      {/* MÊS FATURA */}
                      <div className="field">
                          <label className="label is-size-7 has-text-weight-medium">Mês fatura</label>
                          <div className="control">
                              <div className="select is-fullwidth">
                                  <select name="mesFatura" value={priceFormData.mesFatura} onChange={handlePriceInputChange}>
                                      <option value="">Selecionar</option>
                                      {months.map(m => <option key={m} value={m}>{m}</option>)}
                                  </select>
                              </div>
                          </div>
                      </div>

                  </section>
                  <footer className="modal-card-foot has-background-white is-justify-content-flex-end px-5 pb-5 pt-2" style={{ borderTop: 'none' }}>
                      <button className="button" style={{ borderRadius: '4px' }} onClick={() => setIsPriceModalOpen(false)}>Cancelar</button>
                      <button className="button is-link" style={{ borderRadius: '4px' }} onClick={handleSavePrice}>
                          <span className="icon is-small mr-1"><MdSave /></span>
                          <span>Salvar</span>
                      </button>
                  </footer>
              </div>
          </div>
      )}
      </div>

    </div>
  );
};

export default Abastecimentos;