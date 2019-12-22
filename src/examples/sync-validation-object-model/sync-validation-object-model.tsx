import React from 'react';
import {Field, reduxForm} from '../../index';

const validationIsRequired = (value) => !value ? 'Field required.' : undefined;
const validationMinLength = (minLength) => (value) =>
  value && (value.length < minLength) ? `The minimum length of the value must be ${minLength}.` : undefined;

const validate = (values) => {
  const errors: MapMessages<any> = {
    profile: {
      firstName: validationIsRequired(values.profile.firstName),
      lastName: validationIsRequired(values.profile.lastName),
    },
  };

  return errors;
};

const warn = (values) => {
  const warnings: MapMessages<any> = {
    profile: {
      firstName: validationMinLength(2)(values.profile.firstName),
      lastName: validationMinLength(2)(values.profile.lastName),
    },
  };

  return warnings;
};

const SyncValidation = (props) => {
  const {handleSubmit} = props;
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>First Name</label>
        <div>
          <Field name="profile.firstName" component="input" type="text" placeholder="First Name" />
        </div>
      </div>
      <div>
        <label>Last Name</label>
        <div>
          <Field name="profile.lastName" component="input" type="text" placeholder="Last Name" />
        </div>
      </div>
      <div>
        <button type="submit">Submit</button>
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
