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
    this.availabilityStartUser = moment.tz("10:00", "HH:mm", this.timeZoneUser);
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

  async deleteAllEvents() {
    try {
      
      const events = await fs.firestore().collection("events").get();
      events.forEach((event) => {
        event.ref.delete();
      });
      return "ok";
    } catch (error) {
      console.log("Something went wrong at repository layer", error);

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

    // update the free solts to remove the slots that lie in the events

    const freeSlotsOfAUserAfterRemovingEvents = this.removeEventsFromFreeSlots(
      freeSlotsOfAUser,
      events,
      timezone
    );

    console.log(
      "freeSlotsOfAUserAfterRemovingEvents",
      freeSlotsOfAUserAfterRemovingEvents
    );

    return freeSlotsOfAUserAfterRemovingEvents;
  }

  private getFreeSlotsOfAUser(date: Date, resultTimeZone: String) {
    const availableSlots: any = [];
    const availableSlotsInRequestedTimeZone: any = [];
    const selectedDate = moment.tz(date, this.timeZoneUser);
    const selectedDateInRequetedTz = selectedDate.clone().tz(resultTimeZone);

    // Calculate the desired start time by combining the date and time
    const currentTime = selectedDate
      .clone()
      .startOf("day")
      .add(this.availabilityStartUser.get("hour"), "hours")
      .add(this.availabilityStartUser.get("minute"), "minutes");

    // console.log(currentTime.format()); // Output the combined start time

    // console.log("curret", currentTime);

    const currentDateNew = moment.tz(date, "YYYY-MM-DDTHH:mm", resultTimeZone);

    while (
      currentTime.isBefore(
        moment(selectedDate).startOf("day").add(this.availabilityEndUser)
      )
    ) {
      const currentTimeInUserTimeZone = currentTime
        .clone()
        .tz(this.timeZoneUser)
        .format();
      const currentTimeInRequestedTimeZone = currentTime
        .clone()
        .tz(resultTimeZone)
        .format();

      availableSlots.push(currentTimeInUserTimeZone);

      const slotDate = moment.tz(
        currentTimeInRequestedTimeZone,
        "YYYY-MM-DDTHH:mm",
        resultTimeZone
      );

      slotDate.date(currentDateNew.date());
      slotDate.month(currentDateNew.month());
      slotDate.year(currentDateNew.year());
      slotDate.tz(resultTimeZone);

      let slot = slotDate.format();
      // console.log("slot", slot);

      availableSlotsInRequestedTimeZone.push(slot);

      if (
        currentTime.get("hour") === this.availabilityEndUser.get("hour") &&
        currentTime.get("minute") === this.availabilityEndUser.get("minute")
      ) {
        break;
      }
      // console.log("currentTim and date", currentTime);
      currentTime.add(this.slotDurationUser, "minutes");
    }

    console.log("availableSlots", availableSlots);
    return availableSlotsInRequestedTimeZone;
  }

  private removeEventsFromFreeSlots(
    freeSlotsOfAUser: any,
    events: any,
    timezoneRequested: any
  ) {
    let updatedFreeSlots = [...freeSlotsOfAUser]; // Create a copy of the array to avoid modifying it directly
    const toRemoveSlots: any = [];

    events.forEach((event) => {
      const eventTimeStartInTZRequested = moment
        .unix(event.startHours._seconds)
        .tz(timezoneRequested);

        console.log("event", event);

      const eventEndInTZRequested = moment
        .unix(event.endHours._seconds)
        .tz(timezoneRequested);
      // console.log("eventTimeStartInTZRequested", eventTimeStartInTZRequested);
      // console.log("eventEndInTZRequested", eventEndInTZRequested);
      const eventTimeStartInUser = moment
        .unix(event.startHours._seconds)
        .tz(this.timeZoneUser);
      // console.log("eventTimeStartInUser", eventTimeStartInUser);

      freeSlotsOfAUser.forEach((slot: any, index) => {


        const slotDateTime = moment.tz(
          slot,
          "YYYY-MM-DDTHH:mm",
          timezoneRequested
        );
        const slotDateTimeNext = moment.tz(
          freeSlotsOfAUser[index + 1],
          "YYYY-MM-DDTHH:mm",
          timezoneRequested
        );
     
        if (
          slotDateTime.isBetween(eventTimeStartInTZRequested, eventEndInTZRequested, null, "[)") || eventTimeStartInTZRequested.isBetween(slotDateTime, slotDateTimeNext, null, "[)" || 
          eventEndInTZRequested.isBetween(slotDateTime, slotDateTimeNext, null, "[)"))) {
          // Remove the slot from the updatedFreeSlots array
          if (!toRemoveSlots.includes(index)) {
            toRemoveSlots.push(index);
          }
        }


      });
    });

    updatedFreeSlots = updatedFreeSlots.filter((slot, index) => !toRemoveSlots.includes(index));

    console.log("updatedFreeSlots", updatedFreeSlots.length, freeSlotsOfAUser.length)
    return updatedFreeSlots;
  }
}

export default EventRepository;
