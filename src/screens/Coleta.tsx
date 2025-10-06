import React, { useState } from 'react';
import { MdSearch, MdFilterList, MdEdit, MdLocationPin, MdCheckCircle, MdOutlineWatchLater, MdArrowForwardIos, MdOutlineCloudUpload } from 'react-icons/md';
import { Link } from 'react-router-dom';
import useTheme from '../hooks/useTheme';

// Interface para um item da lista de coleta
interface ColetaItem {
  id: number;
  cooperado: string;
  motorista: string;
  status: 'Pendente' | 'Entregue' | 'Atrasado';
}

// Dados mockados para a lista de coleta
const mockColetaData: ColetaItem[] = [
  { id: 1, cooperado: 'Primato', motorista: 'Luiz Carlos', status: 'Pendente' },
  { id: 2, cooperado: 'Primato', motorista: 'Marcos Paulo', status: 'Entregue' },
  { id: 3, cooperado: 'Primato', motorista: 'Ana Cássia', status: 'Atrasado' },
];

const Coleta = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();

  const filteredData = mockColetaData.filter(item =>
    item.motorista.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.cooperado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClass = (status: ColetaItem['status']) => {
    switch (status) {
      case 'Pendente':
        return 'has-background-warning-light has-text-warning-dark';
      case 'Entregue':
        return 'has-background-success-light has-text-success-dark';
      case 'Atrasado':
        return 'has-background-danger-light has-text-danger-dark';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: ColetaItem['status']) => {
    switch (status) {
      case 'Pendente':
        return <MdOutlineWatchLater />;
      case 'Entregue':
        return <MdCheckCircle />;
      default:
        return null;
    }
  };

  return (
    <>
      <h1 className="title is-4">Coleta de dejetos</h1>

      {/* Campo de busca */}
      <div className="field has-addons">
        <div className="control is-expanded">
          <input
            className="input"
            type="text"
            placeholder="Buscar cooperado"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="control">
          <button className="button is-info">
            <span className="icon">
              <MdSearch />
            </span>
            <span>Buscar</span>
          </button>
        </div>
      </div>

      {/* Lista de cooperados */}
      <div className="list-header level is-mobile mt-5">
        <div className="level-left">
          <p className="subtitle is-6">Primato</p>
        </div>
        <div className="level-right">
          <div className="buttons">
            <button className="button is-light">
              <span className="icon"><MdFilterList /></span>
              <span>Filtrar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="list-container">
        {filteredData.map(item => (
          <div className="card mb-3" key={item.id}>
            <div className="card-content">
              <div className="level is-mobile is-align-items-center">
                <div className="level-left">
                  <div className="level-item has-text-left">
                    <div>
                      <p className="title is-5">{item.cooperado}</p>
                      <p className="subtitle is-6 mt-1">Motorista: {item.motorista}</p>
                    </div>
                  </div>
                </div>
                <div className="level-right">
                  <div className="level-item has-text-right is-hidden-touch">
                    <div className={`tag is-large ${getStatusClass(item.status)}`}>
                      {item.status}
                    </div>
                  </div>
                  <div className="level-item buttons is-hidden-touch ml-4">
                    <button className="button is-light">
                      <span className="icon has-text-link">
                        <MdLocationPin />
                      </span>
                    </button>
                    <button className="button is-light">
                      <span className="icon has-text-link">
                        <MdEdit />
                      </span>
                    </button>
                  </div>
                  <div className="level-item is-hidden-desktop">
                    <span className="icon is-medium">
                      <MdArrowForwardIos />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Botão para instalar o app */}
      <div className="mt-6 has-text-centered">
        <button className="button is-link is-large">
          <span className="icon">
            <MdOutlineCloudUpload />
          </span>
          <span>Instalar APP</span>
        </button>
      </div>
    </>
  );
};

export default Coleta;