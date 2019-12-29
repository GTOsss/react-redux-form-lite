import React from 'react';
import {IFormContext} from './types';

const defaultContext: IFormContext = {
  form: '',
  updateValidateAndWarnMap: () => {},
};

const ReduxFormContext = React.createContext<IFormContext>(defaultContext);

export default ReduxFormContext;
