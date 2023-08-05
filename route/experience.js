import express from "express";

const router = express.Router(); 

import {create, get10Experience, deleteExperienceById, incrementTOfEpidemie} from "../controller/experience.js";

router.post('/create', create);
router.get('/get10', get10Experience);
router.delete('/delete/:id', deleteExperienceById);
router.put('incrementT', incrementTOfEpidemie)

export default router;
