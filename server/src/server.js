const http = require("http");

const app = require("./app");
const { loadPlanetsData } = require("./models/planets.model");
const { start } = require("repl");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
  });
}

startServer();
