const cheerio = require("cheerio");

const { zip } = require("../util/arrays/zip");

const _parseHtmlTable = body => {
  const $ = cheerio.load(body);

  const keys = $("table thead tr th")
    .toArray()
    .map(x => $(x).text());

  return $("table tbody tr")
    .toArray()
    .map(row =>
      zip(keys)(
        $(row)
          .find("td")
          .toArray()
          .map(cell => $(cell).text())
      )
    );
};

module.exports = {
  _parseHtmlTable,
};
