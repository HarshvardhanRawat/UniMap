import { useEffect, useState } from 'react';

/**
 * Simple debounce hook for UI inputs.
 *
 * @param {any} value
 * @param {number} delayMs
 * @returns {any}
 */
export default function useDebouncedValue(value, delayMs = 120) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);

  return debouncedValue;
}

