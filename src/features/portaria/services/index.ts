/**
 * PORTARIA REGISTRO - Exports de Services
 * Centraliza todos os serviços do módulo
 * @author Antonio Marcos de Souza Santos
 * @date 24/03/2026
 */

export { portariaRegistroService } from './portariaRegistroService';
export { portariaValidationService } from './portariaValidationService';
export { portariaMapperService } from './portariaMapperService';
export { portariaFormatterService } from './portariaFormatterService';
export {
	portariaActivityPayloadService,
	portariaDeletionPayloadService,
	abastecimentoService,
	entregaDejetosService,
	entregaInsumoService,
	expedicaoService,
} from './activities';
export {
	portariaDeletionService,
	portariaSubmissionService,
} from './orchestration'; // portariaDrawerHydrationService agora é exportado diretamente de services/portariaDrawerHydrationService
