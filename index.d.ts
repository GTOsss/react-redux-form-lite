export interface IFieldMeta {
  focused: boolean;
  active: boolean;
  blurred: boolean;
  changed: boolean;
  warning: string;
  error: string;
}

export type MetaState<Values> = {
  [key in keyof Values]?: Values[key] extends object ? MetaState<Values[key]> : IFieldMeta;
};

export type MapMessages<Values> = {
  [key in keyof Values]?: Values[key] extends object ? MapMessages<Values[key]> : string | null;
};

export interface IFormState<Values> {
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

export interface IReduxFormState<Values> {
  form: IFormState<Values>;
  meta: MetaState<Values>;
  values: Values;
}

export type ValidateMethod = (value?: any) => string | undefined | null;
export type ValidateProps = Array<ValidateMethod> | ValidateMethod;

export interface IFullReduxFormState<Values> {
  [key: string]: IReduxFormState<Values> | IReduxFormWizard<Values> | undefined;
}

export interface IMapValidate {
  [key: string]: ValidateProps;
}

export interface IMapErrorsAndWarningsMessages<Values> {
  errors?: MapMessages<Values>;
  warnings?: MapMessages<Values>;
}

export interface IReduxFormSubmitEvent<Values> {
  values: Values;
  actions: IReduxFormActions<Values>;
  state: IReduxFormState<Values>;
  wizard?: IReduxFormWizard<Values>;
}

export interface IReduxFormActions<Values> {
  registerForm(form: string, wizard?: string): any;

  registerField(form: string, field: string, value: any, wizard?: string): any;

  change(form: string, field: string, value: any, wizard?: string): any;

  focus(form: string, field: string): any;

  blur(form: string, field: string): any;

  updateValidateMessage(form: string, field: string, value: any, wizard?: string): any;

  updateValidateMessages(form: string, errorsMap: MapMessages<any>, submitted?: boolean, wizard?: string): any;

  updateWarningMessage(form: string, field: string, value?: string, wizard?: string): any;

  updateWarningMessages(form: string, warningMap: MapMessages<Values>, submitted?: string, wizard?: string): any;

  updateValidateAndWarningMessages(
    form: string,
    map: IMapErrorsAndWarningsMessages<Values>,
    submitted?: boolean,
    wizard?: string,
  ): any;

  changeSubmitted(form: string, value: boolean): any;

  updateFormState(
    form: string,
    state: IReduxFormState<any>,
    wizard?: string,
    wizardState?: IReduxFormWizard<any>,
  ): any;

  removeField(form: string, field: string): any;

  removeForm(form: string): any;

  setInitialValues(form: string, initialValues: any, wizard?: string): any;

  resetForm(form: string, wizard?: string);

  arrayPush(form: string, field: string, value: any): any;
}

export type SubmitValidate<Values> = (values: Values) => MapMessages<Values>;

export interface IReduxFormParams<Values = {}> {
  form: string;
  wizard?: string;
  destroyOnUnmount?: boolean;
  validate?: SubmitValidate<any>;
  warn?: SubmitValidate<any>;
  initialValues?: Values;
}

export interface IWizardState<Values> {
  errorsMap: MapMessages<Values>;
  hasErrors: boolean;
  warningsMap: MapMessages<Values>;
  hasWarnings: boolean;
}

export interface IReduxFormWizard<Values> {
  wizard: IWizardState<Values>;
  values: Values;
}

export interface IReduxFormInjected<Values> {
  handleSubmit(): void;

  formParams: IReduxFormParams<Values>;
  formActions: IReduxFormActions<Values>;
  formState: IReduxFormState<Values>;
}

declare const reducer: () => IFullReduxFormState<any>;
// declare const reduxForm: ()