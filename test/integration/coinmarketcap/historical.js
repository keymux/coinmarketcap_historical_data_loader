const { expect } = require("chai");

describe("historical.js", () => {
  describe("_queryCreator()", () => {
    describe("given a proto and a domain", () => {
      [
        {
          proto: "http",
          domain: "localhost",
          port: "8080",
        },
      ].forEach(({ proto, domain, port }) => {
        const query = _queryCreator(proto, domain, port);

        it("should create a function", () => {
          expect(query).to.be.a("function");
        });

        describe("which", () => {
          [
            {
              ticker: "bitcoin",
              domain: "2017",
            },
          ].forEach(({ ticker, domain }) => {
            describe("given a ticker and a year", () => {
              it("should retrieve a set of ticker data", () => {
                //
              });
            });
          });
        });
      });
    });
  });
});
