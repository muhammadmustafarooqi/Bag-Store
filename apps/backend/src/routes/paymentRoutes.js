const express = require('express');
const router = express.Router();
const { initiateJazzCash, jazzCashCallback, verifyTransaction } = require('../controllers/paymentController');

router.post('/jazzcash/initiate', initiateJazzCash);
router.post('/jazzcash/callback', jazzCashCallback);
router.get('/jazzcash/verify/:txnId', verifyTransaction);

module.exports = router;
