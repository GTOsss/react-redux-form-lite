interface IFieldMeta {
  focused: boolean;
  active: boolean;
  blurred: boolean;
  changed: boolean;
  warning: string;
  error: string;
}

type MetaState<Values> = {
  [key in keyof Values]?: Values[key] extends object ? MetaState<Values[key]> : IFieldMeta;
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
  meta: MetaState<Values>;
  values: Values;
}

type ValidateMethod = (value?: any) => string | undefined | null;
type ValidateProps = Array<ValidateMethod> | ValidateMethod;

interface IFullReduxFormState<Values> {
  [key: string]: IReduxFormState<Values> | IReduxFormWizard<Values> | undefined;
}

interface IMapValidate {
  [key: string]: ValidateProps;
}

interface IMapErrorsAndWarningsMessages<Values> {
  errors?: MapMessages<Values>;
  warnings?: MapMessages<Values>;
}

interface IReduxFormSubmitEvent<Values> {
  values: Values;
  actions: IReduxFormActions<Values>;
  state: IReduxFormState<Values>;
  wizard?: IReduxFormWizard<Values>;
}

interface IReduxFormActions<Values> {
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

  arrayPush(form: string, field: string, value: any): any;
}

type SubmitValidate<Values> = (values: Values) => MapMessages<Values>;

interface IReduxFormParams<Values = {}> {
  form: string;
  wizard?: string;
  destroyOnUnmount?: boolean;
  validate?: SubmitValidate<any>;
  warn?: SubmitValidate<any>;
  initialValues?: Values;
}

interface IWizardState<Values> {
  errorsMap: MapMessages<Values>;
  hasErrors: boolean;
  warningsMap: MapMessages<Values>;
  hasWarnings: boolean;
}

interface IReduxFormWizard<Values> {
  wizard: IWizardState<Values>;
  values: Values;
}
