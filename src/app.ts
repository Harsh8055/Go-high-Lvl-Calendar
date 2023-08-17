import bodyParser from "body-parser";
import express from "express";
import connect from "./config/database";
import ApiRoutes from "./routes/index";
import cors from "cors";
import http from "http";

const app = express();




const setUpAndStartServer = async () => {
  app.use(cors());


  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  // app.use(decryptUser);

  app.use("/api", ApiRoutes);


  await connect();
  const server = http.createServer(app);

  server.listen(3000, async () => {
    console.log(`Server Started at 3000`);
    

  });



}; 

setUpAndStartServer();

export default app;

