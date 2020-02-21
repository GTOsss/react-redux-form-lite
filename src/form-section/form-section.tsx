import React, {Component} from 'react';
import FormSectionContext from './form-section-context';

export interface IProps {
  name: string;
  children: React.ReactNode;
}

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
