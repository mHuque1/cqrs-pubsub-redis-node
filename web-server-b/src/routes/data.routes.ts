  // src/routes/data.routes.ts
  import { Router } from "express";
  import {
    getAllDatos,
    getMovementsBetweenDates,
    getMovementsGroupedByMonth,
  } from "../controllers/data.controller";

  const router = Router();

  router.get("/movements-between-dates", getMovementsBetweenDates);
  router.get("/movements-grouped-by-month", getMovementsGroupedByMonth);

  export default router;
