const mongoose = require("mongoose");
const { model } = require("mongoose");
const { HoldingSchema } =require("../schemas/HoldingSchema");

const HoldingModel = new model("Holding", HoldingSchema);

module.exports = {HoldingModel};