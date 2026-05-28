const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8081;

// --- CONFIGURACIÓN DE SWAGGER
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API REST - CONTROL DE EMPLEADOS',
            version: '1.0.0',
            description: 'API final que administra las altas, bajas, consultas y cambios de empleados.'
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Servidor Local'
            },
            {
                url: '/',
                description: 'Servidor en Producción (Render)'
            }
        ],
    },
    apis: [`${path.join(__dirname, "index.js")}`],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));


// --- "BASE DE DATOS" SIMULADA
let empleados = [
    { id: 1, nombre: "Annete Montoya", puesto: "Alumna" },
    { id: 2, nombre: "Ingrid Hernández", puesto: "Ingeniera" }
];


// --- RUTAS DOCUMENTADAS

/**
 * @swagger
 * components:
 *   schemas:
 *     Empleado:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 3
 *         nombre:
 *           type: string
 *           example: Carlos Pérez
 *         puesto:
 *           type: string
 *           example: Desarrollador Web
 */

/**
 * @swagger
 * /empleado:
 *   get:
 *     summary: Obtener todos los empleados
 *     description: Devuelve un arreglo con todos los empleados registrados.
 *     responses:
 *       200:
 *         description: Lista de empleados obtenida con éxito.
 */
app.get('/empleado', (req, res) => {
    res.json(empleados);
});

/**
 * @swagger
 * /empleado/{id}:
 *   get:
 *     summary: Obtener un empleado por ID
 *     description: Busca y devuelve un único empleado usando su ID de ruta.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado
 *     responses:
 *       200:
 *         description: Empleado encontrado con éxito.
 *       404:
 *         description: Empleado no encontrado.
 */
app.get('/empleado/:id', (req, res) => {
    const empleado = empleados.find(e => e.id === parseInt(req.params.id));

    if (!empleado) {
        return res.status(404).json({
            Error: "Empleado no encontrado"
        });
    }

    res.json(empleado);
});

/**
 * @swagger
 * /empleado:
 *   post:
 *     summary: Dar de alta un nuevo empleado
 *     description: Recibe los datos en el cuerpo (body) y registra un empleado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Empleado'
 *     responses:
 *       201:
 *         description: Empleado registrado exitosamente.
 */
app.post('/empleado', (req, res) => {
    const nuevoEmpleado = {
        id: empleados.length + 1,
        nombre: req.body.nombre,
        puesto: req.body.puesto
    };

    empleados.push(nuevoEmpleado);

    res.status(201).json({
        mensaje: "Empleado creado con éxito",
        empleado: nuevoEmpleado
    });
});

/**
 * @swagger
 * /empleado/{id}:
 *   put:
 *     summary: Modificar un empleado existente
 *     description: Actualiza los datos de un empleado según su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado a modificar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Empleado'
 *     responses:
 *       200:
 *         description: Empleado actualizado con éxito.
 *       404:
 *         description: Empleado no encontrado.
 */
app.put('/empleado/:id', (req, res) => {
    const empleado = empleados.find(
        e => e.id === parseInt(req.params.id)
    );

    if (!empleado) {
        return res.status(404).json({
            Error: "Empleado no encontrado"
        });
    }

    empleado.nombre = req.body.nombre || empleado.nombre;
    empleado.puesto = req.body.puesto || empleado.puesto;

    res.json({
        mensaje: "Empleado actualizado con éxito",
        empleado
    });
});

/**
 * @swagger
 * /empleado/{id}:
 *   delete:
 *     summary: Eliminar un empleado (Baja)
 *     description: Remueve a un empleado del sistema usando su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado a eliminar
 *     responses:
 *       200:
 *         description: Empleado eliminado con éxito.
 *       404:
 *         description: Empleado no encontrado.
 */
app.delete('/empleado/:id', (req, res) => {
    const indice = empleados.findIndex(
        e => e.id === parseInt(req.params.id)
    );

    if (indice === -1) {
        return res.status(404).json({
            Error: "Empleado no encontrado"
        });
    }

    empleados.splice(indice, 1);

    res.json({
        mensaje: "Empleado eliminado correctamente"
    });
});

// --- INICIO DEL SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(
        `Documentación disponible en http://localhost:${PORT}/api-docs`
    );
});