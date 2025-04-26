const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const User = require("./user");


const port = 3000; // User model (to be created)

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB (Replace with your local MongoDB URL)
mongoose.connect('mongodb://localhost:27017/maruthi');

app.use(express.static(__dirname + "/public"));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Signup Route
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Error registering user" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "User not found!" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ message: "Incorrect password!" });

  res.json({ message: "Login successful!" });
});
const busBookingSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  from: String,
  to: String,
  date: String,
  seat: String
});

const BusBooking = mongoose.model('BusBooking', busBookingSchema);



const flightBookingSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  departure: String,
  destination: String,
  date: String,
  classType: String,
  passengers: Number
});

const FlightBooking = mongoose.model('FlightBooking', flightBookingSchema);


const trainBookingSchema = new mongoose.Schema({
  departure: String,
  destination: String,
  date: String,
  classType: String,
  passengers: Number,
  email: String
});

const TrainBooking = mongoose.model('TrainBooking', trainBookingSchema);

const carBookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  pickupDate: String,
  dropoffDate: String,
  carType: String
});

const CarBooking = mongoose.model('CarBooking', carBookingSchema);
// API to handle bus bookings
app.post('/bus-booking', async (req, res) => {
  try {
      const newBooking = new BusBooking(req.body);
      await newBooking.save();
      res.status(201).json({ message: 'Bus booking successful!' });
  } catch (error) {
      res.status(500).json({ message: 'Error booking bus', error });
  }
});



app.post('/flight-booking', async (req, res) => {
  try {
      const newFlightBooking = new FlightBooking(req.body);
      await newFlightBooking.save();
      res.json({ message: "Flight booking successful!" });
  } catch (error) {
      res.status(500).json({ message: "Flight booking failed!", error });
  }
});
//train


app.post('/train-booking', async (req, res) => {
  try {
      const { departure, destination, date, classType, passengers, email } = req.body;
      
      if (!departure || !destination || !date || !classType || !passengers || !email) {
          return res.status(400).json({ message: 'All fields are required!' });
      }

      const newBooking = new TrainBooking({ departure, destination, date, classType, passengers, email });
      await newBooking.save();
      res.status(201).json({ message: 'Train booking successful!' });

  } catch (error) {
      console.error('Booking error:', error);
      res.status(500).json({ message: 'Server error! Try again later.' });
  }
});

//train
app.post('/car-booking', async (req, res) => {
  try {
      const { name, email, phone, pickupDate, dropoffDate, carType } = req.body;
      
      if (!name || !email || !phone || !pickupDate || !dropoffDate || !carType) {
          return res.status(400).json({ message: 'All fields are required!' });
      }

      const newBooking = new CarBooking({ name, email, phone, pickupDate, dropoffDate, carType });
      await newBooking.save();

      res.status(201).json({ message: 'Car booking successful!' });
  } catch (error) {
      console.error('Booking error:', error);
      res.status(500).json({ message: 'Server error! Try again later.' });
  }
});



app.get("/", (req, res) => {
  res.send("<h1>Server is Working!</h1>");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


