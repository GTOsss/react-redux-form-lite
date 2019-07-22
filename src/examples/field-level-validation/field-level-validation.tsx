import React, {Component, FormEvent} from 'react';
import {Field, reduxForm} from '../../index';

const validateIsRequired = (value) => !value ? 'Field required.' : undefined;
const validateMinLength = (minLength) => (value) =>
  value.length < minLength ? `Must be ${minLength} characters or more.` : undefined;

const warnTooYang = (value) => Number.parseInt(value, 10) < 18 ? 'Too yang.' : undefined;
const warnTooSmall = (value) => Number.parseInt(value, 10) < 1 ? 'Too small.' : undefined;
const warnTooLarge = (value) => Number.parseInt(value, 10) > 100 ? 'Too large.' : undefined;

const Input = ({label, meta: {error, warning, blurred}, input}) => (
  <div>
    <label>{label}</label>
    <input {...input} type="text" />
    {blurred && error ? (
      <div
        className={`message ${error ? 'message_error' : ''} ${error ? 'message_warning' : ''}`}
      >
        {warning || error}
      </div>
    ) : null}
  </div>
);

interface IProps {
  handleSubmit(event: FormEvent<HTMLFormElement> | ((event: FormEvent<HTMLFormElement>) => void));

  innerOnSubmit(event: FormEvent<HTMLFormElement>): void;
}

class FieldLevelValidate extends Component<IProps> {
  render() {
    const {handleSubmit, innerOnSubmit} = this.props;
    return (
      <form onSubmit={innerOnSubmit ? handleSubmit(innerOnSubmit) : handleSubmit}>
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
          name="lastName"
          component={Input}
          type="text"
          placeholder="Last Name"
        />
        <Field
          label="Age"
          validate={validateIsRequired}
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
          <button type="submit">Submit</button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'simple',
})(FieldLevelValidate);
