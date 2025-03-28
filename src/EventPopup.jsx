const EventPopup = ({
  event
}) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        color: "#333",
        backgroundColor: "white",
        padding: "12px",
        maxWidth: "250px",
        lineHeight: "1.4",
      }}
    >
      <h3
        style={{
          fontWeight: "bold",
          fontSize: "16px",
          marginBottom: "8px",
          color: "#761AB3",
        }}
      >
        {event.eventTitle}
      </h3>

      <p style={{ margin: "5px 0", fontSize: "14px" }}>{event.eventDescription}</p>

      <p
        style={{
          margin: "8px 0",
          fontSize: "13px",
          color: "#555",
        }}
      >
        <strong style={{ color: "#1AB393" }}>Endereço:</strong>{" "}
        {event.eventAddressStreet}, {event.eventAddressNumber}, {event.eventAddressNeighborhood}
      </p>

      <p
        style={{
          margin: "8px 0",
          fontSize: "13px",
          color: "#555",
        }}
      >
        <strong style={{ color: "#1AB393" }}>Data:</strong>{" "}
        {new Date(event.startDateTime).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })}{" "}
        às{" "}
        {new Date(event.startDateTime).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
};

export default EventPopup;
