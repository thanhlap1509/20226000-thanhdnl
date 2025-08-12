const { MongoClient, ObjectId } = require("mongodb");
const { authenticateRequest } = require("./auth");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const dbname = "database";
const collection_name = "user";
const userCollection = client.db(dbname).collection(collection_name);

const connectToDatabase = async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error(`Error connecting to the database: ${err}`);
  }
};

const checkDocumentExist = async function (data) {
  const { email } = data;
  let result = await userCollection.findOne({ email });
  return !!result;
};

const createUsers = async function (data) {
  if (!(data instanceof Object)) {
    return "Please enter body in a JSON/list of JSON format";
  }

  // Validate data format
  let isValid, validateMessage;
  let dataIsArray;
  if (Array.isArray(data)) {
    dataIsArray = 1;
    if (data.length === 0) return "List is empty, no document inserted";
    for (const [index, value] of data.entries()) {
      ({ isValid, validateMessage } = authenticateRequest(value));
      if (!isValid) {
        return `${validateMessage} at index ${index}`;
      }
    }
  } else {
    dataIsArray = 0;
    ({ isValid, validateMessage } = authenticateRequest(data));

    if (!isValid) {
      return validateMessage;
    }
  }

  // Check if data exist and insert if not
  try {
    await connectToDatabase();

    // If data is a list of object
    if (dataIsArray) {
      // Check if any document exist
      for (const [index, value] of data.entries()) {
        if (await checkDocumentExist(value)) {
          return `Exist an user with email ${value.email}`;
        }
      }

      return await userCollection.insertMany(data);
    }

    // If data is an single object
    if (await checkDocumentExist(data)) {
      return `Exist an user with email ${data.email}`;
    }
    return await userCollection.insertOne(data);
  } catch (error) {
    createUserMessage = `Error inserting document ${error}`;
    return createUserMessage;
  } finally {
    client.close();
  }
};

const findSingleUser = async function (data) {
  const { _id } = data;
  return _id ? await userCollection.findOne({ _id: new ObjectId(_id) }) : _id;
};

const findUsers = async function (data) {
  try {
    await connectToDatabase();
    // Check undefined body
    if (!data) {
      return await userCollection.find().toArray();
    }

    // Check non object body
    if (!(data instanceof Object)) {
      return "Please enter body in a JSON/list of JSON format";
    }

    // If body is array of object
    const results = [];
    let result;
    if (Array.isArray(data)) {
      // Return all documents if empty array
      if (data.length === 0) return await userCollection.find().toArray();

      for (const [index, value] of data.entries()) {
        // value must be an object {}
        if (Array.isArray(value) || !(value instanceof Object)) {
          console.log(value, index, value instanceof Object);
          console.log("here");

          return "Please enter body in a JSON/list of JSON format";
        }

        result = await findSingleUser(value);

        if (result instanceof Object) {
          results.push(result);
        } else {
          return `Error retrieving document at index ${index}`;
        }
      }
      return results;
    }

    // Return all documents if empty object
    if (Object.keys(data).length === 0) {
      return await userCollection.find().toArray();
    }

    // If body is non empty object
    result = await findSingleUser(data);

    if (result instanceof Object) {
      return result;
    }
    return "Enter valid _id to search for users";
  } catch (error) {
    console.log(`Error retrieving documents ${error}`);
    return `Error retrieving documents ${error}`;
  } finally {
    client.close();
  }
};
module.exports = { createUsers, findUsers };
