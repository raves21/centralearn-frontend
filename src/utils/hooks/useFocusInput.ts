import { useEffect, useRef, type DependencyList } from "react";

type Args = {
  deps?: DependencyList;
};

export function useFocusInput({ deps = [] }: Args) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [...deps]);

  return { inputRef };
}
