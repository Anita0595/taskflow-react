import { useState } from "react";

export default function TodoistPanel({ isConnected, isChecking, notice, onConnect, onDisconnect }) {
  const [draftToken, setDraftToken] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onConnect(draftToken);
    setDraftToken("");
  }

  return (
    <section className="todoist">
      <h2>Enviar a Todoist</h2>

      {isConnected ? (
        <div className="todoist-row">
          <p className="todoist-state">Conectado. Cada tarea nueva se envía a Todoist.</p>
          <button type="button" className="secondary" onClick={onDisconnect}>
            Desconectar
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={draftToken}
            onChange={(event) => setDraftToken(event.target.value)}
            placeholder="Pega aquí tu token de Todoist"
            autoComplete="off"
          />
          <button type="submit" disabled={isChecking}>
            {isChecking ? "Conectando..." : "Conectar"}
          </button>
        </form>
      )}

      {notice && (
        <p className={notice.kind === "error" ? "todoist-notice error" : "todoist-notice"}>
          {notice.text}
        </p>
      )}
    </section>
  );
}
