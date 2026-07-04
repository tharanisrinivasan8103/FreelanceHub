const db = require("../config/db");

// ================= SEND MESSAGE =================
exports.sendMessage = (req, res) => {
  const { receiver_id, content } = req.body;
  const sender_id = req.user.id;

  if (!receiver_id || !content)
    return res.status(400).json({ message: "receiver_id and content required" });

  db.query(
    "INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)",
    [sender_id, receiver_id, content],
    (err, result) => {
      if (err) {
        console.error("sendMessage error:", err);
        return res.status(500).json({ message: "Server Error", error: err.message });
      }
      res.status(201).json({ message: "Sent!", id: result.insertId });
    }
  );
};

// ================= GET CONVERSATION =================
exports.getConversation = (req, res) => {
  const { otherId } = req.params;
  const userId = req.user.id;

  db.query(
    `SELECT m.*, s.name AS sender_name, r.name AS receiver_name
     FROM messages m
     JOIN users s ON m.sender_id   = s.id
     JOIN users r ON m.receiver_id = r.id
     WHERE (m.sender_id = ? AND m.receiver_id = ?)
        OR (m.sender_id = ? AND m.receiver_id = ?)
     ORDER BY m.created_at ASC`,
    [userId, otherId, otherId, userId],
    (err, result) => {
      if (err) {
        console.error("getConversation error:", err);
        return res.status(500).json({ message: "Server Error", error: err.message });
      }
      db.query(
        "UPDATE messages SET is_read = 1 WHERE receiver_id = ? AND sender_id = ?",
        [userId, otherId]
      );
      res.json(result);
    }
  );
};

// ================= GET CONTACTS (inbox) =================
exports.getInbox = (req, res) => {
  const userId = req.user.id;

  db.query(
    `SELECT DISTINCT
       CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END AS other_id
     FROM messages
     WHERE sender_id = ? OR receiver_id = ?`,
    [userId, userId, userId],
    (err, others) => {
      if (err) {
        console.error("getInbox error:", err);
        return res.status(500).json({ message: "Server Error", error: err.message });
      }
      if (others.length === 0) return res.json([]);

      const otherIds = others.map(o => o.other_id);
      const ph = otherIds.map(() => "?").join(",");

      db.query(
        `SELECT
           u.id, u.name, u.role,
           (SELECT content FROM messages
            WHERE (sender_id=u.id AND receiver_id=?) OR (sender_id=? AND receiver_id=u.id)
            ORDER BY created_at DESC LIMIT 1) AS last_message,
           (SELECT COUNT(*) FROM messages
            WHERE sender_id=u.id AND receiver_id=? AND is_read=0) AS unread
         FROM users u WHERE u.id IN (${ph})`,
        [userId, userId, userId, ...otherIds],
        (err2, result) => {
          if (err2) {
            console.error("getInbox step2 error:", err2);
            return res.status(500).json({ message: "Server Error", error: err2.message });
          }
          res.json(result);
        }
      );
    }
  );
};
