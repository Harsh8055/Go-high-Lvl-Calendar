import express from "express";
const router = express.Router();

import EventControllers from "../../controllers/EventControllers";


// router.get("/get-event", EventControllers.getAllEvents);
router.get("/get-all-events", EventControllers.getAllEvents);


router.post("/add", EventControllers.addNewEvent);


export default router;