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
  // Calculation
  // Notes:
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
  if (dimension < 1) return 0;

  // For a rook in n dimensions:
  // In each dimension, the rook can move along a line passing through the center.
  // For each dimension, the rook can attack (sideLength-1) squares.
  // Total number of attackable squares: dimension * (sideLength-1)
  return dimension * (SIDE_LENGTH - 1);
};

/**
 * Calculate the maximum number of squares a bishop can attack in n dimensions
 * A bishop attacks diagonally - moving the same distance in two different dimensions
 *
 * @param {number} dimension - Number of dimensions
 * @returns {number} Maximum number of squares a bishop can attack
 */
// NOTE: THIS IS NOT CORRECT!
export const calculateBishopAttacks = (dimension) => {
  if (dimension < 2) return 0;

  // In 2D, a bishop in the center attacks 13 squares
  if (dimension === 2) return 13;

  // For 3D and higher, a bishop can attack diagonally in multiple ways:
  // 1. Standard diagonal in any 2D plane: 4 * (dimension choose 2) * (SIDE_LENGTH - 1)
  // 2. Higher-dimensional diagonals (moving simultaneously in 3+ dimensions)

  // This gives us a formula based on combinations of dimensions
  let attackable = 0;

  // For each pair of dimensions, we have 4 diagonals
  const pairwiseDiagonals = 4 * (dimension * (dimension - 1) / 2) * (SIDE_LENGTH - 1);
  attackable += pairwiseDiagonals;

  // Each 3D+ diagonal can be formed by selecting 3 or more dimensions and moving
  // simultaneously in all of them
  if (dimension >= 3) {
    // This adds additional diagonals available in higher dimensions
    const additionalDiagonals = Math.pow(2, dimension) - 1 - dimension - (dimension * (dimension - 1) / 2);
    attackable += additionalDiagonals * 2 * (SIDE_LENGTH - 1);
  }

  return attackable;
};

/**
 * Calculate the maximum number of squares a queen can attack in n dimensions
 * A queen combines the movements of a rook and bishop
 *
 * @param {number} dimension - Number of dimensions
 * @returns {number} Maximum number of squares a queen can attack
 */
export const calculateQueenAttacks = (dimension) => {
  // A queen combines the attack patterns of a rook and bishop
  // We simply add their attack squares
  const rookAttacks = calculateRookAttacks(dimension);
  const bishopAttacks = calculateBishopAttacks(dimension);

  return rookAttacks + bishopAttacks;
};

/**
 * Calculate the maximum number of squares a king can attack in n dimensions
 * A king moves 1 square in any direction, but only one step total
 *
 * @param {number} dimension - Number of dimensions
 * @returns {number} Maximum number of squares a king can attack
 */
export const calculateKingAttacks = (dimension) => {
  if (dimension < 1) return 0;

  // TODO: Verify correctness
  // In 2D, a king attacks 8 squares (all adjacent)
  if (dimension === 2) return 8;

  // The key insight is that a king can only move ONE square total,
  // not one square in each dimension simultaneously.
  // It can move one step in any direction (orthogonal or diagonal)

  // Total adjacent squares = 2*dimension (orthogonal moves, like a one-step rook)
  const orthogonalMoves = 2 * dimension;

  // Plus diagonal moves to adjacent squares (like a one-step bishop)
  // This is equivalent to the number of ways to select at least one dimension to move in
  // minus the orthogonal moves we already counted
  const diagonalMoves = Math.pow(2, dimension) - 1 - orthogonalMoves;

  return orthogonalMoves + diagonalMoves;
};

/**
 * Calculate the maximum number of squares a pawn can attack in n dimensions
 * A pawn attacks diagonally forward, which means it moves 1 in the forward dimension
 * and 1 in any other single dimension
 *
 * @param {number} dimension - Number of dimensions
 * @returns {number} Maximum number of squares a pawn can attack
 */
export const calculatePawnAttacks = (dimension) => {
  if (dimension < 2) return 0;

  // TODO: Verify correctness.

  // In 2D, a pawn attacks 2 squares (forward-left and forward-right)
  if (dimension === 2) return 2;

  // For higher dimensions:
  // In 3D, a pawn attacks 4 squares (forward-left, forward-right, forward-up, forward-down)
  // In general, a pawn attacks 2 * (dimension - 1) squares:
  // Choose 1 forward dimension, then choose 1 of the remaining (dimension-1) dimensions
  // to move diagonally in, with 2 possible directions (+ or -) in that dimension
  return 2 * (dimension - 1);
};

/**
 * Returns the formula for calculating the maximum number of squares
 * a knight can attack in n dimensions
 */
export const getKnightFormula = () => {
  return '4 * d * (d-1)';  // correct
};

/**
 * Returns the formula for calculating the maximum number of squares
 * a rook can attack in n dimensions
 */
export const getRookFormula = () => {
  return 'd * (l-1)';  // correct
};

/**
 * Returns the formula for calculating the maximum number of squares
 * a bishop can attack in n dimensions
 */
export const getBishopFormula = () => {
  return 'TODO: Verify correctness';
};

/**
 * Returns the formula for calculating the maximum number of squares
 * a queen can attack in n dimensions
 */
export const getQueenFormula = () => {
  return 'Rook attacks + Bishop attacks';
};

/**
 * Returns the formula for calculating the maximum number of squares
 * a king can attack in n dimensions
 */
export const getKingFormula = () => {
  return 'TODO: Verify correctness';
};

/**
 * Returns the formula for calculating the maximum number of squares
 * a pawn can attack in n dimensions
 */
export const getPawnFormula = () => {
  return 'TODO: Verify correctness';
};

/**
 * Returns information about a chess piece
 * @param {string} pieceName - Name of the chess piece
 * @returns {Object} Object with calculation function and formula
 */
export const getPieceInfo = (pieceName) => {
  const pieces = {
    'Knight': {
      calculate: calculateKnightAttacks,
      formula: getKnightFormula()
    },
    'Rook': {
      calculate: calculateRookAttacks,
      formula: getRookFormula()
    },
    'Bishop': {
      calculate: calculateBishopAttacks,
      formula: getBishopFormula()
    },
    'Queen': {
      calculate: calculateQueenAttacks,
      formula: getQueenFormula()
    },
    'King': {
      calculate: calculateKingAttacks,
      formula: getKingFormula()
    },
    'Pawn': {
      calculate: calculatePawnAttacks,
      formula: getPawnFormula()
    }
  };

  return pieces[pieceName] || null;
};
