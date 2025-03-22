import "./MapImageCatalog.css";
import { useEvents } from "./context/EventsContext";

const EVENT_SERVICE_URL = import.meta.env.VITE_EVENT_SERVICE_URL;

const MapImageCatalog = () => {
  const { filteredEvents, isLoadingEvents, isErrorEvents, errorEvents } =
    useEvents();

  if (isLoadingEvents) {
    return <div>Carregando eventos...</div>;
  }

  if (isErrorEvents) {
    return (
      <div>
        Erro ao carregar eventos: {errorEvents.message || "Erro desconhecido"}
      </div>
    );
  }

  return (
    <div className="container">
      <div className="event-list">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.eventId} className="event-card">
              <div
                className="event-image"
                style={{
                  backgroundImage: `url(${EVENT_SERVICE_URL}/map?latitude=${event.latitude}&longitude=${event.longitude}&eventPrice=${event.eventPrice})`,
                }}
              ></div>
              <p className="event-date">
                {new Date(event.startDateTime).toLocaleDateString()} -
                {new Date(event.startDateTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <h2 className="event-name">{event.eventTitle}</h2>
              <p className="event-description">{event.eventDescription}</p>
            </div>
          ))
        ) : (
          <div>Sem eventos para exibir</div>
        )}
      </div>
    </div>
  );
};

export default MapImageCatalog;
