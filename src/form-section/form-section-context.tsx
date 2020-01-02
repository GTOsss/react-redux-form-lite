import React from 'react';
import {IFormSectionContext} from './types';

const defaultContext: IFormSectionContext = {
  name: '',
};

const ReduxFormContext = React.createContext<IFormSectionContext>(defaultContext);

export default ReduxFormContext;
