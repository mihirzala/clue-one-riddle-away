// Question Bank
const BASE_QUESTIONS = [
    {
        level: 1,
        difficulty: "SIMPLE",
        clue: "The more of them you take, the more you leave behind. What are they? (Write a single plural word)",
        answerHashes: ["b7595e2a863957fc6c225ed540d335dd1e859dd3032451c2e11bceb0329defa6","1a11a5a27be607e96d0205aa1304d7f39c97416ab35892049129d3f6eafa90fb"],
        firstLetter: "S",
        hint: "Think of walking in wet sand or soft dust.",
        points: 100
    },
    {
        level: 2,
        difficulty: "MODERATE",
        clue: "I am an odd number. Take away one letter and I become completely even. What number am I? (Spelled out in lowercase)",
        answerHashes: ["3ba8d02b16fd2a01c1a8ba1a1f036d7ce386ed953696fa57331c2ac48a80b255"],
        firstLetter: "S",
        hint: "Examine the letters S-E-V-E-N.",
        points: 200
    },
    {
        level: 3,
        difficulty: "LOGICAL",
        clue: "The mechanics of this chamber door depend on the final index of this series:\n1, 4, 9, 16, 25, 36, ...?",
        answerHashes: ["0e17daca5f3e175f448bacace3bc0da47d0655a74c8dd0dc497a3afbdad95f1f"],
        firstLetter: "4",
        hint: "These are successive perfect squares ($1^2$, $2^2$, $3^2$, etc.).",
        points: 350
    },
    {
        level: 4,
        difficulty: "CLASSICAL",
        clue: "Brothers and sisters I have none, but this portrait subject's father is my father's son. Who is in the portrait? (Answer 'my son', 'myself', or 'my daughter')",
        answerHashes: ["38c3baac1ce5961866f65ec3a021aff8a48f1ea6643f5685a8e54b9f280b386d","98aa6675482552881925fe70d82559692d811b3bcd33f53b9a702c24d5322696","6d7504df87c5730ef4094bb8d087ab4e19e198e54b3b39de1ef2dbb8e46c02c3"],
        firstLetter: "M",
        hint: "'My father's son' must be 'me' since I have no siblings.",
        points: 500
    },
    {
        level: 5,
        difficulty: "HISTORIC",
        clue: "The parchment is encoded using an ancient Caesar Cipher, shifting letters forward by 3 paces (A -> D, B -> E, C -> F...). \n\nDecoded text: 'KHOOR'. \nDecrypt it to unlock this chamber.",
        answerHashes: ["2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"],
        firstLetter: "H",
        hint: "Trace back each letter by 3 places (e.g., K - 3 = H).",
        points: 700
    },
    {
        level: 6,
        difficulty: "DIFFICULT",
        clue: "What occurs once in a minute, twice in a moment, but never in a thousand years?",
        answerHashes: ["62c66a7a5dd70c3146618063c344e531e6d4b59e379808443ce962b3abd63c5a","d2010e8304e25d4de563c472f3a91d6219db7d738ff2a0a0e464902cf53327ed","d75ffd3083e80df716da1d54b000ae742e7973884ee3b293b605aa9905029099"],
        firstLetter: "M",
        hint: "This riddle is strictly alphabetical. Inspect the visual text.",
        points: 1000
    },
    {
        level: 7,
        difficulty: "CRYPTIC",
        clue: "What sequence follows this logic step? \n2, 9, 30, 93, ...? \nWhat is the next numeral?",
        answerHashes: ["27e1615212f3c6ea846ed6c412df1361ce97f006ee20bb5aa2483a3b61d5cadd"],
        firstLetter: "2",
        hint: "The mathematical rule: $(Current \\times 3) + 3$. For instance, $(2 \\times 3) + 3 = 9$.",
        points: 1400
    },
    {
        level: 8,
        difficulty: "SCHOLARLY",
        clue: "I have keys but open no locks. I have space but no room. You can enter, but you cannot leave. What am I? (One word)",
        answerHashes: ["91f060a9ad4b39eb228d9537292fab19d252faed06c169d0fdcb4a90560f5676","3693efb5a03a46fd3d14cccd4b47f0ffd0ec2251155f4a55f34227a8d42c962a","5107ba0d22f4869fd971771cdd8be6679893a29cc5351dbbe4f845ffdd04b4e4"],
        firstLetter: "K",
        hint: "You are pressing my keys right now.",
        points: 1900
    },
    {
        level: 9,
        difficulty: "COMPLEX",
        clue: "Convert this binary configuration back to its matching uppercase alphabetical character: \n\n'01011010'",
        answerHashes: ["594e519ae499312b29433b7dd8a97ff068defcba9755b6d5d00e84c524d67b06"],
        firstLetter: "Z",
        hint: "The base-10 value is 90. What uppercase ASCII letter is position 90?",
        points: 2500
    },
    {
        level: 10,
        difficulty: "LEGENDARY",
        clue: "I am the beginning of everything, the end of everywhere. I am the start of eternity, and the end of time and space. What am I?",
        answerHashes: ["3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea","d536aec09b07cfef921939e57ac668edd3751a00f1185162f4b4cf94fce4f133","b4bc40ef55dd0a6031a40f2c51e594144f7c557029abcb2fb5c5495e5cc8e1f1"],
        firstLetter: "E",
        hint: "Look closely at the letter spelling of 'Everything', 'Everywhere', 'Eternity'.",
        points: 4000
    }
];

