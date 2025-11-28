require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(cors()); 
app.use(express.json()); 

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);


app.get('/api/pontos', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: 'Email é obrigatório para listar.' });
    }

    const { data, error } = await supabase
        .from('registros_ponto')
        .select('*')
        .eq('usuario_email', email)
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/pontos', async (req, res) => {
    const { usuario_email, usuario_nome, tipo, observacao } = req.body;

    if (!usuario_email || !tipo) {
        return res.status(400).json({ error: 'Email e Tipo são obrigatórios.' });
    }

    const { data, error } = await supabase
        .from('registros_ponto')
        .insert([
            { usuario_email, usuario_nome, tipo, observacao }
        ])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data[0]);
});

app.put('/api/pontos/:id', async (req, res) => {
    const { id } = req.params;
    const { observacao, tipo } = req.body;

    const { data, error } = await supabase
        .from('registros_ponto')
        .update({ observacao, tipo })
        .eq('id', id)
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.delete('/api/pontos/:id', async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase
        .from('registros_ponto')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Registro excluído com sucesso.' });
});

app.get('/', (req, res) => {
    res.send('API do Sistema de Ponto rodando!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});