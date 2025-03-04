import React, { useState, useEffect } from 'react';
import { getPieceInfo } from '../utils/calculator.js';

// Define the specific dimensions to display
const DIMENSIONS = [1, 2, 3, 4, 5, 6, 7, 10, 20, 50];

// List of chess pieces to display
const CHESS_PIECES = ['Knight', 'Rook', 'Bishop', 'Queen', 'King', 'Pawn'];

// Helper function to format large numbers with commas
const formatNumber = (num) => {
  return num.toLocaleString();
};

const AttackTable = () => {
  // State to hold calculated attack counts
  const [attackCounts, setAttackCounts] = useState({});

  // Calculate attack counts for all pieces and selected dimensions on component mount
  useEffect(() => {
    const counts = {};

    CHESS_PIECES.forEach(piece => {
      const pieceInfo = getPieceInfo(piece);
      if (!pieceInfo) return;

      counts[piece] = {};
      DIMENSIONS.forEach(d => {
        counts[piece][d] = pieceInfo.calculate(d);
      });
    });

    setAttackCounts(counts);
  }, []);

  return (
    <div>
      <h2>Maximum Attackable Squares in N-Dimensional Chess</h2>
      <p>All calculations are for chess boards with side length 8 in each dimension.</p>

      <table>
        <thead>
          <tr>
            <th>Piece</th>
            {DIMENSIONS.map(d => (
              <th key={d}>{d}D</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CHESS_PIECES.map(piece => (
            <tr key={piece}>
              <td>{piece}</td>
              {DIMENSIONS.map(d => (
                <td key={d}>
                  {attackCounts[piece] ? formatNumber(attackCounts[piece][d]) : '...'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Scaling Formulas</h2>
      <p>How the maximum number of attackable squares scales with dimension (d) for a side length of 8:</p>

      <div className="formulas-container">
        {CHESS_PIECES.map(piece => {
          const pieceInfo = getPieceInfo(piece);
          return pieceInfo.calculate.formula ? (
            <div className="formula" key={piece}>
              <h3>{piece}</h3>
              <p>
                {pieceInfo.calculate.formula}
              </p>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default AttackTable;
