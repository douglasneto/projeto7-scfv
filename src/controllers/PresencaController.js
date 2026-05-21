const path = require('path');
const db = require(path.join(__dirname, '..', 'config', 'database'));

// Utilitário: encapsula db.all em uma Promise
function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Utilitário: encapsula db.run em uma Promise
function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

const PresencaController = {

  // ─── GET / ──────────────────────────────────────────────────────────────────
  // Renderiza a tela de chamada diária com todas as crianças em ordem alfabética
  async renderChamada(req, res) {
    try {
      const criancas = await dbAll(
        'SELECT * FROM criancas ORDER BY nome ASC'
      );

      // Data atual formatada como AAAA-MM-DD (compatível com input type="date")
      const dataHoje = new Date().toLocaleDateString('sv-SE');

      res.render('index', { criancas, dataHoje });
    } catch (err) {
      console.error('Erro em renderChamada:', err.message);
      res.status(500).send('Erro interno ao carregar a chamada.');
    }
  },

  // ─── POST /registrar ────────────────────────────────────────────────────────
  // Salva os registros de presença/ausência no banco de dados
  async registrarPresenca(req, res) {
    try {
      const { data, presencas } = req.body;

      // presencas é um objeto { crianca_id: 'Presente'|'Ausente', ... }
      if (presencas && typeof presencas === 'object') {
        for (const [criancaId, status] of Object.entries(presencas)) {
          await dbRun(
            'INSERT INTO presencas (crianca_id, data, status) VALUES (?, ?, ?)',
            [criancaId, data, status]
          );
        }
      }

      res.redirect('/relatorio');
    } catch (err) {
      console.error('Erro em registrarPresenca:', err.message);
      res.status(500).send('Erro interno ao salvar presença.');
    }
  },

  // ─── GET /relatorio ─────────────────────────────────────────────────────────
  // Renderiza o histórico completo de frequências
  async renderRelatorio(req, res) {
    try {
      const registros = await dbAll(`
        SELECT
          p.id        AS id,
          c.nome      AS nome,
          p.data      AS data,
          p.status    AS status
        FROM presencas p
        INNER JOIN criancas c ON c.id = p.crianca_id
        ORDER BY p.data DESC, c.nome ASC
      `);

      res.render('relatorio', { registros });
    } catch (err) {
      console.error('Erro em renderRelatorio:', err.message);
      res.status(500).send('Erro interno ao carregar relatório.');
    }
  },

  // ─── GET /cadastro ──────────────────────────────────────────────────────────
  // Renderiza o formulário de cadastro de nova criança
  async renderCadastro(req, res) {
    try {
      res.render('cadastro');
    } catch (err) {
      console.error('Erro em renderCadastro:', err.message);
      res.status(500).send('Erro interno ao carregar cadastro.');
    }
  },

  // ─── POST /cadastrar ────────────────────────────────────────────────────────
  // Salva uma nova criança no banco de dados
  async cadastrarCrianca(req, res) {
    try {
      const { nome, responsavel, telefone } = req.body;

      if (!nome || nome.trim() === '') {
        return res.status(400).send('O nome da criança é obrigatório.');
      }

      await dbRun(
        'INSERT INTO criancas (nome, responsavel, telefone) VALUES (?, ?, ?)',
        [nome.trim(), responsavel ? responsavel.trim() : '', telefone ? telefone.trim() : '']
      );

      res.redirect('/');
    } catch (err) {
      console.error('Erro em cadastrarCrianca:', err.message);
      res.status(500).send('Erro interno ao cadastrar criança.');
    }
  },

  // ─── GET /excluir/:id ───────────────────────────────────────────────────────
  // Exclui um registro específico da tabela de presenças pelo ID
  async excluirPresenca(req, res) {
    try {
      const { id } = req.params;

      await dbRun('DELETE FROM presencas WHERE id = ?', [id]);

      res.redirect('/relatorio');
    } catch (err) {
      console.error('Erro em excluirPresenca:', err.message);
      res.status(500).send('Erro interno ao excluir registro.');
    }
  }

};

module.exports = PresencaController;
