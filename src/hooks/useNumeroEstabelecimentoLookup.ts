import { useCallback, useRef, useState } from 'react';
import { ProdutorService } from '../services/produtorService';

interface NumeroEstabelecimentoValidationResult {
  isDuplicate: boolean;
  message: string | null;
}

interface UseNumeroEstabelecimentoLookupResult {
  isChecking: boolean;
  duplicateMessage: string | null;
  duplicateFocusSignal: number;
  handleNumeroEstabelecimentoInputChange: (rawValue: string) => string;
  validateNumeroEstabelecimentoOnBlur: (rawValue: string) => Promise<NumeroEstabelecimentoValidationResult>;
  clearDuplicateMessage: () => void;
}

const DEFAULT_DUPLICATE_MESSAGE = 'N. de estabelecimento já existe.';

export function useNumeroEstabelecimentoLookup(): UseNumeroEstabelecimentoLookupResult {
  const [isChecking, setIsChecking] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState<string | null>(null);
  const [duplicateFocusSignal, setDuplicateFocusSignal] = useState(0);
  const requestSequenceRef = useRef(0);

  const clearDuplicateMessage = useCallback(() => {
    setDuplicateMessage(null);
  }, []);

  const handleNumeroEstabelecimentoInputChange = useCallback((rawValue: string): string => {
    const sanitizedValue = rawValue.replaceAll(/\D/g, '');
    if (duplicateMessage) {
      setDuplicateMessage(null);
    }
    return sanitizedValue;
  }, [duplicateMessage]);

  const validateNumeroEstabelecimentoOnBlur = useCallback(async (rawValue: string): Promise<NumeroEstabelecimentoValidationResult> => {
    const sanitizedValue = rawValue.replaceAll(/\D/g, '');

    if (!sanitizedValue) {
      setDuplicateMessage(null);
      return { isDuplicate: false, message: null };
    }

    const sequence = ++requestSequenceRef.current;
    setIsChecking(true);

    try {
      const existing = await ProdutorService.findByNumEstabelecimento(sanitizedValue);
      const isDuplicate = Boolean(existing);

      if (requestSequenceRef.current !== sequence) {
        return {
          isDuplicate: false,
          message: null
        };
      }

      if (isDuplicate) {
        const backendMessage =
          typeof existing?.message === 'string' && existing.message.trim()
            ? existing.message
            : DEFAULT_DUPLICATE_MESSAGE;

        setDuplicateMessage(backendMessage);
        setDuplicateFocusSignal(prev => prev + 1);
        return {
          isDuplicate: true,
          message: backendMessage
        };
      }

      setDuplicateMessage(null);
      return {
        isDuplicate: false,
        message: null
      };
    } catch {
      if (requestSequenceRef.current === sequence) {
        setDuplicateMessage(null);
      }

      return {
        isDuplicate: false,
        message: null
      };
    } finally {
      if (requestSequenceRef.current === sequence) {
        setIsChecking(false);
      }
    }
  }, []);

  return {
    isChecking,
    duplicateMessage,
    duplicateFocusSignal,
    handleNumeroEstabelecimentoInputChange,
    validateNumeroEstabelecimentoOnBlur,
    clearDuplicateMessage
  };
}
