import React from 'react';
import { render } from 'react-dom';

import Quiz from './Quiz';

import './index.sass';

render(
  <React.StrictMode>
    <Quiz />
  </React.StrictMode>,
  document.getElementById('root')
);
