const path = require("path");

const getModels = ({ basePath, modelDependencies }) =>
  modelDependencies.map(modelDependency =>
    require(path.resolve(basePath, modelDependency)).getModel()
  );

const createModels = ({
  basePath,
  createTable,
  modelDependencies,
  queryPromise,
}) =>
  Promise.resolve({ basePath, modelDependencies })
    .then(getModels)
    .then(models => models.map(createTable))
    .then(createModels =>
      Promise.all(createModels.map(createModel => queryPromise(createModel)))
    );

const dropModels = ({ basePath, modelDependencies, queryPromise }) =>
  Promise.resolve({ basePath, modelDependencies: modelDependencies.reverse() })
    .then(getModels)
    .then(models =>
      Promise.all(
        models.map(({ name }) =>
          queryPromise({
            query: `DROP TABLE ${name}`,
          })
        )
      )
    );

module.exports = {
  createModels,
  dropModels,
};
