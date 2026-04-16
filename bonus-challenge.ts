/*
Coding Challenge: Conway’s Game of Life
The Game of Life is a cellular automaton devised by the British mathematician John Conway in 1970. It is a "zero-player game," meaning its evolution is determined by its initial state, requiring no further input.

Your task is to build a command-line interface (CLI) version of this simulation using a fixed 50x50 grid.

---

The Rules of the World
The universe of the Game of Life is a two-dimensional grid of cells. Each cell is in one of two possible states: alive or dead. Every generation, the grid transitions based on the following four rules:

Underpopulation: Any live cell with fewer than 2 live neighbors dies.
Survival: Any live cell with 2 or 3 live neighbors lives on to the next generation.
Overpopulation: Any live cell with more than 3 live neighbors dies.
Reproduction: Any dead cell with exactly 3 live neighbors becomes a live cell.

---

Technical Requirements
Fixed Grid: The simulation must run on a strictly defined grid of 50 rows and 50 columns.
CLI Rendering: Choose 2 characters tor represent dead or alive cells (i.e. "#" and ".").

Frame Rendering:  The screen should refresh or clear for each new generation to create an animation effect.
Initial State: Allow the user to start the simulation with a random distribution of live cells or a predefined pattern (like a "Glider" or "Pulsar").
The Loop: The program should calculate the next generation based on the current state and display it, ideally with a small delay (e.g., 100ms) between frames.
*/

const ROWS: number = 50;
const COLUMNS: number = 50;
const DELAY_MS: number = 100;

enum State {
  "alive",
  "dead",
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class GameOfLife {
  canvas: Cell[][];

  constructor() {
    for (let y = 0; y < COLUMNS; y++) {
      for (let x = 0; x < ROWS; x++) {
        const randomNumber = Math.random();
        this.canvas[x][y] = new Cell(
          randomNumber === 1 ? State.alive : State.dead,
        );
      }
    }
  }

  render() {
    while (true) {
      for (let y = 0; y < COLUMNS; y++) {
        for (let x = 0; x < ROWS; x++) {}
      }
      delay(DELAY_MS);
    }
  }
}

class Cell {
  state: State;

  constructor(state: State) {
    this.state = state;
  }

  toString(): string {
    return this.state === State.alive ? "." : "#";
  }
}
