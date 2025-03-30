import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MapImageCatalog from "./components/imageCatalog/MapImageCatalog";
import { EventsProvider } from "./components/EventsProvider";
import Map from "./components/mapComponent/Map";
import "./App.css";

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
