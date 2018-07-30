const { spy } = require("sinon");

const keys = [
  "emerg",
  "alert",
  "crit",
  "error",
  "warning",
  "notice",
  "info",
  "debug",
];

const getSpyLogger = () =>
  keys.reduce(
    (acc, key) => {
      acc[key] = spy(x => {
        acc.orderedLogs.push(
          `[${key.toUpperCase()} ${new Date(Date.now()).toUTCString()}]`
        );
        acc.orderedLogs.push(x);
      });

      return acc;
    },
    {
      orderedLogs: [],
    }
  );

// eslint-disable-next-line no-console
const printSpiedLogs = logger => console.error(logger.orderedLogs);

module.exports = {
  getSpyLogger,
  printSpiedLogs,
};
