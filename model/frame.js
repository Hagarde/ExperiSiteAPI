import mongoose from "mongoose";
import { population } from "../parameter.js";

const frameSchema = new mongoose.Schema({
    epidemie : {type : mongoose.Schema.Types.ObjectId, ref : "Epidemie"},
    experience : { type : mongoose.Schema.Types.ObjectId,ref : "Experience", required : true }, 
    t : { type: Number, required : true, default:0}, 

    population: {
        type: Number,
        default : population
      },
      S1: {
        type: Number,
        default: 0,
      },
      U1: {
        type: Number,
        default: 0,
      },
      P1: {
        type: Number,
        default: 0,
      },
      RU1: {
        type: Number,
        default: 0,
      },
      RP1: {
        type: Number,
        default: 0,
      },
      S2: {
        type: Number,
        default: 0,
      },
      U2: {
        type: Number,
        default: 0,
      },
      P2: {
        type: Number,
        default: 0,
      },
      RU2: {
        type: Number,
        default: 0,
      },
      RP2: {
        type: Number,
        default: 0,
      },
      S3: {
        type: Number,
        default: 0,
      },
      U3: {
        type: Number,
        default: 0,
      },
      P3: {
        type: Number,
        default: 0,
      },
      RU3: {
        type: Number,
        default: 0,
      },
      RP3: {
        type: Number,
        default: 0,
      },
      S4: {
        type: Number,
        default: 0,
      },
      U4: {
        type: Number,
        default: 0,
      },
      P4: {
        type: Number,
        default: 0,
      },
      RU4: {
        type: Number,
        default: 0,
      },
      RP4: {
        type: Number,
        default: 0,
      }, 
      XA : {
        type: Number,
        default:0
      },
      XB : {
        type: Number,
        default:0
      },
      YA : {
        type: Number,
        default:0
      },
      YB : {
        type: Number,
        default:0
      }
})


export default mongoose.model("Frame", frameSchema)