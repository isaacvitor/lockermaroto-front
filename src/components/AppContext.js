import React from 'react';
const user = JSON.parse(localStorage.getItem('@lockermaroto:user')) || null;

export const context = {
  user,
  applicationPreferences: {
    controlByInventory: { disabled: false, timeCheckout: 10000, timeCheckin: 10000 },
    doorOpenAlarm: { disabled: true, timeout: 20000 }, //doorOpenAlarm
    lockOnClose: { disabled: true, timeout: 3000 }
  },
  verticalMenu: {
    reference: null,
    visible: false
  }
};

export const AppContext = React.createContext(context);
