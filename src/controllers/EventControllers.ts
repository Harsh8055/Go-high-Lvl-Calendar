import EventService from "../services/eventService";

const eventService = new EventService();

const addNewEvent = async (req, res) => {
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



const userController = {
  addNewEvent,
  getAllEvents
};

export default userController;
