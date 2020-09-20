module.exports = {
  presets: ['@babel/preset-env', '@babel/react', '@babel/preset-flow'],
  plugins: [],
  babelrcRoots: [
    // Keep the root as a root
    ".",
  
    // Also consider monorepo packages "root" and load their .babelrc.json files.
    "./api/*"
  ]
};
