
import { TYPES } from '../../core/types';
import { EventsViewModel } from '../viewmodels/EventsViewModel';
import { useViewModel } from './useViewModel';

export function useEventsViewModel(): EventsViewModel {
  return useViewModel<EventsViewModel>(TYPES.EventsViewModel);
}
