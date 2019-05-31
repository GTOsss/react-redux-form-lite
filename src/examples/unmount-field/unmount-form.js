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


const UnmountForm = (props) => {
  const {handleSubmit, showLastName = false} = props;
  const [visibleLastName, setVisibleLastName] = useState(showLastName);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>First Name</label>
        <div>
          <Field name="firstName" component="input" type="text" placeholder="First Name" />
        </div>
      </div>
      <Field
        name="withLastName"
        component="input"
        type="checkbox"
        onChange={(e) => setVisibleLastName(e.target.checked)}
      />
      {visibleLastName ? (
        <div>
          <label>Last Name</label>
          <div>
            <Field name="lastName" component="input" type="text" placeholder="Last Name" />
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
