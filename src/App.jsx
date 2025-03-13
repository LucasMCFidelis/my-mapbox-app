import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MapComponent from "./MapComponent";
import MapImageCatalog from "./MapImageCatalog";

function App() {
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <h1>Mapa com Mapbox</h1>
        <MapComponent />
        <MapImageCatalog></MapImageCatalog>
      </div>
    </QueryClientProvider>
  );
}

export default App;
