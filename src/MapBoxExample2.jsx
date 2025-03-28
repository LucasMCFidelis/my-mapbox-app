import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

const MapboxExample = () => {
  const mapContainerRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibHVjYXNmaWRlbGlzIiwiYSI6ImNtNzE3dWt0eTBhNXoybHB0Y3lxODQ4ZTkifQ.ldAx_AdjOu5g_PdBUppRAA';

    mapRef.current = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [12.550343, 55.665957],
      zoom: 8
    });

    new mapboxgl.Marker()
      .setLngLat([12.554729, 55.70651])
      .addTo(mapRef.current);

    new mapboxgl.Marker({ color: 'black', rotation: 45 })
      .setLngLat([12.65147, 55.608166])
      .addTo(mapRef.current);

    return () => mapRef.current;
  }, []);

  return <div id="map" ref={mapContainerRef} style={{ height: '100%' }}></div>;
};

export default MapboxExample;