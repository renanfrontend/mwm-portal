import React, { useState, useMemo, useRef } from 'react';
import { 
  MdAdd, MdSearch, MdFilterList, MdDelete, MdTimer, MdCheckCircle, 
  MdOutlineLocalGasStation, MdSave, MdFileDownload, 
  MdPictureAsPdf, MdChevronLeft, MdChevronRight, MdCheck, MdArrowUpward, MdArrowDownward, MdViewColumn,
  MdArrowBack // Adicionado ícone de voltar
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom'; // Adicionado hook de navegação
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

// --- IMPORTAÇÃO DO LOGO ---
import logoMwm from '../../logo.png';

// --- INTERFACES ---
interface AbastecimentoItem {
  id: string;
  data: string;
  horaInicio: string;
  horaTermino?: string;
  tipoAbastecimento: string;
  tipoVeiculo: string; 
  produto: string;
  placa: string;
  transportadora: string;
  odometro: string;
  pressaoInicial: string;
  pressaoFinal?: string;
  volumeAbastecido?: string;
  status: 'Em andamento' | 'Concluído';
  assinatura?: string;
  usuario?: string;
}

interface PrecificacaoItem {
  id: string;
  preco: string;
  produto: string;
  mesAnp: string;
  mesFatura: string;
  usuario: string;
  data: string;
}

// --- CONSTANTES ---
const ITENS_POR_PAGINA = 5;

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const vehicleTypes = [
    "Caminhão Truck",
    "Carreta",
    "Bitrem",
    "Vuc",
    "Utilitário",
    "Empilhadeira"
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

const initialAbastecimentos: AbastecimentoItem[] = [
    {
        id: '101',
        data: '2026-01-10',
        horaInicio: '08:00',
        horaTermino: '08:45',
        tipoAbastecimento: 'Bomba de abastecimento',
        tipoVeiculo: 'Caminhão Truck', 
        produto: 'Biometano',
        placa: 'ABC-1D23',
        transportadora: 'Primato',
        odometro: '15000',
        pressaoInicial: '200',
        pressaoFinal: '20',
        volumeAbastecido: '450',
        status: 'Concluído',
        usuario: 'Renan'
    },
    {
        id: '102',
        data: '2026-01-11',
        horaInicio: '14:30',
        horaTermino: '15:15',
        tipoAbastecimento: 'Cilindro de abastecimento',
        tipoVeiculo: 'Utilitário', 
        produto: 'CO²',
        placa: 'XYZ-9988',
        transportadora: 'Translog',
        odometro: '22300',
        pressaoInicial: '180',
        pressaoFinal: '10',
        volumeAbastecido: '300',
        status: 'Concluído',
        usuario: 'Carlos'
    }
];

// --- HELPERS ---
const calculateDuration = (start: string, end?: string) => {
    if (!end) return '-';
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    const date1 = new Date(0, 0, 0, h1, m1);
    const date2 = new Date(0, 0, 0, h2, m2);
    if (date2 < date1) date2.setDate(date2.getDate() + 1);
    const diff = date2.getTime() - date1.getTime();
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}h`;
};

// --- COMPONENTE DE ASSINATURA ---
const SignaturePad = ({ onSave, onCancel }: { onSave: (dataUrl: string) => void, onCancel: () => void }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }
        const rect = canvas.getBoundingClientRect();
        return { offsetX: clientX - rect.left, offsetY: clientY - rect.top };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        setIsDrawing(true);
        const { offsetX, offsetY } = getCoordinates(e, canvas);
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const { offsetX, offsetY } = getCoordinates(e, canvas);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx?.closePath();
        }
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    return (
        <div className="box">
            <h3 className="title is-6 has-text-centered">Assinatura do Responsável</h3>
            <div style={{ border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f9f9f9', cursor: 'crosshair' }}>
                <canvas
                    ref={canvasRef} width={460} height={200}
                    onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
                    style={{ width: '100%', touchAction: 'none' }}
                />
            </div>
            <div className="buttons is-centered mt-4">
                <button className="button is-light" onClick={clearCanvas}>Limpar</button>
                <button className="button is-danger is-light" onClick={onCancel}>Cancelar</button>
                <button className="button is-success" onClick={() => canvasRef.current && onSave(canvasRef.current.toDataURL())}>
                    <span className="icon"><MdCheck /></span> <span>Confirmar</span>
                </button>
            </div>
        </div>
    );
};

// --- GERAR PDF ---
const printReceipt = (item: AbastecimentoItem) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
        <html>
        <head>
            <title>Recibo #${item.id}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
                .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
                .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                .info-block { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
                .table { width: 100%; border-collapse: collapse; margin: 30px 0; }
                .table th, .table td { border: 1px solid #000; padding: 10px; text-align: left; }
                .signature-box { margin-top: 60px; text-align: center; }
                .signature-img { max-height: 80px; display: block; margin: 0 auto; border-bottom: 1px solid #000; width: 200px; }
                .footer { font-size: 10px; text-align: center; margin-top: 50px; color: #666; border-top: 1px solid #ccc; padding-top: 10px; }
            </style>
        </head>
        <body>
            <div class="header">
                <img src="${logoMwm}" style="max-height: 60px; margin-bottom: 10px;" alt="MWM Logo"/>
                <div class="logo">MWM - UMA EMPRESA TUPY</div>
                <div>MWM-TUPY DO BRASIL LTDA.</div>
                <div>SITIO LINHA ALVES, S/N OURO VERDE DO OESTE/PR - CEP 85933-000</div>
                <div>Fone: 55 11 3882-3291</div>
            </div>
            <div class="info-block"><strong>Cliente:</strong> Primato Cooperativa Agroindustrial</div>
            <div class="info-block">
                <strong>Recibo Nº:</strong> ${item.id}
                <span><strong>Data:</strong> ${item.data.split('-').reverse().join('/')}</span>
            </div>
            <div class="info-block"><strong>Usuário:</strong> ${item.usuario || 'Sistema'}</div>

            <table class="table">
                <thead><tr><th>Veículo</th><th>Tipo</th><th>Placa/TAG</th><th>Produto</th><th>Início</th><th>Término</th><th>Quantidade (m³)</th></tr></thead>
                <tbody><tr><td>${item.tipoVeiculo === 'Empilhadeira' ? 'Empilhadeira' : 'Caminhão'}</td><td>${item.tipoVeiculo}</td><td>${item.placa}</td><td>${item.produto}</td><td>${item.horaInicio}</td><td>${item.horaTermino || '-'}</td><td>${item.volumeAbastecido || '0'}</td></tr></tbody>
            </table>

            <div class="signature-box">
                ${item.assinatura ? `<img src="${item.assinatura}" class="signature-img" />` : '<div style="border-bottom: 1px solid #000; width: 200px; margin: 0 auto; height: 50px;"></div>'}
                <p>Assinatura do Responsável</p>
                <small>relacionamento.clientes@primato.com.br</small>
            </div>
            <div class="footer">Portal Clientes | Rel: 001-V01 | Gerado em: ${new Date().toLocaleString()}</div>
        </body>
        </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.focus(); printWindow.print(); printWindow.close(); }, 500);
};

const Abastecimentos: React.FC = () => {
  const navigate = useNavigate(); // Hook para navegação

  // Estados
  const [activeTab, setActiveTab] = useState('Abastecimento');
  const [abastecimentosList, setAbastecimentosList] = useState<AbastecimentoItem[]>(initialAbastecimentos);
  const [precificacaoList, setPrecificacaoList] = useState<PrecificacaoItem[]>(initialPrecificacaoData);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtros Relatório
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterPlaca, setFilterPlaca] = useState('');
  const [filterProduto, setFilterProduto] = useState('');
  const [filterTipoAbastecimento, setFilterTipoAbastecimento] = useState('');
  const [filterTipoVeiculo, setFilterTipoVeiculo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // Visibilidade Colunas
  const [visibleColumns, setVisibleColumns] = useState({
      id: true, data: true, horaInicio: true, horaTermino: true, duration: true,
      tipoVeiculo: true, placa: true, produto: true, volumeAbastecido: true,
      totalValue: true, usuario: true, status: true, recibo: true
  });

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'finish'>('create');
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  // Forms
  const [formData, setFormData] = useState({
    data: '', horaInicio: '', tipoAbastecimento: '', tipoVeiculo: '', produto: '', placa: '',
    odometro: '', pressaoInicial: '', pressaoFinal: '', volumeAbastecido: '', horaTermino: ''
  });
  const [priceFormData, setPriceFormData] = useState({ preco: '', produto: '', mesAnp: '', mesFatura: '' });

  // --- LÓGICA GRÁFICO ---
  const chartData = useMemo(() => {
    return precificacaoList.map(item => {
        const precoNumber = parseFloat(item.preco.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
        const [dia, mes, ano] = item.data.split('/');
        const dataObj = new Date(Number(ano), Number(mes) - 1, Number(dia));
        const mesAno = !isNaN(dataObj.getTime()) ? dataObj.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }) : 'N/A';
        return { name: `${mesAno} (${item.produto})`, preco: precoNumber, rawDate: dataObj.getTime() };
    }).sort((a, b) => a.rawDate - b.rawDate);
  }, [precificacaoList]);

  const getPriceForProduct = (productName: string) => {
      const priceItem = precificacaoList.find(p => p.produto === productName);
      return priceItem ? parseFloat(priceItem.preco.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) : 0;
  };

  // --- HANDLERS ---
  const handleSavePrice = () => {
      if (!priceFormData.preco || !priceFormData.produto) return toast.warn("Preencha os campos.");
      const newItem: PrecificacaoItem = {
          id: Date.now().toString(),
          preco: `R$ ${priceFormData.preco.replace('.', ',')}`,
          produto: priceFormData.produto,
          mesAnp: priceFormData.mesAnp,
          mesFatura: priceFormData.mesFatura,
          usuario: 'Sistema',
          data: new Date().toLocaleDateString('pt-BR')
      };
      setPrecificacaoList([...precificacaoList, newItem]);
      toast.success("Preço salvo!");
      setIsPriceModalOpen(false);
      setPriceFormData({ preco: '', produto: '', mesAnp: '', mesFatura: '' });
  };

  const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setPriceFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openCreateModal = () => {
    const now = new Date();
    setFormData({
        data: now.toISOString().split('T')[0],
        horaInicio: now.toTimeString().slice(0, 5),
        tipoAbastecimento: '', tipoVeiculo: '', produto: '', placa: '', odometro: '', pressaoInicial: '', pressaoFinal: '', volumeAbastecido: '', horaTermino: ''
    });
    setModalMode('create');
    setIsModalOpen(true);
  };

  const openFinishModal = (item: AbastecimentoItem) => {
    const now = new Date();
    setFormData({ ...item, pressaoFinal: '', volumeAbastecido: '', horaTermino: now.toTimeString().slice(0, 5) } as any);
    setCurrentItemId(item.id);
    setModalMode('finish');
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (modalMode === 'create') {
        if (!formData.placa) return toast.warn("Preencha campos.");
        const newItem: AbastecimentoItem = {
            id: Math.floor(Math.random() * 10000).toString(),
            ...formData,
            transportadora: placasOptions.find(p => p.placa === formData.placa)?.transportadora || 'N/A',
            status: 'Em andamento',
            usuario: 'Sistema'
        };
        setAbastecimentosList([newItem, ...abastecimentosList]);
        toast.success("Iniciado!");
        setIsModalOpen(false);
    } else {
        if (!formData.pressaoFinal || !formData.volumeAbastecido) return toast.warn("Preencha dados finais.");
        setIsModalOpen(false);
        setIsSignatureModalOpen(true);
    }
  };

  const handleSignatureSave = (signatureData: string) => {
      setAbastecimentosList(prev => prev.map(item => {
          if (item.id === currentItemId) {
              return {
                  ...item,
                  odometro: formData.odometro,
                  pressaoFinal: formData.pressaoFinal,
                  volumeAbastecido: formData.volumeAbastecido,
                  horaTermino: formData.horaTermino,
                  status: 'Concluído',
                  assinatura: signatureData
              };
          }
          return item;
      }));
      setIsSignatureModalOpen(false);
      toast.success("Abastecimento finalizado e assinado com sucesso!");
      
      // REDIRECIONA PARA A ABA RELATÓRIOS
      setActiveTab('Relatórios');
  };

  const filteredReportList = useMemo(() => {
      return abastecimentosList.filter(item => {
          if (item.status !== 'Concluído') return false;
          if (filterStartDate && item.data < filterStartDate) return false;
          if (filterEndDate && item.data > filterEndDate) return false;
          if (filterPlaca && !item.placa.toLowerCase().includes(filterPlaca.toLowerCase())) return false;
          if (filterProduto && item.produto !== filterProduto) return false;
          if (filterTipoAbastecimento && item.tipoAbastecimento !== filterTipoAbastecimento) return false;
          if (filterTipoVeiculo && item.tipoVeiculo !== filterTipoVeiculo) return false;
          return true;
      });
  }, [abastecimentosList, filterStartDate, filterEndDate, filterPlaca, filterProduto, filterTipoAbastecimento, filterTipoVeiculo]);

  const sortedReportList = useMemo(() => {
      let sortableItems = [...filteredReportList];
      if (sortConfig !== null) {
          sortableItems.sort((a, b) => {
              let aValue: any = a[sortConfig.key as keyof AbastecimentoItem];
              let bValue: any = b[sortConfig.key as keyof AbastecimentoItem];
              if (sortConfig.key === 'duration') {
                  aValue = calculateDuration(a.horaInicio, a.horaTermino);
                  bValue = calculateDuration(b.horaInicio, b.horaTermino);
              } else if (sortConfig.key === 'totalValue') {
                  aValue = parseFloat(a.volumeAbastecido || '0') * getPriceForProduct(a.produto);
                  bValue = parseFloat(b.volumeAbastecido || '0') * getPriceForProduct(b.produto);
              }
              if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
              if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
              return 0;
          });
      }
      return sortableItems;
  }, [filteredReportList, sortConfig, precificacaoList]);

  const currentReportItems = sortedReportList.slice((currentPage - 1) * ITENS_POR_PAGINA, currentPage * ITENS_POR_PAGINA);
  const totalPages = Math.ceil(sortedReportList.length / ITENS_POR_PAGINA);

  const requestSort = (key: string) => {
      let direction: 'asc' | 'desc' = 'asc';
      if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
      setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
      if (sortConfig?.key === key) return sortConfig.direction === 'asc' ? <MdArrowUpward size={14} className="ml-1"/> : <MdArrowDownward size={14} className="ml-1"/>;
      return null;
  };

  const toggleColumn = (key: keyof typeof visibleColumns) => {
      setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredList = useMemo(() => {
      return abastecimentosList.filter(item => 
        (item.status === 'Em andamento') && 
        (item.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.transportadora.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  }, [abastecimentosList, searchTerm]);

  // --- NOVA FUNÇÃO DE EXPORTAÇÃO ---
  const handleExportReport = () => {
      if (sortedReportList.length === 0) {
          toast.warn("Não há dados filtrados para exportar.");
          return;
      }

      // 1. Cabeçalhos
      const headers = [
          "ID", "Data", "Início", "Término", "Duração", "Veículo", "Tipo", "Produto", "Volume (m³)", "Preço Unit.", "Valor Total", "Usuário", "Status"
      ];

      // 2. Dados
      const csvRows = sortedReportList.map(item => {
          const duration = calculateDuration(item.horaInicio, item.horaTermino);
          const unitPrice = getPriceForProduct(item.produto);
          const totalValue = (parseFloat(item.volumeAbastecido || '0') * unitPrice).toFixed(2).replace('.', ',');
          
          const dataFormatted = item.data.split('-').reverse().join('/');
          const volumeFormatted = (item.volumeAbastecido || '0').replace('.', ',');
          const priceFormatted = unitPrice.toFixed(2).replace('.', ',');

          // Formata CSV com ponto e vírgula
          return [
              item.id,
              dataFormatted,
              item.horaInicio,
              item.horaTermino || '-',
              duration,
              item.placa,
              item.tipoVeiculo || '-',
              item.produto,
              volumeFormatted,
              `R$ ${priceFormatted}`,
              `R$ ${totalValue}`,
              item.usuario || '-',
              item.status
          ].join(';');
      });

      // 3. Monta string CSV com BOM para UTF-8
      const csvString = "\uFEFF" + [headers.join(';'), ...csvRows].join('\n');

      // 4. Download
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio_abastecimentos_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const customSidebarBlue = '#4f46e5';

  return (
    <div className="screen-container" style={{ backgroundColor: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* --- HEADER PADRONIZADO --- */}
      <div className="box is-radiusless mb-0" style={{ borderBottom: '1px solid #dbdbdb', padding: '0.75rem 1rem', flexShrink: 0 }}>
        <div className="level is-mobile">
          <div className="level-left">
            <div className="buttons">
              <button className="button is-white border mr-2" onClick={() => navigate(-1)}>
                <span className="icon"><MdArrowBack size={24} /></span>
              </button>
              <span className="title is-4 mb-0" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Abastecimento</span>
            </div>
          </div>
        </div>
      </div>

      <section className="section py-0 pt-3" style={{ flexShrink: 0 }}>
        <div className="tabs is-toggle is-medium is-centered is-fullwidth mb-0">
          <ul>
            <li className={activeTab === 'Abastecimento' ? 'is-active' : ''}><a onClick={() => setActiveTab('Abastecimento')} className={activeTab === 'Abastecimento' ? 'has-background-link has-text-white' : ''} style={{ borderColor: activeTab === 'Abastecimento' ? '#3273dc' : '' }}><span>Abastecimento</span></a></li>
            <li className={activeTab === 'Relatórios' ? 'is-active' : ''}><a onClick={() => setActiveTab('Relatórios')} className={activeTab === 'Relatórios' ? 'has-background-link has-text-white' : ''} style={{ borderColor: activeTab === 'Relatórios' ? '#3273dc' : '' }}><span>Relatórios</span></a></li>
            <li className={activeTab === 'Precificação' ? 'is-active' : ''}><a onClick={() => setActiveTab('Precificação')} className={activeTab === 'Precificação' ? 'has-background-link has-text-white' : ''} style={{ borderColor: activeTab === 'Precificação' ? '#3273dc' : '' }}><span>Precificação</span></a></li>
          </ul>
        </div>
      </section>

      <div className="screen-content p-5" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', backgroundColor: '#f9fafb' }}>
        {/* === ABA: PRECIFICAÇÃO === */}
        {activeTab === 'Precificação' && (
            <div className="container is-fluid px-0">
                <div className="box mb-4" style={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: 'none' }}>
                    <div className="is-flex is-justify-content-space-between is-align-items-center">
                        <div className="control has-icons-right"><input className="input" type="text" placeholder="Buscar..." style={{ width: '300px', borderRadius: '4px' }} /><span className="icon is-right"><MdSearch /></span></div>
                        <div className="buttons"><button className="button is-link" style={{ borderRadius: '4px' }} onClick={() => setIsPriceModalOpen(true)}><span className="icon"><MdAdd /></span> <span>Adicionar</span></button></div>
                    </div>
                </div>
                <div className="columns is-variable is-4">
                    <div className="column is-5">
                        <div className="box" style={{ height: '100%', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: 'none', minHeight: '400px' }}>
                            <h3 className="title is-6 mb-4 has-text-grey-dark">Evolução de Preços</h3>
                            <div style={{ width: '100%', height: '350px' }}><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} dy={10} interval={0} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} domain={[0, 'auto']} /><Tooltip cursor={{ fill: '#f9fafb' }} formatter={(value: number, _name: string, props: any) => [`R$ ${value.toFixed(2)}`, props.payload.produto]} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} /><Bar dataKey="preco" name="Preço" fill={customSidebarBlue} radius={[4, 4, 0, 0]} barSize={40}><LabelList dataKey="preco" position="top" formatter={(value: number) => `R$ ${value.toFixed(2)}`} style={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }} /></Bar></BarChart></ResponsiveContainer></div>
                        </div>
                    </div>
                    <div className="column is-7"><div className="box p-0" style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: 'none' }}><table className="table is-fullwidth is-hoverable is-size-7"><thead><tr style={{ backgroundColor: '#f3f4f6', color: '#374151' }}><th className="py-3 pl-4">Preço</th><th className="py-3">Produto</th><th className="py-3">Mês ANP</th><th className="py-3">Mês Fatura</th><th className="py-3">Usuário</th><th className="py-3">Data</th></tr></thead><tbody>{precificacaoList.map(item => (<tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}><td className="is-vcentered py-3 pl-4 has-text-weight-bold has-text-success">{item.preco}</td><td className="is-vcentered py-3">{item.produto}</td><td className="is-vcentered py-3">{item.mesAnp}</td><td className="is-vcentered py-3">{item.mesFatura}</td><td className="is-vcentered py-3">{item.usuario}</td><td className="is-vcentered py-3">{item.data}</td></tr>))}</tbody></table></div></div>
                </div>
            </div>
        )}

        {/* === ABA: ABASTECIMENTO (OPERACIONAL) === */}
        {activeTab === 'Abastecimento' && (
            <>
                <div className="box mb-4" style={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: 'none' }}>
                    <div className="is-flex is-justify-content-space-between is-align-items-center">
                        <div className="control has-icons-right"><input className="input" type="text" placeholder="Buscar..." style={{ width: '300px', borderRadius: '4px' }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /><span className="icon is-right"><MdSearch /></span></div>
                        <div className="buttons"><button className="button is-white border" style={{ borderRadius: '4px' }}><span className="icon"><MdDelete /></span></button><button className="button is-white border" style={{ borderRadius: '4px' }}><span className="icon"><MdFilterList /></span> <span>Filtrar</span></button><button className="button is-link" style={{ borderRadius: '4px' }} onClick={openCreateModal}><span className="icon"><MdAdd /></span> <span>Adicionar</span></button></div>
                    </div>
                </div>
                {abastecimentosList.filter(i => i.status === 'Em andamento').length === 0 ? (
                    <div className="has-text-centered p-6 mt-4" style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px dashed #dbdbdb' }}><MdOutlineLocalGasStation size={48} /><p>Sem abastecimentos em andamento</p></div>
                ) : (
                    <div className="box p-0" style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: 'none' }}>
                        <table className="table is-fullwidth is-hoverable is-size-7">
                            <thead><tr style={{ backgroundColor: '#f3f4f6', color: '#374151' }}><th className="py-3">Data</th><th className="py-3">Início</th><th className="py-3">Tipo</th><th className="py-3">Produto</th><th className="py-3">Placa</th><th className="py-3">Status</th><th className="py-3">Ação</th></tr></thead>
                            <tbody>{filteredList.map(item => (<tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}><td className="is-vcentered py-3">{item.data}</td><td className="is-vcentered py-3">{item.horaInicio}</td><td className="is-vcentered py-3">{item.tipoAbastecimento}</td><td className="is-vcentered py-3">{item.produto}</td><td className="is-vcentered py-3 font-bold">{item.placa}</td><td className="is-vcentered py-3"><span className="tag is-light is-warning">{item.status}</span></td><td className="is-vcentered py-3"><button className="button is-small is-white border-0 has-text-success" onClick={() => openFinishModal(item)}><MdCheckCircle /> Finalizar</button></td></tr>))}</tbody>
                        </table>
                    </div>
                )}
            </>
        )}

        {/* === ABA: RELATÓRIOS (ATUALIZADA) === */}
        {activeTab === 'Relatórios' && (
            <div className="container is-fluid px-0">
                <div className="box mb-4" style={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: 'none' }}>
                    <div className="columns is-vcentered is-multiline">
                        <div className="column is-narrow">
                            <button className="button is-white border mr-2" onClick={() => setShowFilters(!showFilters)}><span className="icon"><MdFilterList /></span> <span>{showFilters ? 'Ocultar Filtros' : 'Filtros'}</span></button>
                            <div className={`dropdown ${showColumnSelector ? 'is-active' : ''}`}>
                                <div className="dropdown-trigger">
                                    <button className="button is-white border" onClick={() => setShowColumnSelector(!showColumnSelector)}>
                                        <span className="icon"><MdViewColumn /></span> <span>Colunas</span>
                                    </button>
                                </div>
                                <div className="dropdown-menu" role="menu">
                                    <div className="dropdown-content" style={{ padding: '10px' }}>
                                        {Object.keys(visibleColumns).map((key) => (
                                            <div key={key} className="field">
                                                <label className="checkbox is-size-7">
                                                    <input type="checkbox" checked={visibleColumns[key as keyof typeof visibleColumns]} onChange={() => toggleColumn(key as keyof typeof visibleColumns)} className="mr-2" />
                                                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {showFilters && (
                            <div className="column is-12">
                                <div className="columns">
                                    <div className="column"><div className="field"><label className="label is-small">De:</label><div className="control has-icons-left"><input className="input is-small" type="date" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} /><span className="icon is-small is-left"><MdTimer /></span></div></div></div>
                                    <div className="column"><div className="field"><label className="label is-small">Até:</label><div className="control has-icons-left"><input className="input is-small" type="date" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} /><span className="icon is-small is-left"><MdTimer /></span></div></div></div>
                                    <div className="column"><div className="field"><label className="label is-small">Placa:</label><input className="input is-small" type="text" placeholder="Ex: ABC-1234" value={filterPlaca} onChange={e => setFilterPlaca(e.target.value)} /></div></div>
                                    <div className="column"><div className="field"><label className="label is-small">Produto:</label><div className="select is-small is-fullwidth"><select value={filterProduto} onChange={e => setFilterProduto(e.target.value)}><option value="">Todos</option><option value="Biometano">Biometano</option><option value="Diesel">Diesel</option><option value="CO²">CO²</option></select></div></div></div>
                                    <div className="column"><div className="field"><label className="label is-small">Abastecimento:</label><div className="select is-small is-fullwidth"><select value={filterTipoAbastecimento} onChange={e => setFilterTipoAbastecimento(e.target.value)}><option value="">Todos</option><option value="Bomba de abastecimento">Bomba</option><option value="Cilindro de abastecimento">Cilindro</option></select></div></div></div>
                                    <div className="column"><div className="field"><label className="label is-small">Veículo:</label><div className="select is-small is-fullwidth"><select value={filterTipoVeiculo} onChange={e => setFilterTipoVeiculo(e.target.value)}><option value="">Todos</option>{vehicleTypes.map(vt => <option key={vt} value={vt}>{vt}</option>)}</select></div></div></div>
                                </div>
                            </div>
                        )}
                        <div className="column has-text-right">
                            {/* BOTÃO EXPORTAR COM EVENTO ATUALIZADO */}
                            <button className="button is-white border" onClick={handleExportReport}>
                                <span className="icon"><MdFileDownload /></span> 
                                <span>Exportar</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="box p-0" style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: 'none' }}>
                    <table className="table is-fullwidth is-hoverable is-size-7">
                        <thead>
                            <tr style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>
                                {visibleColumns.id && <th className="py-3 pl-4 is-clickable" onClick={() => requestSort('id')}>ID {getSortIcon('id')}</th>}
                                {visibleColumns.data && <th className="py-3 is-clickable" onClick={() => requestSort('data')}>Data {getSortIcon('data')}</th>}
                                {visibleColumns.horaInicio && <th className="py-3 is-clickable" onClick={() => requestSort('horaInicio')}>Início {getSortIcon('horaInicio')}</th>}
                                {visibleColumns.horaTermino && <th className="py-3 is-clickable" onClick={() => requestSort('horaTermino')}>Término {getSortIcon('horaTermino')}</th>}
                                {visibleColumns.duration && <th className="py-3 is-clickable" onClick={() => requestSort('duration')}>Duração {getSortIcon('duration')}</th>}
                                {visibleColumns.tipoVeiculo && <th className="py-3 is-clickable" onClick={() => requestSort('tipoVeiculo')}>Veículo {getSortIcon('tipoVeiculo')}</th>}
                                {visibleColumns.placa && <th className="py-3 is-clickable" onClick={() => requestSort('placa')}>Placa {getSortIcon('placa')}</th>}
                                {visibleColumns.produto && <th className="py-3 is-clickable" onClick={() => requestSort('produto')}>Produto {getSortIcon('produto')}</th>}
                                {visibleColumns.volumeAbastecido && <th className="py-3 is-clickable" onClick={() => requestSort('volumeAbastecido')}>Volume {getSortIcon('volumeAbastecido')}</th>}
                                {visibleColumns.totalValue && <th className="py-3 is-clickable" onClick={() => requestSort('totalValue')}>Total {getSortIcon('totalValue')}</th>}
                                {visibleColumns.usuario && <th className="py-3 is-clickable" onClick={() => requestSort('usuario')}>Usuário {getSortIcon('usuario')}</th>}
                                {visibleColumns.status && <th className="py-3">Status</th>}
                                {visibleColumns.recibo && <th className="py-3 has-text-centered">Recibo</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {currentReportItems.map(item => {
                                const duration = calculateDuration(item.horaInicio, item.horaTermino);
                                const unitPrice = getPriceForProduct(item.produto);
                                const totalValue = (parseFloat(item.volumeAbastecido || '0') * unitPrice).toFixed(2);

                                return (
                                    <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        {visibleColumns.id && <td className="is-vcentered py-3 pl-4"><strong>#{item.id}</strong></td>}
                                        {visibleColumns.data && <td className="is-vcentered py-3">{item.data.split('-').reverse().join('/')}</td>}
                                        {visibleColumns.horaInicio && <td className="is-vcentered py-3">{item.horaInicio}</td>}
                                        {visibleColumns.horaTermino && <td className="is-vcentered py-3">{item.horaTermino || '-'}</td>}
                                        {visibleColumns.duration && <td className="is-vcentered py-3 has-text-info">{duration}</td>}
                                        {visibleColumns.tipoVeiculo && <td className="is-vcentered py-3">{item.tipoVeiculo || '-'}</td>}
                                        {visibleColumns.placa && <td className="is-vcentered py-3 has-text-weight-bold">{item.placa}</td>}
                                        {visibleColumns.produto && <td className="is-vcentered py-3">{item.produto}</td>}
                                        {visibleColumns.volumeAbastecido && <td className="is-vcentered py-3">{item.volumeAbastecido} m³</td>}
                                        {visibleColumns.totalValue && <td className="is-vcentered py-3 has-text-success">R$ {totalValue}</td>}
                                        {visibleColumns.usuario && <td className="is-vcentered py-3">{item.usuario || '-'}</td>}
                                        {visibleColumns.status && <td className="is-vcentered py-3"><span className="tag is-success is-light">Concluído</span></td>}
                                        {visibleColumns.recibo && (
                                            <td className="is-vcentered py-3 has-text-centered">
                                                <button className="button is-small is-ghost has-text-danger" title="Ver Recibo" onClick={() => printReceipt(item)}>
                                                    <span className="icon is-medium"><MdPictureAsPdf size={20} /></span>
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                            {currentReportItems.length === 0 && (
                                <tr><td colSpan={Object.keys(visibleColumns).filter(k => (visibleColumns as any)[k]).length} className="has-text-centered py-5 has-text-grey">Nenhum registro encontrado.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <nav className="pagination is-centered is-small mt-4">
                    <button className="pagination-previous" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><MdChevronLeft /> Anterior</button>
                    <button className="pagination-next" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}>Próximo <MdChevronRight /></button>
                    <ul className="pagination-list"><li><span className="pagination-link is-current">{currentPage} de {totalPages || 1}</span></li></ul>
                </nav>
            </div>
        )}
      </div>

      {/* --- MODAIS DE DADOS E ASSINATURA --- */}
      {isModalOpen && (
        <div className="modal is-active">
            <div className="modal-background" onClick={() => setIsModalOpen(false)}></div>
            <div className="modal-card" style={{ width: '550px', maxHeight: '95vh', borderRadius: '8px' }}>
                <header className="modal-card-head has-background-white pt-5 px-5 pb-0" style={{ borderBottom: 'none' }}><p className="modal-card-title is-size-5 has-text-weight-normal text-gray-700">{modalMode === 'create' ? 'Inserir abastecimento' : 'Finalizar abastecimento'}</p><button className="delete" aria-label="close" onClick={() => setIsModalOpen(false)}></button></header>
                <section className="modal-card-body px-5 py-4">
                    <div className="field"><label className="label is-size-7 has-text-weight-medium">Data</label><div className="control"><input className="input" type="date" name="data" value={formData.data} onChange={handleInputChange} disabled={modalMode === 'finish'} /></div></div>
                    <div className="field"><label className="label is-size-7 has-text-weight-medium">Horário de inicio</label><div className="control has-icons-right"><input className="input" type="time" name="horaInicio" value={formData.horaInicio} onChange={handleInputChange} disabled={modalMode === 'finish'} /><span className="icon is-small is-right"><MdTimer /></span></div></div>
                    <div className="field"><label className="label is-size-7 has-text-weight-medium">Tipo de abastecimento</label><div className="control"><div className="select is-fullwidth"><select name="tipoAbastecimento" value={formData.tipoAbastecimento} onChange={handleInputChange} disabled={modalMode === 'finish'}><option value="">Selecionar</option><option value="Bomba de abastecimento">Bomba de abastecimento</option><option value="Cilindro de abastecimento">Cilindro de abastecimento</option></select></div></div></div>
                    <div className="field"><label className="label is-size-7 has-text-weight-medium">Tipo de Veículo</label><div className="control"><div className="select is-fullwidth"><select name="tipoVeiculo" value={formData.tipoVeiculo} onChange={handleInputChange} disabled={modalMode === 'finish'}><option value="">Selecionar</option>{vehicleTypes.map(v => <option key={v} value={v}>{v}</option>)}</select></div></div></div>
                    <div className="field"><label className="label is-size-7 has-text-weight-medium">Produto</label><div className="control"><div className="select is-fullwidth"><select name="produto" value={formData.produto} onChange={handleInputChange} disabled={modalMode === 'finish'}><option value="">Selecionar</option><option value="Biometano">Biometano</option><option value="CO²">CO²</option></select></div></div></div>
                    <div className="field"><label className="label is-size-7 has-text-weight-medium">Placa do veículo</label><div className="control"><div className="select is-fullwidth"><select name="placa" value={formData.placa} onChange={handleInputChange} disabled={modalMode === 'finish'}><option value="">Selecionar</option>{placasOptions.map(p => <option key={p.placa} value={p.placa}>{p.placa}</option>)}</select></div></div></div>
                    <div className="field"><label className="label is-size-7 has-text-weight-medium">Odomêtro:</label><div className="control"><input className="input" type="number" name="odometro" placeholder="000000000" value={formData.odometro} onChange={handleInputChange} /></div></div>
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
                        {modalMode === 'create' ? 'Iniciar abastecimento' : 'Avançar para Assinatura'}
                    </button>
                </footer>
            </div>
        </div>
      )}

      {isSignatureModalOpen && (
          <div className="modal is-active">
              <div className="modal-background" onClick={() => setIsSignatureModalOpen(false)}></div>
              <div className="modal-content" style={{ maxWidth: '500px' }}><SignaturePad onSave={handleSignatureSave} onCancel={() => setIsSignatureModalOpen(false)} /></div>
          </div>
      )}

      {isPriceModalOpen && (
          <div className="modal is-active">
              <div className="modal-background" onClick={() => setIsPriceModalOpen(false)}></div>
              <div className="modal-card" style={{ width: '500px', borderRadius: '8px' }}>
                  <header className="modal-card-head has-background-white pt-5 px-5 pb-0" style={{ borderBottom: 'none' }}><p className="modal-card-title is-size-5 has-text-weight-normal text-gray-700">Inserir preço</p><button className="delete" aria-label="close" onClick={() => setIsPriceModalOpen(false)}></button></header>
                  <section className="modal-card-body px-5 py-4">
                      <div className="field"><label className="label is-size-7 has-text-weight-medium">Preço</label><div className="control"><input className="input" type="number" step="0.01" name="preco" placeholder="0.00" value={priceFormData.preco} onChange={handlePriceInputChange} /></div></div>
                      <div className="field"><label className="label is-size-7 has-text-weight-medium">Produto</label><div className="control"><div className="select is-fullwidth"><select name="produto" value={priceFormData.produto} onChange={handlePriceInputChange}><option value="">Selecionar</option><option value="Biometano">Biometano</option><option value="CO²">CO²</option></select></div></div></div>
                      <div className="field"><label className="label is-size-7 has-text-weight-medium">Mês ANP</label><div className="control"><div className="select is-fullwidth"><select name="mesAnp" value={priceFormData.mesAnp} onChange={handlePriceInputChange}><option value="">Selecionar</option>{months.map(m => <option key={m} value={m}>{m}</option>)}</select></div></div></div>
                      <div className="field"><label className="label is-size-7 has-text-weight-medium">Mês fatura</label><div className="control"><div className="select is-fullwidth"><select name="mesFatura" value={priceFormData.mesFatura} onChange={handlePriceInputChange}><option value="">Selecionar</option>{months.map(m => <option key={m} value={m}>{m}</option>)}</select></div></div></div>
                  </section>
                  <footer className="modal-card-foot has-background-white is-justify-content-flex-end px-5 pb-5 pt-2" style={{ borderTop: 'none' }}>
                      <button className="button" style={{ borderRadius: '4px' }} onClick={() => setIsPriceModalOpen(false)}>Cancelar</button>
                      <button className="button is-link" style={{ borderRadius: '4px' }} onClick={handleSavePrice}><span className="icon is-small mr-1"><MdSave /></span><span>Salvar</span></button>
                  </footer>
              </div>
          </div>
      )}

    </div>
  );
};

export default Abastecimentos;