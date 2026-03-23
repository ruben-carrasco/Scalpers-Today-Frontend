
import { TYPES } from '../../core/types';
import { AuthViewModel } from '../viewmodels/AuthViewModel';
import { useViewModel } from './useViewModel';

export function useAuthViewModel(): AuthViewModel {
  return useViewModel<AuthViewModel>(TYPES.AuthViewModel);
}
