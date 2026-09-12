import "dotenv/config";
import { createApp } from "./app.js";
import { loadConfig } from "./config.js";

const config = loadConfig();
const app = createApp(config);
const port = Number(process.env.PORT || config.PORT || 8080);
app.listen(port, "0.0.0.0", () => console.log(`AgentGate API listening on http://0.0.0.0:${port}`));
