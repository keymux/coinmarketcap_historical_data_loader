const getModel = overrides =>
  Object.assign(
    {
      description: "Date and Price Information lacking time detail",
      name: "cryptocurrencies",
      columns: {
        id: {
          autoIncrement: true,
          name: "id",
          primaryKey: true,
          type: "INT",
          unsigned: true,
        },
        name: {
          name: "name",
          type: "VARCHAR(255)",
          nullable: false,
        },
        ticker_symbol: {
          name: "ticker_symbol",
          type: "VARCHAR(255)",
          nullable: false,
        },
      },
    },
    overrides
  );

module.exports = {
  getModel,
};
