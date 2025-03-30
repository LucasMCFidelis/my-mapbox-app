import React, { useEffect, useRef, useState } from "react";
import { useEvents } from "./context/EventsContext";
import mapboxgl, { Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";
import PopupMap from "./PopupMap";

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
      style: "mapbox://styles/mapbox/standard",
      center: [initialViewState.longitude, initialViewState.latitude],
      zoom: initialViewState.zoom,
      pitch: 42,
      minZoom: 10,
      maxBounds: maxBounds,
    });

    mapRef.current.on("style.load", () => {
      mapRef.current.setConfigProperty("basemap", "lightPreset", "dusk");
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

    // Remove marcadores antigos antes de adicionar novos
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    filteredEvents.forEach((event) => {
      if (!event.longitude || !event.latitude) return;

      const marker = new mapboxgl.Marker({
        color: event.eventPrice > 0 ? "#761AB3" : "#1AB393",
      })
        .setLngLat([event.longitude, event.latitude])
        .addTo(mapRef.current);

      const markerElement = marker.getElement();
      markerElement.style.cursor = "pointer"; // Define o cursor

      // Pegamos o primeiro elemento filho (que é um <svg>)
      const iconElement = markerElement.firstChild;
      iconElement.style.transition = "transform 0.2s ease-in-out";

      // Aplica hover no ícone e não no marcador principal
      markerElement.addEventListener("mouseenter", () => {
        iconElement.style.transform = "scale(1.3)";
      });

      markerElement.addEventListener("mouseleave", () => {
        iconElement.style.transform = "scale(1)";
      });

      markerElement.addEventListener("click", () => {
        setViewState({
          longitude: event.longitude,
          latitude: event.latitude,
          zoom: 16,
        });
        setSelectedEvent(event);
      });

      markersRef.current.push(marker);
    });
  }, [filteredEvents]);

  return (
    <>
      <div ref={mapContainerRef} className="map-component" />
      {isLoadingEvents && <div>Carregando dados dos eventos...</div>}
      {isErrorEvents && (
        <div>
          Erro ao carregar eventos: {errorEvents.message || "Erro desconhecido"}
        </div>
      )}
      {mapRef.current && <PopupMap map={mapRef.current} />}
    </>
  );
};

export default Map;
