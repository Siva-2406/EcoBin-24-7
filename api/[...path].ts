import express from 'express';
import { apiRouter } from '../server/routes/api.js';

const app = express();

app.use(express.json());

// The catch-all Vercel function receives requests under /api/*.
// Mount the existing API router at the root of this function.
app.use(apiRouter);

export default app;
