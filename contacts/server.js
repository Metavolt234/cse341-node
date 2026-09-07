const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const contactsRoute = require("./routes/contacts");

const app = express();

const PORT = process.env.PORT || 3000;

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Contacts API is running!");
});


async function startServer() {
  try {
    await client.connect();

    const database = client.db("cse341");

    app.locals.db = database;
    app.use("/contacts", contactsRoute);

    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

startServer();