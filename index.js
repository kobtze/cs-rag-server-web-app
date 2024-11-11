const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const rateLimit = require('express-rate-limit');
const { openAIProcess } = require('./openai');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 25,
  standardHeaders: false,
  legacyHeaders: false
});

// Apply the rate limiter to all requests
app.use(limiter);

const pool = new Pool({
  user: process.env.TIMESCALEDB_USER,
  host: process.env.TIMESCALEDB_HOST,
  database: process.env.TIMESCALEDB_DB,
  password: process.env.TIMESCALEDB_PASSWORD,
  port: process.env.TIMESCALEDB_PORT
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error connecting to the database', err.stack);
  }
  console.log('Connected to PostgreSQL database');
  release();
});

app.get('/', (req, res) => {
  res
      .status(200)
      .send(`Hello ${process.env.HELLO}!`)
})

app.post('/api/v1/query', async (req, res) => {
  try {
    // Validate request
    const userQuery = req.body?.query;
    if (!userQuery) {
      res.status(400).json({ error: 'Invalid schema' });
      return;
    }
    // Semantic search on past customer tickets
    const dbResult = await pool.query(`
      SELECT chunk,
         t.body,
         t.answer,
         ts.embedding <=> ai.openai_embed('text-embedding-3-small', $1) as distance
      FROM helpdesk_customer_tickets_embedding_store AS ts
        LEFT JOIN helpdesk_customer_tickets AS t
      ON ts.id = t.id
      ORDER BY distance
        LIMIT 1;
    `,
    [userQuery]);
    const retrievedDoc = dbResult.rows[0];

    const llmResponse = await openAIProcess({userQuery, retrievedDocument: retrievedDoc});

    res.json({
      success: true,
      userQuery: userQuery,
      retrievedDoc: retrievedDoc,
      suggestedResponse: llmResponse
    });
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).json({ error: 'An error occurred while processing request' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
