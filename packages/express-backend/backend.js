import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();
const port = 8000;

app.use(cors());

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));

app.use(express.json());

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userService.addUser(userToAdd)
    .then((newUser) => {
      res.status(201).send(newUser);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  userService.deleteUserById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send("Resource not found.");
      }
      else {
        res.status(204).send();
    }})
    .catch((error) => {
      res.status(400).send(error);
    });
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  userService.findUserById(id)
    .then((result) => {
      if (result === null) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(result);
      }
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  userService.getUsers(name, job)
    .then((result) => {
      res.send({ users_list: result });
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

