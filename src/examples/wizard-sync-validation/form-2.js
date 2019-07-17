import React from 'react';
import {Field, reduxForm} from '../../index';

const validationIsRequired = (value) => !value ? 'Field required.' : undefined;
const validationMinLength = (value) =>
  value && (value.length < 2) ? 'The minimum length of the value must be 2.' : undefined;

const validate = (values) => {
  const errors = {};

  errors.phone = validationIsRequired(values.phone);
  errors.email = validationIsRequired(values.email);

  return errors;
};

const warn = (values) => {
  const warnings = {};

  warnings.email = validationMinLength(values.email);

  return warnings;
};

const FormComponent2 = (props) => {
  const {handleSubmit, prevPage} = props;

  return (
    <form onSubmit={handleSubmit}>
      <Field name="phone" component="input" type="text" placeholder="Phone" />
      <Field name="email" component="input" type="text" placeholder="Email" />
      <button type="button" onClick={prevPage}>Previous</button>
      <button type="submit">Next</button>
    </form>
  );
};

const Form2 = reduxForm({
  form: 'step2',
  wizard: 'wizard',
  destroyOnUnmount: false,
  validate,
  warn,
})(FormComponent2);

export default Form2;
