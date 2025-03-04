# N-Dimensional Chess Attack Calculator

This web app calculates the maximum number of squares different chess pieces can attack in n-dimensional chess boards with side length 8.

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
npm install
npm start
```
