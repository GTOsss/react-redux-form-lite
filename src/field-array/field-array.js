import React, { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FieldArrayContext from './field-array-context';
import ReduxFormContext from '../redux-form/redux-form-context';
import * as actions from '../store/actions';
import { getIn } from '../utils/object-manager';

class FieldArray extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      fieldArray: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.fieldArray !== nextProps.fieldArray) {
      return { fieldArray: nextProps.fieldArray };
    }
    return null;
  }

  createFields = () => {
    const {
      state: { fieldArray },
      props: { name, formContext: { form }, actions: { arrayPush } },
    } = this;
    return {
      map: (callback) => fieldArray.map((el, i) => callback(`${name}[${i}]`, i, fieldArray)),
      push: (value) => arrayPush(form, `${name}[${fieldArray.length}]`, value),
      length: fieldArray.length,
    };
  };

  render() {
    const { component, name, ...props } = this.props;
    const meta = {};
    const fieldArrayContext = {
      fieldName: name,
    };
    const fields = this.createFields();
    return (
      <FieldArrayContext.Provider value={fieldArrayContext}>
        {createElement(component, { ...props, meta, fields })}
      </FieldArrayContext.Provider>
    );
  }
}

FieldArray.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
  name: PropTypes.string,
  actions: PropTypes.objectOf(PropTypes.func),
  formContext: PropTypes.objectOf(PropTypes.any),
};

FieldArray.defaultProps = {
  name: '',
  actions: {},
  formContext: {},
};

const mapStateToProps = (state, props) => {
  const { formContext: { form } = {}, name } = props;
  return {
    fieldArray: getIn(state, `reduxForm.${form}.values.${name}`) || [],
  };
};

const mapDispatchToProps = (dispatch) => ({
  actions: { ...bindActionCreators(actions, dispatch) },
});

const FieldArrayConnected = connect(mapStateToProps, mapDispatchToProps)(FieldArray);

const FieldArrayWithContext = (props) => (
  <ReduxFormContext.Consumer>
    {(formContext) => (
      <FieldArrayConnected {...props} formContext={formContext} />
    )}
  </ReduxFormContext.Consumer>
);

export default connect(mapStateToProps, mapDispatchToProps)(FieldArrayWithContext);
