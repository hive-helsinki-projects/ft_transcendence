const handleWebSocket = (connection, request) => {
    connection.socket.on('message', (message) => {
      console.log('Received:', message);
      connection.socket.send(`Echo: ${message}`);
    });
  };
  
  export default { handleWebSocket };
  