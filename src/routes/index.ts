import express from "express";
const router = express.Router();
import v1ApiRoutes from "./v1/index";


router.use("/v1", v1ApiRoutes);

router.use((err: any,req: any , res: any, next: any) => {
  const error = new Error("Invalid route");
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
  next(error);
});

router.use((err: any, req: any, res: any, next: any ) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

export default router;
