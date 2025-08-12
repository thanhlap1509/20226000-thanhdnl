const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const dbname = "database";
const collection_name = "user";
const userCollection = client.db(dbname).collection(collection_name);

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log(`Connected to the ${dbname} database, ${collection_name} collection`);
  } catch (err) {
    console.error(`Error connecting to the database: ${err}`);
  }
};

const checkDocumentExist = async function (data) {
  const { email } = data;
  let result = await userCollection.findOne({ email });
  return !!result;
};

const createUser = async function (data) {
  let success;
  let createUserMessage;
  try {
    await connectToDatabase();
    const { email, password } = data;
    const hasUser = await checkDocumentExist(data);
    if (hasUser) {
      success = false;
      createUserMessage = `Exist an user with email ${email}`;
      return { success, createUserMessage };
    }

    await userCollection.insertOne({ email, password });

    success = true;
    createUserMessage = `Successfully create an user with email ${email}`;
    return { success, createUserMessage };
  } catch (error) {
    success = false;
    createUserMessage = `Error inserting document ${error}`;
    return { success, createUserMessage };
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
module.exports = { createUser, findUsers };
