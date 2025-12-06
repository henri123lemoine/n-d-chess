import React, { useState, useEffect } from 'react';
import { getPieceInfo } from '../utils/calculator.js';
import { DIAGONAL_MODE_LIST, KNIGHT_MODE_LIST } from '../utils/movementModes.js';
import LatexFormula from './LatexFormula.js';

const DIMENSIONS = [1, 2, 3, 4, 5, 6, 7, 10, 20, 50];
const CHESS_PIECES = ['Pawn', 'Knight', 'Rook', 'Bishop', 'Queen', 'King'];
const MIN_SIDE_LENGTH = 1;

// Helper function to format large numbers with commas
const formatNumber = (num) => {
  return num.toLocaleString();
};

const AttackTable = ({ diagonalMode, knightMode, sideLength, onSettingsChange }) => {
  // State to hold calculated attack counts
  const [attackCounts, setAttackCounts] = useState({});

  // Calculate attack counts for all pieces and selected dimensions when mode settings change
  useEffect(() => {
    const counts = {};

    CHESS_PIECES.forEach(piece => {
      const pieceInfo = getPieceInfo(piece, diagonalMode, knightMode, sideLength);
      if (!pieceInfo) return;

      counts[piece] = {};
      DIMENSIONS.forEach(d => {
        counts[piece][d] = pieceInfo.calculate(d);
      });
    });

    setAttackCounts(counts);
  }, [diagonalMode, knightMode, sideLength]); // Recalculate when these settings change

  // Handlers for settings changes
  const handleDiagonalModeChange = (e) => {
    onSettingsChange({ diagonalMode: e.target.value, knightMode, sideLength });
  };

  const handleKnightModeChange = (e) => {
    onSettingsChange({ diagonalMode, knightMode: e.target.value, sideLength });
  };

  const handleSideLengthChange = (e) => {
    // Parse as integer and ensure it's at least 2
    const newSideLength = Math.max(MIN_SIDE_LENGTH, parseInt(e.target.value, 10) || MIN_SIDE_LENGTH);
    onSettingsChange({ diagonalMode, knightMode, sideLength: newSideLength });
  };

  return (
    <div>
      <h2>Maximum Attackable Squares in N-Dimensional Chess</h2>
      <p>All calculations are for chess boards with side length {sideLength} in each dimension.</p>

      <div className="settings-panel">
        <div className="setting-group">
          <label htmlFor="side-length">Board Size: </label>
          <input
            id="side-length"
            type="number"
            min={MIN_SIDE_LENGTH}
            value={sideLength}
            onChange={handleSideLengthChange}
          />
          <p className="setting-description">
            The side length of the chess board in each dimension (default is 8).
          </p>
        </div>

        <div className="setting-group">
          <label htmlFor="diagonal-mode">Diagonal Movement: </label>
          <select
            id="diagonal-mode"
            value={diagonalMode}
            onChange={handleDiagonalModeChange}
          >
            {DIAGONAL_MODE_LIST.map(mode => (
              <option key={mode.value} value={mode.value}>{mode.label}</option>
            ))}
          </select>
          <p className="setting-description">
            {DIAGONAL_MODE_LIST.map((mode, i) => (
              <span key={mode.value}>{mode.value}: {mode.description}{i < DIAGONAL_MODE_LIST.length - 1 && <br/>}</span>
            ))}
          </p>
        </div>

        <div className="setting-group">
          <label htmlFor="knight-mode">Knight Movement: </label>
          <select
            id="knight-mode"
            value={knightMode}
            onChange={handleKnightModeChange}
          >
            {KNIGHT_MODE_LIST.map(mode => (
              <option key={mode.value} value={mode.value}>{mode.label}</option>
            ))}
          </select>
          <p className="setting-description">
            {KNIGHT_MODE_LIST.map((mode, i) => (
              <span key={mode.value}>{mode.value}: {mode.description}{i < KNIGHT_MODE_LIST.length - 1 && <br/>}</span>
            ))}
          </p>
        </div>
      </div>

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

      <h2 className="formulas-heading">Scaling Formulas</h2>
      <p className="formula-description">How the maximum number of attackable squares scales with dimension (d) for a side length of {sideLength}:</p>

      <div className="formulas-container">
        {CHESS_PIECES.map(piece => {
          const pieceInfo = getPieceInfo(piece, diagonalMode, knightMode, sideLength);
          return pieceInfo?.formula ? (
            <div className="formula" key={piece}>
              <LatexFormula formula={pieceInfo.formula} />
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default AttackTable;
