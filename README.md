# N-Dimensional Chess

![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/henri123lemoine/n-d-chess?include_prereleases)
![GitHub](https://img.shields.io/github/license/henri123lemoine/n-d-chess)
[![Netlify](https://img.shields.io/badge/Netlify-Deployed-brightgreen)](https://n-d-chess.netlify.app/)

A web application that computes the maximum number of squares various chess pieces can attack on n-dimensional chessboards with configurable side lengths, built with React and KaTeX for mathematical rendering.

## Overview

This project extends traditional chess mechanics into n-dimensional spaces, calculating the maximum attackable squares for pieces like the Pawn, Knight, Rook, Bishop, Queen, and King. Users can configure the board's side length and choose between different movement modes, including "Classic" and "Hyper" diagonal movements for bishops and pawns, and "Standard" and "Alternative" movements for knights. Results are displayed in an interactive table, with scaling formulas rendered in LaTeX using KaTeX for clarity and precision.

Hosted live on Netlify: [https://n-d-chess.netlify.app/](https://n-d-chess.netlify.app/)

## Features

- **Multi-Dimensional Calculations**
- **Configurable Modes**:
  - Diagonal Movements: "Classic" (2D diagonals) and "Hyper" (n-dimensional diagonals).
  - Knight Movements: "Standard" (traditional 2D moves) and "Alternative" (generalized to Manhattan distance 3, excluding straight moves).
- **Dynamic Board Size**: Supports configurable side lengths (default 8), adjustable via an intuitive UI.
- **Mathematical Precision**: Provides LaTeX-rendered formulas showing how attack counts scale with dimensions.
- **Verification Suite**: Includes a test suite in `src/utils/chess-tests.js` to validate calculations against known 2D chess values.
- **Responsive Design**: Built with React for a seamless, interactive user experience across devices.

## Technical Challenges

The project tackles several complex technical hurdles:

- **Generalizing Movement Rules**:

  - **Knight**: In "Standard" mode, moves are 2 steps in one dimension and 1 in another, scaling as \(4d(d-1)\). In "Alternative" mode, knights move any 3 squares (Manhattan distance 3), excluding single-axis moves, requiring combinatorial logic (\(8\binom{d}{2} + 8\binom{d}{3}\)).
  - **Bishop**: "Classic" mode restricts diagonals to 2D subspaces (\(\binom{d}{2}(2l-3)\)), while "Hyper" mode generalizes to n-dimensional diagonals (\(\sum\_{r=2}^{d}\binom{d}{r}(3 \cdot 2^r + 1)\)), summing over all possible subsets.
  - **Finite Board Constraints**: Adjustments for board edges (e.g., side length < 5 limits knight moves) add piecewise complexity to formulas.

- **Mathematical Rendering**: Integrates KaTeX to display complex formulas dynamically, ensuring they update with user settings .

- **Validation**: Ensures accuracy by testing against traditional 2D chess values (e.g., Queen attacks 27 squares), with a robust test suite addressing non-negativity and dimensional scaling.

## Usage

### Running Locally

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/henri123lemoine/n-d-chess.git
   cd n-d-chess
   ```

2. **Install Dependencies and Start the Development Server**:

   ```bash
   npm install
   npm start
   ```

   Open your browser at `http://localhost:3000`.

### Online Access

Visit the deployed application on Netlify: [https://n-d-chess.netlify.app/](https://n-d-chess.netlify.app/)

## Mathematical Background

In traditional 2D chess (8x8 board), maximum attackable squares from optimal positions are:

- **Knight**: 8 (center)
- **Rook**: 14 (7 in each direction)
- **Bishop**: 13 (diagonals)
- **Queen**: 27 (rook + bishop)
- **King**: 8 (adjacent)
- **Pawn**: 2 (diagonal forward attacks)

This project generalizes these to n dimensions. For example:

- **Knight (Standard)**: Scales as \(4d(d-1)\), reflecting pairs of dimensions with four move orientations.
- **Queen (Hyper)**: Combines rook (\(d(l-1)\)) and hyper-bishop (\(\sum\_{r=2}^{d}\binom{d}{r}(3 \cdot 2^r + 1)\)) moves.

Formulas adjust for finite board sizes (e.g., knight moves drop when side length < 5), detailed in `src/utils/calculator.js`.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
