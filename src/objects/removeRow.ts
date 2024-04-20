import Phaser from "phaser";

export function removeRow(
    row: number,
    numCols: number,
    board: string[][],
    tiles: Phaser.GameObjects.Sprite[],
    tileTypes: string[]
) {
    // Shift the rows down in the data and update their corresponding sprites.
    for (let i = row; i > 0; i--) {
        board[i] = board[i - 1].slice(); // Getting row above
        for (let col = 0; col < numCols; col++) {
            const currentSpriteIndex = i * numCols + col;
            const aboveSpriteIndex = (i - 1) * numCols + col;
            tiles[currentSpriteIndex].setData(
                "tileType",
                tiles[aboveSpriteIndex].getData("tileType")
            );
            tiles[currentSpriteIndex].setTexture(
                tiles[aboveSpriteIndex].getData("tileType")
            );
        }
    }

    // Generate a new random top row for the board data
    board[0] = [];
    for (let col = 0; col < numCols; col++) {
        const randomIndex = Math.floor(Math.random() * tileTypes.length);
        board[0][col] = tileTypes[randomIndex];

        // Update the data and texture for the new top row
        const tileSprite = tiles[col];
        tileSprite.setData("tileType", tileTypes[randomIndex]);
        tileSprite.setTexture(tileTypes[randomIndex]);
    }
}
