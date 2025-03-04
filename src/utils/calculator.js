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
 * In "Classic" mode:
 *   - The bishop moves diagonally in a 2D subspace (exactly 2 dimensions change by ±1 per step).
 *   - Maximum attack squares formula: C(d, 2) * (2l - 2 - (l % 2))
 *
 * In "Hyper" mode:
 *   - The bishop moves diagonally in any subset of r dimensions (r ≥ 2) uniformly.
 *   - Formula: Sum from r=2 to d of: C(d, r) * 2^r * f(l,r)
 *     Where f(l,r) is a transition function based on side length
 *
 * @param {number} dimension - Number of dimensions.
 * @param {string} diagonalMode - "Classic" or "Hyper".
 * @param {number} sideLength - Side length of the board in each dimension.
 * @returns {number} Maximum number of squares a bishop can attack.
 */
export const calculateBishopAttacks = (dimension, diagonalMode, sideLength) => {
  if (diagonalMode === 'Classic') {
    // For classic mode, the bishop moves diagonally in exactly 2 dimensions.
    // Handle small boards explicitly.
    if (sideLength < 2) return 0;
    if (sideLength === 2) return combinatorial(dimension, 2);
    // For sideLength >= 3, optimal 2D bishop moves:
    // When sideLength is odd, maximum moves = 2*(sideLength-1).
    // When sideLength is even, maximum moves = 2*(sideLength-1) - 1.
    const twoDimMoves = (sideLength % 2 === 0) ? (2 * sideLength - 3) : (2 * sideLength - 2);
    return combinatorial(dimension, 2) * twoDimMoves;
  } else {
    // Hyper mode: generalized diagonal movement in any subset of r dimensions, for r >= 2.
    // For each r-dimensional diagonal, an optimal placement gives:
    // If sideLength < 2, no moves.
    if (sideLength < 2) return 0;
    let total = 0;
    // For each possible r (number of dimensions moved simultaneously), where r >= 2 and r <= dimension.
    for (let r = 2; r <= dimension; r++) {
      // For an r-dimensional diagonal, there are 2^(r-1) pairs of opposite directions.
      // In an odd sideLength board, an optimal cell gives (sideLength-1)/2 moves in each direction, totaling 2^(r-1) * (sideLength-1).
      // In an even board, due to asymmetry, one direction yields one less move overall per pair, so we subtract (2^(r-1) - 1).
      const ideal = Math.pow(2, r - 1) * (sideLength - 1);
      const moves_r = (sideLength % 2 === 0) ? (ideal - (Math.pow(2, r - 1) - 1)) : ideal;
      total += combinatorial(dimension, r) * moves_r;
    }
    return Math.round(total); // rounding to handle floating point issues
  }
};

/**
 * Returns the mathematical formula representation for the given diagonal mode.
 *
 * @param {string} diagonalMode - "Classic" or "Hyper".
 * @returns {string} LaTeX representation of the formula.
 */
calculateBishopAttacks.getFormula = (diagonalMode) => {
  if (diagonalMode === 'Classic') {
    // For Classic mode, now the formula is essentially:
    // \text{Bishop}_{Classic}(d, l) = \binom{d}{2} \times
    // \begin{cases}
    //   0, & l < 2 \\
    //   1, & l = 2 \\
    //   2l-2, & l \ge 3, l \text{ odd} \\
    //   2l-3, & l \ge 3, l \text{ even}
    // \end{cases}
    return "\\text{Bishop}_{\\text{Classic}}(d, l) = \\binom{d}{2} \\cdot \\begin{cases} 0 & l < 2 \\\\ 1 & l = 2 \\\\ 2l-2 & l \\geq 3 \\text{ (l odd)} \\\\ 2l-3 & l \\geq 3 \\text{ (l even)} \\end{cases}";
  } else {
    // For Hyper mode, the generalized formula is:
    // \text{Bishop}_{\text{Hyper}}(d, l) = \sum_{r=2}^{d} \binom{d}{r} \cdot \left[2^{r-1}(l-1) - \mathbb{1}_{l\text{ even}}\,(2^{r-1}-1)\right]
    return "\\text{Bishop}_{\\text{Hyper}}(d, l) = \\sum_{r=2}^{d} \\binom{d}{r} \\cdot \\left[2^{r-1}(l-1) - \\mathbb{1}_{l\\text{ even}}(2^{r-1}-1)\\right]";
  }
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
  if (diagonalMode === 'Classic') {
    return "\\text{Queen}_{\\text{Classic}}(d, l) = d(l-1) + \\binom{d}{2}(2l-3)";
  } else {
    return "\\text{Queen}_{\\text{Hyper}}(d, l) = d(l-1) + \\text{Bishop}_{\\text{Hyper}}(d, l)";
  }
};

/**
 * Calculate the maximum number of squares a king can attack in n dimensions.
 * A king can move at most one square in any direction.
 * In each dimension, the king has min(sideLength, 3) positions (including staying in place).
 * Subtract 1 to exclude the starting square.
 *
 * Formula: min(l, 3)^d - 1
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
  if (diagonalMode === 'Classic') {
    return "\\text{Pawn}_{\\text{Classic}}(d, l) = (d-1) \\cdot \\min(l-1, 2)";
  } else {
    return "\\text{Pawn}_{\\text{Hyper}}(d, l) = \\min(l, 3)^{d-1} - 1";
  }
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
 * Helper function to calculate factorial of n.
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
