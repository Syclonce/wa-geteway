const express = require('express');
const Whatsapp = require('./whatsapp');
const app = express();
const port = 3000;

let whatsapp = null;

app.get('/', (req, res) => {
    // Inisialisasi objek Whatsapp hanya sekali
    if (!whatsapp) {
        whatsapp = new Whatsapp();
        whatsapp.start();
        res.send('WhatsApp client started');
    } else {
        res.send('WhatsApp client is already running');
    }
});

app.get('/send', (req, res) => {
    const status = whatsapp ? whatsapp.getStatus() : 'not initialized';

    if (status !== 'ready') {
        return res.send('WhatsApp is not ready yet. Please try again later.');
    }

    res.send(`
        <form action="/send-message" method="get">
            <input type="text" name="number" placeholder="Number" required>
            <input type="text" name="message" placeholder="Message" required>
            <button type="submit">Send</button>
        </form>
    `);
});

app.get('/send-message', (req, res) => {
    const number = req.query.number;
    const message = req.query.message;

    if (!number || !message) {
        return res.send('Invalid number or message');
    }

    // Cek status sebelum mengirim pesan
    const status = whatsapp.getStatus();
    if (status !== 'ready') {
        return res.send('WhatsApp is not ready to send messages. Please try again later.');
    }

    whatsapp.sendMessage(number, message);
    res.send(`Sending message to ${number}: ${message}`);
});

app.get('/qr', (req, res) => {
    const qrCode = whatsapp.getQR();
    if (qrCode) {
        res.send(`<img src="data:image/png;base64,${qrCode}"/>`);
    } else {
        res.send('QR code is not available yet. Please wait.');
    }
});

app.get('/status', (req, res) => {
    const status = whatsapp ? whatsapp.getStatus() : 'not initialized';
    res.send(`WhatsApp status: ${status}`);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
