import React, {Component} from 'react';
import {Field, reduxForm} from '../../index';

const validateIsRequired = (value) => !value ? 'Field required.' : undefined;
const validateMinLength = (minLength) => (value) =>
  value.length < minLength ? `Must be ${minLength} characters or more.` : undefined;

const warnTooYang = (value) => Number.parseInt(value) < 18 ? 'Too yang' : undefined;
const warnTooSmall = (value) => Number.parseInt(value) < 0 ? 'Too small' : undefined;
const warnTooLarge = (value) => Number.parseInt(value) > 100 ? 'Too too large' : undefined;

const Input = ({label, meta: {error, warning, blurred}}) => (
  <div>
    <label>{label}</label>
    <input type="text" />
    {blurred && error ? (
      <div
        className={`message ${error ? 'message_error' : ''} ${error ? 'message_warning' : ''}`}
      >
        {warning || error}
      </div>
    ) : null}
  </div>
);

class FieldLevelValidate extends Component {
  render() {
    const {handleSubmit, pristine, reset, submitting} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Field
          label="First Name"
          validate={validateIsRequired}
          name="firstName"
          component={Input}
          type="text"
          placeholder="First Name"
        />
        <Field
          label="Last Name"
          validate={[validateIsRequired, validateMinLength(2)]}
          name="age"
          component={Input}
          type="text"
          placeholder="Last Name"
        />
        <Field
          label="Age"
          validate={[validateIsRequired]}
          warn={warnTooYang}
          name="age"
          component={Input}
          type="text"
          placeholder="Age"
        />
        <Field
          label="Number from 0 to 100"
          warn={[warnTooSmall, warnTooLarge]}
          name="number"
          component={Input}
          type="text"
          placeholder="Number from 0 to 100"
        />
        <div>
          <button type="submit" disabled={pristine || submitting}>Submit</button>
          <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'simple',
})(FieldLevelValidate);
