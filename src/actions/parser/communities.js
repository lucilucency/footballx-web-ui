/* eslint-disable import/prefer-default-export */
import { savedTheme } from '../../theme';

export const parseCommunityDetail = data => ({
  ...data.community,
  color: data.community.color || savedTheme,
});
