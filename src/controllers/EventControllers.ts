import EventService from "../services/eventService";

const eventService = new EventService();

const addNewEvent = async (req: any, res: any) => {
  try {
    const response = await eventService.addNewEvent(req.body);
    // console.log("1", 1);
    return res.status(201).json({
      success: true,
      message: "Successfully created a new event",
      data: response,
      err: {},
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      data: {},
      success: false,
      err: error.explanation,
    });
  }
};


const getAllEvents = async (req, res) => {
  try {
    console.log("geting data");
    const response = await eventService.getAllEvents();

    return res.status(201).json({
      message: "Successfully fetched events ",
      data: response,
      err: {},
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Not able to fetch events",
      err: error,
      success: false,
      data: {},
    });
  }
};
const getFreeSlot = async (req: any, res: any) => {
  try {
    console.log("geting data");
    const response = await eventService.getFreeSlot(req.body.date,req.body.timezone);
    return res.status(201).json({
      message: "Successfully fetched events ",
      data: response,
      err: {},
      success: true,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: "Not able to fetch events",
      err: error,
      success: false,
      data: {},
    });
  }
};






const userController = {
  addNewEvent,
  getAllEvents,
  getFreeSlot,
};

export default userController;
