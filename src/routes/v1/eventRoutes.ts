import express from "express";
const router = express.Router();

import EventControllers from "../../controllers/EventControllers";


router.get("/get-event/:id", EventControllers.getAllEvents);


router.post("/add", EventControllers.addNewEvent);

export default router;