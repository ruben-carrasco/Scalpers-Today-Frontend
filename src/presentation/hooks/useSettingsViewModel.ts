
import { TYPES } from '../../core/types';
import { SettingsViewModel } from '../viewmodels/SettingsViewModel';
import { useViewModel } from './useViewModel';

export function useSettingsViewModel(): SettingsViewModel {
  return useViewModel<SettingsViewModel>(TYPES.SettingsViewModel);
}
