const express = require("express");

const router = express.Router();

const controller = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");


// GET ALL USERS (Admin)

router.get(

"/",

authMiddleware,

controller.getAllUsers

);


// GET ALL FREELANCERS

router.get(

"/freelancers",

authMiddleware,

controller.getFreelancers

);


// GET ALL CLIENTS

router.get(

"/clients",

authMiddleware,

controller.getClients

);


// GET SINGLE USER

router.get(

"/:id",

authMiddleware,

controller.getUserById

);


// DELETE USER (Admin)

router.delete(

"/:id",

authMiddleware,

controller.deleteUser

);


module.exports = router;