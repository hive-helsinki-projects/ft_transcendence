const handleWebSocket = (connection, req) => {
    connection.on('message', (message) => {
      console.log('Received:', message);
      connection.send(`Echo: ${message}`);
    });
  };
  
  export default { handleWebSocket };