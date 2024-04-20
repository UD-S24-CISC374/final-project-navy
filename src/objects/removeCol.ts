export function removeCol(
    col: number,
    numRows: number,
    numCols: number,
    board: string[][],
    tiles: Phaser.GameObjects.Sprite[],
    tileTypes: string[]
) {
    if (col === 0) {
        // Direct replacement of column 0
        for (let row = 0; row < numRows; row++) {
            // Generate a new tile at the start of the row for column 0
            const randomIndex = Math.floor(Math.random() * tileTypes.length);
            const newTileType = tileTypes[randomIndex];
            board[row][col] = newTileType;

            // Update the sprite for the new tile at the beginning of the row
            const tileSprite = tiles[row * numCols + col];
            tileSprite.setData("tileType", newTileType);
            tileSprite.setTexture(newTileType);
        }
    } else {
        // Shift all columns to the right of the matched column to the left
        for (let row = 0; row < numRows; row++) {
            // Remove the matched column and shift columns
            board[row].splice(col, 1);

            // Generate a new tile at the start of the row
            const randomIndex = Math.floor(Math.random() * tileTypes.length);
            const newTileType = tileTypes[randomIndex];
            board[row].unshift(newTileType); // Adds to the beginning of the array

            // Update sprites from column 0 to col-1 after the shift
            for (let shiftCol = 0; shiftCol < numCols; shiftCol++) {
                const tileSprite = tiles[row * numCols + shiftCol];
                const tileType = board[row][shiftCol];
                tileSprite.setData("tileType", tileType);
                tileSprite.setTexture(tileType);
            }
        }
    }
}
