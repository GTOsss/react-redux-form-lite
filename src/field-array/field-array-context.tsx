import React from 'react';

const FieldArrayContext = React.createContext({});

export default FieldArrayContext;

export interface IFieldArrayContext {
  fieldArray: string;
}
