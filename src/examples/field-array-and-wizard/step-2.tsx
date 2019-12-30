import React from 'react';
import reduxForm from '../../redux-form';
import FieldArray from '../../field-array';
import Field from '../../field';
import {getIn, setIn} from '../../utils/object-manager';

const validateIsRequired = (value) => !value ? 'Field required.' : undefined;

let id = 0;

const getId = () => id++;

const submitValidate = (values) => {
  const result = {};
  const thirdUserFirstName = getIn(values, 'users[2].firstName');

  if (thirdUserFirstName && (thirdUserFirstName.length < 10)) {
    return setIn(result, 'users[2].firstName', 'Min length should be 10');
  }

  return {};
};

const Friends = (props) => {
  const {fields} = props;

  return (
    <div>
      <ul>
        {fields.map((friend) => (
          <li>
            <Field validate={validateIsRequired} name={`${friend}.firstName`} component="input" type="text" />
            <Field validate={validateIsRequired} name={`${friend}.secondName`} component="input" type="text" />
            <Field validate={validateIsRequired} name={`${friend}.contacts.phone`} component="input" type="text" />
          </li>
        ))}
      </ul>
      <button id="addFriendToUser" onClick={() => fields.push({id: getId()})}>Add friend</button>
    </div>
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
      <button type="button">Previous</button>
      <button type="submit">Next</button>
    </form>
  );
};

export default () => {
  id = 0;
  return reduxForm({
    form: 'step2',
    destroyOnUnmount: false,
    wizard: 'fieldArrayWizard',
    validate: submitValidate,
  })(FieldArrayExample);
};
