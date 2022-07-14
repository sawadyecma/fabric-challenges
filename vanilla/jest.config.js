module.exports = {
  roots: ["./cases"],
  testMatch: ["**/?(*.)+(test).+(ts|tsx)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
