import { useState, useEffect } from "react";

type Args = {
  value: string;
  delay: number;
};

export function useDebounceInput({ value, delay }: Args) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const debounceHandler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(debounceHandler);
    };
  }, [value, delay]);

  return debouncedValue;
}
