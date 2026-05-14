import { TYPES } from '../../core/types';
import { AssistantViewModel } from '../viewmodels/AssistantViewModel';
import { useViewModel } from './useViewModel';

export function useAssistantViewModel(): AssistantViewModel {
  return useViewModel<AssistantViewModel>(TYPES.AssistantViewModel);
}
