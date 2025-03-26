import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";

import lipsyncRouter from "./lipsinc.js";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
//console.log('Environment:', process.env)

const SERVER_PORT = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === "production";

// Enable CORS in development
if (!isProduction) {
  app.use(cors());
}

// API endpoints
const apiRouter = express.Router();

// Move all API endpoints to the router
apiRouter.get("/get-token", async (req, res) => {
  try {
    const { data } = req.query;

    const additionalSetup = JSON.parse(
      Buffer.from(data, "base64").toString("utf-8")
    );

    const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-realtime-preview",
        temperature: 0.6,
        input_audio_transcription: {
          model: "whisper-1",
        },
        ...additionalSetup,
      }),
    });

    if (r.status < 200 || r.status >= 299) {
      const body = await r.json();
      console.error("Failed to create the live session", body);
      return res.status(r.status).json({
        error: `Failed to create the live session, Openai status: ${r.status}`,
      });
    }

    const ephemeralToken = await r.json();
    res.json(ephemeralToken);
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ error: "Failed to create the live session" });
  }
});

// Mount the API router with /api prefix
app.use("/api", apiRouter);
app.use("/lipsinc", lipsyncRouter);

// Debug route to check file system
app.get("/debug", (req, res) => {
  const debugInfo = {
    cwd: process.cwd(),
    dirname: __dirname,
    files: {
      dist: fs.readdirSync(path.join(__dirname, "dist")),
      public: fs.readdirSync(path.join(__dirname, "public")),
      root: fs.readdirSync(__dirname),
    },
  };
  res.json(debugInfo);
});

// Serve static files only in production
if (isProduction) {
  const distPath = path.join(__dirname, "dist");
  const publicPath = path.join(__dirname, "public");

  console.log("Production mode - static file paths:", {
    distPath,
    publicPath,
    exists: {
      dist: fs.existsSync(distPath),
      public: fs.existsSync(publicPath),
    },
    contents: {
      dist: fs.existsSync(distPath) ? fs.readdirSync(distPath) : [],
      public: fs.existsSync(publicPath) ? fs.readdirSync(publicPath) : [],
    },
  });

  // Serve static files from dist first (since it contains the built files)
  app.use(express.static(distPath));
  app.use(express.static(publicPath));

  // Catch-all route to serve index.html in production
  app.get("*", (req, res) => {
    const indexPath = path.join(publicPath, "index.html");
    console.log("Request for:", req.path);
    console.log("Trying to serve index.html from:", indexPath);
    console.log("Index exists:", fs.existsSync(indexPath));

    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send(
        "Index file not found. Available files: " +
          JSON.stringify(
            {
              dist: fs.existsSync(distPath) ? fs.readdirSync(distPath) : [],
              public: fs.existsSync(publicPath)
                ? fs.readdirSync(publicPath)
                : [],
            },
            null,
            2
          )
      );
    }
  });
}

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}`);
  if (isProduction) {
    console.log("Current directory structure:", {
      cwd: process.cwd(),
      dirname: __dirname,
      files: fs.readdirSync(__dirname),
    });
  }
});
