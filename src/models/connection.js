const mongoose = require("mongoose");

const connectionString = process.env.DB_URL;
mongoose
  .connect(connectionString)
  .then(() => console.log("Database connected"))
  .catch((error) => console.error(error));
