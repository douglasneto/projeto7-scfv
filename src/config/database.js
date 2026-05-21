const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// O arquivo .sqlite é criado na raiz do projeto (dois níveis acima de src/config/)
const DB_PATH = path.join(__dirname, '..', '..', 'database.sqlite');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('✅ Banco de dados SQLite conectado em:', DB_PATH);
  }
});

// Garante que as tabelas existam ao iniciar a aplicação
db.serialize(() => {
  // Tabela de crianças cadastradas
  db.run(`
    CREATE TABLE IF NOT EXISTS criancas (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      nome      TEXT    NOT NULL,
      responsavel TEXT,
      telefone  TEXT
    )
  `, (err) => {
    if (err) {
      console.error('❌ Erro ao criar tabela "criancas":', err.message);
    } else {
      console.log('✅ Tabela "criancas" pronta.');
    }
  });

  // Tabela de registros diários de presença
  db.run(`
    CREATE TABLE IF NOT EXISTS presencas (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      crianca_id INTEGER NOT NULL,
      data       TEXT    NOT NULL,
      status     TEXT    NOT NULL,
      FOREIGN KEY (crianca_id) REFERENCES criancas(id)
    )
  `, (err) => {
    if (err) {
      console.error('❌ Erro ao criar tabela "presencas":', err.message);
    } else {
      console.log('✅ Tabela "presencas" pronta.');
    }
  });
});

module.exports = db;
