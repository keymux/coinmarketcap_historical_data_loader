const { expect } = require("chai");

const {
  _dedupMerge,
  _uniqueness,
  arrayOfColumnarMappedDataToInsert,
} = require("../../../src/databases/mysql");

/**
 * TODO: Better name and abstract into a module for shared usage
 */
const addActual = testSetFn => testSet =>
  Object.assign(testSet, {
    //actual: testSet.input.map(testSetMapFn),
    actual: testSetFn(testSet),
  });

describe("_uniqueness()", () => {
  // A test wrapper for the _uniqueness function
  const u = input => index => _uniqueness(input[index], index, input);

  const testSets = [
    /**
     * This is a good place to add newly discovered bugs so that regression
     * testing will be automatic in the future
     */
    {
      input: ["x", "y", "y"],
      expected: [true, true, false],
      it: "should pick up a duplicate at the end of the array",
    },
    {
      input: ["x", "x", "y"],
      expected: [true, false, true],
      it: "should pick up a duplicate at the beginning of the array",
    },
  ].map(testSet =>
    addActual(testSet =>
      testSet.input.map((x, index, array) => u(array)(index))
    )(testSet)
  );

  testSets.forEach(testSet =>
    it(testSet.it, () => expect(testSet.actual).to.deep.equal(testSet.expected))
  );

  it("should act as an Array.filter callback to de-duplicate an array", () => {
    const input = ["y", "a", "y", "b", "y", "c", "b", "d", "x", "c"];
    const expected = ["y", "a", "b", "c", "d", "x"];
    const actual = input.filter(_uniqueness);

    expect(actual).to.deep.equal(expected);
  });
});

describe("_dedupMerge()", () => {
  const testSets = [
    /**
     * This is a good place to add newly discovered bugs so that regression
     * testing will be automatic in the future
     */
    {
      input: [["x", "y"], ["x", "z"], ["y", "z"]],
      expected: ["x", "y", "z"],
      it: "should dedupMerge",
    },
    {
      input: [["z", "y"], ["z", "x"], ["y", "x"]],
      expected: ["z", "y", "x"],
      it: "should dedupMerge left",
    },
  ].map(testSet =>
    addActual(testSet => testSet.input.reduce(_dedupMerge, []))(testSet)
  );

  testSets.forEach(testSet =>
    it(testSet.it, () => expect(testSet.actual).to.deep.equal(testSet.expected))
  );
});

describe("arrayOfColumnarMappedDataToInsert()", () => {
  const testSets = [
    /**
     * This is a good place to add newly discovered bugs so that regression
     * testing will be automatic in the future
     */
    {
      input: [
        {
          a: "b",
        },
        {
          c: "d",
        },
      ],
      expected: '("a","c")\nVALUES\n("b",null),\n(null,"d")',
      it: "should assume null for fields not provided",
    },
  ].map(testSet =>
    addActual(testSet => arrayOfColumnarMappedDataToInsert(testSet.input))(
      testSet
    )
  );

  testSets.forEach(testSet =>
    it(testSet.it, () => expect(testSet.actual).to.deep.equal(testSet.expected))
  );
});
