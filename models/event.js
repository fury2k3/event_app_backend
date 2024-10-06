const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
        name: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        availableTickets: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
        },
        eventCover: {
            type: String,
        },

    },
    {
        timestamps: true,
    },
);

// return image base Url + image name
const setImageUrl = (doc) => {
    if (doc.eventCover) {
        if (doc.eventCover.startsWith("events")) {
            const imageUrl = `${process.env.BASE_URL}/events/${doc.eventCover}`;
            doc.eventCover = imageUrl;
        }
    }
    return doc;
};

EventSchema.post("init", function (doc) {
    setImageUrl(doc);
});

EventSchema.post("save", function (doc) {
    setImageUrl(doc);
});


module.exports = mongoose.model('Event', EventSchema);
