import React from 'react';

const FieldArrayContext = React.createContext({});

export default FieldArrayContext;

export interface IFieldArrayContext {
  name: string;
}
