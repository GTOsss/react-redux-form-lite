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
  validate: submitValidate;
  warn: submitValidate;
}
