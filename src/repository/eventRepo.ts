
import fs from "firebase-admin";


class EventRepository {
  async addNewEvent(data) {
    try {

      console.log("data",data);
      const events = await fs.firestore().collection("events").add(data);
     
      return "ok";
      
    } catch (error) {
      console.log("Something went wrong at repository layer", error);
      console.log(error);
      throw error;
    }
  }

  async getAllEvents() {
    try {

      console.log("geting data");
      const events = await fs.firestore().collection("events").get();
     
     return "ok";
    } catch (error) {
      console.log("Something went wrong in fetching the event", error);
      throw error;
    }
  }


}

export default EventRepository;
