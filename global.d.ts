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

type validateMethod = (value?: any) => string | undefined | null;
type validateProps = Array<validateMethod> | validateMethod;

interface IFullReduxFormState<Values> {
  [key: string]: IReduxFormState<Values> | undefined;
}

interface IMapValidate {
  [key: string]: validateProps;
}

interface IMapErrorsAndWarningsMessages<Values> {
  errors?: MapMessages<Values>;
  warnings?: MapMessages<Values>;
}

interface IReduxFormActions<Values> {
  registerForm(form: string): any;

  registerField(form: string, field: string, value: any): any;

  change(form: string, field: string, value: any): any;

  focus(form: string, field: string): any;

  blur(form: string, field: string): any;

  updateValidateMessage(form: string, field: string, value: any): any;

  updateValidateMessages(form: string, errorsMap: MapMessages<any>, submitted?: boolean): any;

  updateWarningMessage(form: string, field: string, value?: string): any;

  updateWarningMessages(form: string, warningMap: MapMessages<Values>, submitted?: string): any;

  updateValidateAndWarningMessages(form: string, map: IMapErrorsAndWarningsMessages<Values>, submitted?: boolean): any;

  changeSubmitted(form: string, value: boolean): any;

  updateFormState(form: string, state: IReduxFormState<any>): any;

  removeField(form: string, field: string): any;

  removeForm(form: string): any;

  arrayPush(form: string, field: string, value: any): any;
}

type submitValidate = (values) => MapMessages<typeof values>;