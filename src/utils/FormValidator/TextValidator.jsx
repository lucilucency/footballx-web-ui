import React from 'react';
import TextField from 'material-ui/TextField';
import { ValidatorComponent } from '../ValidatorCore';

export default class TextValidator extends ValidatorComponent {
  render() {
    // eslint-disable-next-line
    const { errorMessages, validators, requiredError, errorText, validatorListener, ...rest } = this.props;
    const { isValid } = this.state;
    return (
      <TextField
        {...rest}
        ref={(r) => { this.input = r; }}
        errorText={(!isValid && this.getErrorMessage()) || errorText}
      />
    );
  }
}
