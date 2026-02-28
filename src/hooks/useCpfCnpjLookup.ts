import { useCallback, useState, useRef } from 'react';
import { ProdutorService } from '../services/produtorService';
import type { ProdutorListItem } from '../types/cooperado';

interface UseCpfCnpjLookupResult {
  nomeProdutor: string;
  numEstabelecimento: string;
  isLocked: boolean;
  isCpfReadOnly: boolean;
  isNomeReadOnly: boolean;
  focusEstabelecimentoSignal: number;
  handleCpfCnpjChange: (value: string) => Promise<void>;
  handleCpfCnpjFocus: () => boolean;
  resetFields: () => void;
}

export function useCpfCnpjLookup(onFound?: (produtor: ProdutorListItem) => void): UseCpfCnpjLookupResult {
  const [nomeProdutor, setNomeProdutor] = useState('');
  const [numEstabelecimento, setNumEstabelecimento] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [focusEstabelecimentoSignal, setFocusEstabelecimentoSignal] = useState(0);
  const lastCpfCnpj = useRef('');

  // Chamada ao digitar CPF/CNPJ
  const resetFields = useCallback(() => {
    setNomeProdutor('');
    setNumEstabelecimento('');
    setIsLocked(false);
    lastCpfCnpj.current = '';
  }, []);

  const handleCpfCnpjChange = useCallback(async (value: string) => {
    if (isLocked) return;
    lastCpfCnpj.current = value;
    // Só busca se for CPF (11) ou CNPJ (14) completo
    const onlyNums = value.replaceAll(/\D/g, '');
    if (onlyNums.length !== 11 && onlyNums.length !== 14) {
      setNomeProdutor('');
      setNumEstabelecimento('');
      return;
    }
    try {
      const result = await ProdutorService.findByCpfCnpj(onlyNums);
      if (result) {
        setNomeProdutor(result.nomeProdutor || result.nome || '');
        setNumEstabelecimento(result.numEstabelecimento || result.numeroEstabelecimento || '');
        setIsLocked(true);
        setFocusEstabelecimentoSignal(prev => prev + 1);
        if (onFound) onFound(result);
      } else {
        setNomeProdutor('');
        setNumEstabelecimento('');
        setIsLocked(false);
      }
    } catch {
      setNomeProdutor('');
      setNumEstabelecimento('');
      setIsLocked(false);
    }
  }, [isLocked, onFound]);

  // Chamada ao focar no campo CPF/CNPJ
  const handleCpfCnpjFocus = useCallback((): boolean => {
    if (isLocked) {
      resetFields();
      return true;
    }
    return false;
  }, [isLocked, resetFields]);

  return {
    nomeProdutor,
    numEstabelecimento,
    isLocked,
    isCpfReadOnly: isLocked,
    isNomeReadOnly: isLocked,
    focusEstabelecimentoSignal,
    handleCpfCnpjChange,
    handleCpfCnpjFocus,
    resetFields,
  };
}
