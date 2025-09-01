import { QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "../utils/queryClient";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <div className="font-poppins">{children}</div>
    </QueryClientProvider>
  );
}
