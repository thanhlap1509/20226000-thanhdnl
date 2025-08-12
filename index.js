const express = require("express");
const { authenticateRequest } = require("./auth");
const { createUsers, findUsers } = require("./db");
const app = express();
const PORT = 5000;

// parse request object into json object
app.use(express.json());

app.get("/user", async (req, res) => {
  return res.send(await findUsers(req.body));
});

app.post("/user", async (req, res) => {
  return res.send(await createUsers(req.body));
});

app.put("/user", async (req, res) => {
  // check if body has email and/or password to update
  const { isValid, validateMessage } = authenticateRequest(req.body, { update: false });
  if (!isValid) {
    return res.send(validateMessage);
  }
});

app.use((req, res) => {
  res.status(404).send("Route not found");
});

app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
