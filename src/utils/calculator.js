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
 * For "Standard" mode:
 *   - The knight moves 2 in one coordinate and 1 in another.
 *   - Formula: [l ≥ 3] · d(d-1) · (1 + 3[l ≥ 5])
 *
 * For "Alternative" mode:
 *   - The knight moves with Manhattan distance 3, using vectors with |a₁|+⋯+|a_d| = 3,
 *     excluding moves that change only one coordinate.
 *   - Formula:
 *       [l ≥ 3] · C(d,2) · (2 + 6[l ≥ 5]) +
 *       [d ≥ 3] · [l ≥ 2] · C(d,3) · (1 + 7[l ≥ 5])
 *
 * @param {number} dimension - Number of dimensions.
 * @param {string} knightMode - "Standard" or "Alternative".
 * @param {number} sideLength - Side length of the board in each dimension.
 * @returns {number} Maximum number of squares a knight can attack.
 */
export const calculateKnightAttacks = (dimension, knightMode, sideLength) => {
  if (knightMode === 'Standard') {
    // Standard knight formula without conditionals
    return (sideLength >= 3) * dimension * (dimension - 1) * (1 + 3 * (sideLength >= 5));
  } else { // Alternative mode
    // Case 2: Exactly 2 nonzero coordinates
    const case2Moves = (sideLength >= 3) * combinatorial(dimension, 2) * (2 + 6 * (sideLength >= 5));

    // Case 3: Exactly 3 nonzero coordinates
    const case3Moves = (dimension >= 3) * (sideLength >= 2) * combinatorial(dimension, 3) * (1 + 7 * (sideLength >= 5));

    return case2Moves + case3Moves;
  }
};

calculateKnightAttacks.getFormula = (knightMode) => {
  if (knightMode === 'Standard') {
    return "\\text{Knight}_{\\text{Standard}}(d, l) = \\mathbb{1}_{l \\geq 3} \\cdot d(d-1) \\cdot (1 + 3 \\cdot \\mathbb{1}_{l \\geq 5})";
  } else {
    return "\\text{Knight}_{\\text{Alternative}}(d, l) = \\mathbb{1}_{l \\geq 3} \\cdot \\binom{d}{2} \\cdot (2 + 6 \\cdot \\mathbb{1}_{l \\geq 5}) + \\mathbb{1}_{d \\geq 3} \\cdot \\mathbb{1}_{l \\geq 2} \\cdot \\binom{d}{3} \\cdot (1 + 7 \\cdot \\mathbb{1}_{l \\geq 5})";
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
 *   - Maximum attack squares formula: C(d, 2) * (2l - 3 + (l % 2))
 *
 * In "Hyper" mode:
 *   - The bishop moves diagonally in any subset of r dimensions (r ≥ 2) uniformly.
 *   - Formula: Sum from r=2 to d of: C(d, r) * [2^(r-1)(l-1) - isEven(l)*(2^(r-1)-1)]
 *
 * @param {number} dimension - Number of dimensions.
 * @param {string} diagonalMode - "Classic" or "Hyper".
 * @param {number} sideLength - Side length of the board in each dimension.
 * @returns {number} Maximum number of squares a bishop can attack.
 */
export const calculateBishopAttacks = (dimension, diagonalMode, sideLength) => {
  if (diagonalMode === 'Classic') {
    const twoDimMoves = Math.max(0, 2 * sideLength - 3 + (sideLength % 2));
    return combinatorial(dimension, 2) * twoDimMoves;
  } else { // Hyper mode
    let total = 0;
    if (sideLength >= 2) {
      for (let r = 2; r <= dimension; r++) {
        const factor = 1 << (r - 1);
        const baseMoves = factor * (sideLength - 1);
        const evenAdjustment = (sideLength % 2 === 0) ? (factor - 1) : 0;
        total += combinatorial(dimension, r) * (baseMoves - evenAdjustment);
      }
    }

    return Math.round(total);
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
    return "\\text{Bishop}_{\\text{Classic}}(d, l) = \\binom{d}{2} \\cdot \\max(0, 2l - 3 + (l \\bmod 2))";
  } else {
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
  if (diagonalMode === 'Hyper') {
    // In Hyper mode, the queen's moves are the union of:
    //   Rook(d,l) = d(l-1)
    //   and Bishop_Hyper(d,l) = ∑₍r=2₎ᵈ (C(d,r) * [2^(r-1)(l-1) - 𝟙_{l even}(2^(r-1)-1)])
    return "\\text{Queen}_{\\text{Hyper}}(d, l) = d(l-1) + \\sum_{r=2}^{d} \\binom{d}{r}\\Bigl[2^{r-1}(l-1) - \\mathbb{1}_{\\{l\\,\\mathrm{even}\\}}(2^{r-1}-1)\\Bigr]";
  } else {
    // Classic mode: queen's moves are computed as rook moves plus bishop moves in 2D subspaces.
    const rookFormula = calculateRookAttacks.getFormula();
    const bishopFormula = calculateBishopAttacks.getFormula(diagonalMode);
    return `\\text{Queen}_{\\text{Classic}}(d, l) = ${rookFormula} + ${bishopFormula}`;
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
