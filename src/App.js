import React, { useState } from 'react';
import AttackTable from './components/AttackTable.js';
import { DEFAULT_DIAGONAL_MODE, DEFAULT_KNIGHT_MODE, DEFAULT_SIDE_LENGTH } from './utils/movementModes.js';

function App() {
  // State for chess movement settings
  const [settings, setSettings] = useState({
    diagonalMode: DEFAULT_DIAGONAL_MODE,
    knightMode: DEFAULT_KNIGHT_MODE,
    sideLength: DEFAULT_SIDE_LENGTH
  });

  // Handler to update settings
  const handleSettingsChange = (newSettings) => {
    setSettings({
      ...settings,
      ...newSettings
    });
  };

  return (
    <div className="container">
      <h1>N-Dimensional Chess Attack Calculator</h1>
      <p>
        This calculator shows the maximum number of squares different chess pieces can attack
        in n-dimensional chess boards with configurable side length.
      </p>
      <AttackTable
        diagonalMode={settings.diagonalMode}
        knightMode={settings.knightMode}
        sideLength={settings.sideLength}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
}

export default App;
