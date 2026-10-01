const express = require('express');
const axios = require('axios');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/buscar', async (req, res) => {
    // Si no mandan 'q', usamos 'tortilla' por defecto como en tu primer ejemplo
    const terminoBusqueda = req.query.q || 'tortilla';

    try {
        // URL real de la PNT con los parámetros correctos
        const urlPNT = `https://buscador.plataformadetransparencia.org.mx/bkobligaciones/api/v1/facetas?q=${encodeURIComponent(terminoBusqueda)}&sistema=todos&exacta=true`;

        const respuestaPNT = await axios.get(urlPNT, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept': 'application/json'
            }
        });

        res.json({
            exito: true,
            resultados: respuestaPNT.data
        });

    } catch (error) {
        console.error('Error al conectar con la PNT:', error.message);
        res.status(500).json({ 
            exito: false, 
            error: 'No se pudo obtener la información de la Plataforma Nacional de Transparencia.',
            detalle: error.message 
        });
    }
});

// Exportamos la app envuelta en serverless para que Netlify la ejecute como función
module.exports.handler = serverless(app);
