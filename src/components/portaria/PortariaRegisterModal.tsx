import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { podeCadastrarPortaria, podeEditarPortaria } from '../../domain/permissaoPortaria';
import { entregaDejetosService } from '../../features/portaria/services/activities/entrega-dejetos/entregaDejetosService';



interface Props {
    isActive: boolean;
    onClose: () => void;
    onSave: (newItem: any) => void;
}



const PortariaRegisterModal: React.FC<Props> = ({ isActive, onClose, onSave }) => {
    const { user } = useAuth();
    const podeEditarOuCadastrar = podeCadastrarPortaria(user) || podeEditarPortaria(user);
  // --- ESTADOS ---
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [hora, setHora] = useState(new Date().toTimeString().slice(0, 5));
  const [atividade, setAtividade] = useState('');


    // Logística / Transporte
    const [cooperado, setCooperado] = useState('');
    const [transportadora, setTransportadora] = useState('');
    const [tipoVeiculo, setTipoVeiculo] = useState('');
    const [placa, setPlaca] = useState('');

         // Selects dinâmicos
         const [transportadoraOptions, setTransportadoraOptions] = useState<{ id: string; nomeFantasia: string }[]>([]);
         const [veiculoOptions, setVeiculoOptions] = useState<{ id: string; label: string; value: string }[]>([]);
         const [placaOptions, setPlacaOptions] = useState<{ id: string; placa: string }[]>([]);

        // Carregar selects quando atividade for 'Entrega de dejetos'
        useEffect(() => {
            console.log('🔄 useEffect acionado - Atividade atual:', atividade);
            if (atividade === 'Entrega de dejetos') {
                console.group('🚚 ENTREGA DE DEJETOS - CARREGANDO DADOS');
                console.log('⏱️ Timestamp:', new Date().toLocaleTimeString());
                
                // Transportadoras
                console.log('📡 Chamando API: getTransportadoras()...');
                entregaDejetosService.getTransportadoras().then(data => {
                    console.log('📡 Resposta recebida da API (Transportadoras):', data);
                    setTransportadoraOptions(data);
                    console.log('%c✅ TRANSPORTADORAS', 'color: #10b981; font-weight: bold; font-size: 12px;');
                    console.table(data);
                    console.log('Total:', data.length);
                }).catch(e => {
                    console.error('%c❌ ERRO - TRANSPORTADORAS', 'color: #ef4444; font-weight: bold; font-size: 12px;');
                    console.error('Status:', e.response?.status);
                    console.error('Mensagem:', e.response?.data || e.message);
                });
                
                // Tipos de Veículo
                entregaDejetosService.getTiposVeiculo().then(data => {
                    setVeiculoOptions(data);
                    console.log('%c✅ TIPOS DE VEÍCULO', 'color: #3b82f6; font-weight: bold; font-size: 12px;');
                    console.table(data);
                    console.log('Total:', data.length);
                }).catch(e => {
                    console.error('%c❌ ERRO - TIPOS DE VEÍCULO', 'color: #ef4444; font-weight: bold; font-size: 12px;');
                    console.error('Status:', e.response?.status);
                    console.error('Mensagem:', e.response?.data || e.message);
                });
                
                // Limpa placas
                setPlacaOptions([]);
                setPlaca('');
                console.groupEnd();
            }
        }, [atividade]);

        // Carregar placas ao selecionar transportadora (só se for entrega de dejetos)
        useEffect(() => {
            if (atividade === 'Entrega de dejetos' && transportadora) {
                console.group('🚛 PLACAS - CARREGANDO');
                console.log('%c📌 Transportadora Selecionada:', 'color: #f59e0b; font-weight: bold;', transportadora);
                console.log('⏱️ Timestamp:', new Date().toLocaleTimeString());
                
                entregaDejetosService.getPlacasByTransportadora(transportadora).then(data => {
                    setPlacaOptions(data);
                    console.log('%c✅ PLACAS', 'color: #10b981; font-weight: bold; font-size: 12px;');
                    console.table(data);
                    console.log('Total:', data.length);
                    console.groupEnd();
                }).catch(e => {
                    console.error('%c❌ ERRO - PLACAS', 'color: #ef4444; font-weight: bold; font-size: 12px;');
                    console.error('Transportadora ID:', transportadora);
                    console.error('Status:', e.response?.status);
                    console.error('Mensagem:', e.response?.data || e.message);
                    console.groupEnd();
                });
            } else if (atividade === 'Entrega de dejetos') {
                console.log('%c🔄 PLACAS LIMPAS', 'color: #8b5cf6; font-weight: bold; font-size: 12px;');
                setPlacaOptions([]);
            }
        }, [atividade, transportadora]);
  
  // Pessoas
  const [motorista, setMotorista] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [visitante, setVisitante] = useState('');
  
  // Operação
  const [fornecedor, setFornecedor] = useState(''); 
  const [notaFiscal, setNotaFiscal] = useState(''); 
  
  // Visita
  const [motivoVisita, setMotivoVisita] = useState('');
  const [outrosMotivos, setOutrosMotivos] = useState('');

  // ESTADO DE ERROS
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const defaultTextColor = '#363636';

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSave = () => {
    const newErrors: { [key: string]: boolean } = {};
    let hasError = false;

    // Comuns
    if (!data) { newErrors.data = true; hasError = true; }
    if (!hora) { newErrors.hora = true; hasError = true; }
    if (!atividade) { newErrors.atividade = true; hasError = true; }

    // Regras por Atividade
    if (atividade === 'Entrega de dejetos') {
        if (!cooperado) { newErrors.cooperado = true; hasError = true; }
        if (!transportadora) { newErrors.transportadora = true; hasError = true; }
        if (!tipoVeiculo) { newErrors.tipoVeiculo = true; hasError = true; }
        if (!placa) { newErrors.placa = true; hasError = true; }
    } 
    else if (atividade === 'Entrega de Insumo') {
        if (!transportadora) { newErrors.transportadora = true; hasError = true; }
        if (!placa) { newErrors.placa = true; hasError = true; }
        if (!fornecedor) { newErrors.fornecedor = true; hasError = true; }
        if (!notaFiscal) { newErrors.notaFiscal = true; hasError = true; }
    } 
    else if (atividade === 'Expedição') {
        if (!transportadora) { newErrors.transportadora = true; hasError = true; }
        if (!tipoVeiculo) { newErrors.tipoVeiculo = true; hasError = true; }
        if (!placa) { newErrors.placa = true; hasError = true; }
        if (!notaFiscal) { newErrors.notaFiscal = true; hasError = true; }
    } 
    else if (atividade === 'Abastecimento') {
        if (!transportadora) { newErrors.transportadora = true; hasError = true; }
        if (!tipoVeiculo) { newErrors.tipoVeiculo = true; hasError = true; }
        if (!placa) { newErrors.placa = true; hasError = true; }
    } 
    else if (atividade === 'Visita') {
        if (!visitante) { newErrors.visitante = true; hasError = true; }
        if (!cpfCnpj) { newErrors.cpfCnpj = true; hasError = true; }
        if (!motivoVisita) { newErrors.motivoVisita = true; hasError = true; }
        if (motivoVisita === 'Outros' && !outrosMotivos) { newErrors.outrosMotivos = true; hasError = true; }
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const newItem = {
      id: Math.random().toString(36).substring(2, 9),
      categoria: atividade === 'Visita' ? 'Visita' : 'Entregas',
      data,
      horario: hora,
      atividade,
      empresa: atividade === 'Entrega de dejetos' ? cooperado : fornecedor,
      transportadora,
      tipoVeiculo,
      placa,
      motorista: atividade === 'Visita' ? visitante : motorista,
      cpf_cnpj: cpfCnpj,
      status: 'Em andamento'
    };

    onSave(newItem);
    handleClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={handleClose}></div>
      <div className="modal-card" style={{ maxWidth: '800px', width: '100%' }}>
        <header className="modal-card-head has-background-white" style={{ borderBottom: 'none' }}>
          <p className="modal-card-title has-text-weight-bold">Registrar entrada</p>
          <button className="delete" aria-label="close" onClick={handleClose}></button>
        </header>
        
        <section className="modal-card-body">
          <div className="columns is-multiline">
            
            {/* DATALISTS (Sugestões para inputs) */}
            <datalist id="transportadoras-list">
                {transportadoraOptions.map(opt => <option key={opt.id} value={opt.nomeFantasia} />)}
            </datalist>
            <datalist id="veiculos-list">
                {veiculoOptions.map(opt => <option key={opt.id} value={opt.label} />)}
            </datalist>
            <datalist id="placas-list">
                {placaOptions.map(opt => <option key={opt.id} value={opt.placa} />)}
            </datalist>

            {/* DATA */}
            <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Data *</label></div>
            <div className="column is-12 pt-1">
                <input 
                    className={`input ${errors.data ? 'is-danger' : ''}`} 
                    type="date" 
                    value={data} 
                    style={{ color: defaultTextColor }}
                    onChange={e => { setData(e.target.value); clearError('data'); }} 
                    disabled={!podeEditarOuCadastrar}
                />
                {errors.data && <p className="help is-danger">Campo obrigatório</p>}
            </div>
            
            {/* HORA */}
            <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Hora *</label></div>
            <div className="column is-12 pt-1">
                <input 
                    className={`input ${errors.hora ? 'is-danger' : ''}`} 
                    type="time" 
                    value={hora} 
                    style={{ color: defaultTextColor }}
                    onChange={e => { setHora(e.target.value); clearError('hora'); }} 
                    disabled={!podeEditarOuCadastrar}
                />
                {errors.hora && <p className="help is-danger">Campo obrigatório</p>}
            </div>

             {/* ATIVIDADE */}
             <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Atividade a realizar *</label></div>
             <div className="column is-12 pt-1">
               <div className={`select is-fullwidth ${errors.atividade ? 'is-danger' : ''}`}>
                                 <select 
                                         value={atividade} 
                                         onChange={e => {
                                             const novaAtividade = e.target.value;
                                             setAtividade(novaAtividade);
                                             clearError('atividade');
                                             console.log('%c📋 ATIVIDADE SELECIONADA', 'color: #8b5cf6; font-weight: bold; font-size: 13px;', novaAtividade);
                                         }}
                                         style={{ color: defaultTextColor }}
                                         disabled={!podeEditarOuCadastrar}
                                 >
                  <option value="" disabled>Selecionar</option>
                  <option value="Entrega de dejetos">Entrega de dejetos</option>
                  <option value="Entrega de Insumo">Entrega de Insumo</option>
                  <option value="Expedição">Expedição</option>
                  <option value="Abastecimento">Abastecimento</option>
                  <option value="Visita">Visita</option>
                </select>
              </div>
              {errors.atividade && <p className="help is-danger">Campo obrigatório</p>}
            </div>

            {/* --- CAMPOS DINÂMICOS --- */}

            {/* 1. ENTREGA DE DEJETOS */}
            {atividade === 'Entrega de dejetos' && (
                <>
                    <div className="column is-12 mt-4 mb-0"><h5 className="title is-6 has-text-grey has-text-weight-normal">Logística</h5></div>
                    
                    {/* Cooperado */}
                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Cooperado *</label></div>
                    <div className="column is-12 pt-1">
                        <div className={`select is-fullwidth ${errors.cooperado ? 'is-danger' : ''}`}>
                            <select 
                                value={cooperado} 
                                onChange={e => { setCooperado(e.target.value); clearError('cooperado'); }}
                                style={{ color: defaultTextColor }}
                                disabled={!podeEditarOuCadastrar}
                            >
                                <option value="" disabled>Selecionar</option>
                                <option value="Primato">Primato</option>
                                <option value="Agrocampo">Agrocampo</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>
                        {errors.cooperado && <p className="help is-danger">Campo obrigatório</p>}
                    </div>

                    {/* Transportadora (Lista Fixa conforme CSV, mas mantive Select) */}
                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Transportadora *</label></div>
                    <div className="column is-12 pt-1">
                        <div className={`select is-fullwidth ${errors.transportadora ? 'is-danger' : ''}`}> 
                            <select 
                                value={transportadora} 
                                onChange={e => { setTransportadora(e.target.value); clearError('transportadora'); setPlaca(''); }}
                                style={{ color: defaultTextColor }}
                                disabled={!podeEditarOuCadastrar}
                            >
                                <option value="">Selecionar Transportadora</option>
                                {transportadoraOptions.map(t => (
                                  <option key={t.id} value={t.id}>{t.nomeFantasia}</option>
                                ))}
                            </select>
                        </div>
                        {errors.transportadora && <p className="help is-danger">Campo obrigatório</p>}
                    </div>

                    {/* Tipo Veículo */}
                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Tipo de Veículo *</label></div>
                    <div className="column is-12 pt-1">
                        <div className={`select is-fullwidth ${errors.tipoVeiculo ? 'is-danger' : ''}`}> 
                            <select 
                                value={tipoVeiculo} 
                                onChange={e => { setTipoVeiculo(e.target.value); clearError('tipoVeiculo'); }}
                                style={{ color: defaultTextColor }}
                                disabled={!podeEditarOuCadastrar}
                            >
                                <option value="">Selecionar</option>
                                {veiculoOptions.map(v => (
                                  <option key={v.id} value={v.value}>{v.label}</option>
                                ))}
                            </select>
                        </div>
                        {errors.tipoVeiculo && <p className="help is-danger">Campo obrigatório</p>}
                    </div>

                    {/* Placa (Selecionar ou Digitar) */}
                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Placa *</label></div>
                    <div className="column is-12 pt-1">
                        <input 
                            className={`input ${errors.placa ? 'is-danger' : ''}`}
                            list="placas-list"
                            value={placa}
                            onChange={e => { setPlaca(e.target.value); clearError('placa'); }}
                            style={{ color: defaultTextColor }}
                            placeholder="Selecione ou digite..."
                            disabled={!podeEditarOuCadastrar}
                        />
                        <datalist id="placas-list">
                            {placaOptions.map(opt => <option key={opt.id} value={opt.placa} />)}
                        </datalist>
                        {errors.placa && <p className="help is-danger">Campo obrigatório</p>}
                    </div>

                    <div className="column is-12 mt-4 mb-0"><h5 className="title is-6 has-text-grey has-text-weight-normal">Informações</h5></div>
                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Motorista</label></div>
                    <div className="column is-12 pt-1">
                        <input className="input" type="text" value={motorista} onChange={e => setMotorista(e.target.value)} style={{ color: defaultTextColor }} />
                    </div>
                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">CPF ou Passaporte</label></div>
                    <div className="column is-12 pt-1">
                        <input className="input" type="text" value={cpfCnpj} onChange={e => setCpfCnpj(e.target.value)} style={{ color: defaultTextColor }} />
                    </div>

                    {/* DEBUG VISUAL: Mostra dados carregados na tela */}
                    <div className="column is-12 mt-4">
                        <details style={{
                            background:'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                            border:'2px solid #3b82f6',
                            padding:'16px',
                            borderRadius:'6px',
                            fontSize:'0.85em',
                            boxShadow:'0 2px 8px rgba(0,0,0,0.1)'
                        }} open>
                            <summary style={{
                                cursor:'pointer',
                                fontWeight:'bold',
                                fontSize:'1.1em',
                                color:'#1e40af',
                                marginBottom:'12px',
                                userSelect:'none'
                            }}>
                                🔍 DEBUG: Dados Carregados
                            </summary>
                            
                            <div style={{marginBottom:'16px'}}>
                                <div style={{
                                    background:'#ecfdf5',
                                    border:'1px solid #10b981',
                                    padding:'8px 12px',
                                    borderRadius:'4px',
                                    marginBottom:'8px',
                                    fontWeight:'600',
                                    color:'#047857'
                                }}>
                                    ✅ Transportadoras ({transportadoraOptions.length})
                                </div>
                                <pre style={{
                                    whiteSpace:'pre-wrap',
                                    wordBreak:'break-all',
                                    background:'#f9fafb',
                                    padding:'8px',
                                    borderRadius:'4px',
                                    border:'1px solid #e5e7eb',
                                    maxHeight:'200px',
                                    overflow:'auto',
                                    fontSize:'0.8em'
                                }}>{transportadoraOptions.length === 0 ? '⏳ Carregando...' : JSON.stringify(transportadoraOptions, null, 2)}</pre>
                            </div>

                            <div style={{marginBottom:'16px'}}>
                                <div style={{
                                    background:'#eff6ff',
                                    border:'1px solid #3b82f6',
                                    padding:'8px 12px',
                                    borderRadius:'4px',
                                    marginBottom:'8px',
                                    fontWeight:'600',
                                    color:'#1e40af'
                                }}>
                                    ✅ Tipos de Veículo ({veiculoOptions.length})
                                </div>
                                <pre style={{
                                    whiteSpace:'pre-wrap',
                                    wordBreak:'break-all',
                                    background:'#f9fafb',
                                    padding:'8px',
                                    borderRadius:'4px',
                                    border:'1px solid #e5e7eb',
                                    maxHeight:'200px',
                                    overflow:'auto',
                                    fontSize:'0.8em'
                                }}>{veiculoOptions.length === 0 ? '⏳ Carregando...' : JSON.stringify(veiculoOptions, null, 2)}</pre>
                            </div>

                            <div>
                                <div style={{
                                    background:'#fef3c7',
                                    border:'1px solid #f59e0b',
                                    padding:'8px 12px',
                                    borderRadius:'4px',
                                    marginBottom:'8px',
                                    fontWeight:'600',
                                    color:'#92400e'
                                }}>
                                    ✅ Placas ({placaOptions.length})
                                </div>
                                <pre style={{
                                    whiteSpace:'pre-wrap',
                                    wordBreak:'break-all',
                                    background:'#f9fafb',
                                    padding:'8px',
                                    borderRadius:'4px',
                                    border:'1px solid #e5e7eb',
                                    maxHeight:'200px',
                                    overflow:'auto',
                                    fontSize:'0.8em'
                                }}>{placaOptions.length === 0 ? '⏳ Selecione uma transportadora...' : JSON.stringify(placaOptions, null, 2)}</pre>
                            </div>
                        </details>
                    </div>
                </>
            )}

            {/* 2. ENTREGA DE INSUMO */}
            {atividade === 'Entrega de Insumo' && (
                <>
                    <div className="column is-12 mt-4 mb-0"><h5 className="title is-6 has-text-grey has-text-weight-normal">Logística</h5></div>
                    
                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Transportadora *</label></div>
                    <div className="column is-12 pt-1">
                        <input 
                            className={`input ${errors.transportadora ? 'is-danger' : ''}`} 
                            type="text" 
                            value={transportadora} 
                            onChange={e => { setTransportadora(e.target.value); clearError('transportadora'); }} 
                            style={{ color: defaultTextColor }}
                        />
                        {errors.transportadora && <p className="help is-danger">Campo obrigatório</p>}
                    </div>

                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Placa * (Digitável)</label></div>
                    <div className="column is-12 pt-1">
                        <input 
                            className={`input ${errors.placa ? 'is-danger' : ''}`} 
                            type="text" 
                            value={placa} 
                            onChange={e => { setPlaca(e.target.value); clearError('placa'); }} 
                            style={{ color: defaultTextColor }}
                        />
                        {errors.placa && <p className="help is-danger">Campo obrigatório</p>}
                    </div>

                    <div className="column is-12 mt-4 mb-0"><h5 className="title is-6 has-text-grey has-text-weight-normal">Informações</h5></div>
                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Motorista</label></div>
                    <div className="column is-12 pt-1"><input className="input" type="text" value={motorista} onChange={e => setMotorista(e.target.value)} style={{ color: defaultTextColor }} /></div>
                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">CPF ou Passaporte</label></div>
                    <div className="column is-12 pt-1"><input className="input" type="text" value={cpfCnpj} onChange={e => setCpfCnpj(e.target.value)} style={{ color: defaultTextColor }} /></div>

                    <div className="column is-12 mt-4 mb-0"><h5 className="title is-6 has-text-grey has-text-weight-normal">Dados da Operação</h5></div>
                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Fornecedor / Empresa *</label></div>
                    <div className="column is-12 pt-1">
                        <input className={`input ${errors.fornecedor ? 'is-danger' : ''}`} type="text" value={fornecedor} onChange={e => { setFornecedor(e.target.value); clearError('fornecedor'); }} style={{ color: defaultTextColor }} />
                        {errors.fornecedor && <p className="help is-danger">Campo obrigatório</p>}
                    </div>
                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">NF *</label></div>
                    <div className="column is-12 pt-1">
                        <input className={`input ${errors.notaFiscal ? 'is-danger' : ''}`} type="text" value={notaFiscal} onChange={e => { setNotaFiscal(e.target.value); clearError('notaFiscal'); }} style={{ color: defaultTextColor }} />
                        {errors.notaFiscal && <p className="help is-danger">Campo obrigatório</p>}
                    </div>
                </>
            )}

            {/* 3. EXPEDIÇÃO */}
            {atividade === 'Expedição' && (
                <>
                    <div className="column is-12 mt-4 mb-0"><h5 className="title is-6 has-text-grey has-text-weight-normal">Logística</h5></div>
                    
                    {/* Transportadora (Selecionar ou Digitar) */}
                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Transportadora * </label></div>
                    <div className="column is-12 pt-1">
                        <input 
                            className={`input ${errors.transportadora ? 'is-danger' : ''}`}
                            list="transportadoras-list"
                            value={transportadora}
                            onChange={e => { setTransportadora(e.target.value); clearError('transportadora'); }}
                            style={{ color: defaultTextColor }}
                            placeholder="Selecione ou digite..."
                        />
                        {errors.transportadora && <p className="help is-danger">Campo obrigatório</p>}
                    </div>

                    {/* Tipo Veículo (Selecionar ou Digitar) */}
                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Tipo de Veículo * </label></div>
                    <div className="column is-12 pt-1">
                        <input 
                            className={`input ${errors.tipoVeiculo ? 'is-danger' : ''}`}
                            list="veiculos-list"
                            value={tipoVeiculo}
                            onChange={e => { setTipoVeiculo(e.target.value); clearError('tipoVeiculo'); }}
                            style={{ color: defaultTextColor }}
                            placeholder="Selecione ou digite..."
                        />
                        {errors.tipoVeiculo && <p className="help is-danger">Campo obrigatório</p>}
                    </div>

                    {/* Placa (Selecionar ou Digitar) */}
                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Placa *</label></div>
                    <div className="column is-12 pt-1">
                        <input 
                            className={`input ${errors.placa ? 'is-danger' : ''}`}
                            list="placas-list"
                            value={placa}
                            onChange={e => { setPlaca(e.target.value); clearError('placa'); }}
                            style={{ color: defaultTextColor }}
                            placeholder="Selecione ou digite..."
                        />
                        {errors.placa && <p className="help is-danger">Campo obrigatório</p>}
                    </div>

                    <div className="column is-12 mt-4 mb-0"><h5 className="title is-6 has-text-grey has-text-weight-normal">Informações</h5></div>
                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Motorista</label></div>
                    <div className="column is-12 pt-1"><input className="input" type="text" value={motorista} onChange={e => setMotorista(e.target.value)} style={{ color: defaultTextColor }} /></div>
                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">CPF ou Passaporte</label></div>
                    <div className="column is-12 pt-1"><input className="input" type="text" value={cpfCnpj} onChange={e => setCpfCnpj(e.target.value)} style={{ color: defaultTextColor }} /></div>

                    <div className="column is-12 mt-4 mb-0"><h5 className="title is-6 has-text-grey has-text-weight-normal">Dados da Operação</h5></div>
                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Produto / NF *</label></div>
                    <div className="column is-12 pt-1">
                        <input className={`input ${errors.notaFiscal ? 'is-danger' : ''}`} type="text" value={notaFiscal} onChange={e => { setNotaFiscal(e.target.value); clearError('notaFiscal'); }} style={{ color: defaultTextColor }} />
                        {errors.notaFiscal && <p className="help is-danger">Campo obrigatório</p>}
                    </div>
                </>
            )}

            {/* 4. ABASTECIMENTO */}
            {atividade === 'Abastecimento' && (
                <>
                    <div className="column is-12 mt-4 mb-0"><h5 className="title is-6 has-text-grey has-text-weight-normal">Logística</h5></div>
                    
                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Transportadora *</label></div>
                    <div className="column is-12 pt-1">
                        <div className={`select is-fullwidth ${errors.transportadora ? 'is-danger' : ''}`}>
                            <select 
                                value={transportadora} 
                                onChange={e => { setTransportadora(e.target.value); clearError('transportadora'); }}
                                style={{ color: defaultTextColor }}
                            >
                                <option value="">Selecionar</option>
                                {transportadoraOptions.map(t => <option key={t.id} value={t.id}>{t.nomeFantasia}</option>)}
                            </select>
                        </div>
                        {errors.transportadora && <p className="help is-danger">Campo obrigatório</p>}
                    </div>

                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Tipo de Veículo *</label></div>
                    <div className="column is-12 pt-1">
                        <div className={`select is-fullwidth ${errors.tipoVeiculo ? 'is-danger' : ''}`}>
                            <select 
                                value={tipoVeiculo} 
                                onChange={e => { setTipoVeiculo(e.target.value); clearError('tipoVeiculo'); }}
                                style={{ color: defaultTextColor }}
                            >
                                <option value="">Selecionar</option>
                                <option value="Caminhão Truck">Caminhão Truck</option>
                            </select>
                        </div>
                        {errors.tipoVeiculo && <p className="help is-danger">Campo obrigatório</p>}
                    </div>

                    {/* Placa (Selecionar ou Digitar) */}
                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Placa *</label></div>
                    <div className="column is-12 pt-1">
                        <input 
                            className={`input ${errors.placa ? 'is-danger' : ''}`}
                            list="placas-list"
                            value={placa}
                            onChange={e => { setPlaca(e.target.value); clearError('placa'); }}
                            style={{ color: defaultTextColor }}
                            placeholder="Selecione ou digite..."
                        />
                        {errors.placa && <p className="help is-danger">Campo obrigatório</p>}
                    </div>

                    <div className="column is-12 mt-4 mb-0"><h5 className="title is-6 has-text-grey has-text-weight-normal">Informações</h5></div>
                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Motorista</label></div>
                    <div className="column is-12 pt-1"><input className="input" type="text" value={motorista} onChange={e => setMotorista(e.target.value)} style={{ color: defaultTextColor }} /></div>
                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">CPF ou Passaporte</label></div>
                    <div className="column is-12 pt-1"><input className="input" type="text" value={cpfCnpj} onChange={e => setCpfCnpj(e.target.value)} style={{ color: defaultTextColor }} /></div>
                </>
            )}

            {/* 5. VISITA */}
            {atividade === 'Visita' && (
                <>
                    <div className="column is-12 mt-4 mb-0"><h5 className="title is-6 has-text-grey has-text-weight-normal">Dados do Visitante</h5></div>
                    
                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Nome do Visitante *</label></div>
                    <div className="column is-12 pt-1">
                        <input 
                            className={`input ${errors.visitante ? 'is-danger' : ''}`} 
                            type="text" 
                            value={visitante} 
                            onChange={e => { setVisitante(e.target.value); clearError('visitante'); }} 
                            style={{ color: defaultTextColor }}
                        />
                        {errors.visitante && <p className="help is-danger">Campo obrigatório</p>}
                    </div>

                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">CPF ou Passaporte *</label></div>
                    <div className="column is-12 pt-1">
                        <input 
                            className={`input ${errors.cpfCnpj ? 'is-danger' : ''}`} 
                            type="text" 
                            value={cpfCnpj} 
                            onChange={e => { setCpfCnpj(e.target.value); clearError('cpfCnpj'); }} 
                            style={{ color: defaultTextColor }}
                        />
                        {errors.cpfCnpj && <p className="help is-danger">Campo obrigatório</p>}
                    </div>

                    <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Motivo *</label></div>
                    <div className="column is-12 pt-1">
                        <div className={`select is-fullwidth ${errors.motivoVisita ? 'is-danger' : ''}`}>
                            <select 
                                value={motivoVisita} 
                                onChange={e => { setMotivoVisita(e.target.value); clearError('motivoVisita'); }}
                                style={{ color: defaultTextColor }}
                            >
                                <option value="">Selecionar</option>
                                <option value="Reunião">Reunião</option>
                                <option value="Entrevista">Entrevista</option>
                                <option value="Manutenção">Manutenção</option>
                                <option value="Outros">Outros</option>
                            </select>
                        </div>
                        {errors.motivoVisita && <p className="help is-danger">Campo obrigatório</p>}
                    </div>

                    {motivoVisita === 'Outros' && (
                        <>
                            <div className="column is-12 pb-0"><label className="label is-small has-text-grey">Especificar Outro *</label></div>
                            <div className="column is-12 pt-1">
                                <input 
                                    className={`input ${errors.outrosMotivos ? 'is-danger' : ''}`} 
                                    type="text" 
                                    value={outrosMotivos} 
                                    onChange={e => { setOutrosMotivos(e.target.value); clearError('outrosMotivos'); }} 
                                    style={{ color: defaultTextColor }}
                                />
                                {errors.outrosMotivos && <p className="help is-danger">Campo obrigatório</p>}
                            </div>
                        </>
                    )}
                </>
            )}

          </div>
        </section>

        <footer className="modal-card-foot has-background-white is-justify-content-flex-end" style={{ borderTop: 'none' }}>
          <button className="button" onClick={handleClose}>Cancelar</button>
                    <button 
                        className="button has-text-white border-0" 
                        style={{ backgroundColor: '#10b981' }}
                        onClick={handleSave}
                        disabled={!podeEditarOuCadastrar}
                    >
                        Salvar
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PortariaRegisterModal;