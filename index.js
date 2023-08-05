import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";

import EpidemieRouter from './route/epidemie.js';
import ExperienceRouter from './route/experience.js';
import FrameRouter from './route/frame.js';
import GameRouter from './route/game.js';

const port = 5001; 


// initialisation des librairies 
const app = express();
app.use(morgan("dev"));
app.use(express.json({limit: "30mb", extended: "true"}))
app.use(express.urlencoded({limit: "30mb", extended: "true"}))
app.use(cors())

const MONGODB_URL = "mongodb+srv://root:root@cluster0.leuql.mongodb.net/?retryWrites=true&w=majority"

// Création des route des API 
app.use("/epidemie", EpidemieRouter);
app.use("/experience", ExperienceRouter);
app.use("/frame", FrameRouter);
app.use("/game", GameRouter)

app.get("/", (req, res)=>{
    res.send("Ca marche");
})

mongoose
    .connect(MONGODB_URL)
    .then(()=>{
        app.listen(port, () => {
            console.log(`Bien connecté, serveur dispo au port ${port}`)
        })
}).catch((error)=>{console.log(`C'est cassé : ${error}`)})