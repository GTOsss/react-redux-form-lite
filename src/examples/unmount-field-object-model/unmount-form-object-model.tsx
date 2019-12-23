import React from 'react';
import {Field, reduxForm} from '../../index';
import {getIn} from '../../utils/object-manager';

const validate = (values) => {
  const errors: MapMessages<any> = {};

  if (!values.lastName) {
    errors.lastName = 'Field required.';
  }

  return errors;
};

const warn = (values) => {
  const warnings: MapMessages<any> = {};

  if (values.lastName && values.lastName.length <= 2) {
    warnings.lastName = 'The minimum length of the value must be 2.';
  }

  return warnings;
};

const UnmountForm = (props) => {
  const {formState, handleSubmit} = props;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>First Name</label>
        <div>
          <Field name="profile.firstName" component="input" type="text" placeholder="First Name" />
        </div>
      </div>
      <Field
        name="onlyForFront.noRequest.withLastName"
        component="input"
        type="checkbox"
      />
      {getIn(formState, 'values.onlyForFront.noRequest.withLastName', false) ? (
        <div>
          <label>Last Name</label>
          <div>
            <Field name="profile.lastName" component="input" type="text" placeholder="Last Name" />
          </div>
        </div>
      ) : null}
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'example',
  validate,
  warn,
})(UnmountForm);
