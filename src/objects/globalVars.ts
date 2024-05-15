let storyTriggered = false;
let level1Reset = false;
let level1Win = false;
let level1Lose = false;

let level2Reset = false;
let level2Win = false;
let level2Lose = false;

let level3Reset = false;
let level3Win = false;
let level3Lose = false;

// Define the function to display match history
function displayMatchHistory(matchList: string[]) {
    console.log("Match History:");
    matchList.forEach((match, index) => {
        console.log(`${index + 1}: ${match}`);
    });
}

module.exports = {
    storyTriggered: storyTriggered,
    level1Reset: level1Reset,
    level1Win: level1Win,
    level1Lose: level1Lose,
    level2Reset: level2Reset,
    level2Win: level2Win,
    level2Lose: level2Lose,
    level3Reset: level3Reset,
    level3Win: level3Win,
    level3Lose: level3Lose,
    displayMatchHistory: displayMatchHistory, // Export the function
};
