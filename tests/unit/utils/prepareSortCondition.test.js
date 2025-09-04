import { expect, test } from "vitest";
import prepareSortCondition from "../../../src/utils/prepareSortCondition";
import CustomError from "../../../src/error/customError";
import { BAD_REQUEST } from "../../../src/error/code";

const validTestCases = [
  {
    condStr: "email.asc,_id.desc,role.asc",
    expectedCondition: { email: 1, _id: -1, role: 1 },
  },
  {
    condStr: "_id.desc,email.asc,role.asc",
    expectedCondition: { _id: -1, email: 1, role: 1 },
  },
];

const duplicateFieldTestCases = [
  {
    condStr: "email.asc,_id.desc,email.asc",
    duplicateField: "email",
  },
  {
    condStr: "email.asc,_id.desc,_id.asc",
    duplicateField: "_id",
  },
];

test("Produce valid sort condition", () => {
  validTestCases.forEach(({ condStr, expectedCondition }) => {
    const anticipateCondition = prepareSortCondition(condStr);
    expect(expectedCondition).toEqual(anticipateCondition);
  });
});

test("Duplicate field", () => {
  duplicateFieldTestCases.forEach(({ condStr, duplicateField }) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const cond = prepareSortCondition(condStr);
    } catch (err) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.code).toBe(BAD_REQUEST);
      expect(err.details).toBe(`Duplicate field ${duplicateField}`);
    }
  });
});
