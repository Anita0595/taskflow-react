import { useCallback, useState } from "react";

const TOKEN_KEY = "taskflow.todoistToken";
const API_URL = "https://api.todoist.com/api/v1";

const HOW_TO_FIND_TOKEN =
  "El token está en Todoist, en Ajustes → Integraciones → Desarrollador.";

function readToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? "";
  } catch (error) {
    console.warn("No se pudo leer el token guardado.", error);
    return "";
  }
}

function writeToken(token) {
  try {
    if (token === "") {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      localStorage.setItem(TOKEN_KEY, token);
    }
  } catch (error) {
    console.warn("No se pudo guardar el token.", error);
  }
}

export function useTodoist() {
  const [token, setToken] = useState(readToken);
  const [isChecking, setIsChecking] = useState(false);
  const [notice, setNotice] = useState(null);

  const connect = useCallback(async (rawToken) => {
    const cleanToken = rawToken.trim();
    if (cleanToken === "") {
      setNotice({ kind: "error", text: "Pega tu token de Todoist para poder conectar." });
      return;
    }

    setIsChecking(true);
    setNotice(null);
    try {
      const response = await fetch(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${cleanToken}` },
      });

      if (response.status === 401) {
        setNotice({ kind: "error", text: `Ese token no es válido. ${HOW_TO_FIND_TOKEN}` });
        return;
      }
      if (!response.ok) {
        throw new Error(String(response.status));
      }

      setToken(cleanToken);
      writeToken(cleanToken);
      setNotice({ kind: "ok", text: "Conectado con Todoist." });
    } catch (error) {
      console.warn("No se pudo conectar con Todoist.", error);
      setNotice({ kind: "error", text: "No se pudo conectar. Revisa tu conexión a internet." });
    } finally {
      setIsChecking(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setToken("");
    writeToken("");
    setNotice({ kind: "ok", text: "Desconectado. Tus tareas ya no se envían a Todoist." });
  }, []);

  const sendTask = useCallback(
    async (title) => {
      if (token === "") {
        return;
      }
      try {
        const response = await fetch(`${API_URL}/tasks`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: title }),
        });

        if (response.status === 401) {
          setToken("");
          writeToken("");
          setNotice({
            kind: "error",
            text: `Tu token dejó de funcionar. Vuelve a conectarte. ${HOW_TO_FIND_TOKEN}`,
          });
          return;
        }
        if (!response.ok) {
          throw new Error(String(response.status));
        }
        setNotice(null);
      } catch (error) {
        console.warn("No se pudo enviar la tarea a Todoist.", error);
        setNotice({
          kind: "error",
          text: "No se pudo enviar esa tarea a Todoist. La guardé igual en esta lista.",
        });
      }
    },
    [token]
  );

  return {
    isConnected: token !== "",
    isChecking,
    notice,
    connect,
    disconnect,
    sendTask,
  };
}
