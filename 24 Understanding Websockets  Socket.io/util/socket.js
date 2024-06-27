const { Server } = require("socket.io");
let io;

module.exports = {
  init: (httpServer) => {
    io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:3000",
      },
    });
    return io.listen(4000);
  },

  getIo: () => {
    if (!io) {
      throw new Error("socket.io is not initialized");
    }
    return io;
  },
};
