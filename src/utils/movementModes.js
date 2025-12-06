/**
 * Centralized configuration for movement mode variants in n-dimensional chess.
 */

export const DIAGONAL_MODES = {
  Diagonal: {
    value: 'Diagonal',
    label: 'Diagonal',
    description: 'Exactly 2 coordinates change equally per step.',
  },
  Polyagonal: {
    value: 'Polyagonal',
    label: 'Polyagonal',
    description: 'Any r ≥ 2 coordinates change equally (diagonals, triagonals, etc.).',
  },
};

export const KNIGHT_MODES = {
  'L-shaped': {
    value: 'L-shaped',
    label: 'L-shaped',
    description: 'Classic (1,2)-leaper: 2 in one axis, 1 in another.',
  },
  '3-Leaper': {
    value: '3-Leaper',
    label: '3-Leaper',
    description: 'Manhattan distance 3, excluding straight moves.',
  },
};

// Default settings
export const DEFAULT_DIAGONAL_MODE = 'Polyagonal';
export const DEFAULT_KNIGHT_MODE = '3-Leaper';
export const DEFAULT_SIDE_LENGTH = 8;

// For backwards compatibility and iteration
export const DIAGONAL_MODE_LIST = Object.values(DIAGONAL_MODES);
export const KNIGHT_MODE_LIST = Object.values(KNIGHT_MODES);
