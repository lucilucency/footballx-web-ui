import React from 'react';
import TimePicker from 'material-ui/TimePicker';
import { ValidatorComponent } from '../ValidatorCore';

export default class TimeValidator extends ValidatorComponent {
  render() {
    // eslint-disable-next-line
    const { errorMessages, validators, requiredError, errorText, validatorListener, ...rest } = this.props;
    const { isValid } = this.state;
    return (
      <TimePicker
        {...rest}
        ref={(r) => { this.input = r; }}
        errorText={(!isValid && this.getErrorMessage()) || errorText}
      />
    );
  }
}
