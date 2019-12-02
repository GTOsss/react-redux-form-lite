import React from 'react';
import {Field, reduxForm} from '../../index';

const validationIsRequired = (value) => !value ? 'Field required.' : undefined;
const validationMinLength = (value) =>
  value && (value.length < 2) ? 'The minimum length of the value must be 2.' : undefined;
const validationMinLength3 = (value) =>
  value && (value.length < 3) ? 'The minimum length of the value must be 3.' : undefined;

const validate = (values) => {
  const errors: MapMessages<any> = {};

  errors.firstName = validationIsRequired(values.firstName);
  errors.lastName = validationIsRequired(values.lastName);

  return errors;
};

const warn = (values) => {
  const warnings: MapMessages<any> = {};

  warnings.lastName = validationMinLength(values.lastName);

  return warnings;
};

const Step1Component = (props) => {
  const {handleSubmit} = props;

  return (
    <form onSubmit={handleSubmit}>
      <Field validate={validationMinLength3} name="firstName" component="input" type="text" placeholder="First Name" />
      <Field validate={validationMinLength3} name="lastName" component="input" type="text" placeholder="Last Name" />
      <button type="button">Previous</button>
      <button type="submit">Next</button>
    </form>
  );
};

const Step1 = reduxForm({
  form: 'step1',
  wizard: 'wizardExample',
  validate,
  warn,
  destroyOnUnmount: false,
})(Step1Component);

export default Step1;
