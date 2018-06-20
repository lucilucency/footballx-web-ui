import React, { cloneElement } from 'react';
import styled from 'styled-components';
import FloatingLabel from './FloatingLabel';
import DropDownArrow from 'material-ui/svg-icons/navigation/arrow-drop-down';
import { selectionsPresenterTypes } from './types';
import { selectionsPresenterDefaultProps } from './defaultProps';

const Styled = styled.div`
  .presenterColumn {
    display: flex;
    flex-direction: column;-webkit-flex-direction: column;;-ms-flex-direction: column;
    flex: auto;-ms-flex: auto;-webkit-flex: auto;
  }
  .presenterRow {
    align-items: center;-webkit-align-items: center;
    display: flex;
    flex: auto;-ms-flex: auto;-webkit-flex: auto;
    justify-content: flex-end;-webkit-justify-content: flex-end;
    position: relative;
  }
  .presenterSelections {
    flex: 1;-ms-flex: 1;-webkit-flex: 1;
  }
  .presenterUnderline {
    position: relative;
    margin-top: 1px;
  }
`;

const SelectionsPresenter = ({
  disabled,
  dropDownIcon,
  errorStyle,
  errorText,
  floatingLabel,
  floatingLabelFocusStyle,
  floatingLabelStyle,
  hintText,
  isFocused,
  isOpen,
  muiTheme,
  selectedValues,
  selectionsRenderer,
  underlineErrorStyle,
  underlineFocusStyle,
  underlineStyle,
}) => {
  const { textField: { borderColor, floatingLabelColor, focusColor } } = muiTheme;

  const isValidObject = (obj) =>
    obj &&
    Object.prototype.toString.call(obj) === '[object Object]' &&
    Object.keys(obj).includes('value') &&
    obj.value !== null;

  // Condition for shrinking the floating Label
  const isShrunk =
    !disabled &&
    ((Array.isArray(selectedValues) && (!!selectedValues.length || isFocused)) ||
      (!Array.isArray(selectedValues) && (isValidObject(selectedValues) || (selectedValues === null && isFocused))) ||
      isOpen);

  const baseHRstyle = {
    borderBottom: '1px solid',
    borderColor,
    borderLeft: 'none',
    borderRight: 'none',
    borderTop: 'none',
    bottom: 0,
    boxSizing: 'content-box',
    left: 0,
    margin: 0,
    position: 'absolute',
    width: '100%',
    ...underlineStyle,
    ...(errorText ? { borderColor: 'red', ...underlineErrorStyle } : {}),
  };

  const focusedHRstyle = disabled
    ? {}
    : errorText
      ? underlineStyle
      : {
        borderBottom: '2px solid',
        borderColor: isFocused || isOpen ? focusColor : borderColor,
        transform: `scaleX( ${isFocused || isOpen ? 1 : 0} )`,
        transition: '450ms cubic-bezier(0.23, 1, 0.32, 1)', // transitions.easeOut(),
        ...underlineFocusStyle,
      };

  const arrowDownIcon = cloneElement(dropDownIcon || <DropDownArrow />, {
    style: {
      // fill: this.context.muiTheme.textField.borderColor,
      transform: `rotate(${isOpen ? 180 : 0}deg)`,
    },
  });

  return (
    <Styled>
      <div className="presenterColumn">
        <div className="presenterRow">
          <div className="presenterSelections">
            {floatingLabel && (
              <FloatingLabel
                defaultColors={{ floatingLabelColor, focusColor }}
                disabled={disabled}
                floatingLabelFocusStyle={floatingLabelFocusStyle}
                floatingLabelStyle={floatingLabelStyle}
                isFocused={isFocused}
                shrink={isShrunk}
              >
                {floatingLabel}
              </FloatingLabel>
            )}
            {(!floatingLabel || isShrunk) && selectionsRenderer(selectedValues, hintText)}
          </div>
          {arrowDownIcon}
        </div>
        <div className="presenterUnderline">
          <hr style={baseHRstyle} />
          <hr style={{ ...baseHRstyle, ...focusedHRstyle }} />
        </div>
        {errorText && <div style={{ marginTop: 5, color: 'red', fontSize: 12, ...errorStyle }}>{errorText}</div>}
      </div>
    </Styled>
  );
};

SelectionsPresenter.propTypes = selectionsPresenterTypes;
SelectionsPresenter.defaultProps = selectionsPresenterDefaultProps;

export default SelectionsPresenter;
