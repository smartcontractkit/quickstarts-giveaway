module.exports = {
  globals: {
    NODE_ENV: 'test',
  },
  moduleDirectories: [
    'node_modules',
    'src',
  ],
  moduleFileExtensions: [
    'js',
    'json',
    'jsx',
    'ts',
    'tsx',
  ],
  setupFilesAfterEnv: [`${__dirname}/src/setupTests.ts`],
  globalSetup:  `${__dirname}/src/setupTestsGlobal.ts`,
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        diagnostics: true,
      },
    ],
  },
  verbose: true,
  moduleNameMapper: {
    '@ui/(.*)': '<rootDir>/./src/$1',
  },
  preset: 'ts-jest',
}
