const Event = require('../models/event');

const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const { uploadSingleImage } = require('../middlewares/upload_image');



const uploadEventImage = uploadSingleImage("eventCover");

// Image Processing
const resizeImage = async (req, res, next) => {
    console.log(req.file);
    const filename = `events-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/events/${filename}`);

    // Save image into db
    req.body.eventCover = filename;

    next();
};


const createEvent = async (req, res) => {
    const { user, name, date, location, price, availableTickets, description, eventCover } = req.body;

    try {
        const newEvent = new Event({
            user,
            name,
            date,
            location,
            price,
            availableTickets,
            description,
            eventCover,
        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const deleteEvent = async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        res.status(204).json(deletedEvent);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const updateEvent = async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id, req.body,
            { new: true },
        );
        res.status(200).json(updatedEvent);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getAllEvent = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json({ events: events });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('user');
        if (event) {
            return res.status(200).json({ event: event });
        } else {
            return res.status(404).json({ msg: "this event doesn't exist " });
        }

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    createEvent,
    deleteEvent,
    updateEvent,
    getAllEvent,
    getEventById,
    uploadEventImage,
    resizeImage,
}