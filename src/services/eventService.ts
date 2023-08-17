import eventRepository from "../repository/eventRepo";
// import jwt from "jsonwebtoken";


class eventService {
  eventRepository: any;
  constructor() {
    this.eventRepository = new eventRepository();
  }
  async addNewEvent(data) {
    try {
   
      const user = await this.eventRepository.addNewEvent(data);
      return user;
    } catch (error) {
      console.log("Something went wrong Service layer. ", error);
      throw error;
    }
  }

  async getAllEvents() {
    try {
      const user = await this.eventRepository.getAllEvents();
      return user;
    } catch (error) {
      console.log("Something went wrong Service layer.");
      throw error;
    }
  }


 
}

export default eventService;
