const { expect } = require("chai");

const {
  _getBaseUri,
  _queryCreator,
} = require("../../../src/coinmarketcap/historical");

const rp = require("request-promise");

describe("historical.js", () => {
  describe("_queryCreator()", () => {
    describe("given a proto and a domain", () => {
      [
        {
          proto: "http",
          domain: "localhost",
          port: "8080",
        },
      ].forEach(input => {
        const query = _queryCreator({ rp, _getBaseUri })(input);

        it("should create a function", () => {
          expect(query).to.be.a("function");
        });

        describe("which", () => {
          [
            {
              ticker: "bitcoin",
              domain: "2017",
            },
          ].forEach(input => {
            describe("given a ticker and a year", () => {
              it("should retrieve a set of ticker data", () => {
                return query(input).then(actual => {
                  expect(actual.length).to.be.at.least(10000);
                });
              });
            });
          });
        });
      });
    });
  });
});
