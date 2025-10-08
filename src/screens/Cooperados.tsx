import React, { useState, useEffect } from 'react';
import { MdSearch, MdFilterList, MdArrowBack, MdLocationOn, MdModeEdit, MdRemoveRedEye, MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { fetchCooperadosData, type CooperadoItem } from '../services/api';

const Cooperados = () => {
  const [activeTab, setActiveTab] = useState('cadastro');
  const [cooperadosData, setCooperadosData] = useState<CooperadoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchCooperadosData();
      setCooperadosData(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredData = cooperadosData.filter(item =>
    item.motorista.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.filial.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCertificadoClass = (status: CooperadoItem['certificado']) => {
    return status === 'Ativo' ? 'is-success' : 'is-danger';
  };

  return (
    <>
      <div className="level is-mobile mb-4">
        <div className="level-left">
          <div className="level-item">
            <button className="button is-light" onClick={() => navigate(-1)}>
              <span className="icon"><MdArrowBack /></span>
            </button>
          </div>
          <div className="level-item">
            <h1 className="title is-4">Cooperados</h1>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <button className="button is-primary">
              <span className="icon"><MdAdd /></span>
              <span>Cadastrar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="tabs is-boxed">
        <ul>
          <li className={activeTab === 'cadastro' ? 'is-active' : ''}>
            <a onClick={() => setActiveTab('cadastro')}>Cadastro</a>
          </li>
          <li className={activeTab === 'agenda' ? 'is-active' : ''}>
            <a onClick={() => setActiveTab('agenda')}>Agenda</a>
          </li>
        </ul>
      </div>

      {activeTab === 'cadastro' && (
        <div className="content">
          <div className="level is-mobile mt-5 mb-4">
            <div className="level-left">
              <div className="level-item">
                <div className="field has-addons">
                  <div className="control is-expanded">
                    <input
                      className="input"
                      type="text"
                      placeholder="Digite nome, empresa, veículo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="control">
                    <button className="button is-info">
                      <span className="icon"><MdSearch /></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <button className="button is-light">
                  <span className="icon"><MdFilterList /></span>
                  <span>Filtrar</span>
                </button>
              </div>
            </div>
          </div>
          
          {loading ? (
            <progress className="progress is-large is-info" max="100"></progress>
          ) : (
            <div className="table-container">
              <table className="table is-striped is-hoverable is-fullwidth">
                <thead>
                  <tr>
                    <th>Matrícula</th>
                    <th>Filial</th>
                    <th>Motorista</th>
                    <th>Tipo de Veículo</th>
                    <th>Placa</th>
                    <th>Certificado</th>
                    <th>Doam Dejetos</th>
                    <th>Fase</th>
                    <th style={{ width: '150px' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(item => (
                    <tr key={item.id}>
                      <td>{item.matricula}</td>
                      <td>{item.filial}</td>
                      <td>{item.motorista}</td>
                      <td>{item.tipoVeiculo}</td>
                      <td>{item.placa}</td>
                      <td>
                        <span className={`tag ${getCertificadoClass(item.certificado)}`}>
                          {item.certificado}
                        </span>
                      </td>
                      <td>{item.doamDejetos}</td>
                      <td>{item.fase}</td>
                      <td>
                        <div className="buttons are-small">
                          <button className="button is-light"><span className="icon"><MdLocationOn /></span></button>
                          <button className="button is-light"><span className="icon"><MdRemoveRedEye /></span></button>
                          <button className="button is-light"><span className="icon"><MdModeEdit /></span></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'agenda' && (
        <div className="content">
          <p>Conteúdo da aba de Agenda.</p>
        </div>
      )}
    </>
  );
};

export default Cooperados;