const express = require("express");
const pool = require("../db");
const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM rcm.code_data");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { user_code, description, linked_code, sub_code_type } = req.body;

  try {
    const query = `
      UPDATE rcm.code_data 
      SET user_code = $1, description = $2, linked_code = $3, sub_code_type = $4
      WHERE code = $5
      RETURNING *;
    `;

    const result = await pool.query(query, [user_code, description, linked_code, sub_code_type, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No record found with that ID" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating code data:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const query = `DELETE FROM rcm.code_data WHERE code = $1 RETURNING *;`;
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Code not found" });
    }

    res.json({ message: "Code deleted successfully", deletedCode: result.rows[0] }); 

  } catch (error) {
    console.error("Error deleting code:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/new", async(req, res)=>{
  const {user_code, description } = req.body;

  try{
    const query = `
      INSERT INTO rcm.code_data (code, user_code, code_type, description, cat_code, linked_code, sub_code_type, created_by, creation_date) 
      VALUES 
      (nextval('rcm.code_data_code_seq'), $1, 335, $2, NULL, 321, NULL, 1, NOW())
      RETURNING *;
    `

    const result = await pool.query(query, [user_code, description])
    if (result.rowCount == 0){
      return res.status(404).json({ error: "Code not found" });
    }

    res.json(result.rows[0]);
  } catch(err){
    console.error("/new error is:", err)
  }
})


module.exports = router;
