import Phaser from "phaser";
import { generateRandomBoard } from "../objects/generateBoard";
import { Scene } from "phaser";

// Define an interface for the scene to ensure it has the properties we expect
interface GameScene extends Scene {
    board: string[][];
    tileTypes: string[];
    tilesGroup: Phaser.GameObjects.Group;
    score: number;
    recentMatch: string;
    turnCount: number;
    saveGameState: () => void;
    scoreText: Phaser.GameObjects.Text | null;
    recentMatchText: Phaser.GameObjects.Text;
    turnText: Phaser.GameObjects.Text;
}

// Function to reset the game state for any board size
export function resetGameState(
    scene: GameScene,
    numRows: number,
    numCols: number
): void {
    // Generate a new board of specified size
    scene.board = generateRandomBoard(numRows, numCols, scene.tileTypes);
    scene.score = 0;
    scene.recentMatch = "";
    scene.turnCount = 10; // Reset turn count

    // Update UI elements
    scene.scoreText?.setText(`Matches: ${scene.score}`);
    scene.recentMatchText.setText(`Most Recent Match: ${scene.recentMatch}`);
    scene.turnText.setText(`Turns: ${scene.turnCount}`);

    // Update tile sprites to reflect new board state
    scene.tilesGroup.getChildren().forEach((tile, index) => {
        const row = Math.floor(index / numCols);
        const col = index % numCols;
        const tileType = scene.board[row][col];
        tile.setData("tileType", tileType);
        if (tile instanceof Phaser.GameObjects.Sprite) {
            tile.setTexture(tileType);
        }
    });

    // Save the reset game state
    scene.saveGameState();
}
