export default {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: false,
        modules: false
      }
    ]
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      regenerator: true
    }]
  ]
}
