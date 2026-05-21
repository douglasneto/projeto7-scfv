const express = require('express');
const path = require('path');
const PresencaController = require(path.join(__dirname, 'src', 'controllers', 'PresencaController'));

const app = express();
const PORT = 3000;

// Configuração da view engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Middleware para parsear o corpo das requisições POST
app.use(express.urlencoded({ extended: true }));

// ─── ROTAS ────────────────────────────────────────────────────────────────────

// Tela inicial: chamada diária
app.get('/', PresencaController.renderChamada);

// Salvar as presenças do dia
app.post('/registrar', PresencaController.registrarPresenca);

// Relatório de histórico de frequências
app.get('/relatorio', PresencaController.renderRelatorio);

// Tela de cadastro de nova criança
app.get('/cadastro', PresencaController.renderCadastro);

// Salvar nova criança no banco
app.post('/cadastrar', PresencaController.cadastrarCrianca);

// Excluir um registro específico de presença
app.get('/excluir/:id', PresencaController.excluirPresenca);

// ─────────────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅ Servidor SCFV rodando em http://localhost:${PORT}`);
});
