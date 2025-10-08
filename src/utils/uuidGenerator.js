import { v4 as uuidv4 } from "uuid";
const uuidGenerator = (req, res, next) => {
  const requestId = uuidv4();

  req.requestId = requestId;
  res.setHeader("X-Request-ID", requestId);

  console.log(req.requestId);

  next();
};

export default uuidGenerator;
