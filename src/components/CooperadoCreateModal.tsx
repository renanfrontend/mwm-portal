import React, { useState, useEffect } from 'react';
import type { CooperadoItem } from '../services/api';
import useTheme from '../hooks/useTheme';
import { MdMap, MdSave } from 'react-icons/md';

interface Props {
  isActive: boolean;
  onClose: () => void;
  onSave: (item: CooperadoItem) => void;
}

// --- COORDENADAS FIXAS DA BIOPLANTA TOLEDO ---
// IMPORTANTE: Substitua estes valores pelas coordenadas exatas da portaria da Bioplanta
const BIOPLANTA_COORDS = {
  lat: -24.725626, // Exemplo: Latitude aproximada de Toledo-PR
  lon: -53.741378  // Exemplo: Longitude aproximada de Toledo-PR
};

// --- FUNÇÃO PARA CALCULAR DISTÂNCIA (Fórmula de Haversine) ---
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distância em km
  return distance.toFixed(2); // Retorna com 2 casas decimais
};

const CooperadoCreateModal: React.FC<Props> = ({ isActive, onClose, onSave }) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#a0aec0' : '#363636';

  // --- ESTADOS DO FORMULÁRIO ---
  
  // 1. Dados Principais
  const [matricula, setMatricula] = useState('');
  const [nomeProdutor, setNomeProdutor] = useState('');
  const [filiada, setFiliada] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [fase, setFase] = useState('');
  const [cabecas, setCabecas] = useState('');
  const [certificado, setCertificado] = useState('');
  const [doamDejetos, setDoamDejetos] = useState('');

  // 2. Informações de Contato
  const [responsavel, setResponsavel] = useState('');
  const [tecnico, setTecnico] = useState('');

  // 3. Informações da Propriedade
  const [numPropriedade, setNumPropriedade] = useState('');
  const [numEstabelecimento, setNumEstabelecimento] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [distancia, setDistancia] = useState('');

  // --- EFEITO PARA CÁLCULO AUTOMÁTICO DE DISTÂNCIA ---
  useEffect(() => {
    // Verifica se latitude e longitude foram preenchidas e são números válidos
    const latUser = parseFloat(latitude.replace(',', '.'));
    const lonUser = parseFloat(longitude.replace(',', '.'));

    if (!isNaN(latUser) && !isNaN(lonUser)) {
      const dist = calculateDistance(latUser, lonUser, BIOPLANTA_COORDS.lat, BIOPLANTA_COORDS.lon);
      setDistancia(dist);
    } else {
      setDistancia(''); // Limpa se os dados forem inválidos
    }
  }, [latitude, longitude]);

  const handleSave = () => {
    if (!matricula || !nomeProdutor) {
      alert("Preencha os campos obrigatórios (Matrícula e Nome).");
      return;
    }

    // Converter distancia para decimal (caso exista)
    let distanciaKm: number | undefined = undefined;
    if (distancia && !isNaN(Number(distancia))) {
      distanciaKm = parseFloat(distancia.replace(',', '.'));
    }

    // Montar payload para API (CooperadoAPIInput)
    const payload: any = {
      matricula: Number(matricula),
      nomeCooperado: nomeProdutor,
      cpfCnpj,
      fase,
      cabecas: Number(cabecas) || 0,
      certificado,
      doamDejetos,
      responsavel,
      tecnico,
      numPropriedade,
      numEstabelecimento,
      municipio,
      latitude: latitude ? parseFloat(latitude.replace(',', '.')) : undefined,
      longitude: longitude ? parseFloat(longitude.replace(',', '.')) : undefined,
      distanciaKm,
      // Adicione outros campos obrigatórios conforme necessário
    };

    // Chamar onSave passando o payload (ajuste conforme integração real)
    onSave(payload);
    handleClose();
  };

  const handleClose = () => {
    setMatricula(''); setNomeProdutor(''); setFiliada(''); setCpfCnpj('');
    setFase(''); setCabecas(''); setCertificado(''); setDoamDejetos('');
    setResponsavel(''); setTecnico('');
    setNumPropriedade(''); setNumEstabelecimento(''); setMunicipio('');
    setLatitude(''); setLongitude(''); setDistancia('');
    onClose();
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={handleClose}></div>
      <div className="modal-card" style={{ maxWidth: '800px', width: '100%' }}>
        
        <header className="modal-card-head" style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: theme === 'dark' ? '#1f2937' : '#fff' }}>
          <p className="modal-card-title has-text-weight-bold" style={{ color: textColor }}>Adicionar Cooperado</p>
          <button className="delete" aria-label="close" onClick={handleClose}></button>
        </header>

        <section className="modal-card-body" style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff' }}>
          
          {/* SEÇÃO 1: DADOS GERAIS */}
          <div className="columns is-multiline">
            <div className="column is-6">
              <div className="field">
                <label className="label is-size-7" style={{ color: textColor }}>Matrícula</label>
                <div className="control">
                  <input className="input is-small" type="number" placeholder="000000" value={matricula} onChange={e => setMatricula(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="column is-6">
              <div className="field">
                <label className="label is-size-7" style={{ color: textColor }}>Nome do produtor</label>
                <div className="control">
                  <input className="input is-small" type="text" placeholder="Nome completo" value={nomeProdutor} onChange={e => setNomeProdutor(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="column is-6">
              <div className="field">
                <label className="label is-size-7" style={{ color: textColor }}>Filiada</label>
                <div className="control">
                  <div className="select is-small is-fullwidth">
                    <select value={filiada} onChange={e => setFiliada(e.target.value)}>
                      <option value="">Selecionar</option>
                      <option value="Primato">Primato</option>
                      <option value="MWM">MWM</option>
                      <option value="Tupy">Tupy</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-6">
              <div className="field">
                <label className="label is-size-7" style={{ color: textColor }}>CPF/CNPJ</label>
                <div className="control">
                  <input className="input is-small" type="text" placeholder="000.000.000-00" value={cpfCnpj} onChange={e => setCpfCnpj(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="column is-6">
              <div className="field">
                <label className="label is-size-7" style={{ color: textColor }}>Fase do dejetos</label>
                <div className="control">
                  <div className="select is-small is-fullwidth">
                    <select value={fase} onChange={e => setFase(e.target.value)}>
                      <option value="">Selecionar</option>
                      <option value="Term. Frimesa">Term. Frimesa</option>
                      <option value="GRSC">GRSC</option>
                      <option value="Crechário">Crechário</option>
                      <option value="UPD">UPD</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-6">
              <div className="field">
                <label className="label is-size-7" style={{ color: textColor }}>Cabeças alojadas</label>
                <div className="control">
                  <input className="input is-small" type="number" placeholder="0" value={cabecas} onChange={e => setCabecas(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="column is-6">
              <div className="field">
                <label className="label is-size-7" style={{ color: textColor }}>Certificado</label>
                <div className="control">
                  <div className="select is-small is-fullwidth">
                    <select value={certificado} onChange={e => setCertificado(e.target.value)}>
                      <option value="">Selecionar</option>
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-6">
              <div className="field">
                <label className="label is-size-7" style={{ color: textColor }}>Doam dejetos</label>
                <div className="control">
                  <div className="select is-small is-fullwidth">
                    <select value={doamDejetos} onChange={e => setDoamDejetos(e.target.value)}>
                      <option value="">Selecionar</option>
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-3" style={{ backgroundColor: 'var(--border-color)', height: '1px' }} />

          {/* SEÇÃO 2: INFORMAÇÕES DE CONTATO */}
          <h4 className="title is-6 mb-3" style={{ color: textColor }}>Informações de contato</h4>
          <div className="columns is-multiline">
            <div className="column is-6">
              <div className="field">
                <label className="label is-size-7" style={{ color: textColor }}>Responsável pela propriedade</label>
                <div className="control">
                  <input className="input is-small" type="text" placeholder="Nome do responsável" value={responsavel} onChange={e => setResponsavel(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="column is-6">
              <div className="field">
                <label className="label is-size-7" style={{ color: textColor }}>Técnico responsável</label>
                <div className="control">
                  <input className="input is-small" type="text" placeholder="Nome do técnico" value={tecnico} onChange={e => setTecnico(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <hr className="my-3" style={{ backgroundColor: 'var(--border-color)', height: '1px' }} />

          {/* SEÇÃO 3: INFORMAÇÕES DA PROPRIEDADE */}
          <h4 className="title is-6 mb-3" style={{ color: textColor }}>Informações da propriedade</h4>
          <div className="columns is-multiline">
            <div className="column is-6">
              <div className="field">
                <label className="label is-size-7" style={{ color: textColor }}>Nº da propriedade</label>
                <div className="control">
                  <input className="input is-small" type="text" value={numPropriedade} onChange={e => setNumPropriedade(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="column is-6">
              <div className="field">
                <label className="label is-size-7" style={{ color: textColor }}>Nº de estabelecimento</label>
                <div className="control">
                  <input className="input is-small" type="text" value={numEstabelecimento} onChange={e => setNumEstabelecimento(e.target.value)} />
                </div>
              </div>
            </div>
            
            <div className="column is-12">
              <div className="field">
                <label className="label is-size-7" style={{ color: textColor }}>Município</label>
                <div className="control">
                  <input className="input is-small" type="text" placeholder="Cidade - UF" value={municipio} onChange={e => setMunicipio(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="column is-4">
              <div className="field">
                <label className="label is-size-7" style={{ color: textColor }}>Latitude</label>
                <div className="control">
                  <input className="input is-small" type="text" placeholder="-24.0000" value={latitude} onChange={e => setLatitude(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="column is-4">
              <div className="field">
                <label className="label is-size-7" style={{ color: textColor }}>Longitude</label>
                <div className="control">
                  <input className="input is-small" type="text" placeholder="-53.0000" value={longitude} onChange={e => setLongitude(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="column is-4">
              <div className="field">
                <label className="label is-size-7" style={{ color: textColor }}>Distância</label>
                <div className="control has-icons-right">
                  <input 
                    className="input is-small has-background-light" 
                    type="text" 
                    placeholder="-- Km" 
                    value={distancia ? `${distancia} Km` : ''} 
                    readOnly 
                  />
                </div>
                <p className="help is-info" style={{fontSize: '0.65rem'}}>* Até Bioplanta Toledo</p>
              </div>
            </div>

            <div className="column is-12">
               <label className="label is-size-7" style={{ color: textColor }}>Localização</label>
               {latitude && longitude ? (
                   <a 
                     href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="button is-small is-link is-light is-fullwidth"
                     style={{ justifyContent: 'center' }}
                   >
                     <span className="icon"><MdMap /></span><span>Ver no mapa</span>
                   </a>
               ) : (
                   <button className="button is-small is-light is-fullwidth" disabled>
                     <span className="icon"><MdMap /></span><span>Ver no mapa</span>
                   </button>
               )}
            </div>
          </div>

        </section>

        <footer className="modal-card-foot is-justify-content-flex-end" style={{ borderTop: '1px solid var(--border-color)', backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', gap: '10px' }}>
          <button className="button" onClick={handleClose}>Cancelar</button>
          <button className="button is-success" onClick={handleSave}>
            <span className="icon is-small"><MdSave /></span>
            <span>Salvar</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default CooperadoCreateModal;