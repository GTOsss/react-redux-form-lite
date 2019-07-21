interface IFieldMeta {
  focused: boolean;
  active: boolean;
  blurred: boolean;
  changed: boolean;
  warning: string;
  error: string;
}

type IMetaState<Values> = {
  [key in keyof Values]?: Values[key] extends object ? IMetaState<Values[key]> : IFieldMeta;
};

type MapMessages<Values> = {
  [key in keyof Values]?: Values[key] extends object ? MapMessages<Values[key]> : string | null;
};

interface IFormState<Values> {
  submitted: boolean;
  focused: boolean;
  blurred: boolean;
  changed: boolean;
  errorsMap: MapMessages<Values>;
  hasErrors: boolean;
  warningsMap: MapMessages<Values>;
  hasWarnings: boolean;
  activeField: string;
}

interface IReduxFormState<Values> {
  form: IFormState<Values>;
  meta: IMetaState<Values>;
  values: Values;
}

interface IFullReduxFormState<Values> {
  [key: string]: IReduxFormState<Values> | undefined;
}
