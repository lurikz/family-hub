import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const initDb = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS planos (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nome VARCHAR(255) NOT NULL,
      limite_usuarios INTEGER NOT NULL,
      valor_mensal DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tenants (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nome VARCHAR(255) NOT NULL,
      plano_id UUID REFERENCES planos(id),
      ativo BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS usuarios (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nome VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      senha_hash VARCHAR(255) NOT NULL,
      tenant_id UUID REFERENCES tenants(id),
      role VARCHAR(50) DEFAULT 'user',
      pode_ver_financeiro BOOLEAN DEFAULT false,
      ativo BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tarefas (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      titulo VARCHAR(255) NOT NULL,
      descricao TEXT,
      responsavel_id UUID REFERENCES usuarios(id),
      tenant_id UUID REFERENCES tenants(id) NOT NULL,
      data_execucao DATE,
      recorrente BOOLEAN DEFAULT false,
      dias_repeticao INTEGER[],
      status VARCHAR(50) DEFAULT 'pendente',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS listas_compra (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID REFERENCES tenants(id) NOT NULL,
      nome VARCHAR(255) NOT NULL,
      valor_total DECIMAL(10,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS itens_lista (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      lista_id UUID REFERENCES listas_compra(id) ON DELETE CASCADE,
      nome VARCHAR(255) NOT NULL,
      categoria VARCHAR(100),
      concluido BOOLEAN DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS financeiro (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID REFERENCES tenants(id) NOT NULL,
      tipo VARCHAR(20) NOT NULL, -- entrada/saida
      descricao VARCHAR(255) NOT NULL,
      valor DECIMAL(10,2) NOT NULL,
      categoria VARCHAR(100),
      data DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    await query(sql);
    console.log('Banco de dados inicializado com sucesso.');
    
    // Seed Master Admin
    const masterEmail = 'padilha.ctt@gmail.com';
    const checkMaster = await query('SELECT id FROM usuarios WHERE email = $1', [masterEmail]);
    
    if (checkMaster.rows.length === 0) {
      // Password 'mp469535' hashed (mock for now or use bcrypt)
      // In production, use bcrypt.hashSync('mp469535', 10)
      const mockHash = '$2a$10$abcdefghijklmnopqrstuv'; 
      await query(
        'INSERT INTO usuarios (nome, email, senha_hash, role, pode_ver_financeiro) VALUES ($1, $2, $3, $4, $5)',
        ['Master Admin', masterEmail, mockHash, 'master_admin', true]
      );
      console.log('Usuário Master Admin criado.');
    }
  } catch (err) {
    console.error('Erro ao inicializar banco de dados:', err);
  }
};
