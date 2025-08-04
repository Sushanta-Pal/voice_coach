// server.js
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import 'dotenv/config';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const { Pool } = pg;

// FIX: Added the ssl configuration object required by Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log('✅ Connected to db'))
  .catch(err => console.error('❌ Database connection error', err.stack));

// Fetch user data
app.get('/api/user/:email', async (req, res) => {
  const { email } = req.params;
  console.log(`[Backend] ➡️ Received request for email: ${email}`); 

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    console.log(`[Backend] 🔍 Database query found ${rows.length} user(s).`);

    if (rows.length === 0) {
      const newUserResponse = {
        username: 'New User',
        email,
        all_sessions_details: [],
        avg_score: 0,
      };
      console.log('[Backend] 📤 Sending new user data:', newUserResponse);
      return res.json(newUserResponse);
    }
    
    console.log('[Backend] 📤 Sending existing user data:', rows[0]);
    res.json(rows[0]);

  } catch (err) {
    console.error('❌ [Backend] Error during /api/user/:email:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new session
app.post('/api/session', async (req, res) => {
  const { username, email, session } = req.body;

  try {
    const { rows: userRows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userRows.length === 0) {
      // User does not exist, create new user
      const newAvgScore = session.score;
      await pool.query(
        'INSERT INTO users (username, email, all_sessions_details, avg_score) VALUES ($1, $2, $3, $4)',
        [username, email, JSON.stringify([session]), newAvgScore]
      );
    } else {
      // User exists, update sessions and average score
      const existingSessions = userRows[0].all_sessions_details || [];
      const updatedSessions = [...existingSessions, session];
      const newAvgScore = updatedSessions.reduce((acc, s) => acc + s.score, 0) / updatedSessions.length;

      await pool.query(
        'UPDATE users SET all_sessions_details = $1, avg_score = $2 WHERE email = $3',
        [JSON.stringify(updatedSessions), newAvgScore, email]
      );
    }
    res.status(200).json({ message: 'Session saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


// ### **Next Steps**

// 1.  **Replace the Code**: Copy the code from the document above and paste it into your `server.js` file, replacing everything that's currently there.
// 2.  **Restart Your Server**: Stop your application (press `Ctrl + C` in the terminal) and start it again using `npm run dev`.

// This will fix the database connection issue, which will stop your server from crashing and allow your dashboard to fetch and display the data correct