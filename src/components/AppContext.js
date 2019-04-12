import React from 'react';
const user = JSON.parse(localStorage.getItem('@lockermaroto:user')) || null;

export const context = {
  user,
  verticalMenu: {
    reference: null,
    visible: false
  }
};

export const AppContext = React.createContext(context);
