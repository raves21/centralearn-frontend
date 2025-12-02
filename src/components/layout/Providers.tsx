import { QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { queryClient } from "../../utils/queryClient";
import { Toaster } from "@/components/ui/sonner";
import PendingOverlay from "../shared/globals/PendingOverlay";
import GlobalDialog from "../shared/globals/GlobalDialog";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalDialog />
      <Toaster theme="light" richColors />
      <PendingOverlay />
      <div className="text-sm font-poppins">{children}</div>
    </QueryClientProvider>
  );
}
