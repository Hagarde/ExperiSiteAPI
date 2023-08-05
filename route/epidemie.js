import express from "express";

const router = express.Router(); 

import { create, getRandomEpidemie, deleteEpidemieById, get10Epidemie } from "../controller/epidemie.js";

// Créer une épidémie 
router.post('/create', create);

// Récupérer un élément aléatoire
router.get('/random-element', getRandomEpidemie);

// Delete une épidémie 
router.delete('/delete/:id', deleteEpidemieById);

// Get 10 epidémies
router.get('/get10', get10Epidemie);

export default router;
