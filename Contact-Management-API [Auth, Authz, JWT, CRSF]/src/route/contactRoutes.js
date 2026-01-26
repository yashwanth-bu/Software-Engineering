import { Router } from "express";
import { getAllContacts, getTheContact, createContact, updateContact, deleteContact } from "../controller/contactControllers.js";
import tokenValidator from "../middleware/validateTokenHandler.js";

const router = Router();

router.use(tokenValidator)

router.get("/", getAllContacts);
router.get("/:id", getTheContact)
router.post("/", createContact);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact)

export default router;