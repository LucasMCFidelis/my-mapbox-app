import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "./MapImageCatalog.css";

const EVENT_SERVICE_URL = import.meta.env.VITE_EVENT_SERVICE_URL;

const MapImageCatalog = () => {
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${EVENT_SERVICE_URL}/events`);
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
      <div>Erro ao carregar evento {error.message || "Erro desconhecido"}</div>
    );
  }

  const now = new Date().toISOString();
  const filteredEvents =
    events?.filter((event) => {
      return event.endDateTime
        ? event.endDateTime > now
        : event.startDateTime > now;
    }) || [];

  return (
    <div className="container">
      <div className="event-list">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.eventId} className="event-card">
              <div
                className="event-image"
                style={{
                  backgroundImage: `url(${EVENT_SERVICE_URL}/map?latitude=${event.latitude}&longitude=${event.longitude})`,
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
