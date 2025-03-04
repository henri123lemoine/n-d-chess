import React, { useState, useEffect } from 'react';
import { getPieceInfo } from '../utils/calculator.js';
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
            <option value="Classic">Classic (2D diagonals only)</option>
            <option value="Hyper">Hyper (n-dimensional diagonals)</option>
          </select>
          <p className="setting-description">
            Classic: Pieces can only move along traditional 2D diagonals.<br/>
            Hyper: Pieces can move along diagonals in any number of dimensions simultaneously.
          </p>
        </div>

        <div className="setting-group">
          <label htmlFor="knight-mode">Knight Movement: </label>
          <select
            id="knight-mode"
            value={knightMode}
            onChange={handleKnightModeChange}
          >
            <option value="Standard">Standard (2D knight moves)</option>
            <option value="Alternative">Alternative (3D knight moves)</option>
          </select>
          <p className="setting-description">
            Standard: Knights move as in traditional chess (2 in one direction, 1 in another).<br/>
            Alternative: Knights can move at any distance 3 that isn't straight (Manhattan distance).
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

      <h2>Scaling Formulas</h2>
      <p>How the maximum number of attackable squares scales with dimension (d) for a side length of {sideLength}:</p>

      <div className="formulas-container">
        {CHESS_PIECES.map(piece => {
          const pieceInfo = getPieceInfo(piece, diagonalMode, knightMode, sideLength);
          return pieceInfo?.formula ? (
            <div className="formula" key={piece}>
              <h3>{piece}</h3>
              <LatexFormula formula={pieceInfo.formula} />
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default AttackTable;
