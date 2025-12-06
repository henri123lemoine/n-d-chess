/* global BigInt */
/**
 * Chess Piece Attack Calculators for n-dimensional Chess
 *
 * This module computes the maximum number of squares a chess piece can attack
 * from an optimally chosen cell on an l-lengthed d-dimensional board.
 *
 * Two modes for diagonal movement are supported:
 *  - "Diagonal": Traditional 2D diagonals (exactly 2 coordinates change equally).
 *  - "Polyagonal": Generalized r-agonals (any r ≥ 2 coordinates change equally).
 *
 * Two modes for knight movements are supported:
 *  - "L-shaped": The classic (1,2)-leaper — 2 in one axis, 1 in another.
 *  - "3-Leaper": Manhattan distance 3, excluding straight-line moves.
 */

/**
 * Calculate the maximum number of squares a knight can attack in n dimensions.
 *
 * For "L-shaped" mode:
 *   - The knight moves 2 in one coordinate and 1 in another (classic L-shape).
 *   - Formula: [l ≥ 3] · d(d-1) · (1 + 3[l ≥ 5])
 *
 * For "3-Leaper" mode:
 *   - The knight moves with Manhattan distance 3, using vectors with |a₁|+⋯+|a_d| = 3,
 *     excluding moves that change only one coordinate.
 *   - Formula:
 *       [l ≥ 3] · C(d,2) · (2 + 6[l ≥ 5]) +
 *       [d ≥ 3] · [l ≥ 2] · C(d,3) · (1 + 7[l ≥ 5])
 *
 * @param {number} dimension - Number of dimensions.
 * @param {string} knightMode - "L-shaped" or "3-Leaper".
 * @param {number} sideLength - Side length of the board in each dimension.
 * @returns {number} Maximum number of squares a knight can attack.
 */
export const calculateKnightAttacks = (dimension, knightMode, sideLength) => {
  if (knightMode === 'L-shaped') {
    // Small boards drop moves; l=3 => 1×base, l=4 => 2×base, l>=5 => 4×base
    if (sideLength < 3) return 0;
    const base = BigInt(dimension) * BigInt(dimension - 1);
    const multiplier = BigInt(1 + (sideLength >= 4) + 2 * (sideLength >= 5));
    return normalizeResult(base * multiplier);
  } else { // 3-Leaper mode
    // Case 2: Exactly 2 nonzero coordinates (2,1) patterns)
    let case2Multiplier = 0;
    if (sideLength >= 5) {
      case2Multiplier = 8;
    } else if (sideLength === 4) {
      case2Multiplier = 4;
    } else if (sideLength === 3 && dimension === 2) {
      case2Multiplier = 2;
    }
    const case2Moves = combinatorial(dimension, 2) * BigInt(case2Multiplier);

    // Case 3: Exactly 3 nonzero coordinates
    let case3Multiplier = 0;
    if (dimension >= 3 && sideLength >= 2) {
      case3Multiplier = (sideLength === 2) ? 1 : 8; // (±1,±1,±1) permutations
    }
    const case3Moves = combinatorial(dimension, 3) * BigInt(case3Multiplier);

    return normalizeResult(case2Moves + case3Moves);
  }
};

calculateKnightAttacks.getFormula = (knightMode) => {
  if (knightMode === 'L-shaped') {
    return "\\text{Knight}_{\\text{L}}(d, l) = \\mathbb{1}_{l \\geq 3} \\cdot d(d-1) \\cdot \\big(1 + \\mathbb{1}_{l \\geq 4} + 2\\,\\mathbb{1}_{l \\geq 5}\\big)";
  } else {
    return "\\text{Knight}_{\\text{3-Leap}}(d, l) = \\binom{d}{2} \\cdot \\big(2\\,\\mathbb{1}_{l = 3}\\,\\mathbb{1}_{d = 2} + 4\\,\\mathbb{1}_{l = 4} + 8\\,\\mathbb{1}_{l \\geq 5}\\big) + \\binom{d}{3} \\cdot \\big(\\mathbb{1}_{l = 2} + 8\\,\\mathbb{1}_{l \\geq 3}\\big)";
  }
};

