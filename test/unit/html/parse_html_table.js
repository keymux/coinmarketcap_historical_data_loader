const { expect } = require("chai");

const { _parseHtmlTable } = require("../../../src/html/parse_html_table");

describe("parse_html_table.js", () => {
  describe("_parseHtmlTable()", () => {
    const fixtures = [
      {
        description: "should pull out the header and create a map of the data",
        expected: [
          {
            a: "1",
            b: "2",
          },
          {
            a: "9",
            b: "8",
          },
        ],
        input:
          "<table><thead><tr><th>a</th><th>b</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr><tr><td>9</td><td>8</td></tr></tbody></table>",
      },
      {
        description: "should work with coinmarketcap historical table data",
        expected: [
          {
            "Close**": "14156.40",
            Date: "Dec 31, 2017",
            High: "14377.40",
            Low: "12755.60",
            "Market Cap": "216,326,000,000",
            "Open*": "12897.70",
            Volume: "12,136,300,000",
          },
          {
            "Close**": "12952.20",
            Date: "Dec 30, 2017",
            High: "14681.90",
            Low: "12350.10",
            "Market Cap": "246,224,000,000",
            "Open*": "14681.90",
            Volume: "14,452,600,000",
          },
          {
            "Close**": "14656.20",
            Date: "Dec 29, 2017",
            High: "15279.00",
            Low: "14307.00",
            "Market Cap": "246,428,000,000",
            "Open*": "14695.80",
            Volume: "13,025,500,000",
          },
        ],
        input:
          '<table class="table"><thead><tr><th class="text-left">Date</th><th class="text-right">Open*</th><th class="text-right">High</th><th class="text-right">Low</th><th class="text-right">Close**</th><th class="text-right">Volume</th><th class="text-right">Market Cap</th></tr></thead><tbody><tr class="text-right"><td class="text-left">Dec 31, 2017</td><td data-format-fiat data-format-value="12897.7">12897.70</td><td data-format-fiat data-format-value="14377.4">14377.40</td><td data-format-fiat data-format-value="12755.6">12755.60</td><td data-format-fiat data-format-value="14156.4">14156.40</td><td data-format-market-cap data-format-value="12136300000.0">12,136,300,000</td><td data-format-market-cap data-format-value="2.16326e+11">216,326,000,000</td></tr><tr class="text-right"><td class="text-left">Dec 30, 2017</td><td data-format-fiat data-format-value="14681.9">14681.90</td><td data-format-fiat data-format-value="14681.9">14681.90</td><td data-format-fiat data-format-value="12350.1">12350.10</td><td data-format-fiat data-format-value="12952.2">12952.20</td><td data-format-market-cap data-format-value="14452600000.0">14,452,600,000</td><td data-format-market-cap data-format-value="2.46224e+11">246,224,000,000</td></tr><tr class="text-right"><td class="text-left">Dec 29, 2017</td><td data-format-fiat data-format-value="14695.8">14695.80</td><td data-format-fiat data-format-value="15279.0">15279.00</td><td data-format-fiat data-format-value="14307.0">14307.00</td><td data-format-fiat data-format-value="14656.2">14656.20</td><td data-format-market-cap data-format-value="13025500000.0">13,025,500,000</td><td data-format-market-cap data-format-value="2.46428e+11">246,428,000,000</td></tr></table>',
      },
    ];

    const testFixture = ({ description, expected, input }) => {
      it(description, () => {
        const actual = _parseHtmlTable(input);

        expect(actual).to.deep.equal(expected);
      });
    };

    fixtures.forEach(testFixture);
  });
});
