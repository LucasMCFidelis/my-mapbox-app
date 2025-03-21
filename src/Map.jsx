import React, { useEffect, useRef, useState } from "react";
import { useEvents } from "./context/EventsContext";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";

const initialViewState = {
  longitude: -34.861,
  latitude: -7.115,
  zoom: 12,
};

const maxBounds = [
  [-34.914, -7.242],
  [-34.76, -7.037],
];

const Map = () => {
  const [viewState, setViewState] = useState(initialViewState);
  const {
    filteredEvents,
    isLoadingEvents,
    isErrorEvents,
    errorEvents,
    setSelectedEvent,
  } = useEvents();

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  // Inicializa o mapa apenas uma vez
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    if (!import.meta.env.VITE_MAPBOX_ACCESS_TOKEN) {
      console.error("Mapbox access token is missing!");
      return;
    }

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      minZoom: 10,
      maxBounds: maxBounds,
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Atualiza a posição do mapa sempre que `viewState` mudar
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      essential: true,
      duration: 500,
    });
  }, [viewState]);

  // Atualiza os marcadores quando os eventos mudam
  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    filteredEvents.forEach((event) => {
      if (!event.longitude || !event.latitude) return;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="color: black; font-family: Arial, sans-serif;">
          <h3 style="font-weight: bold; margin-bottom: 5px;">${
            event.eventTitle
          }</h3>
          <p>${event.eventDescription}</p>
          <p><strong>Endereço:</strong> ${event.eventAddressStreet}, ${
        event.eventAddressNumber
      }, ${event.eventAddressNeighborhood}</p>
          <p><strong>Data:</strong> ${new Date(
            event.startDateTime
          ).toLocaleString()}</p>
        </div>
      `);

      const marker = new mapboxgl.Marker({
        color: event.eventPrice > 0 ? "#761AB3" : "#1AB393",
      })
        .setLngLat([event.longitude, event.latitude])
        .setPopup(popup)
        .addTo(mapRef.current);

      marker.getElement().addEventListener("click", () => {
        setSelectedEvent(event);
        setViewState({
          longitude: event.longitude,
          latitude: event.latitude,
          zoom: 14,
        });
        setTimeout(() => popup.addTo(mapRef.current), 0);
      });

      markersRef.current.push(marker);
    });
  }, [filteredEvents, setSelectedEvent]);

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

  return (
    <div
      ref={mapContainerRef}
      className="mapComponent"
    />
  );
};

export default Map;
