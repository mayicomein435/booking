const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

let rooms = [];
let bookings = [];
let bookingId = 1;

// Create a room
app.post('/rooms', (req, res) => {
    const { numberOfSeats, amenities, pricePerHour } = req.body;
    const newRoom = {
        id: rooms.length + 1,
        numberOfSeats,
        amenities,
        pricePerHour,
        bookings: []
    };
    rooms.push(newRoom);
    res.status(201).json(newRoom);
});

// Book a room
app.post('/bookings', (req, res) => {
    const { customerName, date, startTime, endTime, roomId } = req.body;
    const room = rooms.find(r => r.id === roomId);
    if (!room) {
        return res.status(404).json({ error: 'Room not found' });
    }

    const newBooking = {
        bookingId: bookingId++,
        customerName,
        date,
        startTime,
        endTime,
        roomId,
        bookingDate: new Date(),
        bookingStatus: 'confirmed'
    };

    room.bookings.push(newBooking);
    bookings.push(newBooking);
    res.status(201).json(newBooking);
});

// List all rooms with booked data
app.get('/rooms', (req, res) => {
    const roomData = rooms.map(room => ({
        roomName: room.id,
        bookedStatus: room.bookings.length > 0 ? 'Booked' : 'Available',
        bookings: room.bookings.map(booking => ({
            customerName: booking.customerName,
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime
        }))
    }));
    res.json(roomData);
});

// List all customers with booked data
app.get('/customers', (req, res) => {
    const customerData = bookings.map(booking => ({
        customerName: booking.customerName,
        roomName: booking.roomId,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime
    }));
    res.json(customerData);
});

// List how many times a customer has booked the room
app.get('/customer-bookings/:customerName', (req, res) => {
    const { customerName } = req.params;
    const customerBookings = bookings.filter(booking => booking.customerName === customerName);
    const bookingData = customerBookings.map(booking => ({
        customerName: booking.customerName,
        roomName: booking.roomId,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        bookingId: booking.bookingId,
        bookingDate: booking.bookingDate,
        bookingStatus: booking.bookingStatus
    }));
    res.json(bookingData);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
