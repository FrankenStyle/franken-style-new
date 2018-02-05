import React from 'react';
import ReactDOM from 'react-dom';
import Button from '../../app/components/Button';

chrome.storage.local.get('state', (obj) => {
  const { state } = obj;
  const initialState = JSON.parse(state || '{}');

  const createStore = require('../../app/store/configureStore');

  ReactDOM.render(
    <Button store={createStore(initialState)} />,
    document.querySelector('#popup')
  );
});
