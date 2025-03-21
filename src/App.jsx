import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MapImageCatalog from "./MapImageCatalog";
import { EventsProvider } from "./EventsProvider";
import Map from "./Map";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <EventsProvider>
        <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
          <h1>Mapa com Mapbox</h1>
          <Map />
        </div>
      </EventsProvider>
    </QueryClientProvider>
  );
}

export default App;
