import React from 'react';
import GlobalStyles from './styles/global';
import Header from './Components/Header';
import Repositories from './Components/Repositories';

function App(){
  return(
    <>
      <Header />
      <Repositories />

      <GlobalStyles />
    </>
  );
}

export default App;