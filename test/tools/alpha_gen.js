const RandExp = require("randexp");
const alphaRandExp = new RandExp(/[A-Za-z]{10,30}/);

const alphaGen = () => {
  const gen = alphaRandExp.gen();

  return gen;
};

module.exports = {
  alphaGen,
};
