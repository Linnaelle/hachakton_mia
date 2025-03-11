const ws = new WebSocket("ws://localhost:5001");

ws.onopen = () => {
  console.log("Connecté au serveur WebSocket");
  
  // Enregistrer l'utilisateur
  ws.send(JSON.stringify({ type: "register", userId: "USER_ID" }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === "notification") {
    console.log("🔔 Nouvelle notification :", data.message);
  }
};

ws.onclose = () => {
  console.log("Connexion WebSocket fermée");
};
