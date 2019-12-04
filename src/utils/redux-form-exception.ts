const UNKNOWN = 'UNKNOWN';

export default class ReduxFormException {
  type: string;
  description: string;

  constructor(type: string) {
    this.type = type;

    switch (type) {
      default: {
        this.type = UNKNOWN;
        this.description = 'Unknown error.';
        break;
      }
    }
  }
}