/**
 * Calculate the maximum number of squares a rook can attack in n dimensions.
 *
 * A rook moves along any single dimension. From a central square on a board,
 * in each dimension there are sideLength - 1 available moves.
 *
 * Formula: d · (l - 1)
 *
 * @param {number} dimension - Number of dimensions.
 * @param {number} sideLength - Side length of the board in each dimension.
 * @returns {number} Maximum number of squares a rook can attack.
 */
export const calculateRookAttacks = (dimension, sideLength) => {
  return normalizeResult(BigInt(dimension) * BigInt(sideLength - 1));
};

calculateRookAttacks.getFormula = () => '\\text{Rook}(d, l) = d \\cdot (l-1)';

/**
 * Calculate the maximum number of squares a bishop can attack in n dimensions.
 *
 * In "Diagonal" mode:
 *   - The bishop moves diagonally in a 2D subspace (exactly 2 dimensions change by ±1 per step).
 *   - Maximum attack squares formula: C(d, 2) · (2l - 3 + (l % 2))
 *
 * In "Polyagonal" mode:
 *   - The bishop moves along any r-agonal (r ≥ 2 dimensions change uniformly).
 *   - Formula: Sum from r=2 to d of: C(d, r) · [2^(r-1)(l-1) - isEven(l)·(2^(r-1)-1)]
 *
 * @param {number} dimension - Number of dimensions.
 * @param {string} diagonalMode - "Diagonal" or "Polyagonal".
 * @param {number} sideLength - Side length of the board in each dimension.
 * @returns {number} Maximum number of squares a bishop can attack.
 */
export const calculateBishopAttacks = (dimension, diagonalMode, sideLength) => {
  if (diagonalMode === 'Diagonal') {
    // Formula handles both odd and even side lengths elegantly
    const term = BigInt(2 * sideLength - 3 + (sideLength % 2));
    return normalizeResult(combinatorial(dimension, 2) * term);
  } else { // Polyagonal mode
    let total = 0n;
    for (let r = 2; r <= dimension; r++) {
      const factor = 1n << BigInt(r - 1);  // Efficient calculation of 2^(r-1)
      const baseMoves = factor * BigInt(sideLength - 1);
      const evenAdjustment = (sideLength % 2 === 0) ? (factor - 1n) : 0n;
      total += combinatorial(dimension, r) * (baseMoves - evenAdjustment);
    }
    return normalizeResult(total);
  }
};

calculateBishopAttacks.getFormula = (diagonalMode) => {
  if (diagonalMode === 'Diagonal') {
    return "\\text{Bishop}_{\\text{Diag}}(d, l) = \\binom{d}{2} \\cdot (2l - 3 + (l \\bmod 2))";
  } else {
    return "\\text{Bishop}_{\\text{Poly}}(d, l) = \\sum_{r=2}^{d} \\binom{d}{r} \\cdot \\left[2^{r-1} \\cdot (l-1) - \\mathbb{1}_{l \\text{ even}} \\cdot (2^{r-1}-1)\\right]";
  }
};

/**
 * Calculate the maximum number of squares a queen can attack in n dimensions.
 *
 * The queen's moves are the union of the rook and bishop moves.
 *
 * @param {number} dimension - Number of dimensions.
 * @param {string} diagonalMode - Mode for bishop moves ("Diagonal" or "Polyagonal").
 * @param {number} sideLength - Side length of the board in each dimension.
 * @returns {number} Maximum number of squares a queen can attack.
 */
export const calculateQueenAttacks = (dimension, diagonalMode, sideLength) => {
  const rook = liftToBigInt(calculateRookAttacks(dimension, sideLength));
  const bishop = liftToBigInt(calculateBishopAttacks(dimension, diagonalMode, sideLength));
  return normalizeResult(rook + bishop);
};

