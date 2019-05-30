import React from 'react';
import { Field, reduxForm } from '../../index';

const validationIsRequired = (value) => !value ? 'Field required.' : undefined;
const validationMinLength = (minLength) => (value) =>
  value && (value.length < minLength) ? `The minimum length of the value must be ${minLength}.` : undefined;

const validate = (values) => {
  const errors = {};

  errors.firstName = validationIsRequired(values.firstName);
  errors.lastName = validationIsRequired(values.lastName);

  return errors;
};

const warn = (values) => {
  const warnings = {};

  warnings.firstName = validationMinLength(2)(values.firstName);
  warnings.lastName = validationMinLength(2)(values.lastName);

  return warnings;
};

const SyncValidation = (props) => {
  const { handleSubmit, pristine, reset, submitting, onSubmit} = props;
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>First Name</label>
        <div>
          <Field name="firstName" component="input" type="text" placeholder="First Name" />
        </div>
      </div>
      <div>
        <label>Last Name</label>
        <div>
          <Field name="lastName" component="input" type="text" placeholder="Last Name" />
        </div>
      </div>
      <div>
        <button type="submit" disabled={pristine || submitting}>Submit</button>
      </div>
    </form>
  );
};

SyncValidation.displayName = 'InnerSyncValidation';

export default reduxForm({
  form: 'example',
  validate,
  warn,
})(SyncValidation);