/** @enum {number} */
const CATEGORIES = Object.freeze({
    science_and_nature: 17
})

/** @enum {string} */
const DIFFICULTY = Object.freeze({
    easy: "easy",
    medium: "medium",
    hard: "hard"
})

/** @enum {string} */
const QUESTION_TYPE = Object.freeze({
    multiple: "multiple",
    boolean: "boolean"
})

module.exports = {
    CATEGORIES, DIFFICULTY, QUESTION_TYPE
}