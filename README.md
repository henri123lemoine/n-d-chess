# N-Dimensional Chess Attack Calculator

This React application calculates the maximum number of squares different chess pieces can attack in n-dimensional chess boards with side length 8.

## Current Features

- Calculates and displays attack counts for a knight across dimensions 2-10
- Shows the scaling formula for a knight's attacks in terms of dimension (d)
- Designed to be easily extended for additional chess pieces

## Mathematical Background

In an n-dimensional chess board, a knight moves by:

- Moving 2 squares in one dimension
- Moving 1 square in another dimension
- Staying in place in all other dimensions

For a knight, we can choose 2 dimensions out of n dimensions (order matters), which gives us n(n-1) ways.
For each chosen pair of dimensions, we have 4 possible moves (+/-2, +/-1).
Therefore, the maximum number of squares a knight can attack is 4 _n_ (n-1).

## Running the Application

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

## Future Extensions

This application is designed to be easily extended to calculate attack patterns for other chess pieces in n-dimensional space.

To add a new piece:

1. Add a calculation function in `src/utils/calculator.js`
2. Add the piece name to the `CHESS_PIECES` array in `src/components/AttackTable.js`
3. Define the piece's formula and calculation method in the `getPieceInfo` function

## Technologies Used

- React
- JavaScript
- CSS
