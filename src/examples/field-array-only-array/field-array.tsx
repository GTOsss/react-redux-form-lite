import React from 'react';
import reduxForm from '../../redux-form';
import FieldArray from '../../field-array';
import Field from '../../field';
import {getIn, setIn} from '../..';

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
  const {fields, fieldArray} = props;

  return (
    <div>
      <ul>
        {fields.map((friend, i) => (
          <li>
            <Field validate={validateIsRequired} name={`${friend}.firstName`} component="input" type="text" />
            <Field validate={validateIsRequired} name={`${friend}.secondName`} component="input" type="text" />
            <Field validate={validateIsRequired} name={`${friend}.contacts.phone`} component="input" type="text" />
            <button
              id="removeFriend"
              type="button"
              onClick={() => fields.remove(fieldArray[i].id)}
            >
              Remove friend
            </button>
          </li>
        ))}
      </ul>
      <button id="addFriendToUser" onClick={() => fields.push({id: getId()})}>Add friend</button>
    </div>
  );
};

const Users = (props) => {
  const {fields, pushUser, fieldArray} = props;

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
        {fields.map((user, i) => (
          <li>
            <Field validate={validateIsRequired} name={`${user}.firstName`} component="input" type="text" />
            <Field validate={validateIsRequired} name={`${user}.secondName`} component="input" type="text" />
            <Field validate={validateIsRequired} name={`${user}.about.hobby`} component="input" type="text" />
            <FieldArray name={`${user}.friends`} component={Friends} />
            <button
              id="removeUser"
              type="button"
              onClick={() => fields.remove(fieldArray[i].id)}
            >
              Remove friend
            </button>
          </li>
        ))}
      </ul>
      <button id="addUser" onClick={push}>Add user</button>
    </div>
  );
};

const FieldArrayExample = (props) => {
  const {handleSubmit, pushUser} = props;

  return (
    <form onSubmit={handleSubmit}>
      <FieldArray name="users" component={Users} pushUser={pushUser} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default () => {
  id = 0;
  return reduxForm({
    form: 'fieldArrayExample',
    validate: submitValidate,
  })(FieldArrayExample);
};
