import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  const newUser = { ...user, id: generateId() };
  users["users_list"].push(newUser);
  return newUser;
};

const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const deleteUserById = (id) => {
  const initialLength = users["users_list"].length;
  users["users_list"] = users["users_list"].filter(
    (user) => user["id"] !== id
  );
  return users["users_list"].length !== initialLength;
};

app.use(cors());
app.use(express.json());

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const newUser = addUser(userToAdd);
  res.status(201).send(newUser);
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  const deleted = deleteUserById(id);
  if (!deleted) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(204).send();
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  let result = users["users_list"];
  if (name != undefined) {
    result = result.filter((user) => user["name"] === name);
  }
  if (job != undefined) {
    result = result.filter((user) => user["job"] === job);
  }
  res.send({ users_list: result });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

