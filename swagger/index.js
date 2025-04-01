const express = require('express');
const { swaggerSpecBackoffice } = require('../swagger/backoffice/swaggerBackoffice');
const { swaggerSpecWebsitesCustomers } = require('../swagger/websites/customers/swaggerCustomers');
const { swaggerSpecWebsitesEcommerce } = require('../swagger/websites/ecommerce/swaggerEcommerce');
const swaggerUi = require('swagger-ui-express');

const router = express.Router();

// Backoffice Swagger
router.use('/backoffice', swaggerUi.serveFiles(swaggerSpecBackoffice), swaggerUi.setup(swaggerSpecBackoffice, {
    swaggerOptions: {
        validatorUrl: null,
    },
}));

router.get('/backoffice.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpecBackoffice); // Envia o JSON gerado pelo swagger-jsdoc
});

// Customers Swagger
router.use('/websites/customers',  swaggerUi.serveFiles(swaggerSpecWebsitesCustomers), swaggerUi.setup(swaggerSpecWebsitesCustomers, {
    swaggerOptions: {
        validatorUrl: null,
    },
}));

router.get('/websites/customers.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpecWebsitesCustomers); // Envia o JSON gerado pelo swagger-jsdoc
});

// Ecommerce Swagger
router.use('/websites/ecommerce',  swaggerUi.serveFiles(swaggerSpecWebsitesEcommerce), swaggerUi.setup(swaggerSpecWebsitesEcommerce, {
    swaggerOptions: {
        validatorUrl: null,
    },
}));

router.get('/websites/ecommerce.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpecWebsitesEcommerce); // Envia o JSON gerado pelo swagger-jsdoc
});

module.exports = router;