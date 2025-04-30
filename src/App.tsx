import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Calendar } from "./Calendar/Calendar";
import { Toaster } from "./components/ui/sonner";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-screen-xl mx-auto">
        <Toaster richColors position="bottom-center" />
        <Calendar />
      </div>
    </QueryClientProvider>
  );
}

export default App;
