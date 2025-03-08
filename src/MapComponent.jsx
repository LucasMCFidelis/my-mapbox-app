import { useQuery } from "@tanstack/react-query";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios"; // Importando o axios

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const EVENT_SERVICE_URL = import.meta.env.VITE_EVENT_SERVICE_URL;

const MapComponent = () => {
  // Função para buscar os eventos
  const fetchEvents = async () => {
    try {
      const response = await axios.get(EVENT_SERVICE_URL);
      return response.data; // Retorna os dados diretamente
    } catch (error) {
      throw new Error("Erro ao buscar eventos: " + error.message); // Lança um erro se houver falha na requisição
    }
  };

  // Utilizando useQuery para gerenciar a consulta
  const {
    data: events,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["events"], // A chave única para a consulta
    queryFn: fetchEvents, // Função de busca dos eventos
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

  // Definição dos limites para João Pessoa
  const bounds = [
    [-34.95, -7.25], // Coordenadas sudoeste (SW)
    [-34.75, -7.00], // Coordenadas nordeste (NE)
  ];

  return (
    <div className="h-screen w-full">
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: -34.861, // Atualizado para João Pessoa
          latitude: -7.115, // Atualizado para João Pessoa
          zoom: 12, // Ajustado o zoom para a cidade
        }}
        style={{ width: "100%", height: "500px" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        maxBounds={bounds} // Restringe o movimento dentro desses limites
        minZoom={10} // Impede que o usuário afaste muito o zoom
      >
        {/* Renderiza os marcadores para cada evento */}
        {events && events.length > 0 ? (
          events.map((event) => (
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
