import express from "express";

const router = express.Router(); 

import {create, get10Frame, getDataByIdOrTime, deleteFrame} from "../controller/frame.js";

router.post('/create', create);
router.get('/get10', get10Frame);
router.get('/get', getDataByIdOrTime);
router.delete('/delete/:id', deleteFrame);


export default router;