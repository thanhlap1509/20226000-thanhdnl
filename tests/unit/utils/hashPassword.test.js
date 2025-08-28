import { describe, expect, test } from "vitest";
import bcrypt from "bcryptjs";

import hashPassword from "../../../src/utils/hashPassword.js";

describe("Hash password", () => {
  test("Hashed password can be verify with original", async () => {
    const testPassword = "thakskoiiwfiowofwf";
    const hashedPassword = await hashPassword(testPassword);
    expect(await bcrypt.compare(testPassword, hashedPassword)).toEqual(true);
  });

  test("Hashed password produce different password each time", async () => {
    const testPassword = "th228dudw";
    const hashedPassword1 = await hashPassword(testPassword);
    const hashedPassword2 = await hashPassword(testPassword);
    expect(hashedPassword1).not.toEqual(hashedPassword2);
    expect(await bcrypt.compare(testPassword, hashedPassword1)).toEqual(true);
    expect(await bcrypt.compare(testPassword, hashedPassword2)).toEqual(true);
  });
});
