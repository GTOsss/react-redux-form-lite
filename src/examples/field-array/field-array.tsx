import React from 'react';
import reduxForm from '../../redux-form';
import FieldArray from '../../field-array';
import Field from '../../field';

const validateIsRequired = (value) => !value ? 'Field required.' : undefined;

let id = 0;

const getId = () => id++;

const Friends = (props) => {
  const {fields} = props;

  return (
    <ul>
      {fields.map((friend) => (
        <li>
          <Field validate={validateIsRequired} name={`${friend}.firstName`} component="input" type="text" />
          <Field validate={validateIsRequired} name={`${friend}.secondName`} component="input" type="text" />
          <Field validate={validateIsRequired} name={`${friend}.contacts.phone`} component="input" type="text" />
        </li>
      ))}
    </ul>
  );
};

const Users = (props) => {
  const {fields} = props;

  return (
    <div>
      <ul>
        {fields.map((user) => (
          <li>
            <Field validate={validateIsRequired} name={`${user}.firstName`} component="input" type="text" />
            <Field validate={validateIsRequired} name={`${user}.secondName`} component="input" type="text" />
            <Field validate={validateIsRequired} name={`${user}.about.hobby`} component="input" type="text" />
            <FieldArray name={`${user}.friends`} component={Friends} />
          </li>
        ))}
      </ul>
      <button id="addUser" onClick={() => fields.push({id: getId()})}>Add user</button>
    </div>
  );
};

const FieldArrayExample = (props) => {
  const {handleSubmit} = props;

  return (
    <form onSubmit={handleSubmit}>
      <Field validate={validateIsRequired} name="groupName" component="input" type="text" />
      <FieldArray name="users" component={Users} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default () => {
  id = 0;
  return reduxForm({form: 'fieldArrayExample'})(FieldArrayExample);
};
