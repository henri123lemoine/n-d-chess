/**
 * Chess Piece Attack Calculators for n-dimensional Chess
 * All boards are assumed to have side length 8 in every dimension.
 *
 * This module implements functions that calculate the maximum number
 * of squares a chess piece can attack from a central position on an 8×…×8 board.
 *
 * Two modes for diagonal movement are supported:
 *  - "Classic": Diagonals are defined in the traditional way (moving in exactly 2 dimensions).
 *  - "Hyper":  Diagonals are generalized to any subset (r ≥ 2) of dimensions moving uniformly.
 *
 * Additionally, two modes for knight movements are supported:
 *  - "Standard": The knight moves as in standard chess (2 in one axis, 1 in another, 0 elsewhere).
 *  - "Alternative": The knight moves any 3 squares away (Manhattan distance 3), except moves that are "straight"
 *                   (i.e. moves along a single axis).
 *
 * Set DIAGONAL_MODE to "Classic" or "Hyper" and KNIGHT_MODE to "Standard" or "Alternative" as desired.
 */

const SIDE_LENGTH = 8;
const DIAGONAL_MODE = 'Hyper'; // Change to "Classic" for traditional 2D diagonal moves.
const KNIGHT_MODE = 'Alternative'; // Change to "Standard" for the classic knight moves.

/**
 * Calculate the maximum number of squares a knight can attack in n dimensions.
 *
 * Two modes are available:
 *
 * "Standard" mode (classic):
 *   - The knight moves by going 2 steps in one dimension and 1 step in another.
 *   - There are d*(d-1) ordered pairs of dimensions, and for each pair there are 4 ways
 *     (±2 and ±1) to assign the moves.
 *   - Formula: 4 * d * (d - 1)
 *
 * "Alternative" mode:
 *   - The knight moves with a Manhattan distance of 3 but cannot move solely along one axis.
 *   - This is split into two cases:
 *       1. Moves with exactly 2 nonzero coordinates:
 *          * They must be (2,1) (up to order) with sign choices.
 *          * Total moves: 4 * d * (d - 1).
 *       2. Moves with exactly 3 nonzero coordinates:
 *          * The only possibility is (1,1,1) (up to signs).
 *          * Total moves: 8 * C(d, 3).
 *   - Overall formula: 4 * d * (d - 1) + 8 * C(d, 3)
 *
 * @param {number} dimension - Number of dimensions
 * @returns {number} Maximum number of squares a knight can attack
 */
export const calculateKnightAttacks = (dimension) => {
  if (KNIGHT_MODE === 'Standard') {
    return 4 * dimension * (dimension - 1);
  } else {
    // Case 1: exactly 2 nonzero coordinates: (2,1)
    const case2 = 4 * dimension * (dimension - 1); // 4 * C(d,2) with ordering already included.
    // Case 2: exactly 3 nonzero coordinates: (1,1,1)
    const case3 = 8 * combinatorial(dimension, 3);
    return case2 + case3;
  }
};
if (KNIGHT_MODE === 'Standard') {
  calculateKnightAttacks.formula = '4d(d-1)';
} else {
  calculateKnightAttacks.formula = '4d(d-1) + 8(d choose 3)';
}

/**
 * Calculate the maximum number of squares a rook can attack in n dimensions.
 *
 * A rook moves along any single dimension. From a central square on an even board,
 * in each dimension there are SIDE_LENGTH - 1 available moves (the full extent of the axis).
 *
 * Formula: d * (SIDE_LENGTH - 1)
 *
 * @param {number} dimension - Number of dimensions
 * @returns {number} Maximum number of squares a rook can attack
 */
export const calculateRookAttacks = (dimension) => {
  return dimension * (SIDE_LENGTH - 1);
};
calculateRookAttacks.formula = 'd(l-1)';

/**
 * Calculate the maximum number of squares a bishop can attack in n dimensions.
 *
 * The bishop’s movement is defined differently depending on DIAGONAL_MODE.
 *
 * In "Classic" mode:
 *   - The bishop moves diagonally in a 2D subspace (exactly 2 dimensions change by ±1 per step).
 *   - For an even board, moving along a diagonal ray from a central square gives:
 *       * 4 moves in the positive direction,
 *       * 3 moves in the negative direction.
 *   - Total moves per 2D diagonal ray: 2*SIDE_LENGTH - 3.
 *   - There are C(d, 2) pairs of dimensions and 4 diagonal directions per pair.
 *   - Formula: C(d, 2) * (2*SIDE_LENGTH - 3)
 *
 * In "Hyper" mode:
 *   - The bishop may move diagonally in any subset of r dimensions (with r ≥ 2) simultaneously,
 *     taking uniform steps in all chosen dimensions.
 *   - For each chosen r dimensions there are C(d, r) possibilities.
 *   - In any given r-dimensional move, one ray (all positive) yields 4 steps,
 *     while each of the other (2^r - 1) rays is limited to 3 steps (due to board asymmetry).
 *   - Total moves for that subset: (3 * 2^r + 1).
 *   - Summing over r from 2 to d:
 *       Formula: sum (r = 2 to d) [ C(d, r) * (3 * 2^r + 1) ]
 *
 * @param {number} dimension - Number of dimensions
 * @returns {number} Maximum number of squares a bishop can attack
 */
