import {
  describe,
  expect,
  beforeEach,
  afterEach,
  test,
  beforeAll,
  afterAll,
} from "vitest";
import {
  createUser,
  findUserById,
  returnUsers,
  updateUser,
  deleteUser,
  getUserCount,
  getUserCountByRole,
  getUserCountByRoles,
  getUserCreatedTime,
} from "../../../src/daos/user";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const truthyEmail1 = "abc@gmail.com";
const truthyEmail2 = "ghf@gmail.com";
const truthyEmail3 = "tdakdi2@gmail.com";
const truthyEmail4 = "zhaiwwiwi@akiw.com";

const falsyEmail1 = "thanh2";
const falsyEmail2 = "thanh2@gmail";

const truthyRole1 = "admin";
const truthyRole2 = "user";
const falsyRole = "aksks";
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create(); // create instance
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { dbName: "vitestdb" });
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe("Create and find user by id", () => {
  test("Invalid email", async () => {
    await expect(
      createUser({
        email: falsyEmail1,
        role: truthyRole1,
        password: "pasisis",
      }),
    ).rejects.toThrow(mongoose.Error.ValidationError);
    await expect(
      createUser({
        email: falsyEmail2,
        role: truthyRole1,
        password: "pasisis",
      }),
    ).rejects.toThrow(mongoose.Error.ValidationError);
  });

  test("Invalid role", async () => {
    await expect(
      createUser({
        email: truthyEmail1,
        role: falsyRole,
        password: "dkdkdd",
      }),
    ).rejects.toThrow(mongoose.Error.ValidationError);
  });

  test("Missing field", async () => {
    await expect(
      createUser({ role: truthyRole2, password: "thandkd" }),
    ).rejects.toThrow(mongoose.Error.ValidationError);

    await expect(
      createUser({
        email: truthyEmail3,
        password: "thandkd",
      }),
    ).rejects.toThrow(mongoose.Error.ValidationError);

    await expect(
      createUser({ email: truthyEmail2, password: "thandkd" }),
    ).rejects.toThrow(mongoose.Error.ValidationError);
  });

  test("Create valid user", async () => {
    const user1 = await createUser({
      email: truthyEmail1,
      role: truthyRole1,
      password: "thanh",
    });
    expect(user1).toHaveProperty("_id");
    expect(user1).toHaveProperty("email");
    expect(user1).toHaveProperty("role");
    expect(user1).toHaveProperty("createdAt");
    expect(user1).not.toHaveProperty("password");

    const user2 = await createUser({
      email: truthyEmail2,
      role: truthyRole2,
      password: "akakss",
    });
    expect(user2).toHaveProperty("_id");
    expect(user2).toHaveProperty("email");
    expect(user2).toHaveProperty("role");
    expect(user2).toHaveProperty("createdAt");
    expect(user2).not.toHaveProperty("password");
  });

  test("Find User by id", async () => {
    const { _id } = await createUser({
      email: truthyEmail3,
      role: truthyRole1,
      password: "thanhdkd",
    });

    const user = await findUserById(_id);
    expect(user).toBeTruthy();
    expect(user).toHaveProperty("_id", _id);
    expect(user).toHaveProperty("email", truthyEmail3);
    expect(user).toHaveProperty("role", truthyRole1);
    expect(user).toHaveProperty("createdAt");
    expect(user).not.toHaveProperty("password");
  });
});

