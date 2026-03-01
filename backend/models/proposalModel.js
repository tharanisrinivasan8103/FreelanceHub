const db = require("../config/db");



// SEND PROPOSAL

exports.createProposal = (

project_id,

freelancer_id,

bid,

message,

callback

) => {

const sql = `
INSERT INTO proposals
(project_id, freelancer_id, bid, message)
VALUES (?, ?, ?, ?)
`;

db.query(sql,
[project_id, freelancer_id, bid, message],
callback);

};



// GET ALL PROPOSALS FOR PROJECT

exports.getProposalsByProject = (

project_id,

callback

) => {

const sql = `
SELECT proposals.*,
users.name AS freelancer_name
FROM proposals
JOIN users ON proposals.freelancer_id = users.id
WHERE project_id = ?
ORDER BY proposals.id DESC
`;

db.query(sql,
[project_id],
callback);

};



// GET FREELANCER PROPOSALS

exports.getProposalsByFreelancer = (

freelancer_id,

callback

) => {

const sql = `
SELECT proposals.*,
projects.title
FROM proposals
JOIN projects ON proposals.project_id = projects.id
WHERE freelancer_id = ?
ORDER BY proposals.id DESC
`;

db.query(sql,
[freelancer_id],
callback);

};



// DELETE PROPOSAL

exports.deleteProposal = (

id,

callback

) => {

const sql = `
DELETE FROM proposals
WHERE id = ?
`;

db.query(sql,
[id],
callback);

};