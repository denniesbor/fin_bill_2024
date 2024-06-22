// src/utils/helpers.js
export const cleanFilename = (s) => {
  return s ? s.replace(/\s+/g, "_").replace(/[^\w_]/g, "") : "";
};
