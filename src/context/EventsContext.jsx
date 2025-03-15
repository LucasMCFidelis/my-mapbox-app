import { createContext, useContext } from "react";

export const EventsContext = createContext(null);

// Hook para usar o contexto mais facilmente
export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents deve ser usado dentro de um EventsProvider");
  }
  return context;
};
