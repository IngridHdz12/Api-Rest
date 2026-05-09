const express = require('express');
const app = express();
const port = 3000;

app.get('/mensaje', (req, res) => {
  res.json({
    estado: "Exitoso",
    mensaje: "Servidor Express listo para el Parcial 2",
    alumno: "Ingrid Annete Hernández Montoya"
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});