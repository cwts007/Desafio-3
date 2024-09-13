const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'likeme',
    password: 'CONTRASEÑA', // colocar contraseña de la base de datos...
    port: 5432,
});

// Obtener todos los posts
app.get('/posts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts');
        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener los posts: ", error);
        res.status(500).json({ error: 'Error al obtener los posts' });
    }
});

// Agregar un nuevo post
app.post('/posts', async (req, res) => {
    const { titulo, img, descripcion } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0) RETURNING *',
            [titulo, img, descripcion]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error al crear el post: ", error);
        res.status(500).json({ error: 'Error al crear el post' });
    }
});

// Eliminar un post
app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM posts WHERE id = $1', [id]);
        res.json({ message: 'Post eliminado' });
    } catch (error) {
        console.error("Error al eliminar el post: ", error);
        res.status(500).json({ error: 'Error al eliminar el post' });
    }
});

// Dar like a un post
app.put('/posts/like/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *',
            [id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error al dar like al post: ", error);
        res.status(500).json({ error: 'Error al dar like al post' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
