import React, {useState} from 'react';
import {Field, reduxForm} from '../../index';

const validate = (values) => {
  const errors = {};

  if (!values.lastName) {
    errors.lastName = 'Field required.';
  }

  return errors;
};

const warn = (values) => {
  const warnigns = {};

  if (values.lastName && values.lastName.length <= 2) {
    warnigns.lastName = 'The minimum length of the value must be 2.';
  }

  return warnigns;
};

const FormComponent = (props) => {
  const {handleSubmit} = props;

  return (
    <form onSubmit={handleSubmit}>
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
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

const Form = reduxForm({
  form: 'example',
  validate,
  warn,
})(FormComponent);

const UnmountForm = () => {
  const [showForm, setShowForm] = useState(true);

  return (
    <div>
      {showForm ? (
        <Form />
      ) : null}
      <button type="button" onClick={() => setShowForm(!showForm)}>
        Toggle show form
      </button>
    </div>
  );
};

export default UnmountForm;
