import Phaser from "phaser";

export function shiftValues(
    deltaX: number,
    deltaY: number,
    numRows: number,
    numCols: number,
    board: string[][],
    selectedTileIndex: number,
    tiles: Phaser.GameObjects.Sprite[]
) {
    const totalTiles = numRows * numCols;

    const currentIndex = selectedTileIndex;
    const selectedRow = Math.floor(currentIndex / numCols);
    const selectedCol = currentIndex % numCols;

    const newTileTypes = [];

    // Shift values in the row
    if (deltaX !== 0) {
        for (let col = 0; col < numCols; col++) {
            const tileIndex = selectedRow * numCols + col;
            const shiftedIndex =
                ((tileIndex + deltaX + numCols) % numCols) +
                selectedRow * numCols;
            const tileType = tiles[shiftedIndex].getData("tileType");
            newTileTypes.push(tileType);
        }
        // Update tiles in the row with new values
        for (let col = 0; col < numCols; col++) {
            const tileIndex = selectedRow * numCols + col;
            tiles[tileIndex].setData("tileType", newTileTypes[col]);
            tiles[tileIndex].setTexture(newTileTypes[col]);
        }
        // Update the board with new tile types
        board[selectedRow] = newTileTypes;
    }

    // Shift values in the column
    if (deltaY !== 0) {
        for (let row = 0; row < numRows; row++) {
            const tileIndex = row * numCols + selectedCol;
            const shiftedIndex =
                (tileIndex + deltaY * numCols + totalTiles) % totalTiles;
            const tileType = tiles[shiftedIndex].getData("tileType");
            newTileTypes.push(tileType);
        }
        // Update tiles in the column with new values
        for (let row = 0; row < numRows; row++) {
            const tileIndex = row * numCols + selectedCol;
            tiles[tileIndex].setData("tileType", newTileTypes[row]);
            tiles[tileIndex].setTexture(newTileTypes[row]);
        }
        // Update the board with new tile types
        for (let row = 0; row < numRows; row++) {
            board[row][selectedCol] = newTileTypes[row];
        }
    }
}
