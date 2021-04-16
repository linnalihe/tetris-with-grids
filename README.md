# Tetris with grids

Tetris game built with javascript and css grid. Come with classic music. Check out the game at [linnali.com/tetris-with-grids]().

![screenshot of tetris with grid](/tetris-with-grid-screenshot.png)

## Mechanics

- Start/End Game toggles the game state. Ending the game will reset the game.
- Pause/Unpause toggles the game status. If paused the game is frozen but can be resumed by pressing Pause/Unpause button again.
- Use arrow keys to move the tetris pieces
- Use the space bar to rotate the pieces

## Steps to build the game

1. Decide on game grid dimensions. I Choose to go with the traditional dimensions where the ratio is 10 width by 20 height.
2. Create 5 tetrominos each with 4 rotations
   L, T, O, Z, I. I used a array to represent this where each piece is an array of four arrays where each of the four arrays is the different rotation of the pieces.
3. Move tetris pieces down by undrawing and drawing it in divs
   generate a random tetrios, queue up the tetrios / display the next one coming. I set the time interval for this redraw to 500 which is 500ms or 1/2sec. Check if the piece has hit the bottom.
4. Use an EventListener to check for key press. The spacebar rotates the current block, left arrow moves left, right arrow moves right, down arrow moves down faster.
5. Once tetris piece hits the bottom of the game grid, freeze the piece, and make the current piece be the next piece.
6. Check and clear the rows and add 100 points. If tetris piece reach ceiling of grid then it's game over.
