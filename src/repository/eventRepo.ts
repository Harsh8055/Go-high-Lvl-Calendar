import fs from "firebase-admin";
const moment = require("moment-timezone"); // For timezone manipulation

class EventRepository {
  timeZoneUser: any;
  availabilityStartUser: any;
  availabilityEndUser: any;
  slotDurationUser: any;

  constructor() {
    this.timeZoneUser = "Asia/Kolkata";
    // here morning 10 am to evening 5 pm of the date requested by the user
    this.availabilityStartUser = moment.tz("11:00", "HH:mm", this.timeZoneUser);
    this.availabilityEndUser = moment.tz("18:00", "HH:mm", this.timeZoneUser);
    this.slotDurationUser = 30; // in minutes
  }
  async addNewEvent(data) {
    try {
      console.log("data", data);
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
      const events = await (
        await fs.firestore().collection("events").get()
      ).docs.map((doc) => doc.data());
      console.log("events", events);
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

    date = apiResponse.eventDate;
    timezone = apiResponse.timezone;

    // get all the events from db

    const events = await (
      await fs.firestore().collection("events").get()
    ).docs.map((doc) => doc.data());
    console.log("events", events);

    // get all the free slots of the user

    const freeSlotsOfAUser = this.getFreeSlotsOfAUser(date, timezone);
    console.log("freeSlotsOfAUser", freeSlotsOfAUser);
  }

  getFreeSlotsOfAUser(date: Date, resultTimeZone: String) {
    const availableSlots: any = [];
    const availableSlotsInRequestedTimeZone: any = [];
    const selectedDate = moment.tz(date, this.timeZoneUser);
    const selectedDateInRequetedTz = selectedDate.clone().tz(resultTimeZone);

    let currentTime = moment(selectedDate)
      .startOf("day")
      .add(this.availabilityStartUser);

    console.log("curret", currentTime);

    const currentDateNew = moment.tz(date, "YYYY-MM-DDTHH:mm", resultTimeZone);

    while ( currentTime.isBefore(moment(selectedDate).startOf("day").add(this.availabilityEndUser))) {

      const currentTimeInUserTimeZone = currentTime.clone().tz(this.timeZoneUser).format();
      const currentTimeInRequestedTimeZone = currentTime.clone().tz(resultTimeZone).format();

      availableSlots.push(currentTimeInUserTimeZone);

      const slotDate = moment.tz( currentTimeInRequestedTimeZone, "YYYY-MM-DDTHH:mm", resultTimeZone
      );

      slotDate.date(currentDateNew.date());
      slotDate.month(currentDateNew.month());
      slotDate.year(currentDateNew.year());
      slotDate.tz(resultTimeZone);

      let slot = slotDate.format();
      console.log("slot", slot);

      availableSlotsInRequestedTimeZone.push(slot);
      // console.log("currentTim and date", currentTime);
      currentTime.add(this.slotDurationUser, "minutes");
    }
    return availableSlotsInRequestedTimeZone;

    // loop that changes dates of all the availableSlotsInRequested to currentDate from api request
    // const currentDateNew = moment.tz(date, "YYYY-MM-DDTHH:mm", resultTimeZone);

    // availableSlotsInRequestedTimeZone.forEach((slot: any) => {
    //   const slotDate = moment.tz(slot, "YYYY-MM-DDTHH:mm", resultTimeZone);
    //   slotDate.date(currentDateNew.date());
    //   slotDate.month(currentDateNew.month());
    //   slotDate.year(currentDateNew.year());
    //   slotDate.tz(resultTimeZone);
    //   slot = slotDate.format();
    //   console.log("slot", slot);
    // });
    // convert the slots to the timezone of the api request
  }
}

export default EventRepository;
