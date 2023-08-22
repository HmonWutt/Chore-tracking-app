/////all the todo routes////
const routertodo = require("express").Router();
const pool = require("../db");
const verify = require("./verifytoken");

routertodo.get("/", verify, async (req, res) => {
  try {
    const allTodos = await pool.query(
      "SELECT * FROM todo ORDER BY todo_id ASC"
    );
    res.json(allTodos.rows);
  } catch (error) {
    console.error(error.message);
  }
});
routertodo.get("/id/:id/:identifier", async (req, res) => {
  try {
    const { id, identifier } = req.params;
    console.log(id);
    const specific_todo = await pool.query(
      "SELECT * FROM todo WHERE todo_id = $1 and identifier = $2",
      [id, identifier]
    );
    res.json(specific_todo.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

routertodo.get("/:identifier", verify, async (req, res) => {
  try {
    const { identifier } = req.params;
    console.log("identifier", identifier);
    const specific_todo = await pool.query(
      "SELECT * FROM todo WHERE identifier = $1 ",
      [identifier]
    );
    res.json(specific_todo.rows);
  } catch (error) {
    res.json({ message: "Not found!" });
    console.error(error.message);
  }
});
routertodo.get(
  "/descriptionlist/descriptions/:identifier",
  async (req, res) => {
    try {
      const { identifier } = req.params;
      const specific_todo = await pool.query(
        "SELECT description,todo_id FROM todo WHERE identifier=$1 ",
        [identifier]
      );
      res.json(specific_todo.rows);
      console.log("descriptions", specific_todo.rows);
    } catch (error) {
      console.error(error.message);
    }
  }
);

routertodo.get("/bedsheet", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todo WHERE todo_id = 115");
    const lastdone = result.rows[0].lastdone;
    res.json(lastdone);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
/////////////////////////////add new task//////////////////////

routertodo.post("/", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES ($1) RETURNING *",
      [description]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

routertodo.post("/bedsheet", async (req, res) => {
  res.send("hello");
  console.log("post");
  Getlastdone();
});

//////////////////////////////////////////////////////////////////////////////////////////

routertodo.put("/id/:id/:identifier", async (req, res) => {
  try {
    const { id, identifier } = req.params;
    const { set } = req.body;
    console.log(set);

    const updateTOdo = await pool.query(
      `UPDATE todo ${set}  WHERE todo_id = $1 and identifier=$2`,
      [id, identifier]
    );
    res.json(`To do id:${id} of set:${set} was updated`);
  } catch (error) {
    console.error(error.message);
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////
routertodo.delete("/todo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
      id,
    ]);
    res.json(`Todo ${id} was deleted!`);
  } catch (err) {
    console.log(err.message);
  }
});
module.exports = routertodo;
