/**
 * Chess Piece Attack Calculators for n-dimensional Chess
 * All boards are assumed to have side length 8 in every dimension by default,
 * but this can be configured.
 *
 * This module implements functions that calculate the maximum number
 * of squares a chess piece can attack from a central position on an l×…×l board.
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

// Default side length, can be overridden
const DEFAULT_SIDE_LENGTH = 8;

/**
 * Calculate the maximum number of squares a knight can attack in n dimensions.
 *
 * Two modes for knight moves are supported:
 *   - "Standard": The knight moves 2 in one coordinate and 1 in another.
 *       Formula: 4 * d * (d - 1)
 *
 *   - "Alternative": The knight moves a Manhattan distance of 3 in any direction
 *       except straight moves (i.e. moves must affect at least two coordinates).
 *       In this case the move vectors are those (a₁,...,a_d) with |a₁|+…+|a_d| = 3,
 *       excluding moves that change only one coordinate.
 *
 *       This breaks into two cases:
 *         Case 1: Exactly 2 nonzero coordinates: count = C(d,2) * 8.
 *         Case 2: Exactly 3 nonzero coordinates (only possible for d ≥ 3): count = C(d,3) * 8.
 *
 *       Total for Alternative mode:
 *         8 * (C(d,2) + C(d,3))
 *
 *       Note: For d = 1, no valid moves exist; for d = 2, this yields 8 moves (as desired).
 *
 * @param {number} dimension - Number of dimensions
 * @param {string} knightMode - Mode of knight movement: "Standard" or "Alternative"
 * @param {number} sideLength - Side length of the board in each dimension
 * @returns {number} Maximum number of squares a knight can attack
 */
export const calculateKnightAttacks = (dimension, knightMode = 'Alternative', sideLength = DEFAULT_SIDE_LENGTH) => {
  if (knightMode === 'Standard') {
    return 4 * dimension * (dimension - 1);
  } else {
    // Calculate number of moves with exactly 2 nonzero coordinates.
    // There are C(d,2) ways to choose the two coordinates,
    // 2 ways to assign which coordinate moves 2 and which moves 1,
    // and 2 sign choices for each, giving 8 per pair.
    const movesCase2 = (dimension * (dimension - 1) / 2) * 8;

    // Calculate number of moves with exactly 3 nonzero coordinates.
    // Only possible when dimension >= 3. In this case, each nonzero coordinate is ±1.
    // There are C(d,3) ways to choose the three coordinates, and 2^3 sign choices.
    const movesCase3 = dimension >= 3 ? (dimension * (dimension - 1) * (dimension - 2) / 6) * 8 : 0;

    return movesCase2 + movesCase3;
  }
};
calculateKnightAttacks.getFormula = (knightMode) => {
  return knightMode === 'Standard' ? '4d(d-1)' : '8(C(d,2)+C(d,3))';
};

/**
 * Calculate the maximum number of squares a rook can attack in n dimensions.
 *
 * A rook moves along any single dimension. From a central square on an even board,
 * in each dimension there are sideLength - 1 available moves (the full extent of the axis).
 *
 * Formula: d * (sideLength - 1)
 *
 * @param {number} dimension - Number of dimensions
 * @param {number} sideLength - Side length of the board in each dimension
 * @returns {number} Maximum number of squares a rook can attack
 */
export const calculateRookAttacks = (dimension, sideLength = DEFAULT_SIDE_LENGTH) => {
  return dimension * (sideLength - 1);
};
calculateRookAttacks.getFormula = () => 'd(l-1)';

/**
 * Calculate the maximum number of squares a bishop can attack in n dimensions.
 *
 * The bishop's movement is defined differently depending on diagonalMode.
 *
 * In "Classic" mode:
 *   - The bishop moves diagonally in a 2D subspace (exactly 2 dimensions change by ±1 per step).
 *   - For an even board, moving along a diagonal ray from a central square gives:
 *       * 4 moves in the positive direction,
 *       * 3 moves in the negative direction.
 *   - Total moves per 2D diagonal ray: 2*sideLength - 3.
 *   - There are C(d, 2) pairs of dimensions and 4 diagonal directions per pair.
 *   - Formula: C(d, 2) * (2*sideLength - 3)
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
 * @param {string} diagonalMode - Mode of diagonal movement: "Classic" or "Hyper"
 * @param {number} sideLength - Side length of the board in each dimension
 * @returns {number} Maximum number of squares a bishop can attack
 */
