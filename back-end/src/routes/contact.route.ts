import { Router } from "express";
import { handleContact } from "../controllers/contact.controller";

const router = Router();

// now the router simply calls the controller function
router.post("/", handleContact);

export default router; // default export for index.ts
