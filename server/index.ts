import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  // In Vercel, __dirname points to the dist folder, so we need to look for public there
  const staticPath = path.resolve(__dirname, "public");
  
  // Fallback to alternative paths if the primary path doesn't exist
  const fallbackPath = path.resolve(__dirname, "..", "dist", "public");
  const finalPath = require('fs').existsSync(staticPath) ? staticPath : fallbackPath;

  app.use(express.static(finalPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(finalPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
