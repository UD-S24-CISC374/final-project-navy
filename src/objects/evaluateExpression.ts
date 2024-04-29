function safeEval(expression: string): boolean {
    try {
        return eval(expression) as boolean;
    } catch (error) {
        // Handle the error here, or simply return null if you want to ignore it
        //console.error("Error evaluating expression:", error);
        return false;
    }
}

// Specifically for cases where "true || is the first part of an expression"
function orEval(expression: string): boolean | null {
    try {
        return eval(expression) as boolean;
    } catch (error) {
        // Handle the error here, or simply return null if you want to ignore it
        //console.error("Error evaluating expression:", error);
        return null;
    }
}

export function evaluateExpression(
    expression: string[],
    logicalOperators: { [key: string]: string },
    boardSize: number
): boolean {
    let result = "";
    let calc: boolean | null;
    if (expression[0] === "False" && expression[1] === "Or" && boardSize > 5) {
        if (expression[2] === "True" && expression[3] === "Or") {
            for (let i = 4; i < expression.length; i++) {
                const tileType = expression[i];
                result += logicalOperators[tileType];
            }
            calc = orEval(result) as boolean | null;
            console.log(
                "result is: " +
                    logicalOperators[expression[0]] +
                    logicalOperators[expression[1]] +
                    logicalOperators[expression[2]] +
                    logicalOperators[expression[3]] +
                    result
            );
            if (calc === null) {
                return false;
            } else {
                return true;
            }
        } else if (
            expression[2] === "Not" &&
            expression[3] === "False" &&
            expression[4] === "Or"
        ) {
            for (let i = 5; i < expression.length; i++) {
                const tileType = expression[i];
                result += logicalOperators[tileType];
            }
            calc = orEval(result) as boolean | null;
            console.log(
                "result is: " +
                    logicalOperators[expression[0]] +
                    logicalOperators[expression[1]] +
                    logicalOperators[expression[2]] +
                    logicalOperators[expression[3]] +
                    logicalOperators[expression[4]] +
                    result
            );
            if (calc === null) {
                return false;
            } else {
                return true;
            }
        }
    }
    if (expression[0] === "True" && expression[1] === "Or") {
        if (boardSize === 5) {
            for (let i = 2; i < expression.length; i++) {
                const tileType = expression[i];
                result += logicalOperators[tileType];
            }
            calc = orEval(result) as boolean | null;
            console.log(
                "result is: " +
                    logicalOperators[expression[0]] +
                    logicalOperators[expression[1]] +
                    result
            );
            if (calc === null) {
                return false;
            } else {
                return true;
            }
        } else if (boardSize === 7) {
            if (
                (expression[2] === "True" && expression[3] === "Or") ||
                (expression[2] === "False" && expression[3] === "Or")
            ) {
                for (let i = 4; i < expression.length; i++) {
                    const tileType = expression[i];
                    result += logicalOperators[tileType];
                }
                calc = orEval(result) as boolean | null;
                console.log(
                    "result is: " +
                        logicalOperators[expression[0]] +
                        logicalOperators[expression[1]] +
                        logicalOperators[expression[2]] +
                        logicalOperators[expression[3]] +
                        result
                );
            } else if (
                expression[2] === "Not" &&
                expression[3] === "False" &&
                expression[4] === "Or"
            ) {
                for (let i = 5; i < expression.length; i++) {
                    const tileType = expression[i];
                    result += logicalOperators[tileType];
                }
                calc = orEval(result) as boolean | null;
                console.log(
                    "result is: " +
                        logicalOperators[expression[0]] +
                        logicalOperators[expression[1]] +
                        logicalOperators[expression[2]] +
                        logicalOperators[expression[3]] +
                        logicalOperators[expression[4]] +
                        result
                );
            } else {
                for (let i = 2; i < expression.length; i++) {
                    const tileType = expression[i];
                    result += logicalOperators[tileType];
                }
                calc = orEval(result) as boolean | null;
                console.log(
                    "result is: " +
                        logicalOperators[expression[0]] +
                        logicalOperators[expression[1]] +
                        result
                );
            }
            if (calc === null) {
                return false;
            } else {
                return true;
            }
        }
    } else if (
        expression[0] === "Not" &&
        expression[1] === "False" &&
        expression[2] === "Or"
    ) {
        if (boardSize === 5) {
            for (let i = 3; i < expression.length; i++) {
                const tileType = expression[i];
                result += logicalOperators[tileType];
            }
            calc = orEval(result) as boolean | null;
            console.log(
                "result is: " +
                    logicalOperators[expression[0]] +
                    logicalOperators[expression[1]] +
                    logicalOperators[expression[2]] +
                    result
            );
            if (calc === null) {
                return false;
            } else {
                return true;
            }
        } else if (boardSize === 7) {
            if (
                (expression[3] === "True" && expression[4] === "Or") ||
                (expression[3] === "False" && expression[4] === "Or")
            ) {
                for (let i = 5; i < expression.length; i++) {
                    const tileType = expression[i];
                    result += logicalOperators[tileType];
                }
                calc = orEval(result) as boolean | null;
                console.log(
                    "result is: " +
                        logicalOperators[expression[0]] +
                        logicalOperators[expression[1]] +
                        logicalOperators[expression[2]] +
                        logicalOperators[expression[3]] +
                        logicalOperators[expression[4]] +
                        result
                );
            } else {
                for (let i = 3; i < expression.length; i++) {
                    const tileType = expression[i];
                    result += logicalOperators[tileType];
                }
                calc = orEval(result) as boolean | null;
                console.log(
                    "result is: " +
                        logicalOperators[expression[0]] +
                        logicalOperators[expression[1]] +
                        logicalOperators[expression[2]] +
                        result
                );
                if (calc === null) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    } else {
        for (let i = 0; i < expression.length; i++) {
            const tileType = expression[i];
            result += logicalOperators[tileType];
        }
        console.log("result is: " + result);
        // Evaluate the expression using eval() and return the result
        return safeEval(result) as boolean;
    }

    return false;
}

export function evaluate9x9Expression(
    expression: string[],
    logicalOperators: { [key: string]: string }
): boolean {
    let result = "";
    let calc: boolean | null;
    if (
        (expression[0] === "True" && expression[1] === "Or") ||
        (expression[0] === "False" && expression[1] === "Or")
    ) {
        if (
            (expression[2] === "True" && expression[3] === "Or") ||
            (expression[2] === "False" && expression[3] === "Or")
        ) {
            if (
                (expression[4] === "True" && expression[5] === "Or") ||
                (expression[4] === "False" && expression[5] === "Or")
            ) {
                for (let i = 6; i < expression.length; i++) {
                    const tileType = expression[i];
                    result += logicalOperators[tileType];
                }
                calc = orEval(result) as boolean | null;
                console.log(
                    "result is: " +
                        logicalOperators[expression[0]] +
                        logicalOperators[expression[1]] +
                        logicalOperators[expression[2]] +
                        logicalOperators[expression[3]] +
                        logicalOperators[expression[4]] +
                        logicalOperators[expression[5]] +
                        result
                );
            } else if (
                expression[4] === "Not" &&
                expression[5] === "False" &&
                expression[6] === "Or"
            ) {
                for (let i = 7; i < expression.length; i++) {
                    const tileType = expression[i];
                    result += logicalOperators[tileType];
                }
                calc = orEval(result) as boolean | null;
                console.log(
                    "result is: " +
                        logicalOperators[expression[0]] +
                        logicalOperators[expression[1]] +
                        logicalOperators[expression[2]] +
                        logicalOperators[expression[3]] +
                        logicalOperators[expression[4]] +
                        logicalOperators[expression[5]] +
                        logicalOperators[expression[6]] +
                        result
                );
            } else {
                for (let i = 4; i < expression.length; i++) {
                    const tileType = expression[i];
                    result += logicalOperators[tileType];
                }
                calc = orEval(result) as boolean | null;
                console.log(
                    "result is: " +
                        logicalOperators[expression[0]] +
                        logicalOperators[expression[1]] +
                        logicalOperators[expression[2]] +
                        logicalOperators[expression[3]] +
                        result
                );
            }
            if (calc === null) {
                return false;
            } else {
                return true;
            }
        } else if (
            expression[2] === "Not" &&
            expression[3] === "False" &&
            expression[4] === "Or"
        ) {
            if (
                (expression[5] === "True" && expression[6] === "Or") ||
                (expression[5] === "False" && expression[6] === "Or")
            ) {
                for (let i = 7; i < expression.length; i++) {
                    const tileType = expression[i];
                    result += logicalOperators[tileType];
                }
                calc = orEval(result) as boolean | null;
                console.log(
                    "result is: " +
                        logicalOperators[expression[0]] +
                        logicalOperators[expression[1]] +
                        logicalOperators[expression[2]] +
                        logicalOperators[expression[3]] +
                        logicalOperators[expression[4]] +
                        logicalOperators[expression[5]] +
                        logicalOperators[expression[6]] +
                        result
                );
            } else {
                for (let i = 5; i < expression.length; i++) {
                    const tileType = expression[i];
                    result += logicalOperators[tileType];
                }
                calc = orEval(result) as boolean | null;
                console.log(
                    "result is: " +
                        logicalOperators[expression[0]] +
                        logicalOperators[expression[1]] +
                        logicalOperators[expression[2]] +
                        logicalOperators[expression[3]] +
                        logicalOperators[expression[4]] +
                        result
                );
            }
        } else {
            for (let i = 2; i < expression.length; i++) {
                const tileType = expression[i];
                result += logicalOperators[tileType];
            }
            calc = orEval(result) as boolean | null;
            console.log(
                "result is: " +
                    logicalOperators[expression[0]] +
                    logicalOperators[expression[1]] +
                    result
            );
        }
        if (calc === null) {
            return false;
        } else {
            return true;
        }
    } else if (
        expression[0] === "Not" &&
        expression[1] === "False" &&
        expression[2] === "Or"
    ) {
        if (
            (expression[3] === "True" && expression[4] === "Or") ||
            (expression[3] === "False" && expression[4] === "Or")
        ) {
            if (
                (expression[5] === "True" && expression[6] === "Or") ||
                (expression[5] === "False" && expression[6] === "Or")
            ) {
                for (let i = 7; i < expression.length; i++) {
                    const tileType = expression[i];
                    result += logicalOperators[tileType];
                }
                calc = orEval(result) as boolean | null;
                console.log(
                    "result is: " +
                        logicalOperators[expression[0]] +
                        logicalOperators[expression[1]] +
                        logicalOperators[expression[2]] +
                        logicalOperators[expression[3]] +
                        logicalOperators[expression[4]] +
                        logicalOperators[expression[5]] +
                        logicalOperators[expression[6]] +
                        result
                );
            } else {
                for (let i = 5; i < expression.length; i++) {
                    const tileType = expression[i];
                    result += logicalOperators[tileType];
                }
                calc = orEval(result) as boolean | null;
                console.log(
                    "result is: " +
                        logicalOperators[expression[0]] +
                        logicalOperators[expression[1]] +
                        logicalOperators[expression[2]] +
                        logicalOperators[expression[3]] +
                        logicalOperators[expression[4]] +
                        result
                );
            }
            if (calc === null) {
                return false;
            } else {
                return true;
            }
        } else if (
            expression[3] === "Not" &&
            expression[4] === "False" &&
            expression[5] === "Or"
        ) {
            for (let i = 6; i < expression.length; i++) {
                const tileType = expression[i];
                result += logicalOperators[tileType];
            }
            calc = orEval(result) as boolean | null;
            console.log(
                "result is: " +
                    logicalOperators[expression[0]] +
                    logicalOperators[expression[1]] +
                    logicalOperators[expression[2]] +
                    logicalOperators[expression[3]] +
                    logicalOperators[expression[4]] +
                    logicalOperators[expression[5]] +
                    result
            );
        } else {
            for (let i = 3; i < expression.length; i++) {
                const tileType = expression[i];
                result += logicalOperators[tileType];
            }
            calc = orEval(result) as boolean | null;
            console.log(
                "result is: " +
                    logicalOperators[expression[0]] +
                    logicalOperators[expression[1]] +
                    logicalOperators[expression[2]] +
                    result
            );
        }
        if (calc === null) {
            return false;
        } else {
            return true;
        }
    } else if (
        expression[0] === "LParen" &&
        expression[1] === "Not" &&
        expression[2] === "False" &&
        expression[3] === "RParen" &&
        expression[4] === "Or"
    ) {
        if (
            (expression[5] === "True" && expression[6] === "Or") ||
            (expression[5] === "False" && expression[6] === "Or")
        ) {
            for (let i = 7; i < expression.length; i++) {
                const tileType = expression[i];
                result += logicalOperators[tileType];
            }
            calc = orEval(result) as boolean | null;
            console.log(
                "result is: " +
                    logicalOperators[expression[0]] +
                    logicalOperators[expression[1]] +
                    logicalOperators[expression[2]] +
                    logicalOperators[expression[3]] +
                    logicalOperators[expression[4]] +
                    logicalOperators[expression[5]] +
                    logicalOperators[expression[6]] +
                    result
            );
        } else {
            for (let i = 5; i < expression.length; i++) {
                const tileType = expression[i];
                result += logicalOperators[tileType];
            }
            calc = orEval(result) as boolean | null;
            console.log(
                "result is: " +
                    logicalOperators[expression[0]] +
                    logicalOperators[expression[1]] +
                    logicalOperators[expression[2]] +
                    logicalOperators[expression[3]] +
                    logicalOperators[expression[4]] +
                    result
            );
        }
        if (calc === null) {
            return false;
        } else {
            return true;
        }
    } else if (
        expression[0] === "LParen" &&
        expression[1] === "Not" &&
        expression[2] === "False" &&
        expression[3] === "RParen" &&
        expression[4] === "And"
    ) {
        if (expression[5] === "True" && expression[6] === "Or") {
            for (let i = 7; i < expression.length; i++) {
                const tileType = expression[i];
                result += logicalOperators[tileType];
            }
            calc = orEval(result) as boolean | null;
            console.log(
                "result is: " +
                    logicalOperators[expression[0]] +
                    logicalOperators[expression[1]] +
                    logicalOperators[expression[2]] +
                    logicalOperators[expression[3]] +
                    logicalOperators[expression[4]] +
                    logicalOperators[expression[5]] +
                    logicalOperators[expression[6]] +
                    result
            );
        } else {
            for (let i = 5; i < expression.length; i++) {
                const tileType = expression[i];
                result += logicalOperators[tileType];
            }
            calc = orEval(result) as boolean | null;
            console.log(
                "result is: " +
                    logicalOperators[expression[0]] +
                    logicalOperators[expression[1]] +
                    logicalOperators[expression[2]] +
                    logicalOperators[expression[3]] +
                    logicalOperators[expression[4]] +
                    result
            );
        }
        if (calc === null) {
            return false;
        } else {
            return true;
        }
    } else {
        for (let i = 0; i < expression.length; i++) {
            const tileType = expression[i];
            result += logicalOperators[tileType];
        }
        console.log("result is: " + result);
        // Evaluate the expression using eval() and return the result
        return safeEval(result) as boolean;
    }
}
