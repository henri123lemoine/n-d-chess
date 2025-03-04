/**
 * Chess piece attack calculators for n-dimensional chess
 * All boards have side length 8 across all dimensions
 */

const SIDE_LENGTH = 8;

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

/**
 * Calculate the maximum number of squares a bishop can attack in n dimensions
 * A bishop moves diagonally in any direction, changing exactly two coordinates by ±1 per step.
 *
 * @param {number} dimension - Number of dimensions
 * @returns {number} Maximum number of squares a bishop can attack
 */
export const calculateBishopAttacks = (dimension) => {
  if (dimension < 2) return 0;

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
};

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

/**
 * Calculate the maximum number of squares a pawn can attack in n dimensions
 * A pawn attacks diagonally forward, which means it moves 1 in the forward dimension
 * and 1 in any other single dimension.
 *
 * @param {number} dimension - Number of dimensions
 * @returns {number} Maximum number of squares a pawn can attack
 */
export const calculatePawnAttacks = (dimension) => {
  // A pawn attacks diagonally forward.
  // It moves 1 in the forward dimension and 1 in any one of the (dimension-1) other dimensions.
  // For each of these, there are 2 directions (±).
  // Total: 2 * (dimension - 1)
  return 2 * (dimension - 1);
};

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
      formula: '4d(d-1)'
    },
    'Rook': {
      calculate: calculateRookAttacks,
      formula: 'd(l-1)'
    },
    'Bishop': {
      calculate: calculateBishopAttacks,
      formula: '(d choose 2)(2l-3)'
    },
    'Queen': {
      calculate: calculateQueenAttacks,
      formula: 'd(l-1)+(d choose 2)(2l-3)'
    },
    'King': {
      calculate: calculateKingAttacks,
      formula: '3^d-1'
    },
    'Pawn': {
      calculate: calculatePawnAttacks,
      formula: '2(d-1)'
    }
  };

  return pieces[pieceName] || null;
};
