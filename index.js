const express = require('express');
const { connection } = require('./Configs/db');
const { BlogRouter } = require('./Routes/server.routes');
const app = express();
app.use(express.json())
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API-DOCS',
            version: '1.0.0',
        },
    },
    apis: ['./Routes*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/", BlogRouter)
app.listen(8080, connection())