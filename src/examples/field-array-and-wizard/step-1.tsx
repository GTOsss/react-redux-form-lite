import React from 'react';
import {Field, reduxForm} from '../../index';

const SimpleForm = (props) => {
  const {handleSubmit} = props;
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name your group</label>
        <div>
          <Field name="step1Input" component="input" type="text" />
        </div>
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'step1',
  destroyOnUnmount: false,
  wizard: 'fieldArrayWizard',
})(SimpleForm);
