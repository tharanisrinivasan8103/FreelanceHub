const db = require("../config/db");


// GET ALL USERS (ADMIN)

exports.getAllUsers = (req, res) => {

db.query(

"SELECT id, name, email, role, created_at FROM users",

(err, result) => {

if (err) {

return res.status(500).json(err);

}

res.status(200).json(result);

}

);

};



// GET ALL FREELANCERS

exports.getFreelancers = (req, res) => {

db.query(

"SELECT id, name, email, role FROM users WHERE role = 'freelancer'",

(err, result) => {

if (err) {

return res.status(500).json(err);

}

res.status(200).json(result);

}

);

};



// GET ALL CLIENTS

exports.getClients = (req, res) => {

db.query(

"SELECT id, name, email, role FROM users WHERE role = 'client'",

(err, result) => {

if (err) {

return res.status(500).json(err);

}

res.status(200).json(result);

}

);

};



// GET SINGLE USER

exports.getUserById = (req, res) => {

const user_id = req.params.id;


db.query(

"SELECT id, name, email, role FROM users WHERE id = ?",

[user_id],

(err, result) => {

if (err) {

return res.status(500).json(err);

}


if (result.length === 0) {

return res.status(404).json({

message: "User not found"

});

}


res.status(200).json(result[0]);

}

);

};



// DELETE USER (ADMIN)

exports.deleteUser = (req, res) => {

const user_id = req.params.id;


db.query(

"DELETE FROM users WHERE id = ?",

[user_id],

(err, result) => {

if (err) {

return res.status(500).json(err);

}


res.status(200).json({

message: "User deleted successfully"

});

}

);

};