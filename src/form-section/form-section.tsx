import React, {Component} from 'react';
import FormSectionContext from './form-section-context';
import {IPropsFormSection as IProps} from '../../index';

class FormSection extends Component<IProps> {
  static defaultProps = {};

  render() {
    const {children, name} = this.props;

    return (
      <FormSectionContext.Provider value={{name}}>
        {children}
      </FormSectionContext.Provider>
    );
  }
}

export default FormSection;
