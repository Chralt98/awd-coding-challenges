/// <reference types="node" />

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
const ALIVE_CELL_PROBABILITY: number = 0.1;

enum State {
  alive,
  dead,
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class GameOfLife {
  private grid: Cell[][];

  constructor() {
    this.grid = [];

    for (let r = 0; r < ROWS; r++) {
      const row: Cell[] = [];
      this.grid[r] = row;

      for (let c = 0; c < COLUMNS; c++) {
        const randomNumber = Math.random();
        row[c] = new Cell(
          randomNumber < ALIVE_CELL_PROBABILITY ? State.alive : State.dead,
        );
      }
    }
  }

  async render(): Promise<void> {
    while (true) {
      const lines: string[] = [];

      for (let r = 0; r < ROWS; r++) {
        const row = this.grid[r];
        if (!row) continue;
        lines.push(row.join(""));
      }

      console.clear();
      console.log(lines.join("\n"));

      await delay(DELAY_MS);
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

const game = new GameOfLife();
void game.render();
