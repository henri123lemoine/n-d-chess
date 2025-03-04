/**
 * Chess piece attack calculators for n-dimensional chess
 * All boards have side length 8 across all dimensions
 */

const SIDE_LENGTH = 8;
const VERSION = 'Thomas';  // alt: 'Henri'. Mainly about diagonal definition.

/**
 * Calculate the maximum number of squares a knight can attack in n dimensions
 * A knight attacks by moving 2 in one dimension and 1 in another
 *
 * @param {number} dimension - Number of dimensions
 * @returns {number} Maximum number of squares a knight can attack
 */
export const calculateKnightAttacks = (dimension) => {
  // - In 2D, a knight attacks 8 squares
  // - For higher dimensions:
  //   - Choose 2 dimensions out of d (order matters) and decide which one gets +/-2 and which gets +/-1
  //   - That's d*(d-1) ways to choose ordered pairs of dimensions
  //   - And 4 ways to assign signs (+/-2, +/-1)
  //   - Total: 4 * d * (d-1)
  // - This formula is also valid for d=1, since 4 * 1 * 0 = 0, and for d=0, since 4 * 0 * -1 = 0!
  // Thus, the formula is 4 * d * (d-1)
  return 4 * dimension * (dimension - 1);
};
calculateKnightAttacks.formula = '4d(d-1)';

/**
 * Calculate the maximum number of squares a rook can attack in n dimensions
 * A rook attacks by moving any number of squares along a single dimension
 *
 * @param {number} dimension - Number of dimensions
 * @returns {number} Maximum number of squares a rook can attack
 */
export const calculateRookAttacks = (dimension) => {
  // For a rook in n dimensions:
  // In each dimension, the rook can move in two directions.
  // From a central square on an even board, available squares per axis = SIDE_LENGTH - 1.
  // Total: dimension * (SIDE_LENGTH - 1)
  return dimension * (SIDE_LENGTH - 1);
};
calculateRookAttacks.formula = 'd(l-1)';

/**
 * Calculate the maximum number of squares a bishop can attack in n dimensions
 * A bishop moves diagonally in any direction, changing exactly two coordinates by ±1 per step.
 *
 * @param {number} dimension - Number of dimensions
 * @returns {number} Maximum number of squares a bishop can attack
 */
export const calculateBishopAttacks = (dimension) => {
  if (VERSION === 'Henri') {
    // Old formula:
    // A bishop moves diagonally in a 2D subspace.
    // From a central square on an even board, the number of squares available along a diagonal ray is:
    //   - For negative direction: (SIDE_LENGTH/2 - 1) steps,
    //   - For positive direction: (SIDE_LENGTH/2) steps.
    // Total per 2D diagonal = ( (SIDE_LENGTH/2 - 1) + (SIDE_LENGTH/2 - 1) + (SIDE_LENGTH/2 - 1) + (SIDE_LENGTH/2) )
    //                         = 4*(SIDE_LENGTH/2) - 3 = 2*SIDE_LENGTH - 3.
    // There are C(d, 2) ways to choose which 2 dimensions to move in,
    // and each such pair yields 4 diagonal directions.
    // Thus, total bishop attack squares = C(d, 2) * (2*SIDE_LENGTH - 3).
    return combinatorial(dimension, 2) * (2 * SIDE_LENGTH - 3);
  } else {
    // New formula:
    // Calculate the maximum number of squares a bishop can attack in n dimensions,
    // when allowed to move along any "diagonal" – i.e. moving in a subset (r ≥ 2)
    // of dimensions simultaneously with a uniform step.
    //
    // Assumptions (for an 8×…×8 board with even side length):
    //   - In any dimension, moving in the positive direction yields 4 moves,
    //     and moving in the negative direction yields 3 moves.
    //   - In an r-dimensional move, exactly one ray (all positive) yields 4 moves,
    //     while the remaining (2^r - 1) rays are limited to 3 moves.
    //
    // Thus, for a given r (with 2 ≤ r ≤ d), there are C(d, r) ways to choose
    // the dimensions and (3*2^r + 1) moves available per chosen r dimensions.
    //
    // Total bishop moves:
    //   sum (r = 2 to d) [ C(d, r) * (3 * 2^r + 1) ]

    let total = 0;
    for (let r = 2; r <= dimension; r++) {
      total += combinatorial(dimension, r) * (3 * Math.pow(2, r) + 1);
    }
    return total;
  }
};
if (VERSION === 'Henri') {
  calculateBishopAttacks.formula = '(d choose 2)(2l-3)';
} else {
  calculateBishopAttacks.formula = 'sum(r=2 to d)[C(d, r)(3*2^r+1)]';
}

