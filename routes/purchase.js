const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchases');


// Create an order/purchase
router.post('/makePurchase',
    purchaseController.makePurchase,
);

// Read all purchases by user
router.post('/', purchaseController.getPurchasesByUser);


module.exports = router;
