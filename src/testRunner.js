// testRunner.js using ES modules
import { getPieceInfo } from './utils/calculator.js';
import { runTests } from './utils/chess-tests.js';

// Run tests for all pieces
const runAllTests = () => {
  console.log('Running chess piece attack calculations tests...');

  // Get all piece calculators
  const calculators = {
    Knight: {
      calculate: (dimension) => getPieceInfo('Knight').calculate(dimension),
    },
    Rook: {
      calculate: (dimension) => getPieceInfo('Rook').calculate(dimension),
    },
    Bishop: {
      calculate: (dimension) => getPieceInfo('Bishop').calculate(dimension),
    },
    Queen: {
      calculate: (dimension) => getPieceInfo('Queen').calculate(dimension),
    },
    King: {
      calculate: (dimension) => getPieceInfo('King').calculate(dimension),
    },
    Pawn: {
      calculate: (dimension) => getPieceInfo('Pawn').calculate(dimension),
    },
  };

  // Run tests
  const testResults = runTests(calculators);

  // Convert results to passed/failed format
  const results = {
    passed: [],
    failed: [],
  };

  testResults.forEach(result => {
    if (result.pass) {
      const message = result.message ?
        `${result.test}: ${result.message}` :
        `${result.test}: ✓ (${result.actual})`;
      results.passed.push(message);
    } else {
      const message = result.message ?
        `${result.test}: ${result.message}` :
        `${result.test}: ✗ Expected ${result.expected}, got ${result.actual}`;
      results.failed.push(message);
    }
  });

  // Log results
  console.log('\n----- TEST RESULTS -----');
  if (results.failed.length === 0) {
    console.log('✅ All tests passed!');
  } else {
    console.log(`❌ ${results.failed.length} tests failed!`);
  }

  if (results.passed.length > 0) {
    console.log('\nPASSED TESTS:');
    results.passed.forEach(result => console.log(`✓ ${result}`));
  }

  if (results.failed.length > 0) {
    console.log('\nFAILED TESTS:');
    results.failed.forEach(result => console.log(`✗ ${result}`));
  }

  return results;
};

// Execute tests
const results = runAllTests();

// Exit with appropriate code
if (results.failed.length > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
