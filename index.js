const express = require("express");
const { authenticateRequest } = require("./auth");
const { createUser, findUser } = require("./db");
const app = express();
const PORT = 5000;

// parse request object into json object
app.use(express.json());

app.get("/", async (req, res) => {
  return res.send(await findUser(req.body));
});

app.post("/", async (req, res) => {
  const { isValid, validateMessage } = authenticateRequest(req.body);
  if (!isValid) {
    console.log(req.body);
    return res.send(validateMessage);
  }
  const { success, createUserMessage } = await createUser(req.body);
  console.log(createUserMessage);
  return res.send(createUserMessage);
});

app.all("/", (req, res) => {
  return res.send("Welcome!");
});

app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
