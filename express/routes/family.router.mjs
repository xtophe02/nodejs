import express from "express";
const famliyRouter = express.Router();

import {
  addFamilyMember,
  getFamily,
  getFamilyMemberByID,
} from "../controllers/family.controller.mjs";

famliyRouter.get("/", getFamily);
famliyRouter.get("/:id", getFamilyMemberByID);
famliyRouter.post("/", addFamilyMember);

export default famliyRouter;
