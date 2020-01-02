import React from 'react';
import {Field, FormSection, FieldArray, reduxForm} from '../../index';

const validateIsRequired = (value) => !value ? 'Field required.' : undefined;

let id = 0;

const getId = () => id++;

const Users = (props) => {
  const {fields, pushUser} = props;

  const push = () => {
    if (pushUser) {
      pushUser(fields);
    } else {
      fields.push({id: getId()});
    }
  };

  return (
    <div>
      <ul>
        {fields.map((user) => (
          <li>
            <Field validate={validateIsRequired} name={`${user}.firstName`} component="input" type="text" />
          </li>
        ))}
      </ul>
      <button id="addUser" onClick={push}>Add user</button>
    </div>
  );
};

const FormSectionExample = (props) => {
  const {handleSubmit} = props;
  return (
    <form onSubmit={handleSubmit}>
      <FormSection name="userFormSection">
        <div>
          <label>First Name</label>
          <div>
            <Field name="firstName" validate={validateIsRequired} component="input" type="text" placeholder="First Name" />
          </div>
        </div>
        <div>
          <label>Last Name</label>
          <div>
            <Field name="lastName" component="input" type="text" placeholder="Last Name" />
          </div>
        </div>
        <div>
          <label>Email</label>
          <div>
            <Field name="contacts.email" component="input" type="email" placeholder="Email" />
          </div>
        </div>
        <FieldArray component={Users} name="users" />
      </FormSection>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default () => {
  id = 0;
  return reduxForm({
    form: 'simple',
  })(FormSectionExample);
};
