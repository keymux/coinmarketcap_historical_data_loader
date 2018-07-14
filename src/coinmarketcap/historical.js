const { inspect } = require("util");

const _getBaseUri = ({ proto, domain, port }) => {
  // Ensure port is a string
  const strPort = `${port}`;
  const omitPort =
    !port ||
    (proto === "http" && strPort === "80") ||
    (proto === "https" && strPort === "443");

  const protoDomain = `${proto}://${domain}`;

  return protoDomain + (omitPort ? "" : `:${strPort}`);
};

const _queryCreator = ({ rp, _getBaseUri }) => baseUriComponents => ({
  ticker,
  year,
}) => {
  const uri = `${_getBaseUri(
    baseUriComponents
  )}/currencies/${ticker}/historical-data/?start=${year}0101&end=${year}1231`;

  return rp({
    resolveWithFullResponse: true,
    uri,
  });
};

const query = _queryCreator({
  rp: require("request-promise"),
  _getBaseUri,
})({
  proto: "https",
  domain: "coinmarketcap.com",
});

module.exports = {
  _getBaseUri,
  _queryCreator,

  query,
};
