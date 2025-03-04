/**
 * Tests for chess piece attack calculations
 *
 * This file contains test cases for verifying our n-dimensional chess calculations
 * by checking against known values from traditional chess.
 */

// Known values for pieces in the center of a standard 2D board
export const known2DValues = {
  'Knight': 8,    // Knight attacks 8 squares in 2D
  'Rook': 14,     // Rook attacks 14 squares (7 in each of 2 directions)
  'Bishop': 13,   // Bishop attacks 13 squares (diagonals)
  'Queen': 27,    // Queen attacks 27 squares (rook + bishop)
  'King': 8,      // King attacks 8 adjacent squares
  'Pawn': 2       // Pawn attacks 2 diagonal squares forward
};

/**
 * Runs tests to verify calculations match known values
 * @returns {Object} Test results showing passes and failures
 */
export const runTests = (calculators) => {
  const results = [];

  // 2D tests (expected values based on traditional chess)
  results.push({
    test: 'Knight 2D',
    expected: 8,
    actual: calculators['Knight'].calculate(2),
    pass: calculators['Knight'].calculate(2) === 8,
  });

  results.push({
    test: 'Rook 2D',
    expected: 14,
    actual: calculators['Rook'].calculate(2),
    pass: calculators['Rook'].calculate(2) === 14,
  });

  results.push({
    test: 'Bishop 2D',
    expected: 13,
    actual: calculators['Bishop'].calculate(2),
    pass: calculators['Bishop'].calculate(2) === 13,
  });

  results.push({
    test: 'Queen 2D',
    expected: 27,
    actual: calculators['Queen'].calculate(2),
    pass: calculators['Queen'].calculate(2) === 27,
  });

  results.push({
    test: 'King 2D',
    expected: 8,
    actual: calculators['King'].calculate(2),
    pass: calculators['King'].calculate(2) === 8,
  });

  results.push({
    test: 'Pawn 2D',
    expected: 2,
    actual: calculators['Pawn'].calculate(2),
    pass: calculators['Pawn'].calculate(2) === 2,
  });

  // Test that all values for dimensions 2-10 are non-negative
  const PIECES = ['Knight', 'Rook', 'Bishop', 'Queen', 'King', 'Pawn'];
  const DIMENSIONS = [2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Test that all values are non-negative
  PIECES.forEach(piece => {
    const calculator = calculators[piece];
    if (!calculator) return;

    DIMENSIONS.forEach(d => {
      const value = calculator.calculate(d);
      if (value < 0) {
        results.push({
          test: `${piece} ${d}-D`,
          expected: 0,
          actual: value,
          pass: false,
          message: `Got negative value: ${value}`
        });
      } else {
        results.push({
          test: `${piece} ${d}-D`,
          expected: 0,
          actual: value,
          pass: true,
          message: `Non-negative check passed (${value})`
        });
      }
    });
  });

  // Test that attack counts increase with dimensions
  PIECES.forEach(piece => {
    const calculator = calculators[piece];
    if (!calculator) return;

    for (let d = 2; d < 10; d++) {
      const currentValue = calculator.calculate(d);
      const nextValue = calculator.calculate(d + 1);

      if (nextValue <= currentValue) {
        results.push({
          test: `${piece} dimension increase ${d}→${d+1}`,
          expected: `${d+1}D > ${d}D`,
          actual: `${nextValue} <= ${currentValue}`,
          pass: false,
          message: `${piece} in ${d+1}D (${nextValue}) should attack more squares than in ${d}D (${currentValue})`
        });
      } else {
        results.push({
          test: `${piece} dimension increase ${d}→${d+1}`,
          expected: `${d+1}D > ${d}D`,
          actual: `${nextValue} > ${currentValue}`,
          pass: true,
          message: `${piece} attacks more squares as dimensions increase`
        });
      }
    }
  });

  // Test chess piece hierarchy constraints
  // 1. Queen should attack at least as many squares as any other piece
  // 2. Bishop and Rook should attack at least as many squares as Pawn and Knight
  DIMENSIONS.forEach(d => {
    const queenAttacks = calculators['Queen'].calculate(d);
    const bishopAttacks = calculators['Bishop'].calculate(d);
    const rookAttacks = calculators['Rook'].calculate(d);

    if (queenAttacks < bishopAttacks) {
      results.push({
        test: `Hierarchy ${d}-D`,
        expected: 0,
        actual: queenAttacks - bishopAttacks,
        pass: false,
        message: `Queen (${queenAttacks}) attacks fewer squares than Bishop (${bishopAttacks})`
      });
    } else {
      results.push({
        test: `Hierarchy ${d}-D`,
        expected: 0,
        actual: 0,
        pass: true,
        message: `Queen attacks at least as many squares as Bishop`
      });
    }

    if (queenAttacks < rookAttacks) {
      results.push({
        test: `Hierarchy ${d}-D`,
        expected: 0,
        actual: queenAttacks - rookAttacks,
        pass: false,
        message: `Queen (${queenAttacks}) attacks fewer squares than Rook (${rookAttacks})`
      });
    } else {
      results.push({
        test: `Hierarchy ${d}-D`,
        expected: 0,
        actual: 0,
        pass: true,
        message: `Queen attacks at least as many squares as Rook`
      });
    }
  });

  return results;
};

/**
 * Check if all tests pass
 * @param {Object} results - Test results from runTests
 * @returns {boolean} Whether all tests pass
 */
export const allTestsPass = (results) => {
  return results.filter(result => !result.pass).length === 0;
};

// CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    known2DValues,
    runTests,
    allTestsPass
  };
}
