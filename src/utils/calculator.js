/**
 * Chess Piece Attack Calculators for n-dimensional Chess
 *
 * This module computes the maximum number of squares a chess piece can attack
 * from an optimally chosen cell on an l-lengthed d-dimensional board.
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

/**
 * Calculate the maximum number of squares a knight can attack in n dimensions.
 *
 * Two modes for knight moves are supported:
 *
 *   - "Standard": The knight moves 2 in one coordinate and 1 in another.
 *       Ideal (infinite board) formula: 4*d*(d-1)
 *       Piecewise for finite boards:
 *         • l < 3: 0 moves (since a 2–step is impossible)
 *         • 3 ≤ l < 5: Only one sign is available per coordinate (corner placement), so:
 *               moves = d*(d-1)
 *         • l ≥ 5: Full move set available: 4*d*(d-1)
 *
 *   - "Alternative": The knight moves with Manhattan distance 3, using vectors
 *       (a₁,...,a_d) with |a₁|+⋯+|a_d| = 3, excluding moves that change only one coordinate.
 *
 *       The move set is naturally divided into:
 *
 *         Case 1 (movesCase2): Exactly 2 nonzero coordinates.
 *             Ideal count: C(d,2) * 8.
 *         Case 2 (movesCase3): Exactly 3 nonzero coordinates (only for d ≥ 3).
 *             Ideal count: C(d,3) * 8.
 *
 *       Piecewise for finite boards:
 *         • l < 2: 0 moves (not enough space for even a 1–step).
 *         • l == 2:
 *               – If d < 3: 0 moves (since a 2–step is needed).
 *               – If d ≥ 3: Only moves that use 1–steps in all three axes are available,
 *                 so each triple yields 1 move instead of 8; hence: moves = C(d,3)
 *         • 3 ≤ l < 5:
 *               – For movesCase2: Only one sign per coordinate is valid → factor reduces to 2 (instead of 8).
 *               – For movesCase3: Only one valid orientation per triple.
 *               Thus, moves = 2 * C(d,2) + C(d,3)
 *         • l ≥ 5: Full move set available:
 *               moves = 8 * (C(d,2) + C(d,3))
 *
 * @param {number} dimension - Number of dimensions.
 * @param {string} knightMode - "Standard" or "Alternative".
 * @param {number} sideLength - Side length of the board in each dimension.
 * @returns {number} Maximum number of squares a knight can attack.
 */
export const calculateKnightAttacks = (dimension, knightMode, sideLength) => {
  // Knights cannot move in 1D, so return 0 immediately
  if (dimension < 2 || sideLength < 2) {
    return 0;
  }

  if (knightMode === 'Standard') {
    if (sideLength < 3) {
      return 0;
    } else if (sideLength < 5) {
      // In a corner, only one sign is available per axis.
      // Each ordered pair of distinct coordinates yields one move.
      return dimension * (dimension - 1);
    } else { // sideLength >= 5, a central placement is possible.
      return 4 * dimension * (dimension - 1);
    }
  } else { // Alternative mode
    if (sideLength < 2) {
      return 0;
    } else if (sideLength === 2) {
      // With l == 2, a 2–step is impossible.
      // Only moves that use three 1–steps (Case 2) are possible.
      // For d < 3, no valid move exists.
      return dimension < 3 ? 0 : combinatorial(dimension, 3);
    } else if (sideLength < 5) {
      // For 3 ≤ l < 5, a corner placement reduces the count.
      // movesCase2: Reduced factor: 2 instead of 8.
      const movesCase2 = combinatorial(dimension, 2) * 2;
      // movesCase3: Reduced factor: only 1 orientation.
      const movesCase3 = combinatorial(dimension, 3);
      return movesCase2 + movesCase3;
    } else { // sideLength >= 5
      // Full ideal move set.
      const movesCase2 = combinatorial(dimension, 2) * 8;
      const movesCase3 = dimension >= 3 ? combinatorial(dimension, 3) * 8 : 0;
      return movesCase2 + movesCase3;
    }
  }
};

calculateKnightAttacks.getFormula = (knightMode) => {
  if (knightMode === 'Standard') {
    return "\\text{Knight}_{\\text{Standard}}(d, l) = \\begin{cases} 0 & \\text{if } l < 3 \\\\ d(d-1) & \\text{if } 3 \\leq l < 5 \\\\ 4d(d-1) & \\text{if } l \\geq 5 \\end{cases}";
  } else {
    return "\\text{Knight}_{\\text{Alternative}}(d, l) = \\begin{cases} 0 & \\text{if } l < 2 \\\\ 0 & \\text{if } l = 2 \\text{ and } d < 3 \\\\ \\binom{d}{3} & \\text{if } l = 2 \\text{ and } d \\geq 3 \\\\ 2\\binom{d}{2} + \\binom{d}{3} & \\text{if } 3 \\leq l < 5 \\\\ 8\\left(\\binom{d}{2} + \\binom{d}{3}\\right) & \\text{if } l \\geq 5 \\end{cases}";
  }
};

/**
 * Calculate the maximum number of squares a rook can attack in n dimensions.
 *
 * A rook moves along any single dimension. From a central square on an even board,
 * in each dimension there are sideLength - 1 available moves (the full extent of the axis).
 *
 * Formula (for any l): \(d \cdot (l - 1)\)
 *
 * @param {number} dimension - Number of dimensions.
 * @param {number} sideLength - Side length of the board in each dimension.
 * @returns {number} Maximum number of squares a rook can attack.
 */
