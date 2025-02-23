import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import mantineTheme from './assets/theme/mantine-theme';

ReactDOM.render(
  <React.StrictMode>
    <MantineProvider theme={mantineTheme} withNormalizeCSS withGlobalStyles>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