describe("Aggregate users", () => {
  beforeEach(async () => {
    await createUser({
      email: truthyEmail1,
      role: truthyRole1,
      password: "thanhdkd",
      createdAt: new Date(),
    });
    await createUser({
      email: truthyEmail2,
      role: truthyRole2,
      password: "thaddkd",
    });
    await createUser({
      email: truthyEmail3,
      role: truthyRole1,
      password: "ttiis",
    });
    await createUser({
      email: truthyEmail4,
      role: truthyRole1,
      password: "thanhdkd",
    });
  });
  const checkUsersList = (users1, users2, compaFunc) => {
    expect(users1.length).toEqual(users2.length);
    const len = users1.length;

    for (let i = 0; i < len; i++) {
      compaFunc(users1[i], users2[i]);
    }
  };

  describe("Sort user", () => {
    test("Check user sorted", async () => {
      const users = await returnUsers();
      const sortedUsers = await returnUsers({ sort_by: { email: -1 } });

      checkUsersList(users, sortedUsers, (a, b) => {
        expect(a).not.toEqual(b);
      });

      users.sort((a, b) => b.email.localeCompare(a.email));
      checkUsersList(users, sortedUsers, (a, b) => {
        expect(a).toEqual(b);
      });
    });
  });

  const getRandomUser = async () => {
    const users = await returnUsers();
    const index = Math.floor(Math.random() * users.length);
    return users[index];
  };
  describe("Update user", () => {
    test("Check user info change", async () => {
      const newEmail = "thanhdssd@gmail.com";
      const newPassword = "iidiwdiwfiwf";

      const oldUser = await getRandomUser();
      await updateUser(oldUser._id, {
        email: newEmail,
        password: newPassword,
      });
      const newUser = await findUserById(oldUser._id);

      expect(oldUser.role).toEqual(newUser.role);
      expect(oldUser.createdAt).toEqual(newUser.createdAt);
      expect(oldUser.email).not.toEqual(newUser.email);
    });
  });

  describe("Delete user", () => {
    test("Delete user", async () => {
      const user = await getRandomUser();
      await deleteUser(user._id);
      expect(await findUserById(user._id)).toBeFalsy();
    });
  });

  describe("Get user count", () => {
    test("Check default user count", async () => {
      expect(await getUserCount()).toEqual(4);
    });

    test("Check user count after modify", async () => {
      const user = await getRandomUser();
      await deleteUser(user._id);
      expect(await getUserCount()).toEqual(3);

      await createUser({
        email: truthyEmail1,
        role: truthyRole2,
        password: "dkdkdk",
      });
      await createUser({
        email: truthyEmail3,
        role: truthyRole1,
        password: "tyuiotyui",
      });
      expect(await getUserCount()).toEqual(5);
    });
  });

  describe("Get user count by role(s)", () => {
    test("Check default role count", async () => {
      expect(await getUserCountByRole("admin")).toEqual(3);
      expect(await getUserCountByRole("user")).toEqual(1);

      let userRoles;
      userRoles = await getUserCountByRoles();
      userRoles.sort((a, b) => a.count - b.count);
      console.log(userRoles);

      expect(userRoles).toEqual([
        { role: "user", count: 1 },
        { role: "admin", count: 3 },
      ]);
    });

    test("Check role counts after modify", async () => {
      const sampleUser = await createUser({
        email: truthyEmail4,
        role: truthyRole2,
        password: "thaddkd",
      });

      const sampleAdmin = await createUser({
        email: truthyEmail2,
        role: truthyRole1,
        password: "thaddkd",
      });

      expect(await getUserCountByRole("admin")).toEqual(4);
      expect(await getUserCountByRole("user")).toEqual(2);
      const userRoles = await getUserCountByRoles();
      userRoles.sort((a, b) => a.count - b.count);
      expect(userRoles.length).toBe(2);
      expect(userRoles).toEqual([
        { role: "user", count: 2 },
        { role: "admin", count: 4 },
      ]);

      await deleteUser(sampleAdmin._id);
      expect(await getUserCountByRole("admin")).toEqual(3);
      expect(await getUserCountByRole("user")).toEqual(2);

      expect(await getUserCountByRole("kdkdd")).toEqual(0);
    });
  });

  describe("Get user created time", () => {
    test("Get valid created time", async () => {
      const user = await getRandomUser();
      const createdTime = await getUserCreatedTime(user._id);
      expect(Object.keys(createdTime).length).toBe(1);
      expect(createdTime.createdAt).toEqual(user.createdAt);
    });
  });
});
