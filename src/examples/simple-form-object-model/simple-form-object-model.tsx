import React from 'react';
import {Field, reduxForm} from '../../index';

const validateIsRequired = (value) => !value ? 'Field required.' : undefined;
const validateMinLength = (minLength) => (value) =>
  value.length < minLength ? `Must be ${minLength} characters or more.` : undefined;

const SimpleFormObjectModel = (props) => {
  const {handleSubmit} = props;
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>First Name</label>
        <div>
          <Field
            validate={validateIsRequired}
            name="profile.firstName"
            component="input"
            type="text"
            placeholder="First Name"
          />
        </div>
      </div>
      <div>
        <label>Last Name</label>
        <div>
          <Field
            validate={[validateIsRequired, validateMinLength(2)]}
            name="profile.lastName"
            component="input"
            type="text"
            placeholder="Last Name"
          />
        </div>
      </div>
      <div>
        <label>Email</label>
        <div>
          <Field name="contacts.email" component="input" type="email" placeholder="Email" />
        </div>
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'simple',
})(SimpleFormObjectModel);