export const calculateBishopAttacks = (dimension) => {
  if (DIAGONAL_MODE === 'Classic') {
    // Classical bishop movement in exactly 2 dimensions.
    return combinatorial(dimension, 2) * (2 * SIDE_LENGTH - 3);
  } else {
    // Hyper-dimensional bishop movement.
    // Sum over all possible subsets of dimensions of size r (r ≥ 2)
    let total = 0;
    for (let r = 2; r <= dimension; r++) {
      total += combinatorial(dimension, r) * (3 * Math.pow(2, r) + 1);
    }
    return total;
  }
};
if (DIAGONAL_MODE === 'Classic') {
  calculateBishopAttacks.formula = '(d choose 2)(2l-3)';
} else {
  calculateBishopAttacks.formula = 'sum(r=2 to d)[C(d, r)(3*2^r+1)]';
}

/**
 * Calculate the maximum number of squares a queen can attack in n dimensions.
 *
 * The queen combines the moves of the rook and bishop.
 * Thus, its total moves equal the sum of the rook moves and bishop moves.
 *
 * Formula:
 *   - For "Classic": d*(SIDE_LENGTH-1) + (d choose 2)*(2*SIDE_LENGTH-3)
 *   - For "Hyper": d*(SIDE_LENGTH-1) + sum(r=2 to d)[C(d, r)*(3*2^r+1)]
 *
 * @param {number} dimension - Number of dimensions
 * @returns {number} Maximum number of squares a queen can attack
 */
export const calculateQueenAttacks = (dimension) => {
  return calculateRookAttacks(dimension) + calculateBishopAttacks(dimension);
};
calculateQueenAttacks.formula = calculateRookAttacks.formula + ' + ' + calculateBishopAttacks.formula;

/**
 * Calculate the maximum number of squares a king can attack in n dimensions.
 *
 * The king moves one square in any direction (including diagonals).
 * There are 3 options for each dimension (-1, 0, +1) except the case
 * where it stays in place (all 0s), hence:
 *
 * Formula: 3^d - 1
 *
 * @param {number} dimension - Number of dimensions
 * @returns {number} Maximum number of squares a king can attack
 */
export const calculateKingAttacks = (dimension) => {
  return Math.pow(3, dimension) - 1;
};
calculateKingAttacks.formula = '3^d - 1';

/**
 * Calculate the maximum number of squares a pawn can attack in n dimensions.
 *
 * Here we assume the pawn moves "forward" along the first dimension.
 * Its attack moves are defined differently based on DIAGONAL_MODE.
 *
 * In "Classic" mode:
 *   - The pawn moves 1 square forward and 1 square diagonally in any one of the remaining (d-1) dimensions.
 *   - For each of those dimensions, there are 2 directions (±1).
 *   - Formula: 2d - 2
 *
 * In "Hyper" mode:
 *   - The pawn moves 1 square forward (in the first dimension) and 1 square diagonally in any combination of the remaining dimensions.
 *   - For the remaining (d-1) dimensions, each coordinate can change by -1, 0, or +1.
 *   - Exclude the case where all lateral moves are 0 (the straight move).
 *   - Formula: 3^(d-1) - 1
 *
 * @param {number} dimension - Number of dimensions (must be at least 2)
 * @returns {number} Maximum number of squares a pawn can attack
 */
export const calculatePawnAttacks = (dimension) => {
  if (DIAGONAL_MODE === 'Classic') {
    return 2 * dimension - 2;
  } else {
    return Math.pow(3, dimension - 1) - 1;
  }
};
if (DIAGONAL_MODE === 'Classic') {
  calculatePawnAttacks.formula = '2d-2';
} else {
  calculatePawnAttacks.formula = '3^(d-1) - 1';
}

/**
 * Helper function for calculating combinations (n choose k).
 *
 * @param {number} n
 * @param {number} k
 * @returns {number} Combinatorial number: n! / (k!(n-k)!)
 */
function combinatorial(n, k) {
  return factorial(n) / (factorial(k) * factorial(n - k));
}

/**
 * Helper function for calculating factorials.
 *
 * @param {number} n
 * @returns {number} n!
 */
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

/**
 * Get information about a chess piece.
 *
 * This function returns an object containing the calculation function and its formula
 * for a given piece name.
 *
 * @param {string} pieceName - Name of the chess piece (e.g. "Knight", "Rook", "Bishop", "Queen", "King", "Pawn")
 * @returns {object|null} Object with keys "calculate" and "formula", or null if not found.
 */
export const getPieceInfo = (pieceName) => {
  const pieces = {
    'Knight': { calculate: calculateKnightAttacks, formula: calculateKnightAttacks.formula },
    'Rook': { calculate: calculateRookAttacks, formula: calculateRookAttacks.formula },
    'Bishop': { calculate: calculateBishopAttacks, formula: calculateBishopAttacks.formula },
    'Queen':  { calculate: calculateQueenAttacks, formula: calculateQueenAttacks.formula },
    'King':   { calculate: calculateKingAttacks, formula: calculateKingAttacks.formula },
    'Pawn':   { calculate: calculatePawnAttacks, formula: calculatePawnAttacks.formula }
  };

  return pieces[pieceName] || null;
};
