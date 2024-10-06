const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    event: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
        required: true,
    },
    tickets: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
    qrCodeUrl: {
        type: String,
    }
});

// return image base Url + image name
const setImageUrl = (doc) => {
    if (doc.qrCodeUrl) {
        if (doc.qrCodeUrl.startsWith("qr_")) {
            const imageUrl = `${process.env.BASE_URL}/qr-code/${doc.qrCodeUrl}`;
            doc.qrCodeUrl = imageUrl;
        }
    }
    return doc;
};

PurchaseSchema.post("init", function (doc) {
    setImageUrl(doc);
});

PurchaseSchema.post("save", function (doc) {
    setImageUrl(doc);
});


module.exports = mongoose.model('Purchase', PurchaseSchema);
