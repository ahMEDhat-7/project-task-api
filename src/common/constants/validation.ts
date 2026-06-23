export const MAX_NAME_LENGTH = 255;
export const MAX_TITLE_LENGTH = 255;
export const MAX_DESCRIPTION_LENGTH = 1000;
export const MIN_PASSWORD_LENGTH = 8;

export const PASSWORD_REGEX = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  digit: /[0-9]/,
  special: /[^A-Za-z0-9]/,
};
