import React from 'react';
import {Field, reduxForm} from '../../index';

const validationIsRequired = (value) => !value ? 'Field required.' : undefined;
const validationMinLength = (value) =>
  value && (value.length < 2) ? 'The minimum length of the value must be 2.' : undefined;

const Step3Component = (props) => {
  const {handleSubmit, prevPage} = props;

  return (
    <form onSubmit={handleSubmit}>
      <Field validate={validationIsRequired} name="dob" component="input" type="text" placeholder="Date of birthday" />
      <Field
        warn={validationMinLength}
        validate={validationIsRequired}
        name="hobby"
        component="input"
        type="text"
        placeholder="Hobby"
      />
      <button type="button" onClick={prevPage}>Previous</button>
      <button type="submit">Submit</button>
    </form>
  );
};

const Step3 = reduxForm({
  form: 'step3',
  wizard: 'wizardExample',
  destroyOnUnmount: false,
})(Step3Component);

export default Step3;
