const axios = require("axios");
const crypto = require("crypto");

const TRIPAY_API_KEY = "DEV-GthPuRVHb2xy3ifSz1HaLKo8p69XcjxAVdf44FCY";
const TRIPAY_PRIVATE_KEY = "UtikJ-7QQCh-K1Rsy-Vi4Jm-u5ugP";
const TRIPAY_MERCHANT_CODE = "T42915";

const createQRIS = async (orderId, amount) => {
  if (!orderId || !amount || isNaN(amount)) {
    throw new Error("Invalid orderId or amount");
  }

  const merchantRef = `ORDER-${orderId}-${Date.now()}`;
  const roundedAmount = Math.round(amount);

  const signature = crypto
    .createHmac("sha256", TRIPAY_PRIVATE_KEY)
    .update(TRIPAY_MERCHANT_CODE + merchantRef + roundedAmount)
    .digest("hex");

  const data = {
    method: "QRIS",
    merchant_ref: merchantRef,
    amount: roundedAmount,
    customer_name: "Customer",
    customer_email: "tajulmunandar701@email.com",
    order_items: [
      {
        sku: "SKU-001",
        name: "Pembayaran Order",
        price: roundedAmount,
        quantity: 1,
      },
    ],
    callback_url: `http://192.168.100.226:3000/api/payment/payment/${orderId}`,
    return_url: `http://192.168.100.226:3000/api/payment/payment/${orderId}`,
    expired_time: Math.floor(Date.now() / 1000) + 60 * 60,
    signature: signature,
  };

  const response = await axios.post(
    "https://tripay.co.id/api-sandbox/transaction/create",
    data,
    {
      headers: {
        Authorization: `Bearer ${TRIPAY_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const qrUrl = response.data?.data?.qr_url;

  if (!qrUrl) {
    throw new Error("QR URL not found in Tripay response.");
  }

  return qrUrl;
};

module.exports = { createQRIS };
