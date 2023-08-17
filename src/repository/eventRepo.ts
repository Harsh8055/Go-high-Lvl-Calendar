
import fs from "firebase-admin";
const moment = require('moment-timezone'); // For timezone manipulation


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
      const events = await (await fs.firestore().collection("events").get()).docs.map((doc) => doc.data());
      console.log("events",events);
     return "ok";
    } catch (error) {
      console.log("Something went wrong in fetching the event", error);
      throw error;
    }
  }


  async getFreeSlot(req) {
    const { date, timezone } = req.body;
    const events = await (await fs.firestore().collection("events").get()).docs.map((doc) => doc.data());
    console.log("events",events);
    // Parse the date in the provided timezone
    const selectedDate = moment.tz(date, timezone);

    let availabilityStart = events[0].startHour;

    // // Calculate available slots
    // const availableSlots = [];
    // let currentTime = moment(selectedDate).startOf('day').add(availabilityStart);
    // while (currentTime.isBefore(moment(selectedDate).startOf('day').add(availabilityEnd))) {
    //   availableSlots.push(currentTime.format());
    //   currentTime.add(slotDuration, 'minutes');
    // }


  }

  


}

export default EventRepository;
