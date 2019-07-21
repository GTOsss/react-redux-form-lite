export interface IWrappedComponentProps<Values> {
  formParams: IReduxFormParams;
  formActions: IReduxFormActions<Values>;
  formState: IReduxFormState<Values>;

  onSubmit(values: any, state: IReduxFormState<Values>, actions: IReduxFormActions<Values>): void;
}

export interface IReduxFormParams {
  form: string;
  wizard: string;
  destroyOnUnmount: boolean;
  validate: submitValidate<any>;
  warn: submitValidate<any>;
}

export type updateValidateAndWarnMap = (field: string, validate: validateProps, warning: validateProps) => void;

export interface IFormContext extends IReduxFormParams {
  updateValidateAndWarnMap: updateValidateAndWarnMap;
}
