module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "services/*.js",
    "controllers/*.js",
    "middleware/*.js",
    "routes/*.js",
    "!**/node_modules/**"
  ]
};
