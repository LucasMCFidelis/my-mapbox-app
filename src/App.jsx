import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MapImageCatalog from "./MapImageCatalog";
import { EventsProvider } from "./EventsProvider";
import Map from "./Map";
import "./App.css"

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <EventsProvider>
        <div className="app-container">
          <h1>Mapa com Mapbox</h1>
          <div className="map-container">
            <Map/>
          </div>
          <MapImageCatalog />
        </div>
      </EventsProvider>
    </QueryClientProvider>
  );
}

export default App;