const ALT_QUESTIONS = [
    {
        level: 1, difficulty: "SIMPLE",
        clue: "I repeat what you say, but I have no voice. What am I?",
        answerHashes: ["092c79e8f80e559e404bcf660c48f3522b67aba9ff1484b0367e1a4ddef7431d","73bbe8fe8b2b7b72adc45c0b767e401f5c3072b21bd1da2316e6df93bd207cf7"],
        firstLetter: "E",
        hint: "You may hear it in a cave or an empty hall.", points: 100
    },
    {
        level: 2, difficulty: "MODERATE",
        clue: "What gets wetter the more it dries?",
        answerHashes: ["10ca50a8a7148afd6d2a563e8ef8e05cfedd17fc97a6a5327cf9e5300b933e4b","b99f2a4d3849ceacf7835615378904b9cdcad6510f2c1349c296e6f6bc2ead72"],
        firstLetter: "T",
        hint: "You use it after a bath or shower.", points: 200
    },
    {
        level: 3, difficulty: "LOGICAL",
        clue: "What number comes next? 1, 2, 3, 5, 8, 13, ...",
        answerHashes: ["6f4b6612125fb3a0daecd2799dfd6c9c299424fd920f9b308110a2c1fbd8f443","ab5f56b635ce83e4331b7fceae2b9266cb06bf1428abca09ad74dbdee39dd7ec","a69edb489f4eb7f23d85766e3f60af8326fa7f4d0fbf1f14ad276336a18e1dfe"],
        firstLetter: "2",
        hint: "Add the previous two numbers.", points: 350
    },
    {
        level: 4, difficulty: "CLASSICAL",
        clue: "Two fathers and two sons went fishing. They caught three fish, and each took one home. How many people were there?",
        answerHashes: ["4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce","8b5b9db0c13db24256c829aa364aa90c6d2eba318b9232a4ab9313b954d3555f","0b0710080abf95ba4e055debcc0eda0762eedb67c0be9d02257bee940680f3e8"],
        firstLetter: "3",
        hint: "Think of a grandfather, a father, and a son.", points: 500
    },
    {
        level: 5, difficulty: "HISTORIC",
        clue: "A word was shifted forward by 3 letters in the alphabet and became FRGH. Shift it back by 3. What is the word?",
        answerHashes: ["5694d08a2e53ffcae0c3103e5ad6f6076abd960eb1f8a56577040bc1028f702b"],
        firstLetter: "C",
        hint: "F becomes C, R becomes O, G becomes D, and H becomes E.", points: 700
    },
    {
        level: 6, difficulty: "DIFFICULT",
        clue: "What comes once in a year, twice in every, but never in a week?",
        answerHashes: ["3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea","d536aec09b07cfef921939e57ac668edd3751a00f1185162f4b4cf94fce4f133","b4bc40ef55dd0a6031a40f2c51e594144f7c557029abcb2fb5c5495e5cc8e1f1"],
        firstLetter: "E",
        hint: "Look at the letters in the words.", points: 1000
    },
    {
        level: 7, difficulty: "CRYPTIC",
        clue: "What number comes next? 1, 2, 6, 24, 120, ...",
        answerHashes: ["d829857eb1366e70be857a69886d1555af0d32681beab068afb93492c2e2b843","00861645dd60d3592d41794c7ea9eb7a9931a28bbe202e9b621684fff1179661"],
        firstLetter: "7",
        hint: "Multiply by 2, then 3, then 4, then 5.", points: 1400
    },
    {
        level: 8, difficulty: "SCHOLARLY",
        clue: "I have branches, but no fruit, trunk, or leaves. What am I?",
        answerHashes: ["4381dc2ab14285160c808659aee005d51255add7264b318d07c7417292c7442c","3b60d1de12f3775d1a7b220a0c4fb5d7fb3448382d90d687f2a179100c3c9251"],
        firstLetter: "B",
        hint: "This kind of branch handles money.", points: 1900
    },
    {
        level: 9, difficulty: "COMPLEX",
        clue: "Which uppercase letter is represented by the binary ASCII code 01000001?",
        answerHashes: ["ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb","262490e446ad1f6bafb199565bd3eb181704be9d9f70f154bca80cc505b04998","d570ab2768626b3abc2eb95a8bf65bd726566a3119853dae404217671ce65e9c"],
        firstLetter: "A",
        hint: "The decimal value is 65.", points: 2500
    },
    {
        level: 10, difficulty: "LEGENDARY",
        clue: "What five-letter word becomes shorter when you add two letters to it?",
        answerHashes: ["f9b0078b5df596d2ea19010c001bbd009e651de2c57e8fb7e355f31eb9d3f739"],
        firstLetter: "S",
        hint: "Add E and R to describe what happens to the word.", points: 4000
    }
];

