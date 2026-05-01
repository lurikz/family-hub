import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Mudali API' });
});

// Auth Routes Placeholder
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === "padilha.ctt@gmail.com" && password === "mp469535") {
    res.json({
      token: "mock-jwt-token",
      user: {
        id: "1",
        nome: "Master Admin",
        email: "padilha.ctt@gmail.com",
        role: "master_admin",
        tenant_id: null
      }
    });
  } else {
    res.status(401).json({ error: "Credenciais inválidas" });
  }
});

app.listen(PORT, () => {
  console.log(`Mudali Backend running on port ${PORT}`);
});
