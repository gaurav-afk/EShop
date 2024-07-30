const express = require("express");
const app = express(); //creates an instance of an Express application (used to define routes, middleware, and other configurations)
const morgan = require("morgan"); // logging requests to your server
const mongoose = require("mongoose"); // used to connect to a MongoDB database
const cors = require("cors");
require("dotenv/config");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handlers");

app.use(cors());
// add.options("*", cors());

const port = process.env.PORT;
const api = process.env.API_URL;

const productsRouter = require("./routers/products");
const categoryRouter = require("./routers/categories");
const userRouter = require("./routers/users");
const orderRouter = require("./routers/orders");
const { Category } = require("./models/category");

//Middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());

// app.use(errorHandler);

//Routers
app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoryRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/orders`, orderRouter);
// app.use(cors());

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("database is connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(port, () => {
  console.log(api);
  console.log(`Server is running on http://localhost:${port}`); // callback, when server starts
});
