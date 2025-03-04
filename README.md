# N-Dimensional Chess Attack Calculator

[![GitHub release](https://img.shields.io/github/v/release/henri123lemoine/n-d-chess)](https://github.com/henri123lemoine/n-d-chess/releases)
[![Netlify](https://img.shields.io/badge/Netlify-Deployed-brightgreen)](https://n-d-chess.netlify.app/)
[![GitHub](https://img.shields.io/github/license/henri123lemoine/n-d-chess)](https://github.com/henri123lemoine/n-d-chess/blob/main/LICENSE)

A web application that computes the maximum number of attackable squares for hyperdimensional chess pieces on an n-dimensional hypercube.

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

## Usage

Visit the deployed application on Netlify: [https://n-d-chess.netlify.app/](https://n-d-chess.netlify.app/). Otherwise, follow the instructions below to run the application locally.

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

## Mathematical Background

Formulas adjust for finite board sizes (e.g., knight moves drop when side length < 5), detailed in `src/utils/calculator.js`.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
