import React from 'react';
import {Field, reduxForm} from '../../index';
import {IValues} from './initial-values-object-model.test';

const SimpleForm = (props) => {
  const {handleSubmit, formActions: {resetForm}} = props as IReduxFormInjected<{}>;
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
        <label>Email</label>
        <div>
          <Field name="contacts.email" component="input" type="email" placeholder="Email" />
        </div>
      </div>
      <div>
        <label>Sex</label>
        <div>
          <label><Field name="profile.sex" component="input" type="radio" value="male" /> Male</label>
          <label><Field name="profile.sex" component="input" type="radio" value="female" /> Female</label>
        </div>
      </div>
      <div>
        <label>Favorite Color</label>
        <div>
          <Field name="additionalInfo.favoriteColor" component="select">
            <option />
            <option value="ff0000">Red</option>
            <option value="00ff00">Green</option>
            <option value="0000ff">Blue</option>
          </Field>
        </div>
      </div>
      <div>
        <label htmlFor="additionalInfo.employed">Employed</label>
        <div>
          <Field name="employed" id="employed" component="input" type="checkbox" />
        </div>
      </div>
      <div>
        <label>Notes</label>
        <div>
          <Field name="additionalInfo.more.notes" component="textarea" />
        </div>
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
      <div>
        <button id="resetForm" type="submit" onClick={() => resetForm('simple')}>Reset</button>
      </div>
    </form>
  );
};

export default reduxForm<IValues>({
  form: 'simple',
  initialValues: {
    profile: {
      firstName: 'Timofey',
      lastName: 'Goncharov',
    },
    contacts: {
      email: 'test@mail.ru',
    },
    additionalInfo: {
      employed: true,
      favoriteColor: 'ff0000',
      more: {
        notes: 'text for notes',
      },
    },
  },
})(SimpleForm);