/**
 * Calculate the maximum number of squares a queen can attack in n dimensions
 * A queen combines the movements of a rook and bishop.
 *
 * @param {number} dimension - Number of dimensions
 * @returns {number} Maximum number of squares a queen can attack
 */
export const calculateQueenAttacks = (dimension) => {
  // A queen's moves are the sum of rook and bishop moves.
  // Rook moves: dimension * (SIDE_LENGTH - 1)
  // Bishop moves: combinatorial(dimension, 2) * (2*SIDE_LENGTH - 3)
  return calculateRookAttacks(dimension) + calculateBishopAttacks(dimension);
};
if (VERSION === 'Henri') {
  calculateQueenAttacks.formula = 'd(l-1)+(d choose 2)(2l-3)';
} else {
  calculateQueenAttacks.formula = 'd(l-1)+sum(r=2 to d)[C(d, r)(3*2^r+1)]';
}

/**
 * Calculate the maximum number of squares a king can attack in n dimensions
 * A king can move one step in any direction (including diagonals)
 *
 * @param {number} dimension - Number of dimensions
 * @returns {number} Maximum number of squares a king can attack
 */
export const calculateKingAttacks = (dimension) => {
  // A king moves one square in any direction.
  // Total moves = 3^dimension - 1 (all combinations of -1, 0, 1 excluding the zero vector).
  return Math.pow(3, dimension) - 1;
};
calculateKingAttacks.formula = '3^d-1';

/**
 * Calculate the maximum number of squares a pawn can attack in n dimensions
 * A pawn attacks diagonally forward, which means it moves 1 in the forward dimension
 * and 1 in any other single dimension.
 *
 * @param {number} dimension - Number of dimensions
 * @returns {number} Maximum number of squares a pawn can attack
 */
export const calculatePawnAttacks = (dimension) => {
  if (VERSION === 'Henri') {
    // Old formula:
    // A pawn attacks diagonally forward.
    // It moves 1 in the forward dimension and 1 in any one of the (dimension-1) other dimensions.
    // For each of these, there are 2 directions (±).
    // Total: 2 * (dimension - 1)
    return 2 * (dimension - 1);
  } else {
    // New formula:
    // Calculate the maximum number of squares a pawn can attack in n dimensions,
    // when it moves one step forward (in a designated "forward" dimension) and
    // one step diagonally in any combination of the remaining dimensions.
    //
    // For each of the (dimension-1) other axes, the pawn can move -1, 0, or +1.
    // Excluding the case where all lateral moves are 0 (the straight move),
    // the total number of attack moves is: 3^(dimension-1) - 1.
    return Math.pow(3, dimension - 1) - 1;
  }
};
if (VERSION === 'Henri') {
  calculatePawnAttacks.formula = '2(d-1)';
} else {
  calculatePawnAttacks.formula = '3^(d-1)-1';
}

// Helper function for calculating combinations (n choose k)
function combinatorial(n, k) {
  return factorial(n) / (factorial(k) * factorial(n - k));
}

// Helper function for calculating factorials
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

/**
 * Returns information about a chess piece
 * @param {string} pieceName - Name of the chess piece
 */
export const getPieceInfo = (pieceName) => {
  const pieces = {
    'Knight': {
      calculate: calculateKnightAttacks,
    },
    'Rook': {
      calculate: calculateRookAttacks,
    },
    'Bishop': {
      calculate: calculateBishopAttacks,
    },
    'Queen': {
      calculate: calculateQueenAttacks,
    },
    'King': {
      calculate: calculateKingAttacks,
    },
    'Pawn': {
      calculate: calculatePawnAttacks,
    }
  };

  return pieces[pieceName] || null;
};
