const { expect } = require("chai");
const { stub } = require("sinon");

const {
  _getBaseUri,
  _queryCreator,
} = require("../../../src/coinmarketcap/historical");

const uuid = require("uuid");

describe("historical.js", () => {
  describe("_getBaseUri()", () => {
    const fixtures = [
      {
        description: 'should omit the port if "http" and 80',
        expected: "http://a",
        input: {
          proto: "http",
          domain: "a",
          port: 80,
        },
      },
      {
        description: 'should omit the port if "http" and "80"',
        expected: "http://a",
        input: {
          proto: "http",
          domain: "a",
          port: "80",
        },
      },
      {
        description: 'should omit the port if "https" and 443',
        expected: "https://a",
        input: {
          proto: "https",
          domain: "a",
          port: 443,
        },
      },
      {
        description: 'should omit the port if "https" and "443"',
        expected: "https://a",
        input: {
          proto: "https",
          domain: "a",
          port: "443",
        },
      },
      {
        description: 'should include the port if "https" and not 443',
        expected: "https://a:12",
        input: {
          proto: "https",
          domain: "a",
          port: 12,
        },
      },
    ];

    const testFixture = ({ description, expected, input }) => {
      it(description, () => {
        const actual = _getBaseUri(input);

        expect(actual).to.equal(expected);
      });
    };

    fixtures.forEach(testFixture);
  });

  describe("_queryCreator()", () => {
    const fixtures = [
      {
        description:
          "should attempt to resolve with full response and build the uri",
        expected: uuid(),
        input: {
          proto: "http",
          domain: "localhost",
          port: "8080",
          ticker: "bitcoin",
          year: "2017",
        },
      },
    ];

    const testFixture = ({ description, expected, input }) => {
      const rp = stub().resolves(expected);

      const inputWithRp = Object.assign({}, input, { rp });

      return _queryCreator(inputWithRp)(inputWithRp)(inputWithRp).then(
        actual => {
          expect(actual).to.equal(expected);
          expect(rp.calledOnce).to.be.true;
          expect(rp.args[0].length).to.equal(1);

          const arg = rp.args.shift().shift();

          expect(arg).to.have.property("resolveWithFullResponse");
          expect(arg).to.have.property("uri");
        }
      );
    };

    fixtures.forEach(testFixture);
  });
});
