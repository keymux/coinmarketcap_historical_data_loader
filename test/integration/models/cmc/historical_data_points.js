const { expect } = require("chai");

const path = require("path");

const cryptocurrencies = require(path.resolve("src/models/cryptocurrencies"));
const { getModel } = require(path.resolve(
  "src/models/cmc/historical_data_points"
));

const {
  mysql: { createTable, queryPromiseCreator },
} = require("@keymux/yadal");

const { getSpyLogger, printSpiedLogs } = require("../../../tools/spies/logger");

const {
  createModels,
  dropModels,
} = require("../../../tools/table_dependencies");
const { mysqlcPromise } = require("../../../tools/mysqlc");

describe("historical_data_points.js", () => {
  const createTableQuery = createTable(getModel());

  let logger;
  let mysqlc;
  let queryPromise;

  const modelDependencies = ["cryptocurrencies"];

  before(() => {
    logger = getSpyLogger();

    return mysqlcPromise(process.env)
      .then(x => (mysqlc = x))
      .then(() => (queryPromise = queryPromiseCreator({ logger, mysqlc })))
      .then(() =>
        createModels({
          basePath: "src/models",
          createTable,
          modelDependencies,
          queryPromise,
        })
      );
  });

  beforeEach(() => {
    logger = getSpyLogger();
  });

  it("should be able to create the table", () =>
    queryPromise(createTableQuery));

  function printLogsIfFailed() {
    if (this.currentTest.state === "failed") {
      printSpiedLogs(logger);
    }
  }

  afterEach(printLogsIfFailed);

  after(() =>
    queryPromise({
      query: `DROP TABLE ${getModel().name}`,
    }).then(() =>
      dropModels({
        basePath: "src/models",
        modelDependencies,
        queryPromise,
      })
    )
  );
});
