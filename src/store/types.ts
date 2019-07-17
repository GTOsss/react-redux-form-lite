export type MapFieldsString<Values> = {
  [key in keyof Values]?: Values[key] extends object ? MapFieldsString<Values[key]> : string;
};

export interface IFieldMeta {
  focused: boolean;
  active: boolean;
  blurred: boolean;
  changed: boolean;
  warning: string;
  error: string;
}

export type MapFieldsMeta<Values> = {
  [key in keyof Values]?: Values[key] extends object ? MapFieldsMeta<Values[key]> : IFieldMeta;
};

export interface IFormInState<Values> {
  submitted: boolean;
  focused: boolean;
  blurred: boolean;
  changed: boolean;
  errorsMap: MapFieldsString<Values>;
  hasErrors: boolean;
  warningsMap: MapFieldsString<Values>;
  hasWarnings: boolean;
  activeField: string;
}

export interface IFormState<Values> {
  form: IFormInState<Values>;
  meta: MapFieldsMeta<Values>;
  values: Values;
}