import React from 'react';
import {Field, reduxForm} from '../../index';

const validationIsRequired = (value) => !value ? 'Field required.' : undefined;
const validationMinLength = (value) =>
  value && (value.length < 2) ? 'The minimum length of the value must be 2.' : undefined;

const validate = (values) => {
  const errors: MapMessages<any> = {};

  errors.dob = validationIsRequired(values.dob);
  errors.hoddy = validationIsRequired(values.hoddy);

  return errors;
};

const warn = (values) => {
  const warnings: MapMessages<any> = {};

  warnings.hoddy = validationMinLength(values.hoddy);

  return warnings;
};

const Step3Component = (props) => {
  const {handleSubmit, prevPage} = props;

  return (
    <form onSubmit={handleSubmit}>
      <Field name="dob" component="input" type="text" placeholder="Date of birthday" />
      <Field name="hobby" component="input" type="text" placeholder="Hobby" />
      <button type="button" onClick={prevPage}>Previous</button>
      <button type="submit">Submit</button>
    </form>
  );
};

const Step3 = reduxForm({
  form: 'step3',
  wizard: 'wizardExample',
  validate,
  warn,
  destroyOnUnmount: false,
})(Step3Component);

export default Step3;
