import React from 'react';
/* data */
import strings from 'lang';
import { Dialog } from 'material-ui';

export * from './time';
export * from './style';
export * from './sort';
export * from './styledComponent';
export * from './misc';
export * from './FormValidator';

export function toNumber(input) {
  return Number(input);
}

export function toUpperCase(input) {
  return input.toString().toUpperCase();
}

export function abbreviateNumber(num) {
  if (!num) {
    return '-';
  } else if (num >= 1000 && num < 1000000) {
    return `${Number((num / 1000).toFixed(1))}${strings.abbr_thousand}`;
  } else if (num >= 1000000 && num < 1000000000) {
    return `${Number((num / 1000000).toFixed(1))}${strings.abbr_million}`;
  } else if (num >= 1000000000 && num < 1000000000000) {
    return `${Number((num / 1000000000).toFixed(1))}${strings.abbr_billion}`;
  } else if (num >= 1000000000000) {
    return `${Number((num / 1000000000000).toFixed(1))}${strings.abbr_trillion}`;
  }

  return num.toFixed(0);
}

export const calculateDistance = (x1, y1, x2, y2) =>
  (((x2 - x1) ** 2) + ((y2 - y1) ** 2)) ** 0.5;

export const calculateRelativeXY = ({ clientX, clientY, currentTarget }) => {
  // const bounds = target.getBoundingClientRect();
  // const x = clientX - bounds.left;
  // const y = clientY - bounds.top;
  let x = clientX + document.body.scrollLeft;
  let y = clientY + document.body.scrollTop;

  if (currentTarget.offsetParent) {
    let off = currentTarget.offsetParent;

    do {
      x -= off.offsetLeft;
      y -= off.offsetTop;
      off = off.offsetParent;
    } while (off);
  }

  return { x, y };
};

export const jsonFn = json =>
  arrayFn =>
    fn =>
      json[Object.keys(json)[arrayFn]((key, index) => fn(json[key], index))];


export const getPercentWin = (wins, games) => (games ? Number(((wins * 100) / games).toFixed(2)) : 0);

export const camelToSnake = str =>
  str.replace(/\.?([A-Z]+)/g, (match, group) => `_${group.toLowerCase()}`).replace(/^_/, '');

export const getOrdinal = (n) => {
  // TODO localize strings
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const percentile = (pct) => {
  if (pct >= 0.8) {
    return {
      color: 'green',
      grade: 'A',
    };
  } else if (pct >= 0.6) {
    return {
      color: 'blue',
      grade: 'B',
    };
  } else if (pct >= 0.4) {
    return {
      color: 'golden',
      grade: 'C',
    };
  } else if (pct >= 0.2) {
    return {
      color: 'yelor',
      grade: 'D',
    };
  }
  return {
    color: 'red',
    grade: 'F',
  };
};

export function renderDialog(dialogConstruct = {}, triggerOpen, triggerClose) {
  const blankFn = () => {
    console.warn('Request close dialog');
  };

  const defaultDialogCons = {
    title: null,
    actions: [],
    view: <h1>Welcome!</h1>,
    onRequestClose: triggerClose || blankFn,
    contentStyle: {},
    modal: false,
  };
  const {
    title, actions, view, onRequestClose, modal, contentStyle,
  } = Object.assign(defaultDialogCons, dialogConstruct);
  // const { title, actions, view, onRequestClose, modal, contentStyle } = dialogConstruct;

  return (
    <Dialog
      title={title}
      actions={actions}
      open={triggerOpen}
      onRequestClose={onRequestClose}
      // autoScrollBodyContent
      modal={modal}
      contentStyle={contentStyle}
      autoScrollBodyContent
    >
      {view}
    </Dialog>
  );
}

export function bindAll(methods, self) {
  methods.forEach((item) => {
    // eslint-disable-next-line no-param-reassign
    self[item] = self[item].bind(self);
  });
}
