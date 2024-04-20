import Phaser from "phaser";

export function generateRandomBoard(
    numRows: number,
    numCols: number,
    tileTypes: string[]
) {
    //TODO?: create board class and make smarter generations
    // Also TODO: make it so same board remains when exiting level
    const board = [];
    for (let row = 0; row < numRows; row++) {
        const newRow = [];
        for (let col = 0; col < numCols; col++) {
            const randomIndex = Math.floor(Math.random() * tileTypes.length);
            newRow.push(tileTypes[randomIndex]);
        }
        board.push(newRow);
    }
    return board;
}
