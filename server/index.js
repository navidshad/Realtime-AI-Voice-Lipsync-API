import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
//console.log('Environment:', process.env)

const SERVER_PORT = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production';

// Enable CORS in development
if (!isProduction) {
    app.use(cors());
}

// API endpoints
const apiRouter = express.Router();

// Move all API endpoints to the router
apiRouter.get('/get-token', (req, res) => {
    console.log('Received request for token');
    const token = process.env.API_TOKEN || 'default-token';
    res.json({
        token,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Mount the API router with /api prefix
app.use('/api', apiRouter);

// Debug route to check file system
app.get('/debug', (req, res) => {
    const debugInfo = {
        cwd: process.cwd(),
        dirname: __dirname,
        files: {
            dist: fs.readdirSync(path.join(__dirname, 'dist')),
            public: fs.readdirSync(path.join(__dirname, 'public')),
            root: fs.readdirSync(__dirname)
        }
    };
    res.json(debugInfo);
});

// Serve static files only in production
if (isProduction) {
    const distPath = path.join(__dirname, 'dist');
    const publicPath = path.join(__dirname, 'public');
    
    console.log('Production mode - static file paths:', {
        distPath,
        publicPath,
        exists: {
            dist: fs.existsSync(distPath),
            public: fs.existsSync(publicPath)
        },
        contents: {
            dist: fs.existsSync(distPath) ? fs.readdirSync(distPath) : [],
            public: fs.existsSync(publicPath) ? fs.readdirSync(publicPath) : []
        }
    });
    
    // Serve static files from dist first (since it contains the built files)
    app.use(express.static(distPath));
    app.use(express.static(publicPath));
    
    // Catch-all route to serve index.html in production
    app.get('*', (req, res) => {
        const indexPath = path.join(publicPath, 'index.html');
        console.log('Request for:', req.path);
        console.log('Trying to serve index.html from:', indexPath);
        console.log('Index exists:', fs.existsSync(indexPath));
        
        if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            res.status(404).send('Index file not found. Available files: ' + 
                JSON.stringify({
                    dist: fs.existsSync(distPath) ? fs.readdirSync(distPath) : [],
                    public: fs.existsSync(publicPath) ? fs.readdirSync(publicPath) : []
                }, null, 2)
            );
        }
    });
}

app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
    if (isProduction) {
        console.log('Current directory structure:', {
            cwd: process.cwd(),
            dirname: __dirname,
            files: fs.readdirSync(__dirname)
        });
    }
}); 