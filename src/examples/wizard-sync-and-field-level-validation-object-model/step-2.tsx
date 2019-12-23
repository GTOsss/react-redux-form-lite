import React from 'react';
import {Field, reduxForm} from '../../index';

const validationIsRequired = (value) => !value ? 'Field required.' : undefined;
const validationMinLength = (value) =>
  value && (value.length < 2) ? 'The minimum length of the value must be 2.' : undefined;

const validate = (values) => {
  const errors: MapMessages<any> = {
    profile: {
      email: validationIsRequired(values.profile.email),
    },
    contacts: {
      phone: validationIsRequired(values.contacts.phone),
    },
  };

  return errors;
};

const warn = (values) => {
  const warnings: MapMessages<any> = {
    profile: {
      email: validationMinLength(values.profile.email),
    },
  };

  return warnings;
};

const Step2Component = (props) => {
  const {handleSubmit, prevPage} = props;

  return (
    <form onSubmit={handleSubmit}>
      <Field name="contacts.phone" component="input" type="text" placeholder="Phone" />
      <Field name="profile.email" component="input" type="text" placeholder="Email" />
      <button type="button" onClick={prevPage}>Previous</button>
      <button type="submit">Next</button>
    </form>
  );
};

const Step2 = reduxForm({
  form: 'step2',
  wizard: 'wizardExample',
  validate,
  warn,
  destroyOnUnmount: false,
})(Step2Component);

export default Step2;
