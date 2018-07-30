/**
 * Describes interacting with an underlying database in order
 * to work with hostorical data from coin market cap
 */

/**
 * Provides a configurable map for creating the table and interacting with it
 *
 * @param {object} overrides - A testability map which can override fields
 *                             FYI Object.assign doesn't play nice with nested fields
 *
 * @return {object} - a map of fields which help define creation and
 *                    interaction with the table
 */
const getModel = overrides =>
  Object.assign(
    {
      columns: {
        id: {
          autoIncrement: true,
          name: "id",
          primaryKey: true,
          type: "BIGINT",
          unsigned: true,
        },
        cryptocurrencyId: {
          name: "cryptocurrencyId",
          type: "INT",
          unsigned: true,
        },
        date: {
          name: "date",
          type: "DATE",
          nullable: false,
        },
        open: {
          name: "open",
          type: "DOUBLE",
          nullable: false,
        },
        high: {
          name: "high",
          type: "DOUBLE",
          nullable: false,
        },
        low: {
          name: "low",
          type: "DOUBLE",
          nullable: false,
        },
        close: {
          name: "close",
          type: "DOUBLE",
          nullable: false,
        },
        volume: {
          name: "volume",
          type: "DOUBLE",
          nullable: false,
        },
        market_capitalization: {
          name: "market_capitalization",
          type: "DOUBLE",
          nullable: false,
        },
      },
      description: "Date and Price Information lacking time detail",
      foreignKeys: [
        {
          foreignFields: ["id"],
          foreignTable: "cryptocurrencies",
          localFields: ["cryptocurrencyId"],
          name: "cmc_historical_data_point_cryptocurrency_id",
        },
      ],
      name: "cmc_historical_data_point",
    },
    overrides
  );

module.exports = {
  getModel,
};
