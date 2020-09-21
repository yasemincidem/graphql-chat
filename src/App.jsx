import React from 'react';

const App = () => {
  console.log(process.env.NODE_ENV.replaceAll());
  return <div>Hello app!!</div>;
};

export default App;