export const calculateRookAttacks = (dimension, sideLength) => {
  return dimension * (sideLength - 1);
};
calculateRookAttacks.getFormula = () => '\\text{Rook}(d, l) = d(l-1)';

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
 * @param {number} dimension - Number of dimensions.
 * @param {string} diagonalMode - "Classic" or "Hyper".
 * @param {number} sideLength - Side length of the board in each dimension.
 * @returns {number} Maximum number of squares a bishop can attack.
 */
export const calculateBishopAttacks = (dimension, diagonalMode, sideLength) => {
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
  return diagonalMode === 'Classic'
    ? "\\text{Bishop}_{\\text{Classic}}(d, l) = \\binom{d}{2}(2l-3)"
    : "\\text{Bishop}_{\\text{Hyper}}(d, l) = \\sum_{r=2}^{d}\\binom{d}{r}(3 \\cdot 2^r+1)";
};

/**
 * Calculate the maximum number of squares a queen can attack in n dimensions.
 *
 * The queen's moves are the union of the rook and bishop moves.
 *
 * @param {number} dimension - Number of dimensions.
 * @param {string} diagonalMode - Mode for bishop moves ("Classic" or "Hyper").
 * @param {number} sideLength - Side length of the board in each dimension.
 * @returns {number} Maximum number of squares a queen can attack.
 */
export const calculateQueenAttacks = (dimension, diagonalMode, sideLength) => {
  return calculateRookAttacks(dimension, sideLength) + calculateBishopAttacks(dimension, diagonalMode, sideLength);
};

calculateQueenAttacks.getFormula = (diagonalMode) => {
  return diagonalMode === 'Classic'
    ? "\\text{Queen}_{\\text{Classic}}(d, l) = d(l-1) + \\binom{d}{2}(2l-3)"
    : "\\text{Queen}_{\\text{Hyper}}(d, l) = d(l-1) + \\sum_{r=2}^{d}\\binom{d}{r}(3 \\cdot 2^r+1)";
};

/**
 * Calculate the maximum number of squares a king can attack in n dimensions.
 *
 * A king can move at most one square in any direction. In each dimension,
 * the king has min(sideLength, 3) possible positions (including staying in place).
 * We subtract 1 from the total to exclude the square the king is on.
 *
 * Formula: min(sideLength, 3)^dimension - 1
 *
 * @param {number} dimension - Number of dimensions.
 * @param {number} sideLength - Side length of the board in each dimension.
 * @returns {number} Maximum number of squares a king can attack.
 */
export const calculateKingAttacks = (dimension, sideLength) => {
  return Math.pow(Math.min(sideLength, 3), dimension) - 1;
};

calculateKingAttacks.getFormula = () => '\\text{King}(d, l) = \\min(l, 3)^d - 1';

/**
 * Calculate the maximum number of squares a pawn can attack in n dimensions.
 *
 * The pawn moves "forward" along the first coordinate and attacks diagonally.
 * In each remaining dimension, the pawn's attack pattern depends on the mode:
 *
 * - Classic mode: Each dimension beyond the first contributes min(sideLength-1, 2) attack squares
 * - Hyper mode: Similar to a king, but in one fewer dimension (dimension-1)
 *
 * Formula:
 * - Classic mode: (dimension-1) × min(sideLength-1, 2)
 * - Hyper mode: min(sideLength, 3)^(dimension-1) - 1
 *
 * @param {number} dimension - Number of dimensions (d ≥ 2).
 * @param {string} diagonalMode - "Classic" or "Hyper".
 * @param {number} sideLength - Side length of the board in each dimension.
 * @returns {number} Maximum number of squares a pawn can attack.
 */
export const calculatePawnAttacks = (dimension, diagonalMode, sideLength) => {
  if (diagonalMode === 'Classic') {
    return (dimension - 1) * Math.min(sideLength - 1, 2);
  } else { // Hyper mode
    return Math.pow(Math.min(sideLength, 3), dimension - 1) - 1;
  }
};

calculatePawnAttacks.getFormula = (diagonalMode) => {
  return diagonalMode === 'Classic'
    ? "\\text{Pawn}_{\\text{Classic}}(d, l) = (d-1) \\cdot \\min(l-1, 2)"
    : "\\text{Pawn}_{\\text{Hyper}}(d, l) = \\min(l, 3)^{d-1} - 1";
};

/**
 * Helper function to calculate combinations (n choose k). (Returns 0 for k>n)
 *
 * @param {number} n
 * @param {number} k
 * @returns {number} Combinatorial number: n! / (k!(n-k)!)
 */
function combinatorial(n, k) {
  if (k > n) return 0;
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
 * Returns an object with the calculation function and its formula for the given piece.
 *
 * @param {string} pieceName - Name of the chess piece (e.g. "Pawn", "Knight", "Rook", "Bishop", "Queen", "King")
 * @param {string} diagonalMode - "Classic" or "Hyper"
 * @param {string} knightMode - "Standard" or "Alternative"
 * @param {number} sideLength - Side length of the board in each dimension.
 * @returns {object|null} Object with keys "calculate" and "formula", or null if not found.
 */
export const getPieceInfo = (pieceName, diagonalMode = 'Hyper', knightMode = 'Alternative', sideLength = 8) => {
  const pieces = {
    'Pawn': {
      calculate: (dimension) => calculatePawnAttacks(dimension, diagonalMode, sideLength),
      formula: calculatePawnAttacks.getFormula(diagonalMode)
    },
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
    }
  };

  return pieces[pieceName] || null;
};
