const config = {
  // ignore: [/node_modules/, '**/*.spect.js', '**/*.test.js', '**/test/*'],
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: '8.1'
      }
    }]
  ]
}

// if (process.env.BABEL_ENV === 'test') {
//   Object.assign(config, {
//     ignore: [/node_modules/],
//   })
// }

module.exports = config
