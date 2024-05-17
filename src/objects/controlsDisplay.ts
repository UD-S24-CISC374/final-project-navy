import Phaser from "phaser";

export function createControlDisplay(scene: Phaser.Scene) {
    // Create background for the Control display
    const controlDisplay = scene.add.image(800, 75, "HelpBox");
    controlDisplay.setOrigin(0, 0);
    controlDisplay.setDepth(1); // Set depth to overlay other elements

    const controlContainer = scene.add.container(825, 100);

    // Add control text
    const controlText = scene.add.text(
        15,
        40,
        "\nUse the WASD keys to move between rows and columns\n-----------------------------\nW - Goes up a row\nS - Goes down a row\nA - Goes to the left column\nD - Goes to the right column\n\n\nUse the arrow keys to move blocks by shifting the rows and columns\n-----------------------------\n↑ - Shift blocks in column up\n↓ - Shift blocks in column down\n← - Shift blocks in row left\n→ - Shift blocks in row right",
        {
            fontSize: "15px",
            color: "white",
        }
    );
    controlText.setWordWrapWidth(280).setLineSpacing(5);
    //this.controlContainer.setInteractive(); // Enable input for scrolling

    // Add background to the container for visualization
    const containerBackground = scene.add.graphics();
    // For when more information needs to be added
    // controlContainer.add(
    //     new Button(
    //         scene,
    //         200,
    //         0,
    //         "Back",
    //         {
    //             fontSize: "15px",
    //             color: "red",
    //         },
    //         () => {}
    //     )
    // );
    // controlContainer.add(
    //     new Button(
    //         scene,
    //         250,
    //         0,
    //         "Next",
    //         {
    //             fontSize: "15px",
    //             color: "red",
    //         },
    //         () => {}
    //     )
    // );
    containerBackground.fillRect(15, 30, 265, 450); // Adjust size as needed
    controlContainer.add(containerBackground); // Add background to the container
    controlContainer.setDepth(2); // Set depth to overlay other elements

    controlContainer.add(controlText);
    controlContainer.add(
        scene.add.text(105, -20, "Controls", {
            fontSize: "20px",
            color: "white",
        })
    );
    controlContainer.add(
        scene.add.text(15, 15, "Move Around The Board", {
            fontSize: "20px",
            color: "white",
        })
    );

    // Hide control display initially
    controlDisplay.visible = false;
    controlContainer.visible = false;

    return { controlDisplay, controlContainer };
}

export function toggleControlDisplay(
    scene: Phaser.Scene,
    controlDisplay: Phaser.GameObjects.Image,
    controlContainer: Phaser.GameObjects.Container
) {
    // Check if control display is currently visible
    const isControlVisible = controlDisplay.visible;

    // Define the final x-coordinate for the display
    const finalX = isControlVisible ? 800 : 500;

    if (!isControlVisible) {
        // If control display is not visible, slide in
        controlDisplay.visible = true; // Make control display visible
        controlContainer.visible = true; // Make control container visible

        scene.tweens.add({
            targets: [controlDisplay, controlContainer],
            x: finalX, // Slide to the final x-coordinate
            ease: "Power1",
            duration: 400, // Animation duration in milliseconds
        });
    } else {
        // If control display is visible, slide out
        scene.tweens.add({
            targets: [controlDisplay, controlContainer],
            x: finalX, // Slide to the final x-coordinate
            ease: "Power1",
            duration: 400, // Animation duration in milliseconds
            onComplete: () => {
                controlDisplay.visible = false; // Hide control display after sliding out
                controlContainer.visible = false; // Hide control container after sliding out
            },
        });
    }
}
