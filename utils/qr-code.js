const QRCode = require("qrcode");

const generateQRCode = async (orderId) => {
  const url = `http://192.168.100.226:3000/api/payment/payment/${orderId}`;
  const qrCode = await QRCode.toDataURL(url);
  return qrCode;
};

module.exports = { generateQRCode };
