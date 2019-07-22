export interface IMapValidateErrorsAndWarnings {
  validate?: IMapValidate;
  warn?: IMapValidate;
}

export interface IValues {
  [key: string]: any;
}

export interface IMapSubmitValidate {
  validate?: SubmitValidate<any>;
  warn?: SubmitValidate<any>;
}