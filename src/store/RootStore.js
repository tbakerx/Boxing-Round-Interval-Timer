import React from 'react';
import TimerStore from './TimerStore';

export class RootStore {
  timerStore = new TimerStore();
}

const initializedStores = new RootStore();

export const storesContext = React.createContext(initializedStores);
