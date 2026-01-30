require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors = require("cors");


const { HoldingModel } = require("./models/HoldingModel");
const { PositionModel } = require("./models/PostionModel");
const { OrderModel  }   = require("./models/OrderModel");

const PORT = process.env.PORT || 9000;
const url = process.env.MONGO_URL;

app.use(cors());
app.use(bodyParser.json());


mongoose.connect(url)
        .then(()=> console.log("Database is connected"))
        .catch((e) => console.log(e));


app.get("/allHoldings", async (req, res) => {
         let allHoldings = await HoldingModel.find({});
         res.json(allHoldings);
});
app.get("/allPositions", async (req, res) => {
         let allPositions = await PositionModel.find({});
         res.json(allPositions);
});

app.post("/newOrder", async (req, res) => {
        let newOrder = new OrderModel({
            name: req.body.name,
            price: req.body.price,
            qty: req.body.qty,
            mode: req.body.mode,
        });
});

app.listen(PORT, ()=> {
    console.log("Server is listening to port 8080");

});