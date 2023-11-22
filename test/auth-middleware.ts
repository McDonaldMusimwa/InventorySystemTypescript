/*
import { expect } from "chai";
import authMiddleware,{ AuthenticatedRequest } from "../src/auth/is-auth";

it("should throw an error if no authorization header is present", function () {
  const req: AuthenticatedRequest = {
    get: function () {
      return null;
    },
  };

  expect(() => authMiddleware(req, {}, () => {})).to.throw("Not authenticated.");
});

*/