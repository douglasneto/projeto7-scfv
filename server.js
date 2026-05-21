const express = require('express');
const path = require('path');
const PresencaController = require(path.join(__dirname, 'src', 'controllers', 'PresencaController'));

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(express.urlencoded({ extended: true }));

app.get('/', PresencaController.renderChamada);
app.post('/registrar', PresencaController.registrarPresenca);
app.get('/relatorio', PresencaController.renderRelatorio);
app.get('/cadastro', PresencaController.renderCadastro);
app.post('/cadastrar', PresencaController.cadastrarCrianca);
app.get('/excluir/:id', PresencaController.excluirPresenca);

app.listen(PORT, () => {
  console.log('Servidor SCFV rodando em http://localhost:' + PORT);
});
