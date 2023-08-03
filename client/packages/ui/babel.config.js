module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
      },
    ],
    [
      '@babel/plugin-transform-runtime',
      {
        legacy: true,
        loose: false,
      }
    ],
  ],
};
