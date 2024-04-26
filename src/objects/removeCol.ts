import Phaser from "phaser";

export function removeCol(
    col: number,
    numRows: number,
    numCols: number,
    board: string[][],
    tiles: Phaser.GameObjects.Sprite[],
    tileTypes: string[]
) {
    // Directly replace the tiles in the matched column
    for (let row = 0; row < numRows; row++) {
        // Generate a new tile type for each position in the matched column
        const randomIndex = Math.floor(Math.random() * tileTypes.length);
        const newTileType = tileTypes[randomIndex];
        board[row][col] = newTileType;

        // Update the sprite for the new tile at the current column
        const tileSprite = tiles[row * numCols + col];
        tileSprite.setData("tileType", newTileType);
        tileSprite.setTexture(newTileType);
    }
}
