const express = require("express");

const db = require("../data/dbConfig.js");
const { from, insert, update, first } = require("../data/dbConfig.js");
const { restart } = require("nodemon");

const server = express();
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

//GET Request all✅
server.get("/", (req, res) => {
  //get data from db
  db.select("*")
    .from("accounts")
    .then((data) => {
      res.status(200).json({
        data: data,
      });
    })
    .catch((err) => console.log(err));
});

//GET Request async await ✅🏄🏽‍♂️
server.get("/async", async (req, res, next) => {
  try {
    const data = await db.select("*").from("accounts");
    res.status(200).json({ data: data });
  } catch (error) {
    next(error);
  }
});

//GET By :id ✅
server.get("/:id", (req, res) => {
  db("accounts")
    .where({ id: req.params.id })
    .first()
    .then((post) => {
      if (post) {
        res.status(200).json({ data: post });
      } else {
        res.status(404).json({ message: `User ${req.params.id} not found` });
      }
    })
    .catch((err) => console.log(err));
});

//GET by :id async await✅🏄🏽‍♂️
server.get("/async/:id", async (req, res, next) => {
  try {
    const data = await db("accounts").where({ id: req.params.id });
    if (data.length > 0) {
      res.json(data);
    } else {
      res.status(404).json({
        message: `User ${req.params.id} does not exist`,
      });
    }
  } catch (error) {
    next(err);
  }
});

//POST✅
server.post("/", (req, res) => {
  db("accounts")
    .insert(req.body, "id")
    .then((ids) => {
      res.status(201).json({ results: ids });
    })
    .catch((err) => console.log(err));
});
//POST async await ✅🏄🏽‍♂️
server.post("/async", async (req, res, next) => {
  try {
    const payload = {
      name: req.body.name,
      budget: req.body.budget,
    };
    const [dataID] = await db("accounts").insert(payload, "id");
    const displayData = await db("accounts").where({ id: dataID });
    res.status(201).json(displayData);
  } catch (error) {
    next(error);
  }
});

//PUT by :id✅🏄🏽‍♂
server.put("/:id", (req, res) => {
  const postBody = req.body;

  db("accounts")
    .where({ id: req.params.id })
    .update(postBody)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({ message: "Recorded successfully update" });
      } else {
        res
          .status(404)
          .json({ errorMessage: `User ${req.params.id} not found` });
      }
    })
    .catch((err) => console.log(err));
});

//PUT by :id async await✅🏄🏽‍♂️
server.put("/async/:id", async (req, res, next) => {
  try {
    const payload = {
      name: req.body.name,
      budget: req.body.budget,
    };
    await db("accounts").update(payload).where({ id: req.params.id });
    res.json({
      message: `Record succesfullyupdated`,
    });
  } catch (error) {
    next(error);
  }
});

server.put("/:id", (req, res, next) => {});

// Delete ✅
server.delete("/:id", (req, res) => {
  db("accounts")
    .where({ id: req.params.id })
    .del()
    .then((count) => {
      if (count > 0) {
        res
          .status(200)
          .json({ message: `user ${req.params.id} was sucessfully deleted` });
      } else {
        res.status(404).json({ message: `User ${req.params.id} not found` });
      }
    })
    .catch((err) => console.log(err));
});

//DELETE with asycn await
server.delete("/async/:id", async (req, res, next) => {
  try {
    await db("accounts").where({ id: req.params.id }).del();
    res.json({message: `User ${req.params.id} successfully deleted`})
  } catch (error) { next(error)}
});

module.exports = server;
