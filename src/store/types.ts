export interface IMapErrorsAndWarningsMessages<Values> {
  errors?: MapMessages<Values>;
  warnings?: MapMessages<Values>;
}

export type validateMethod = (value?: any) => string | undefined | null;

export type validateProps = Array<validateMethod> | validateMethod;

export interface IMapValidate {
  [key: string]: validateProps;
}

export interface IMapValidateErrorsAndWarnings {
  validate?: IMapValidate;
  warn?: IMapValidate;
}

export interface IValues {
  [key: string]: any;
}

export type submitValidate = (values) => MapMessages<typeof values>;

export interface IMapSubmitValidate {
  validate?: submitValidate;
  warn?: submitValidate;
}