calculateQueenAttacks.getFormula = (diagonalMode) => {
  if (diagonalMode === 'Diagonal') {
    return "\\text{Queen}_{\\text{Diag}}(d, l) = d \\cdot (l-1) + \\binom{d}{2} \\cdot (2l - 3 + (l \\bmod 2))";
  } else {
    return "\\text{Queen}_{\\text{Poly}}(d, l) = d \\cdot (l-1) + \\sum_{r=2}^{d} \\binom{d}{r} \\cdot \\left[2^{r-1} \\cdot (l-1) - \\mathbb{1}_{l \\text{ even}} \\cdot (2^{r-1}-1)\\right]";
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
  const result = powBigInt(Math.min(sideLength, 3), dimension) - 1n;
  return normalizeResult(result);
};

calculateKingAttacks.getFormula = () => '\\text{King}(d, l) = \\min(l, 3)^d - 1';

/**
 * Calculate the maximum number of squares a pawn can attack in n dimensions.
 *
 * The pawn moves "forward" along the first coordinate and attacks diagonally.
 * In each remaining dimension, the pawn's attack pattern depends on the mode:
 *
 * - Diagonal mode: Each dimension beyond the first contributes min(sideLength-1, 2) attack squares
 * - Polyagonal mode: Similar to a king, but in one fewer dimension (dimension-1)
 *
 * Formula:
 * - Diagonal mode: (d-1) · min(l-1, 2)
 * - Polyagonal mode: min(l, 3)^(d-1) - 1
 *
 * @param {number} dimension - Number of dimensions (d ≥ 2).
 * @param {string} diagonalMode - "Diagonal" or "Polyagonal".
 * @param {number} sideLength - Side length of the board in each dimension.
 * @returns {number} Maximum number of squares a pawn can attack.
 */
export const calculatePawnAttacks = (dimension, diagonalMode, sideLength) => {
  if (diagonalMode === 'Diagonal') {
    const result = BigInt(dimension - 1) * BigInt(Math.min(sideLength - 1, 2));
    return normalizeResult(result);
  } else { // Polyagonal mode
    const result = powBigInt(Math.min(sideLength, 3), dimension - 1) - 1n;
    return normalizeResult(result);
  }
};

calculatePawnAttacks.getFormula = (diagonalMode) => {
  if (diagonalMode === 'Diagonal') {
    return "\\text{Pawn}_{\\text{Diag}}(d, l) = (d-1) \\cdot \\min(l-1, 2)";
  } else {
    return "\\text{Pawn}_{\\text{Poly}}(d, l) = \\min(l, 3)^{d-1} - 1";
  }
};

/**
 * Helper function to calculate combinations (n choose k) exactly via BigInt.
 *
 * @param {number} n
 * @param {number} k
 * @returns {bigint} Combinatorial count
 */
function combinatorial(n, k) {
  if (k > n || k < 0) return 0n;
  const kEff = Math.min(k, n - k);
  let result = 1n;
  for (let i = 1; i <= kEff; i++) {
    result = (result * BigInt(n - kEff + i)) / BigInt(i);
  }
  return result;
}

/**
 * Integer-safe exponentiation (returns BigInt)
 *
 * @param {number|bigint} base
 * @param {number} exponent
 * @returns {bigint}
 */
function powBigInt(base, exponent) {
  let result = 1n;
  let b = BigInt(base);
  let e = BigInt(exponent);
  while (e > 0n) {
    if (e & 1n) result *= b;
    b *= b;
    e >>= 1n;
  }
  return result;
}

// Normalize results: use Number when within safe integer range, otherwise keep BigInt
const MAX_SAFE_BIGINT = BigInt(Number.MAX_SAFE_INTEGER);
function normalizeResult(value) {
  if (typeof value === 'bigint') {
    const abs = value < 0n ? -value : value;
    if (abs <= MAX_SAFE_BIGINT) return Number(value);
    return value;
  }
  return value;
}

// Lift a numeric result (Number or BigInt) to BigInt for safe arithmetic
function liftToBigInt(value) {
  return (typeof value === 'bigint') ? value : BigInt(value);
}

/**
 * Get information about a chess piece.
 *
 * Returns an object with the calculation function and its formula for the given piece.
 *
 * @param {string} pieceName - Name of the chess piece ("Pawn", "Knight", "Rook", "Bishop", "Queen", "King")
 * @param {string} diagonalMode - "Diagonal" or "Polyagonal"
 * @param {string} knightMode - "L-shaped" or "3-Leaper"
 * @param {number} sideLength - Side length of the board in each dimension.
 * @returns {object|null} Object with keys "calculate" and "formula", or null if not found.
 */
export const getPieceInfo = (pieceName, diagonalMode = 'Polyagonal', knightMode = '3-Leaper', sideLength = 8) => {
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
