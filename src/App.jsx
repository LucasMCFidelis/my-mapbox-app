import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MapComponent from "./MapComponent";
import MapImageCatalog from "./MapImageCatalog";
import { EventsProvider } from "./EventsProvider";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <EventsProvider>
        <div>
          <h1>Mapa com Mapbox</h1>
          <MapComponent />
          <MapImageCatalog></MapImageCatalog>
        </div>
      </EventsProvider>
    </QueryClientProvider>
  );
}

export default App;
