const express = require('express');
const { swaggerSpecBackoffice } = require('../swagger/backoffice/swaggerBackoffice');
const { swaggerSpecWebsitesCustomers } = require('../swagger/websites/customers/swaggerCustomers');
const { swaggerSpecWebsitesEcommerce } = require('../swagger/websites/ecommerce/swaggerEcommerce');
const swaggerUi = require('swagger-ui-express');
const { swaggerAccessMiddleware} = require('../src/middleware/auth');

const router = express.Router();

// Backoffice Swagger
router.use('/backoffice', swaggerAccessMiddleware, swaggerUi.serveFiles(swaggerSpecBackoffice), swaggerUi.setup(swaggerSpecBackoffice, {
    swaggerOptions: {
        validatorUrl: null,
    },
}));

router.get('/backoffice.json', swaggerAccessMiddleware, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpecBackoffice); // Envia o JSON gerado pelo swagger-jsdoc
});

// Customers Swagger
router.use('/websites/customers', swaggerAccessMiddleware, swaggerUi.serveFiles(swaggerSpecWebsitesCustomers), swaggerUi.setup(swaggerSpecWebsitesCustomers, {
    swaggerOptions: {
        validatorUrl: null,
    },
}));

router.get('/websites/customers.json',  swaggerAccessMiddleware, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpecWebsitesCustomers); // Envia o JSON gerado pelo swagger-jsdoc
});

// Ecommerce Swagger
router.use('/websites/ecommerce',  swaggerAccessMiddleware, swaggerUi.serveFiles(swaggerSpecWebsitesEcommerce), swaggerUi.setup(swaggerSpecWebsitesEcommerce, {
    swaggerOptions: {
        validatorUrl: null,
    },
}));

router.get('/websites/ecommerce.json', swaggerAccessMiddleware,  (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpecWebsitesEcommerce); // Envia o JSON gerado pelo swagger-jsdoc
});

module.exports = router;