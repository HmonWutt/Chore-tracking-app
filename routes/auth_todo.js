/////all the todo routes////
const routertodo = require("express").Router();
const pool = require("../db");
const verify = require("./verifytoken");

routertodo.get("/", async (req, res) => {
  try {
    const allTodos = await pool.query(
      "SELECT * FROM todo ORDER BY todo_id DESC"
    );
    res.json(allTodos.rows);
  } catch (error) {
    console.error(error.message);
  }
});
routertodo.get("/id/:id/:identifier", async (req, res) => {
  try {
    const { id, identifier } = req.params;

    const specific_todo = await pool.query(
      "SELECT * FROM todo WHERE todo_id = $1 and identifier = $2 ORDER BY todo_id DESC",
      [id, identifier]
    );
    res.json(specific_todo.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

routertodo.get("/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;

    const specific_todo = await pool.query(
      "SELECT * FROM todo WHERE identifier = $1 ORDER BY todo_id DESC",
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
        "SELECT description,todo_id FROM todo WHERE identifier=$1 ORDER BY todo_id ASC",
        [identifier]
      );
      res.json(specific_todo.rows);
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
    res.status(500).json({ error: "Internal server error" });
  }
});
/////////////////////////////add new task//////////////////////

routertodo.post("/:identifier", async (req, res) => {
  try {
    const { description, name1, name2 } = req.body;

    const { identifier } = req.params;
    const count = 0;
    const newTodo = await pool.query(
      "INSERT INTO todo (description,identifier,name1,name2,name1_count,name2_count) VALUES ($1,$2,$3,$4,$5,$6) RETURNING todo_id",
      [description, identifier, name1, name2, count, count]
    );
    res.status(200).json({ message: "success", id: newTodo.rows[0].todo_id });
  } catch (err) {
    res.json({ message: error.message });
  }
});

routertodo.post("/bedsheet", async (req, res) => {
  res.send("hello");
  console.log("post");
  Getlastdone();
});

//////////////////////////////////////////////////////////////////////////////////////////

routertodo.put("/id/:id/:identifier", async (req, res) => {
  console.log("this was called");
  try {
    const { id, identifier } = req.params;
    const { set } = req.body;
    const name = `${set.slice(4, 15)}`;
    // const nameasobject = JSON.parse(`{name:${name}}`);

    const updated = await pool.query(
      `UPDATE todo ${set}  WHERE todo_id = $1 and identifier=$2 returning todo_id, ${name}`,
      [id, identifier]
    );
    const newid = updated.rows[0].todo_id;

    const newcount = updated.rows[0][name];

    res.json({ message: "success", id: newid, count: newcount });
  } catch (err) {
    res.json({ message: err.message });
  }
});

routertodo.put("/:identifier/:id", async (req, res) => {
  try {
    const { identifier, id } = req.params;
    const { description } = req.body;

    const updatedTOdo = await pool.query(
      "UPDATE todo SET description = $1  WHERE identifier = $2 and todo_id = $3 returning todo_id",
      [description, identifier, id]
    );
    const task = updatedTOdo.rows[0];
    res.json({
      message: "success",
      id: task.todo_id,
    });
  } catch (error) {
    res.json({ message: "error.message" });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////

routertodo.delete("/:identifier/:id", async (req, res) => {
  console.log("delete called");
  try {
    const { identifier, id } = req.params;
    await pool.query("DELETE FROM todo WHERE identifier= $1 and todo_id = $2", [
      identifier,
      id,
    ]);

    res.json({
      message: "success",
      id: id,
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});

module.exports = routertodo;
