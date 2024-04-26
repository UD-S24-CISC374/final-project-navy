import Phaser from "phaser";

// MoveSelection utility function
export function moveSelection(
    selectedTileIndex: number,
    deltaX: number,
    deltaY: number,
    numCols: number,
    numRows: number,
    tilesGroup: Phaser.GameObjects.Group
) {
    const totalTiles = numRows * numCols;
    let newIndex = selectedTileIndex + deltaX + deltaY * numCols;

    // Wrap horizontally
    if (deltaX !== 0) {
        newIndex =
            ((selectedTileIndex + deltaX + numCols) % numCols) +
            Math.floor(selectedTileIndex / numCols) * numCols;
    }

    // Wrap vertically
    if (deltaY !== 0) {
        newIndex =
            (selectedTileIndex + totalTiles + deltaY * numCols) % totalTiles;
    }

    // Ensure newIndex doesn't go out of range using Phaser's Clamp function
    newIndex = Phaser.Math.Clamp(newIndex, 0, totalTiles - 1);

    const selectedTile = tilesGroup.getChildren()[
        newIndex
    ] as Phaser.GameObjects.Sprite;

    return {
        newIndex: newIndex,
        selectedTile: selectedTile,
    };
}
