import Phaser from "phaser";

interface ArrowStorage {
    [key: string]: Phaser.GameObjects.Image[];
}

export function createArrowAnimation(
    scene: Phaser.Scene,
    arrows: ArrowStorage,
    x: number,
    y: number,
    offset: number,
    direction: string
) {
    let dx = 0;
    let dy = 0;

    // Check if there are already two arrows in the given direction
    if (arrows[direction].length >= 2) {
        return;
    }

    let arrow1: Phaser.GameObjects.Image | null = null;
    let arrow2: Phaser.GameObjects.Image | null = null;

    switch (direction) {
        case "up":
            arrow1 = scene.add.image(x, y, "UArrow");
            arrow2 = scene.add.image(x, y + offset, "UArrow");
            dy = -20;
            break;
        case "down":
            arrow1 = scene.add.image(x, y, "DArrow");
            arrow2 = scene.add.image(x, y - offset, "DArrow");
            dy = 20;
            break;
        case "left":
            arrow1 = scene.add.image(x, y, "LArrow");
            arrow2 = scene.add.image(x + offset, y, "LArrow");
            dx = -20;
            break;
        case "right":
            arrow1 = scene.add.image(x, y, "RArrow");
            arrow2 = scene.add.image(x - offset, y, "RArrow");
            dx = 20;
            break;
    }

    if (arrow1 && arrow2) {
        // Store the arrow references in the dictionary
        arrows[direction].push(arrow1, arrow2);

        // Add the tween animation for both arrows
        const tweenConfig = {
            targets: [arrow1, arrow2],
            x: (arrow: Phaser.GameObjects.Image) => arrow.x + dx,
            y: (arrow: Phaser.GameObjects.Image) => arrow.y + dy,
            yoyo: true,
            repeat: 1,
            duration: 200,
            onComplete: () => {
                arrow1?.destroy();
                arrow2?.destroy();
                arrows[direction] = arrows[direction].filter(
                    (a) => a !== arrow1 && a !== arrow2
                );
            },
        };

        scene.tweens.add(tweenConfig);
    }
}
