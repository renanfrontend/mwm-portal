import { useState, useEffect } from 'react'; // CORREÇÃO: Removido 'React'
import { MdSearch, MdFilterList, MdArrowForwardIos, MdArrowBack, MdLocationOn, MdModeEdit } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ColetaFormModal from '../components/ColetaFormModal';
import CheckInModal from '../components/CheckInModal';
import { loadColetaData, saveColetaItem, checkInColetaItem } from '../features/coleta/coletaSlice';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { type ColetaItem } from '../services/api';

const Coleta = () => {
  const dispatch = useAppDispatch();
  const { coletaData, loading, error } = useAppSelector((state) => state.coleta);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ColetaItem | null>(null);
  const navigate = useNavigate();

  // CORREÇÃO: Removida variável 'canEdit' (TS6133)
  const canAdd = user?.role === 'editor' || user?.role === 'administrador';

  useEffect(() => {
    dispatch(loadColetaData());
  }, [dispatch]);

  const handleEdit = (item: ColetaItem) => {
    setSelectedItem(item);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (item: ColetaItem) => {
    dispatch(saveColetaItem(item));
    setIsFormModalOpen(false);
    setSelectedItem(null);
  };

  const handleCheckInClick = (item: ColetaItem) => {
    setSelectedItem(item);
    setIsCheckInModalOpen(true);
  };

  const handleCheckIn = async () => {
    if (!selectedItem) return;
    dispatch(checkInColetaItem(selectedItem));
    setIsCheckInModalOpen(false);
  };

  const filteredData = coletaData.filter(item =>
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
            <h1 className="title is-4">Coleta de dejetos</h1>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            {canAdd && (
              <button className="button is-primary" onClick={() => {
                setSelectedItem(null);
                setIsFormModalOpen(true);
              }}>
                + Coleta
              </button>
            )}
          </div>
        </div>
      </div>

      <ColetaFormModal
        isActive={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedItem}
      />
      <CheckInModal
        isActive={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        onEdit={() => {
          setIsCheckInModalOpen(false);
          setIsFormModalOpen(true);
        }}
        onCheckIn={handleCheckIn}
        data={selectedItem}
      />

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

      {loading ? (
        <progress className="progress is-large is-info" max="100"></progress>
      ) : error ? (
        <div className="notification is-danger">{error}</div>
      ) : (
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
                      <button className="button is-light" onClick={() => handleCheckInClick(item)}>
                        <span className="icon has-text-link">
                          <MdLocationOn />
                        </span>
                      </button>
                      <button className="button is-light" onClick={() => handleEdit(item)}>
                        <span className="icon has-text-link">
                          <MdModeEdit />
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
      )}
    </>
  );
};

export default Coleta;