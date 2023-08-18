
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
    // let { date, timezone } = req.body;
    let date, timezone;

    const apiResponse = {
      eventDate: "2023-08-20T00:00",
      // timezone to london
      timezone: "Europe/London",
      // timezone: "Asia/Kolkata"
    };

    const timeZoneUser = "Asia/Kolkata";
    // here morning 10 am to evening 5 pm of the date requested by the user
    const availabilityStartUser = moment.tz('11:00', 'HH:mm', timeZoneUser);
    const availabilityEndUser = moment.tz('18:00', 'HH:mm', timeZoneUser);
    const slotDurationUser = 30; // in minutes
    date = apiResponse.eventDate;
    timezone = apiResponse.timezone;

    const events = await (await fs.firestore().collection("events").get()).docs.map((doc) => doc.data());
    console.log("events",events);
    // Parse the date in the provided timezone
    const selectedDate = moment.tz(date, timeZoneUser);
    // const selectedDateInUserTimeZone = selectedDate.clone().tz(timeZoneUser);


    console.log("selectedDate",selectedDate, "timezone",selectedDate.tz(timezone));



   
    
    const availableSlots: any = [];
    const availableSlotsInRequestedTimeZone: any = [];
    let currentTime = moment(selectedDate).startOf('day').add(availabilityStartUser);
    console.log("curret",currentTime);

    while (currentTime.isBefore(moment(selectedDate).startOf('day').add(availabilityEndUser))) {

      const currentTimeInUserTimeZone = currentTime.clone().tz(timeZoneUser).format()
      const currentTimeInRequestedTimeZone = currentTime.clone().tz(timezone).format()

      availableSlots.push(currentTimeInUserTimeZone);
      availableSlotsInRequestedTimeZone.push(currentTimeInRequestedTimeZone);
      
      console.log("currentTim and date",currentTime);
      currentTime.add(slotDurationUser, 'minutes');
    }

    console.log("availableSlots",availableSlots, "availableSlotsInRequestedTimeZone",availableSlotsInRequestedTimeZone);

    // convert the slots to the timezone of the api request





  }

  


}

export default EventRepository;
