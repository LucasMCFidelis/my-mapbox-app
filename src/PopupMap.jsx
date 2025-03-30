import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import mapboxgl from "mapbox-gl";
import { useEvents } from "./context/EventsContext";

const PopupMap = ({ map }) => {
  const contentRef = useRef(document.createElement("div"));
  const popupRef = useRef(null);
  const { selectedEvent, setSelectedEvent } = useEvents();

  useEffect(() => {
    console.log("Selected Event:", selectedEvent);
  }, [selectedEvent]);

  useEffect(() => {
    if (!map || !selectedEvent) return;

    if (popupRef.current) {
      popupRef.current.remove();
    }

    popupRef.current = new mapboxgl.Popup({
      offset: 25,
      maxWidth: "80vw",
      closeOnClick: false,
      closeButton: false,
      className: "custom-popup",
    })
      .setLngLat([selectedEvent.longitude, selectedEvent.latitude])
      .setDOMContent(contentRef.current)
      .addTo(map);

    return () => popupRef.current?.remove();
  }, [selectedEvent, map]);

  return selectedEvent
    ? createPortal(
        <>
          <button onClick={() => setSelectedEvent(null)}>X</button>
          <h3 className="custom-popup-title">{selectedEvent.eventTitle}</h3>
          <p className="custom-popup-description">
            {selectedEvent.eventDescription}
          </p>
          <p className="custom-popup-content">
            <strong>Endereço:</strong> {selectedEvent.eventAddressStreet},{" "}
            {selectedEvent.eventAddressNumber},{" "}
            {selectedEvent.eventAddressNeighborhood}
          </p>
          <p className="custom-popup-content">
            <strong>Data:</strong>{" "}
            {new Date(selectedEvent.startDateTime).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })}{" "}
            às{" "}
            {new Date(selectedEvent.startDateTime).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </>,
        contentRef.current
      )
    : null;
};

export default PopupMap;
