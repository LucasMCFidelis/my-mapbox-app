import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MapComponent from "./MapComponent";

function App() {
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <h1 className="text-center text-2xl font-bold mt-4">Mapa com Mapbox</h1>
        <MapComponent />
      </div>
    </QueryClientProvider>
  );
}

export default App;
