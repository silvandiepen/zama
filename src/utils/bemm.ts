import { useBemm as useBemmFunction } from 'bemm';

/**
 * Custom hook for BEM (Block Element Modifier) CSS class naming.
 * @param {string} block - The BEM block name
 * @returns {Object} BEM utility functions for generating CSS class names
 */
export const useBemm = (block: string) => {
  return useBemmFunction(block, {
    return: 'string',
    includeBaseClass: true
  })
}
