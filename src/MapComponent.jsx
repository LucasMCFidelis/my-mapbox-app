import { useState } from "react";
import { useEvents } from "./context/EventsContext";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapComponent.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const initialViewState = {
  longitude: -34.861,
  latitude: -7.115,
  zoom: 12,
};

const MapComponent = () => {
  const [viewState, setViewState] = useState(initialViewState);
  const {
    filteredEvents,
    isLoadingEvents,
    isErrorEvents,
    errorEvents,
    selectedEvent,
    setSelectedEvent,
  } = useEvents();

  if (isLoadingEvents) {
    return <div>Carregando dados dos eventos...</div>;
  }

  if (isErrorEvents) {
    return (
      <div>
        Erro ao carregar eventos: {errorEvents.message || "Erro desconhecido"}
      </div>
    );
  }

  const bounds = [
    [-34.95, -7.25],
    [-34.75, -7.0],
  ];

  return (
    <div>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "500px" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        maxBounds={bounds}
        minZoom={10}
        onClick={() => setSelectedEvent(null)} // Fecha o popup ao clicar no mapa
      >
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Marker
              key={event.eventId}
              longitude={event.longitude}
              latitude={event.latitude}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation(); // Evita que o clique feche o popup imediatamente
                  setSelectedEvent(event);
                  setViewState({
                    longitude: event.longitude,
                    latitude: event.latitude,
                    zoom: 14,
                    transitionDuration: 500,
                  });
                }}
                style={{
                  backgroundColor: event.eventPrice > 0 ? "#761AB3" : "#1AB393",
                }}
                className="marker"
              >
                {event?.eventTitle?.[0] ?? "?"}
              </div>
            </Marker>
          ))
        ) : (
          <div>Sem eventos para exibir</div>
        )}

        {selectedEvent && (
          <Popup
            longitude={selectedEvent.longitude}
            latitude={selectedEvent.latitude}
            onClose={() => {
              setSelectedEvent(null);
              setViewState(initialViewState); // Resetar para a posição inicial
            }}
            closeButton
            closeOnClick={true} // Fecha ao clicar fora
            anchor="top"
          >
            <div style={{ color: "black" }}>
              <h3 className="font-bold">{selectedEvent.eventTitle}</h3>
              <p>{selectedEvent.eventDescription}</p>
              <p>
                <strong>Endereço:</strong> {selectedEvent.eventAddressStreet},{" "}
                {selectedEvent.eventAddressNumber},{" "}
                {selectedEvent.eventAddressNeighborhood}
              </p>
              <p>
                <strong>Data:</strong>{" "}
                {new Date(selectedEvent.startDateTime).toLocaleString()}
              </p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapComponent;
