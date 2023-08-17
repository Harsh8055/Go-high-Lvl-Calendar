/*Set up Admin API for Firebase*/
const fs = require('firebase-admin');

const serviceAccount = require("../../testprojecthighlevel.json");

const connect = async () => {
  try {
    //Initialize the app

    fs.initializeApp({
      credential: fs.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin Initialized");

    // const usersDb = db.collection('users'); 


  } catch (err) {
    console.log(`Error in connecting to the database ${err}`);
  }


};

export default connect;
