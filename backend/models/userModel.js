const db = require("../config/db");


// CREATE USER

exports.createUser = (name, email, password, role, callback) => {
console.log("Creating user with:", { name, email, role });
const sql = `
INSERT INTO users (name, email, password, role)
VALUES (?, ?, ?, ?)
`;

db.query(sql, [name, email, password, role], callback);

};



// FIND USER BY EMAIL

exports.findByEmail = (email, callback) => {

const sql = `
SELECT * FROM users
WHERE email = ?
`;

db.query(sql, [email], callback);

};



// GET USER BY ID

exports.findById = (id, callback) => {

const sql = `
SELECT id, name, email, role
FROM users
WHERE id = ?
`;

db.query(sql, [id], callback);

};



// GET ALL USERS

exports.getAllUsers = (callback) => {

const sql = `
SELECT id, name, email, role
FROM users
ORDER BY id DESC
`;

db.query(sql, callback);

};



// GET FREELANCERS

exports.getFreelancers = (callback) => {

const sql = `
SELECT id, name, email
FROM users
WHERE role = 'freelancer'
`;

db.query(sql, callback);

};



// GET CLIENTS

exports.getClients = (callback) => {

const sql = `
SELECT id, name, email
FROM users
WHERE role = 'client'
`;

db.query(sql, callback);

};



// DELETE USER

exports.deleteUser = (id, callback) => {

const sql = `
DELETE FROM users
WHERE id = ?
`;

db.query(sql, [id], callback);

};