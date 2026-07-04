const db = require("../config/db");



// CREATE PROJECT

exports.createProject = (title, description, budget, client_id, category, skills, deadline, callback) => {

const sql = `
INSERT INTO projects
(title, description, budget, client_id, category, skills, deadline)
VALUES (?, ?, ?, ?, ?, ?, ?)
`;

db.query(sql,
[title, description, budget, client_id, category, skills || null, deadline || null],
callback);

};



// GET ALL PROJECTS

exports.getAllProjects = (callback) => {

const sql = `
SELECT projects.*, users.name AS client_name
FROM projects
JOIN users ON projects.client_id = users.id
ORDER BY projects.id DESC
`;

db.query(sql, callback);

};



// GET PROJECT BY ID

exports.getProjectById = (id, callback) => {

const sql = `
SELECT *
FROM projects
WHERE id = ?
`;

db.query(sql, [id], callback);

};



// GET CLIENT PROJECTS

exports.getProjectsByClient = (client_id, callback) => {

const sql = `
SELECT *
FROM projects
WHERE client_id = ?
ORDER BY id DESC
`;

db.query(sql, [client_id], callback);

};



// DELETE PROJECT

exports.deleteProject = (id, callback) => {

const sql = `
DELETE FROM projects
WHERE id = ?
`;

db.query(sql, [id], callback);

};