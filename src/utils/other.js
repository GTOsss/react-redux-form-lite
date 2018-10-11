import { getIn } from './object-manager';

export const autoAsyncValidate = (response, props) => {
  const { registeredFields, formActions: { validateField }, formProps: { form } } = props;
  const { data } = response;
  const errors = registeredFields.reduce((result, field) => {
    const errorsResponse = getIn(data, field) || [];
    const error = errorsResponse[0];
    if (error) {
      return [...result, { error, field }];
    }
    return [...result];
  }, []);

  errors.forEach(({ error, field }) => {
    validateField(form, field, error);
  });
};
