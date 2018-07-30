/**
 * Describes interacting with an underlying database in order
 * to work with hostorical data from coin market cap
 */

const QUADRILLION_6_DECIMAL = "DECIMAL(21, 6)"; // Quadrillion
const QUINTILLION_0_DECIMAL = "DECIMAL(18, 0)"; // Quintillion

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
      description: "Date and Price Information lacking time detail",
      name: "cmc_historical_data_point",
      columns: {
        id: {
          autoIncrement: true,
          name: "id",
          primaryKey: true,
          type: "BIGINT",
          unsigned: true,
        },
        cryptocurrencyId: {
          foreignKey: {
            table: "cryptocurrencies",
            fields: "id",
          },
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
          type: QUADRILLION_6_DECIMAL,
          nullable: false,
        },
        high: {
          name: "high",
          type: QUADRILLION_6_DECIMAL,
          nullable: false,
        },
        low: {
          name: "low",
          type: QUADRILLION_6_DECIMAL,
          nullable: false,
        },
        close: {
          name: "close",
          type: QUADRILLION_6_DECIMAL,
          nullable: false,
        },
        volume: {
          name: "volume",
          type: QUINTILLION_0_DECIMAL,
          nullable: false,
        },
        market_capitalization: {
          name: "market_capitalization",
          type: QUINTILLION_0_DECIMAL,
          nullable: false,
        },
      },
    },
    overrides
  );

module.exports = {
  getModel,
};
