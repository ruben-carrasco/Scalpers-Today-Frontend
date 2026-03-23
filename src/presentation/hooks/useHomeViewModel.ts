
import { TYPES } from '../../core/types';
import { HomeViewModel } from '../viewmodels/HomeViewModel';
import { useViewModel } from './useViewModel';

export function useHomeViewModel(): HomeViewModel {
  return useViewModel<HomeViewModel>(TYPES.HomeViewModel);
}
