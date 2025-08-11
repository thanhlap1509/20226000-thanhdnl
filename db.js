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

const findUser = async function (data) {
  try {
    await connectToDatabase();
    const { _id, email } = data;
    console.log(_id);
    let result;
    if (!_id && !email) {
      result = await userCollection.find().toArray();
    } else if (_id) {
      result = await userCollection.findOne({ _id: new ObjectId(_id) });
    } else {
      result = await userCollection.findOne({ email });
    }

    if (!result) {
      result = "There is no user by that information";
    }

    return result;
  } catch (error) {
    console.log(`Error retrieving documents ${error}`);
    return `Error retrieving documents ${error}`;
  } finally {
    client.close();
  }
};
module.exports = { createUser, findUser };
