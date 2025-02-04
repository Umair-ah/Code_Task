const express = require("express");
const pool = require("../db");
const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`SELECT ct1.code_type, ct1.description, ct1.linked_type, ct2.description AS linked_type_description FROM rcm.code_type ct1 LEFT JOIN rcm.code_type ct2 ON ct1.linked_type = ct2.code_type;`);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/add", async(req, res) => {
  try{
    const { description, linked_type } = req.body;

    const query = `INSERT INTO rcm.code_type (code_type, description, linked_type, created_by, creation_date) 
      VALUES 
      (nextval('rcm.code_type_data_code_type_seq'), $1, $2, 1, CURRENT_DATE)
      RETURNING *;
    `

    const result = await pool.query(query, [description, linked_type])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No record" });
    }

    res.json(result.rows[0]);

  } catch (error){
    console.error("error is", error)
  }
});


router.post("/update/:id", async(req, res) => {
  const {id} = req.params
  const {description, linked_type} = req.body

  console.log("id is:",id)
  console.log("description is:", description)
  console.log("linked_type is:", linked_type)



  try{
    const query = `
      UPDATE rcm.code_type
      SET description = $1, linked_type = $2
      WHERE code_type = $3
      RETURNING *;
    `
  const result = await pool.query(query, [description, linked_type, id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "No record found with that ID" });
  }

  res.json(result.rows[0]);



  }catch(err){
    console.error("/update error is:", err)
  }
})


router.delete("/delete/:id", async(req, res)=> {
  const {id} = req.params;

  try{
    const query = `DELETE FROM rcm.code_type WHERE code_type=$1 RETURNING*;`
    const result = await pool.query(query, [id])

    if(result.rows.length === 0){
      return res.status(404).json({ error: "No record found with that ID" });
    }
    res.json(result.rows[0]);
  }catch(err){
    console.error(err)
  }
})

router.get("/limited_linked_type", async(req, res)=>{
  try{
    const query = `SELECT DISTINCT ct1.linked_type, ct2.description AS linked_type_description FROM rcm.code_type ct1 LEFT JOIN rcm.code_type ct2 ON ct1.linked_type = ct2.code_type WHERE ct1.linked_type IS NOT NULL;`
    
    const result = await pool.query(query)

    if(result.rows.length === 0){
      res.json([]);
    }else{
      res.json(result.rows);
    }
  }catch(err){
    console.error(err)
  }
})

module.exports = router;
