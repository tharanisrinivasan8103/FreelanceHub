const db = require("../config/db");


// SEND PROPOSAL

exports.sendProposal = (req, res) => {

const { project_id, freelancer_id, bid, message } = req.body;


// validation

if (!project_id || !freelancer_id || !bid || !message) {

return res.status(400).json({

message: "All fields are required"

});

}


db.query(

"INSERT INTO proposals (project_id, freelancer_id, bid, message) VALUES (?, ?, ?, ?)",

[project_id, freelancer_id, bid, message],

(err, result) => {

if (err) {

return res.status(500).json(err);

}


res.status(201).json({

message: "Proposal Sent Successfully",

proposalId: result.insertId

});

}

);

};



// GET PROPOSALS FOR A PROJECT (CLIENT VIEW)

exports.getProjectProposals = (req, res) => {

const project_id = req.params.id;


db.query(

`SELECT proposals.*, users.name AS freelancer_name

FROM proposals

JOIN users ON proposals.freelancer_id = users.id

WHERE project_id = ?`,

[project_id],

(err, result) => {

if (err) {

return res.status(500).json(err);

}


res.status(200).json(result);

}

);

};



// GET PROPOSALS OF FREELANCER

exports.getFreelancerProposals = (req, res) => {

const freelancer_id = req.params.id;


db.query(

`SELECT proposals.*, projects.title AS project_title

FROM proposals

JOIN projects ON proposals.project_id = projects.id

WHERE freelancer_id = ?`,

[freelancer_id],

(err, result) => {

if (err) {

return res.status(500).json(err);

}


res.status(200).json(result);

}

);

};



// DELETE PROPOSAL

exports.deleteProposal = (req, res) => {

const proposal_id = req.params.id;


db.query(

"DELETE FROM proposals WHERE id = ?",

[proposal_id],

(err, result) => {

if (err) {

return res.status(500).json(err);

}


res.status(200).json({

message: "Proposal Deleted Successfully"

});

}

);

};