export const calculateBishopAttacks = (dimension, diagonalMode = 'Hyper', sideLength = DEFAULT_SIDE_LENGTH) => {
  if (diagonalMode === 'Classic') {
    // Classical bishop movement in exactly 2 dimensions.
    return combinatorial(dimension, 2) * (2 * sideLength - 3);
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
calculateBishopAttacks.getFormula = (diagonalMode) => {
  return diagonalMode === 'Classic' ?
    '(d choose 2)(2l-3)' :
    'sum(r=2 to d)[C(d, r)(3*2^r+1)]';
};

/**
 * Calculate the maximum number of squares a queen can attack in n dimensions.
 *
 * The queen combines the moves of the rook and bishop.
 * Thus, its total moves equal the sum of the rook moves and bishop moves.
 *
 * Formula:
 *   - For "Classic": d*(sideLength-1) + (d choose 2)*(2*sideLength-3)
 *   - For "Hyper": d*(sideLength-1) + sum(r=2 to d)[C(d, r)*(3*2^r+1)]
 *
 * @param {number} dimension - Number of dimensions
 * @param {string} diagonalMode - Mode of diagonal movement: "Classic" or "Hyper"
 * @param {number} sideLength - Side length of the board in each dimension
 * @returns {number} Maximum number of squares a queen can attack
 */
export const calculateQueenAttacks = (dimension, diagonalMode = 'Hyper', sideLength = DEFAULT_SIDE_LENGTH) => {
  return calculateRookAttacks(dimension, sideLength) + calculateBishopAttacks(dimension, diagonalMode, sideLength);
};
calculateQueenAttacks.getFormula = (diagonalMode) => {
  return calculateRookAttacks.getFormula() + ' + ' + calculateBishopAttacks.getFormula(diagonalMode);
};

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
 * @param {number} sideLength - Side length of the board in each dimension (not used for king)
 * @returns {number} Maximum number of squares a king can attack
 */
export const calculateKingAttacks = (dimension, sideLength = DEFAULT_SIDE_LENGTH) => {
  return Math.pow(3, dimension) - 1;
};
calculateKingAttacks.getFormula = () => '3^d - 1';

/**
 * Calculate the maximum number of squares a pawn can attack in n dimensions.
 *
 * Here we assume the pawn moves "forward" along the first dimension.
 * Its attack moves are defined differently based on diagonalMode.
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
 * @param {string} diagonalMode - Mode of diagonal movement: "Classic" or "Hyper"
 * @param {number} sideLength - Side length of the board in each dimension (not used for pawn)
 * @returns {number} Maximum number of squares a pawn can attack
 */
export const calculatePawnAttacks = (dimension, diagonalMode = 'Hyper', sideLength = DEFAULT_SIDE_LENGTH) => {
  if (diagonalMode === 'Classic') {
    return 2 * dimension - 2;
  } else {
    return Math.pow(3, dimension - 1) - 1;
  }
};
calculatePawnAttacks.getFormula = (diagonalMode) => {
  return diagonalMode === 'Classic' ? '2d-2' : '3^(d-1) - 1';
};

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
 * @param {string} diagonalMode - Mode of diagonal movement: "Classic" or "Hyper"
 * @param {string} knightMode - Mode of knight movement: "Standard" or "Alternative"
 * @param {number} sideLength - Side length of the board in each dimension
 * @returns {object|null} Object with keys "calculate" and "formula", or null if not found.
 */
export const getPieceInfo = (pieceName, diagonalMode = 'Hyper', knightMode = 'Alternative', sideLength = DEFAULT_SIDE_LENGTH) => {
  const pieces = {
    'Knight': {
      calculate: (dimension) => calculateKnightAttacks(dimension, knightMode, sideLength),
      formula: calculateKnightAttacks.getFormula(knightMode)
    },
    'Rook': {
      calculate: (dimension) => calculateRookAttacks(dimension, sideLength),
      formula: calculateRookAttacks.getFormula()
    },
    'Bishop': {
      calculate: (dimension) => calculateBishopAttacks(dimension, diagonalMode, sideLength),
      formula: calculateBishopAttacks.getFormula(diagonalMode)
    },
    'Queen': {
      calculate: (dimension) => calculateQueenAttacks(dimension, diagonalMode, sideLength),
      formula: calculateQueenAttacks.getFormula(diagonalMode)
    },
    'King': {
      calculate: (dimension) => calculateKingAttacks(dimension, sideLength),
      formula: calculateKingAttacks.getFormula()
    },
    'Pawn': {
      calculate: (dimension) => calculatePawnAttacks(dimension, diagonalMode, sideLength),
      formula: calculatePawnAttacks.getFormula(diagonalMode)
    }
  };

  return pieces[pieceName] || null;
};
