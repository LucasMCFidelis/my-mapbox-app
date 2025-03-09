import { useQuery } from "@tanstack/react-query";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const EVENT_SERVICE_URL = import.meta.env.VITE_EVENT_SERVICE_URL;

const MapComponent = () => {
  const fetchEvents = async () => {
    try {
      const response = await axios.get(EVENT_SERVICE_URL);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar eventos: " + error.message);
    }
  };

  const {
    data: events,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (isError) {
    return (
      <div>
        Erro ao carregar eventos: {error.message || "Erro desconhecido"}
      </div>
    );
  }

  const now = new Date().toISOString();
  const filteredEvents =
    events?.filter((event) => {
      return event.endDateTime
        ? event.endDateTime > now
        : event.startDateTime > now;
    }) || [];

  const bounds = [
    [-34.95, -7.25],
    [-34.75, -7.0],
  ];

  return (
    <div className="h-screen w-full">
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{ longitude: -34.861, latitude: -7.115, zoom: 12 }}
        style={{ width: "100%", height: "500px" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        maxBounds={bounds}
        minZoom={10}
      >
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Marker
              key={event.id}
              longitude={event.longitude}
              latitude={event.latitude}
            >
              <div
                style={{
                  backgroundColor: event.eventPrice > 0 ? "red" : "blue",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "10px",
                }}
              >
                {event?.eventTitle?.[0] ?? "?"}
              </div>
            </Marker>
          ))
        ) : (
          <div>Sem eventos para exibir</div>
        )}
      </Map>
    </div>
  );
};

export default MapComponent;
