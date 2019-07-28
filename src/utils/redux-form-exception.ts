const UNKNOWN = 'UNKNOWN';
export const INVALIDE_WIZARD_FORM_PARAMS = 'INVALIDE_WIZARD_FORM_PARAMS';

export default class ReduxFormException {
  type: string;
  description: string;

  constructor(type: string) {
    this.type = type;

    switch (type) {
      case INVALIDE_WIZARD_FORM_PARAMS: {
        this.description = 'The argument "destroyOnUnmount" must be false for wizard forms.;';
        break;
      }

      default: {
        this.type = UNKNOWN;
        this.description = 'Unknown error.';
        break;
      }
    }
  }
}