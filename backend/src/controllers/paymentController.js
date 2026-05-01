const crypto = require('crypto');
const Order = require('../models/Order');

const generateJazzCashHash = (params) => {
  const sorted = Object.keys(params)
    .filter((k) => k.startsWith('pp_') && params[k] !== '')
    .sort()
    .map((k) => params[k])
    .join('&');
  const dataToHash = `${process.env.JAZZCASH_INTEGRITY_SALT}&${sorted}`;
  return crypto
    .createHmac('sha256', process.env.JAZZCASH_INTEGRITY_SALT)
    .update(dataToHash)
    .digest('hex')
    .toUpperCase();
};

// POST /api/v1/payments/jazzcash/initiate
exports.initiateJazzCash = async (req, res, next) => {
  try {
    const { orderId, amount } = req.body;
    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const expiry = new Date(now.getTime() + 3600000);
    const expiryStr = `${expiry.getFullYear()}${pad(expiry.getMonth() + 1)}${pad(expiry.getDate())}${pad(expiry.getHours())}${pad(expiry.getMinutes())}${pad(expiry.getSeconds())}`;

    const params = {
      pp_Version: '1.1',
      pp_TxnType: 'MWALLET',
      pp_Language: 'EN',
      pp_MerchantID: process.env.JAZZCASH_MERCHANT_ID,
      pp_SubMerchantID: '',
      pp_Password: process.env.JAZZCASH_PASSWORD,
      pp_BankID: 'TBANK',
      pp_ProductID: 'RETL',
      pp_TxnRefNo: `T${dateStr}`,
      pp_Amount: String(Math.round(amount * 100)),
      pp_TxnCurrency: 'PKR',
      pp_TxnDateTime: dateStr,
      pp_BillReference: order.orderId,
      pp_Description: `KAARVAN Order ${order.orderId}`,
      pp_TxnExpiryDateTime: expiryStr,
      pp_ReturnURL: process.env.JAZZCASH_RETURN_URL,
      pp_SecureHash: '',
    };
    params.pp_SecureHash = generateJazzCashHash(params);

    res.json({ success: true, data: { postUrl: process.env.JAZZCASH_API_URL, params } });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/payments/jazzcash/callback
exports.jazzCashCallback = async (req, res, next) => {
  try {
    const data = req.body;
    const received = data.pp_SecureHash;
    const copy = { ...data };
    delete copy.pp_SecureHash;

    if (received !== generateJazzCashHash(copy)) {
      return res.redirect(`${process.env.CLIENT_URL}/checkout?payment=failed`);
    }

    const order = await Order.findOne({ orderId: data.pp_BillReference });
    if (order) {
      order.paymentStatus = data.pp_ResponseCode === '000' ? 'paid' : 'failed';
      if (data.pp_ResponseCode === '000') {
        order.jazzCashTransactionId = data.pp_TxnRefNo;
        order.orderStatus = 'confirmed';
      }
      await order.save();
    }

    return data.pp_ResponseCode === '000'
      ? res.redirect(`${process.env.CLIENT_URL}/order-success/${data.pp_BillReference}`)
      : res.redirect(`${process.env.CLIENT_URL}/checkout?payment=failed`);
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/payments/jazzcash/verify/:txnId
exports.verifyTransaction = async (req, res, next) => {
  try {
    const order = await Order.findOne({ jazzCashTransactionId: req.params.txnId });
    if (!order) return res.status(404).json({ success: false, message: 'Transaction not found' });
    res.json({ success: true, data: { paymentStatus: order.paymentStatus, order } });
  } catch (err) {
    next(err);
  }
};
