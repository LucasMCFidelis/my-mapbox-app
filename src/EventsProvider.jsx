import { EventsContext } from "./context/EventsContext";
import { useQueries } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import axios from "axios";

const EVENT_SERVICE_URL = import.meta.env.VITE_EVENT_SERVICE_URL;

export const EventsProvider = ({ children }) => {
  const fetchData = async (endpoint) => {
    try {
      const response = await axios.get(`${EVENT_SERVICE_URL}/${endpoint}`);
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao buscar ${endpoint}: ` + error.message);
    }
  };

  const results = useQueries({
    queries: [
      { queryKey: ["events"], queryFn: () => fetchData("events") },
      { queryKey: ["organizers"], queryFn: () => fetchData("events-organizers") },
      { queryKey: ["categories"], queryFn: () => fetchData("events-categories") },
    ],
  });

  const [eventsResult, organizersResult, categoriesResult] = results;

  const events = eventsResult.data;
  const isLoadingEvents = eventsResult.isLoading;
  const isErrorEvents = eventsResult.isError;
  const errorEvents = eventsResult.error;

  const organizers = organizersResult.data;
  const categories = categoriesResult.data;

  const now = new Date().toISOString();
  const filteredEvents = useMemo(() => {
    return events?.filter(({ endDateTime, startDateTime }) => (endDateTime || startDateTime) > now) || [];
  }, [events, now]);

  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <EventsContext.Provider
      value={{
        filteredEvents,
        isLoadingEvents,
        isErrorEvents,
        errorEvents,
        organizers,
        categories,
        selectedEvent,
        setSelectedEvent,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};
