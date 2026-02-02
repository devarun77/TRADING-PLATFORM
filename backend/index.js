require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");


const { HoldingModel } = require("./models/HoldingModel");
const { PositionModel } = require("./models/PostionModel");
const { OrderModel  }   = require("./models/OrderModel");
const    UserModel = require("./models/UserModel");

//middlewares
const {createSecretToken } = require("./utils/SecretToken");
const {userVerification  } = require("./utils/AuthMiddleware");

const PORT = process.env.PORT || 9000;
const url = process.env.MONGO_URL;

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());


mongoose.connect(url)
        .then(()=> console.log("Database is connected"))
        .catch((e) => console.log(e));

app.post("/signup", async (req, res, next) => {

    try{
        const {email, password, username, createdAt} = req.body;
        const exitingUser =  await UserModel.findOne({email});
        if(exitingUser) {
            return res.json({message:"User already exists" });
        }

        const user = await UserModel.create({email, password, username, createdAt});
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
    res
        .status(201)
        .json({
            message:"User Signed in successfully", 
            success: true,
            user,
            });
        next();
    } catch(e) {
        console.log(e);
    };

});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
      });
    }

    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // set true in production (HTTPS)
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});


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