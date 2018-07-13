/**
 * Acts as an Array.filter callback to de-duplicate an array (dedup left)
 *
 * TODO: Generalize into a Filters library
 *
 * @param {varies} element - The array element
 * @param {number} index - The array index
 * @param {array} array - The source array
 *
 * @return {boolean} - Returns whether or not the given element is present elsewhere in the array
 */
const _uniqueness = (element, index, array) => {
  return !array.slice(0, index).includes(element);
};

/**
 * Acts as an Array.reduce callback to merge a collection of arrays
 * and deduplicate the contained values (retaining the left most duplicate).
 *
 * TODO: Generalize into a Reducers library
 *
 * @param {array} accumulator - An accumulator (see Array.reduce)
 * @param {array} array - An array from the collection of arrays
 */
const _dedupMerge = (acc, array) => acc.concat(array).filter(_uniqueness);

/**
 * Takes in an array of maps containing columnar mapped data and
 * produces a mysql insert statement.
 *
 * Assumes all fields provided exist in the database.
 *
 * TODO: Generalize this to provide flexibility to support more
 * database formats.
 *
 * @param {array} data - An array of maps of columnar data
 *
 * @returns {string} - A mysql insert query
 */
const arrayOfColumnarMappedDataToInsert = data => {
  const fields = data
    .map(row => {
      // Return the fields present in the row data
      return Object.keys(row);
    })
    .reduce(_dedupMerge, []);

  const colsLine = `("${fields.join('","')}")\n`;
  const fieldsLines = data.map(dataRow =>
    fields
      .map(key => dataRow[key])
      .map(value => (value === undefined ? "null" : `"${value}"`))
  );

  return `${colsLine}VALUES\n(${fieldsLines.join("),\n(")})`;
};

module.exports = {
  // private (i.e. no contract)
  _dedupMerge,
  _uniqueness,
  // public
  arrayOfColumnarMappedDataToInsert,
};
