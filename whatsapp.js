const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

class Whatsapp {
    client;
    qr;
    status;

    /**
     * Constructor
     * 
     * @returns {void}
     * @memberof Whatsapp
     * 
    */
    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth(),
        });
        this.qr = '';
        this.status = 'pending';

        // Event handler untuk QR code
        this.client.on('qr', (qr) => {
            qrcode.generate(qr, { small: true });
            this.qr = qr;
        });

        // Event handler ketika klien siap
        this.client.on('ready', () => {
            console.log('Client is ready!');
            this.status = 'ready';
        });

        // Event handler untuk error
        this.client.on('error', (error) => {
            console.error('Error pada client:', error);
            this.status = 'error'; // Menandai status sebagai error
        });
    }

    /**
     * Start
     * 
     * @returns {void}
     * @memberof Whatsapp
     * 
    */
    start() {
        this.client.initialize();
    }

    /**
     * Get QR
     * 
     * @returns {string}
     * @memberof Whatsapp
     * 
    */
    getQR() {
        return this.qr;
    }

    /**
     * Get Status
     * 
     * @returns {string}
     * @memberof Whatsapp
     * 
    */
    getStatus() {
        return this.status;
    }

    /**
     * Format Phone Number
     * 
     * @param {string} number
     * @returns {string}
     * @memberof Whatsapp
     * 
    */
    formatPhoneNumber(number) {
        let formattedPhone = number.replace(/[^0-9]/g, ''); // Menghapus karakter non-numerik
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '62' + formattedPhone.substr(1); // Mengganti 0 dengan kode negara Indonesia
        }
        return formattedPhone;
    }

    /**
     * Send Message
     * 
     * @param {string} number
     * @param {string} message
     * @returns {void}
     * @memberof Whatsapp
     * 
    */
    sendMessage(number, message) {
        const formattedNumber = this.formatPhoneNumber(number); // Format nomor
        const chatId = `${formattedNumber}@c.us`; // Membuat ID chat
    
        this.client.sendMessage(chatId, message)
            .then(response => {
                console.log('Pesan berhasil dikirim:', response);
            })
            .catch(err => {
                console.error('Gagal mengirim pesan:', err);
            });
    }
}

module.exports = Whatsapp;
