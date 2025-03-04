import React, { useState, useEffect } from 'react';
import { getPieceInfo } from '../utils/calculator';
import { runTests, allTestsPass } from '../utils/chess-tests';

const TestPanel = () => {
  const [testResults, setTestResults] = useState(null);

  useEffect(() => {
    // Get all piece calculators
    const calculators = {};
    const pieces = ['Knight', 'Rook', 'Bishop', 'Queen', 'King', 'Pawn'];

    pieces.forEach(piece => {
      calculators[piece] = getPieceInfo(piece);
    });

    // Run tests
    const results = runTests(calculators);
    setTestResults(results);
  }, []);

  if (!testResults) {
    return <div>Running tests...</div>;
  }

  return (
    <div className="test-panel">
      <h2>Verification Tests</h2>
      <p>Testing calculations against known values from traditional chess:</p>

      <div className={`test-status ${allTestsPass(testResults) ? 'pass' : 'fail'}`}>
        <strong>
          Status: {allTestsPass(testResults) ? 'All Tests Passed ✓' : 'Some Tests Failed ✗'}
        </strong>
      </div>

      {testResults.passed.length > 0 && (
        <div className="test-passes">
          <h3>Passed Tests:</h3>
          <ul>
            {testResults.passed.map((result, idx) => (
              <li key={`pass-${idx}`}>{result}</li>
            ))}
          </ul>
        </div>
      )}

      {testResults.failed.length > 0 && (
        <div className="test-failures">
          <h3>Failed Tests:</h3>
          <ul>
            {testResults.failed.map((result, idx) => (
              <li key={`fail-${idx}`}>{result}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TestPanel;
