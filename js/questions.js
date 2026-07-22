// Question Bank
const BASE_QUESTIONS = [
    {
        level: 1,
        difficulty: "SIMPLE",
        clue: "The more of them you take, the more you leave behind. What are they? (Write a single plural word)",
        answers: ["steps", "footsteps"],
        hint: "Think of walking in wet sand or soft dust.",
        points: 100
    },
    {
        level: 2,
        difficulty: "MODERATE",
        clue: "I am an odd number. Take away one letter and I become completely even. What number am I? (Spelled out in lowercase)",
        answers: ["seven"],
        hint: "Examine the letters S-E-V-E-N.",
        points: 200
    },
    {
        level: 3,
        difficulty: "LOGICAL",
        clue: "The mechanics of this chamber door depend on the final index of this series:\n1, 4, 9, 16, 25, 36, ...?",
        answers: ["49"],
        hint: "These are successive perfect squares ($1^2$, $2^2$, $3^2$, etc.).",
        points: 350
    },
    {
        level: 4,
        difficulty: "CLASSICAL",
        clue: "Brothers and sisters I have none, but this portrait subject's father is my father's son. Who is in the portrait? (Answer 'my son', 'myself', or 'my daughter')",
        answers: ["my son", "son", "his son"],
        hint: "'My father's son' must be 'me' since I have no siblings.",
        points: 500
    },
    {
        level: 5,
        difficulty: "HISTORIC",
        clue: "The parchment is encoded using an ancient Caesar Cipher, shifting letters forward by 3 paces (A -> D, B -> E, C -> F...). \n\nDecoded text: 'KHOOR'. \nDecrypt it to unlock this chamber.",
        answers: ["hello"],
        hint: "Trace back each letter by 3 places (e.g., K - 3 = H).",
        points: 700
    },
    {
        level: 6,
        difficulty: "DIFFICULT",
        clue: "What occurs once in a minute, twice in a moment, but never in a thousand years?",
        answers: ["m", "the letter m", "letter m"],
        hint: "This riddle is strictly alphabetical. Inspect the visual text.",
        points: 1000
    },
    {
        level: 7,
        difficulty: "CRYPTIC",
        clue: "What sequence follows this logic step? \n2, 9, 30, 93, ...? \nWhat is the next numeral?",
        answers: ["282"],
        hint: "The mathematical rule: $(Current \\times 3) + 3$. For instance, $(2 \\times 3) + 3 = 9$.",
        points: 1400
    },
    {
        level: 8,
        difficulty: "SCHOLARLY",
        clue: "I have keys but open no locks. I have space but no room. You can enter, but you cannot leave. What am I? (One word)",
        answers: ["keyboard", "keyboards", "a keyboard"],
        hint: "You are pressing my keys right now.",
        points: 1900
    },
    {
        level: 9,
        difficulty: "COMPLEX",
        clue: "Convert this binary configuration back to its matching uppercase alphabetical character: \n\n'01011010'",
        answers: ["z"],
        hint: "The base-10 value is 90. What uppercase ASCII letter is position 90?",
        points: 2500
    },
    {
        level: 10,
        difficulty: "LEGENDARY",
        clue: "I am the beginning of everything, the end of everywhere. I am the start of eternity, and the end of time and space. What am I?",
        answers: ["e", "the letter e", "letter e"],
        hint: "Look closely at the letter spelling of 'Everything', 'Everywhere', 'Eternity'.",
        points: 4000
    }
];

const ALT_QUESTIONS = [
    {
        level: 1, difficulty: "SIMPLE",
        clue: "I repeat what you say, but I have no voice. What am I?",
        answers: ["echo", "an echo"],
        hint: "You may hear it in a cave or an empty hall.", points: 100
    },
    {
        level: 2, difficulty: "MODERATE",
        clue: "What gets wetter the more it dries?",
        answers: ["towel", "a towel"],
        hint: "You use it after a bath or shower.", points: 200
    },
    {
        level: 3, difficulty: "LOGICAL",
        clue: "What number comes next? 1, 2, 3, 5, 8, 13, ...",
        answers: ["21", "twenty one", "twenty-one"],
        hint: "Add the previous two numbers.", points: 350
    },
    {
        level: 4, difficulty: "CLASSICAL",
        clue: "Two fathers and two sons went fishing. They caught three fish, and each took one home. How many people were there?",
        answers: ["3", "three", "three people"],
        hint: "Think of a grandfather, a father, and a son.", points: 500
    },
    {
        level: 5, difficulty: "HISTORIC",
        clue: "A word was shifted forward by 3 letters in the alphabet and became FRGH. Shift it back by 3. What is the word?",
        answers: ["code"],
        hint: "F becomes C, R becomes O, G becomes D, and H becomes E.", points: 700
    },
    {
        level: 6, difficulty: "DIFFICULT",
        clue: "What comes once in a year, twice in every, but never in a week?",
        answers: ["e", "the letter e", "letter e"],
        hint: "Look at the letters in the words.", points: 1000
    },
    {
        level: 7, difficulty: "CRYPTIC",
        clue: "What number comes next? 1, 2, 6, 24, 120, ...",
        answers: ["720", "seven hundred twenty"],
        hint: "Multiply by 2, then 3, then 4, then 5.", points: 1400
    },
    {
        level: 8, difficulty: "SCHOLARLY",
        clue: "I have branches, but no fruit, trunk, or leaves. What am I?",
        answers: ["bank", "a bank"],
        hint: "This kind of branch handles money.", points: 1900
    },
    {
        level: 9, difficulty: "COMPLEX",
        clue: "Which uppercase letter is represented by the binary ASCII code 01000001?",
        answers: ["a", "the letter a", "letter a"],
        hint: "The decimal value is 65.", points: 2500
    },
    {
        level: 10, difficulty: "LEGENDARY",
        clue: "What five-letter word becomes shorter when you add two letters to it?",
        answers: ["short"],
        hint: "Add E and R to describe what happens to the word.", points: 4000
    }
];

