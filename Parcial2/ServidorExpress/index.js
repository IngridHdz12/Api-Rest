const express = require('express');
const app = express();
const PORT = 3000;

app.get('/alumnos', (req, res) => {
    res.status(200).json({
        mensaje: "Datos del alumnos",
        datos: 
            { id: 22100199, nombre: "Ingrid Hernández", carrera: "sistemas"}                    
    });
});




 
app.use((req, res, next) => {
    res.status(404).send('Error');
});

app.use((err, req, res, next) => {
    console.log("Error detectado");
    res.status(500).send('ocurrio un error en el servidor');
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
