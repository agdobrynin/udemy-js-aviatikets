module.exports = {
    clearMocks: true,
    collectCoverageFrom: ["src/**/*.js"],
    coverageDirectory: "coverage",
    moduleFileExtensions: ["js"],
    testMatch: ["**/__test__/**/*.js?(x)", "**/?(.*)+(spec|test).js?(x)"],
    transformIgnorePatterns: ["<rootDir>/node_modules/"],
    transform: {
        ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
        "^.+\\.(js|jsx)?$": "babel-jest"
    },
    verbose: true,
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/js/$1",
    }
};