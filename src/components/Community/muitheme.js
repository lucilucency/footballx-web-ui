/* eslint-disable import/prefer-default-export */
export const getStyles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  formControl: {
    margin: theme.spacing.desktopGutterLess,
  },
  group: {
    marginLeft: theme.spacing.desktopGutterMini,
    marginRight: theme.spacing.desktopGutterMini,
    justifyContent: 'center',
    alignItems: 'start',
  },
  package: {
    padding: 16,
    margin: 8,
    maxWidth: 250,
    minWidth: 150,
    borderTop: '5px solid transparent',
    backgroundColor: theme.paper.backgroundColor,
  },
  noBorderBtn: {
    style: {
      border: '1px solid', borderColor: theme.palette.primary2Color,
    },
    labelStyle: {
      color: theme.palette.primary2Color,
    },
  },
});
