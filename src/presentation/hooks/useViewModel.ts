
import { useMemo } from 'react';
import { container } from '../../core/container';

export function useViewModel<T>(type: symbol): T {
  return useMemo(() => container.get<T>(type), [type]);
}
