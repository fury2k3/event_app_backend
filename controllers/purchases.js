const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const path = require("path");

const Purchase = require('../models/Purchase');
const Event = require('../models/event');




const makePurchase = async (req, res) => {
    try {
        const { eventId, tickets, userId } = req.body;

        // Find the event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if there are enough tickets available
        if (event.availableTickets < tickets) {
            return res.status(400).json({ message: 'Not enough tickets available' });
        }

        // Calculate total price
        const totalPrice = event.price * tickets;

        // Create purchase
        const purchase = new Purchase({
            user: userId,
            event: eventId,
            tickets,
            totalPrice,
        });
        await purchase.save();

        // Update event tickets
        event.availableTickets -= tickets;
        await event.save();

        // Generate QR code
        const qrData = `Purchase ID: ${purchase._id}, Event ID: ${eventId}, Tickets: ${tickets}`;
        const qrCodeFileName = `qr_${uuidv4()}.png`;
        const qrCodeDirectory = path.join(__dirname, '..', 'uploads', 'qr-code');
        const qrCodeFilePath = path.join(qrCodeDirectory, qrCodeFileName);



        await QRCode.toFile(qrCodeFilePath, qrData);

        // Save QR code filename to purchase
        purchase.qrCodeUrl = qrCodeFileName;
        await purchase.save();

        res.status(201).json({
            message: 'Purchase created successfully',
            purchase,
            qrCodeUrl: `${process.env.BASE_URL}/qr-code/${qrCodeFileName}`
        });

    } catch (error) {
        res.status(500).json({ message: error.toString() });
    }
};

const getPurchasesByUser = async (req, res) => {
    try {
        const userId = req.body.userId;
        const purchases = await Purchase.find({ user: userId }).populate('event');
        res.status(200).json(purchases);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

module.exports = { makePurchase, getPurchasesByUser };
