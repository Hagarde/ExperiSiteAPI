import express from "express";

const router = express.Router(); 

import {initialisationJeu, play } from "../controller/game.js";

router.get('/init', initialisationJeu);
router.post('/play', play);

export default router;