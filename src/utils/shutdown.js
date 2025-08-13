const shutdown = (server, closeConnection) => {
  console.log("Kill signal received: closing HTTP server");
  server.close(async () => {
    console.log("HTTP server closed");
    await closeConnection();
    process.exit(0);
  });
};

module.exports = shutdown;
