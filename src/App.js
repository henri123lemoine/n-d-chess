import React from 'react';
import AttackTable from './components/AttackTable.js';

function App() {
  return (
    <div className="container">
      <h1>N-Dimensional Chess Attack Calculator</h1>
      <p>
        This calculator shows the maximum number of squares different chess pieces can attack
        in n-dimensional chess boards with side length 8.
      </p>
      <AttackTable />
    </div>
  );
}

export default App;
