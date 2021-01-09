module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        shippedProposals: true,
        targets: {
          // last 2 years of browsers
          browsers: ['chrome > 55', 'edge > 15', 'firefox > 50', 'safari > 10.1', 'opera > 42'],
        },
        useBuiltIns: 'entry',
        corejs: '3.6.5',
      },
    ],
    '@babel/preset-react',
    '@babel/preset-flow',
  ]
}