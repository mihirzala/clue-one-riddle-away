// English riddle pool.
//
// Organized by tier (1-10, matching the daily difficulty curve). Each tier
// holds several interchangeable riddles so that different players can get
// different — but equally difficult — riddles in the same slot. See
// js/riddle-selector.js for how a specific riddle is picked per player/day.
//
// Fields:
//   id            stable unique identifier, used for recent-history tracking
//   tier          1-10, matches ENGLISH_RIDDLE_POOL's own key
//   difficulty    display label for the difficulty tag
//   clue          the riddle text (may contain a {{TRAIL}} placeholder — see
//                 hints.js/game.js for how that gets filled in)
//   answerHashes  SHA-256 hashes of every accepted normalized answer
//   answer        the canonical accepted answer, in plaintext, used by the
//                 hint/reveal engine (js/hints.js) — never sent anywhere,
//                 only read client-side for the progressive reveal
//   hint1/hint2   the two non-reveal hint stages
//   explanation   shown after a correct/failed finish so the solution feels
//                 earned rather than arbitrary
//   theme         a short word representing this riddle's answer, collected
//                 into the day's "Clue Trail" as each riddle is solved
//   points        awarded on a correct answer
const ENGLISH_RIDDLE_POOL = {
    1: [
        {
            id: "en-t1-01", tier: 1, difficulty: "EASY",
            clue: "Turn me on my side and I become endless. What single digit am I?",
            answerHashes: ["2c624232cdd221771294dfbb310aca000a0df6ac8b66b696d90ef06fdefb64a3"],
            answer: "8",
            hint1: "Think about the infinity symbol.",
            hint2: "It's a digit you can write without lifting your pen.",
            explanation: "Rotate the digit 8 ninety degrees and it becomes the infinity symbol (∞).",
            theme: "infinity", points: 100
        },
        {
            id: "en-t1-02", tier: 1, difficulty: "EASY",
            clue: "What five-letter word becomes shorter when you add two letters to it?",
            answerHashes: ["f9b0078b5df596d2ea19010c001bbd009e651de2c57e8fb7e355f31eb9d3f739"],
            answer: "short",
            hint1: "Think about what the word describes, not just its length.",
            hint2: "Add 'E' and 'R' to the end.",
            explanation: "SHORT plus \"ER\" spells SHORTER — a longer word that means more short.",
            theme: "irony", points: 100
        },
        {
            id: "en-t1-03", tier: 1, difficulty: "EASY",
            clue: "I have a face and two hands, but no arms or legs. What am I?",
            answerHashes: ["f583a793a95fd25c63584df768a1b9e275f0d978293ffd93587c446b867ca31b", "d8198efa3604d164853468608c55efa148bc56e3564d5a30232bf98b8ab43aeb"],
            answer: "a clock",
            hint1: "You check me to stay on time.",
            hint2: "My hands point at numbers, not at things.",
            explanation: "A clock has a \"face\" and \"hands,\" just named after body parts.",
            theme: "time", points: 100
        },
        {
            id: "en-t1-04", tier: 1, difficulty: "EASY",
            clue: "What has one eye but cannot see?",
            answerHashes: ["d37e6b10ad528f320bd9887f16d913907760c864d32dc5dfa44ffa38803877c3", "09881f6ed93360a2f6ad81f435a8ca51ca4575d0f954f197ff8f7d16c6565562"],
            answer: "a needle",
            hint1: "You'll find me in a sewing kit.",
            hint2: "Thread passes through my \"eye.\"",
            explanation: "A needle's threading hole is called its \"eye,\" though it can't see anything.",
            theme: "sight", points: 100
        }
    ],
    2: [
        {
            id: "en-t2-01", tier: 2, difficulty: "EASY+",
            clue: "What has a neck but no head, and wears a cap?",
            answerHashes: ["d054e115f775781691e845b51d64d214060a5af029d9f4e299bdedce31f1ce20", "7def9c79e5be6d7a70022168b8b099ce1e707a2fd809a60fab73de6de578884b"],
            answer: "a bottle",
            hint1: "You'll often find me in a fridge.",
            hint2: "You twist my cap to open me.",
            explanation: "A bottle has a narrow \"neck\" and a \"cap,\" borrowing the words but not the body parts.",
            theme: "objects", points: 200
        },
        {
            id: "en-t2-02", tier: 2, difficulty: "EASY+",
            clue: "What can travel all the way around the world while staying stuck in one corner?",
            answerHashes: ["181634c1edc55ce8f84f42d51a0d54f5ad5eab4d85b30dbc6af1f8184772c34e", "e0afcdbf6ad4adf566c572d7f7c34d4dfb85e5122bba750d6a3a5842f915d39b"],
            answer: "a stamp",
            hint1: "It rides on the outside of an envelope.",
            hint2: "It's licked, stuck to a corner, and then the letter travels for it.",
            explanation: "A postage stamp gets carried around the world while staying fixed to the same corner of an envelope.",
            theme: "travel", points: 200
        },
        {
            id: "en-t2-03", tier: 2, difficulty: "EASY+",
            clue: "The more you take away from me, the bigger I get. What am I?",
            answerHashes: ["4216a2ed2deead505f7b910b571d87cfbdc286f036fffcdbbb80dd45e0c4c531", "d2d165dff04ba22532c70d8a1ec9fd87e2160e875875de9e830a64e899760d5d", "39ee4551970726c324df4ea3bf0760fe4ff35252340bfba7b1d4564454f9ccce"],
            answer: "a hole",
            hint1: "Think about digging, not spending.",
            hint2: "The more dirt you remove, the deeper and wider it gets.",
            explanation: "Digging out material from a hole only ever makes the hole larger.",
            theme: "excavation", points: 200
        },
        {
            id: "en-t2-04", tier: 2, difficulty: "EASY+",
            clue: "I'm not alive, but I grow. I don't have lungs, but I need air. I don't have a mouth, but water kills me. What am I?",
            answerHashes: ["dc9f28b12dd1818ee42ffc92ecb940386214598837348d30d3c6c0b7b57e34c9"],
            answer: "fire",
            hint1: "You might light me with a match.",
            hint2: "A bucket of water is my worst enemy.",
            explanation: "Fire spreads (\"grows\"), needs oxygen, and is extinguished by water.",
            theme: "flame", points: 200
        }
    ],
    3: [
        {
            id: "en-t3-01", tier: 3, difficulty: "MEDIUM",
            clue: "A farmer has 17 sheep. All but 9 of them die. How many sheep does the farmer have left?",
            answerHashes: ["19581e27de7ced00ff1ce50b2047e7a567c76b1cbaebabe5ef03f7c3017bb5b7"],
            answer: "9",
            hint1: "Read the sentence very literally.",
            hint2: "\"All but 9 die\" tells you exactly how many survive.",
            explanation: "\"All but 9 die\" means 9 sheep are the exception — they're the ones that lived.",
            theme: "wording", points: 350
        },
        {
            id: "en-t3-02", tier: 3, difficulty: "MEDIUM",
            clue: "Take a number, subtract 6, then multiply the result by 4. You get 20. What was the number?",
            answerHashes: ["4fc82b26aecb47d2868c4efbe3581732a3e7cbcc6c2efb32062c08170a05eeb8"],
            answer: "11",
            hint1: "Work backwards from 20.",
            hint2: "20 divided by 4 is 5 — now undo the subtraction.",
            explanation: "20 ÷ 4 = 5, and 5 + 6 = 11.",
            theme: "algebra", points: 350
        },
        {
            id: "en-t3-03", tier: 3, difficulty: "MEDIUM",
            clue: "I am a three-digit number. My tens digit is 5 more than my ones digit. My hundreds digit is 8 less than my tens digit. What number am I?",
            answerHashes: ["7559ca4a957c8c82ba04781cd66a68d6022229fca0e8e88d8e487c96ee4446d0"],
            answer: "194",
            hint1: "Start by naming the ones digit as a variable and build the others from it.",
            hint2: "Only one single-digit value keeps every digit between 0 and 9.",
            explanation: "If the ones digit is 4, the tens digit is 4+5=9, and the hundreds digit is 9-8=1 — giving 194.",
            theme: "digits", points: 350
        },
        {
            id: "en-t3-04", tier: 3, difficulty: "MEDIUM",
            clue: "What comes next in this sequence? J, F, M, A, M, J, ...",
            answerHashes: ["189f40034be7a199f1fa9891668ee3ab6049f82d38c68be70f596eab2e1857b7"],
            answer: "j",
            hint1: "This isn't a math sequence.",
            hint2: "Each letter starts the name of a month.",
            explanation: "The letters are the first letters of January through June — the next month is July, starting with J.",
            theme: "calendar", points: 350
        }
    ],
    4: [
        {
            id: "en-t4-01", tier: 4, difficulty: "MEDIUM+",
            clue: "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?",
            answerHashes: ["73bbe8fe8b2b7b72adc45c0b767e401f5c3072b21bd1da2316e6df93bd207cf7", "092c79e8f80e559e404bcf660c48f3522b67aba9ff1484b0367e1a4ddef7431d"],
            answer: "an echo",
            hint1: "You might hear me in a canyon or an empty room.",
            hint2: "I repeat exactly what you say.",
            explanation: "An echo is just reflected sound — it \"speaks\" your own words back with no mouth of its own.",
            theme: "sound", points: 500
        },
        {
            id: "en-t4-02", tier: 4, difficulty: "MEDIUM+",
            clue: "Rearrange the letters of the word LISTEN to spell a word meaning \"quiet.\"",
            answerHashes: ["5a9b9fc8e986cc2fc9439778b39f965ea4b55fa030548123d951986d386d4c70"],
            answer: "silent",
            hint1: "It's a classic anagram pair.",
            hint2: "Both words use exactly the same six letters.",
            explanation: "LISTEN and SILENT are anagrams — same letters, rearranged.",
            theme: "anagram", points: 500
        },
        {
            id: "en-t4-03", tier: 4, difficulty: "MEDIUM+",
            clue: "A butcher is 6 feet tall and wears size 12 shoes. What does he weigh?",
            answerHashes: ["59d6d61431fce7d91388d0c60374ddaadc1acd8370221e11b029621656d5ccec"],
            answer: "meat",
            hint1: "The height and shoe size are a distraction.",
            hint2: "Think about what a butcher weighs on his scale, not on a bathroom scale.",
            explanation: "It's a pun: a butcher weighs meat, not himself — the physical details are irrelevant.",
            theme: "homophone", points: 500
        },
        {
            id: "en-t4-04", tier: 4, difficulty: "MEDIUM+",
            clue: "Using only US quarters, dimes, and pennies (no nickels), what is the fewest number of coins that add up to exactly 99 cents?",
            answerHashes: ["19581e27de7ced00ff1ce50b2047e7a567c76b1cbaebabe5ef03f7c3017bb5b7"],
            answer: "9",
            hint1: "Use as many quarters as you can first.",
            hint2: "3 quarters, then fill the rest with dimes, then pennies.",
            explanation: "3 quarters (75¢) + 2 dimes (20¢) + 4 pennies (4¢) = 99¢, using 9 coins — the minimum possible without a nickel.",
            theme: "currency", points: 500
        }
    ],
    5: [
        {
            id: "en-t5-01", tier: 5, difficulty: "CHALLENGING",
            clue: "What 5-letter word looks the same read forwards, backwards, upside down, and in a mirror?",
            answerHashes: ["43e7018b6f3e7a16b6ce9d808fa9838c633e0f151b6e501494070ebfe95b6114"],
            answer: "swims",
            hint1: "Think about which letters have symmetry when flipped.",
            hint2: "It's a common verb about moving through water.",
            explanation: "In a simple block font, S, W, I, M, S each map onto another symmetric shape when rotated 180°, so SWIMS reads the same upside down.",
            theme: "symmetry", points: 700
        },
        {
            id: "en-t5-02", tier: 5, difficulty: "CHALLENGING",
            clue: "If 2 typists can type 2 pages in 2 minutes, how many typists are needed to type 18 pages in 6 minutes?",
            answerHashes: ["e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683"],
            answer: "6",
            hint1: "First figure out how many pages one typist produces per minute.",
            hint2: "One typist types 1 page every 2 minutes — so 3 pages in 6 minutes.",
            explanation: "Each typist manages 3 pages in 6 minutes, so 18 pages needs 18 ÷ 3 = 6 typists.",
            theme: "rate of work", points: 700
        },
        {
            id: "en-t5-03", tier: 5, difficulty: "CHALLENGING",
            clue: "I am an odd number spelled out in English. Remove one letter from me and I become even. What number am I?",
            answerHashes: ["3ba8d02b16fd2a01c1a8ba1a1f036d7ce386ed953696fa57331c2ac48a80b255"],
            answer: "seven",
            hint1: "Only one English number word does this.",
            hint2: "Remove the S from the front.",
            explanation: "SEVEN minus its first letter S spells EVEN.",
            theme: "wordplay", points: 700
        },
        {
            id: "en-t5-04", tier: 5, difficulty: "CHALLENGING",
            clue: "A man looks at a photograph and says: \"I have no brothers or sisters, but that man's father is my father's son.\" Who is in the photograph?",
            answerHashes: ["38c3baac1ce5961866f65ec3a021aff8a48f1ea6643f5685a8e54b9f280b386d"],
            answer: "my son",
            hint1: "\"My father's son,\" with no siblings, can only be one person.",
            hint2: "\"My father's son\" (with no siblings) is the speaker himself.",
            explanation: "Since the speaker has no siblings, \"my father's son\" is the speaker himself — so the photo shows his own son.",
            theme: "lineage", points: 700
        }
    ],
    6: [
        {
            id: "en-t6-01", tier: 6, difficulty: "CHALLENGING+",
            clue: "What common English word contains all five vowels — A, E, I, O, U — appearing in that exact order, exactly once each?",
            answerHashes: ["f3174416b5f94b068d23041a4925f664c8a596c0aa862697e3bf9d62dc2e1bb4"],
            answer: "facetious",
            hint1: "It means \"treating serious matters with inappropriate humor.\"",
            hint2: "It starts with F and ends with -OUS.",
            explanation: "F-A-C-E-T-I-O-U-S runs through A, E, I, O, U in order, one each.",
            theme: "vowels", points: 1000
        },
        {
            id: "en-t6-02", tier: 6, difficulty: "CHALLENGING+",
            clue: "What 7-letter word for a reclining chair becomes a word meaning \"more extended\" when you remove its third letter?",
            answerHashes: ["96b09253a1c42b8219879c4e4c677a500b5eee59ff2d6718f6755ee1b7ed983a"],
            answer: "lounger",
            hint1: "You might relax on one by a pool.",
            hint2: "Remove the U.",
            explanation: "LOUNGER minus its third letter (U) spells LONGER.",
            theme: "wordplay", points: 1000
        },
        {
            id: "en-t6-03", tier: 6, difficulty: "CHALLENGING+",
            clue: "Take the number of sides on a hexagon, multiply it by the number of sides on a triangle, then subtract the number of sides on a square. What do you get?",
            answerHashes: ["8527a891e224136950ff32ca212b45bc93f69fbb801c3b1ebedac52775f99e61"],
            answer: "14",
            hint1: "A hexagon has 6 sides, a triangle has 3.",
            hint2: "6 × 3 = 18, then subtract the square's 4 sides.",
            explanation: "6 × 3 = 18, and 18 − 4 = 14.",
            theme: "geometry", points: 1000
        },
        {
            id: "en-t6-04", tier: 6, difficulty: "CHALLENGING+",
            clue: "What single letter appears twice in \"week,\" once in \"year,\" but never in \"day\"?",
            answerHashes: ["3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea"],
            answer: "e",
            hint1: "Spell each word out loud in your head.",
            hint2: "It's a vowel.",
            explanation: "\"WEEK\" has two E's, \"YEAR\" has one E, and \"DAY\" has none.",
            theme: "letters", points: 1000
        }
    ],
    7: [
        {
            id: "en-t7-01", tier: 7, difficulty: "HARD",
            clue: "Pick any number. Double it, add 10, then cut the result in half, then subtract your original number. What do you always get, no matter which number you started with?",
            answerHashes: ["ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d"],
            answer: "5",
            hint1: "Try it with two different starting numbers and compare.",
            hint2: "Write it algebraically: (2x + 10) / 2 − x.",
            explanation: "(2x + 10) / 2 simplifies to x + 5; subtracting x always leaves 5, regardless of x.",
            theme: "invariant", points: 1400
        },
        {
            id: "en-t7-02", tier: 7, difficulty: "HARD",
            clue: "What word starts with E, ends with E, but is said to only ever hold one letter?",
            answerHashes: ["4c503ca67761e5c4aaecfe996244c25d8c0b40902d1085c85b4468bd567548c6"],
            answer: "envelope",
            hint1: "You'd mail it.",
            hint2: "It usually contains a single paper letter.",
            explanation: "An ENVELOPE starts and ends with E, and typically holds exactly one (paper) letter.",
            theme: "wordplay", points: 1400
        },
        {
            id: "en-t7-03", tier: 7, difficulty: "HARD",
            clue: "A man builds a house with four walls. Every single wall faces south. A bear walks past one of the windows. What color is the bear?",
            answerHashes: ["018fa96a44715c90bf93be148069cb28dd45d398f2cc75aa1565311f6e55d174"],
            answer: "white",
            hint1: "Where on Earth could every wall possibly face south?",
            hint2: "The house must be at the North Pole.",
            explanation: "Every wall faces south only at the North Pole, where the local bears are polar bears — white.",
            theme: "geography", points: 1400
        },
        {
            id: "en-t7-04", tier: 7, difficulty: "HARD",
            clue: "There is a famous 6-digit number where multiplying it by 2, 3, 4, 5, or 6 just rearranges its own digits into a new order. What is that number?",
            answerHashes: ["ebd72b510911af3e254a030cd891cb804e1902189eee7a0f6199472eb5e4dba2"],
            answer: "142857",
            hint1: "It's connected to the fraction 1/7.",
            hint2: "1/7 = 0.142857142857..., repeating forever.",
            explanation: "142857 is the repeating decimal of 1/7, and multiplying it by 2 through 6 cycles the same six digits.",
            theme: "cyclic numbers", points: 1900
        }
    ],
    8: [
        {
            id: "en-t8-01", tier: 8, difficulty: "HARD+",
            clue: "Spelled out in English, one number's letters fall in perfect alphabetical order — no other number shares this property. Which number is it?",
            answerHashes: ["9cee2304bd633d42c35db17c1427a273668bd3166487f924216d807a566a8e73"],
            answer: "forty",
            hint1: "Check the letters F, O, R, T, Y.",
            hint2: "It's a multiple of ten.",
            explanation: "F-O-R-T-Y: each letter comes later in the alphabet than the one before it.",
            theme: "alphabetical order", points: 1900
        },
        {
            id: "en-t8-02", tier: 8, difficulty: "HARD+",
            clue: "I am a 6-letter word. Remove my last letter and I become the number 12, spelled out. What word am I?",
            answerHashes: ["219d9757b9f4c227b66e75e28922fb5e945af0b043260bcdced849e43b584905"],
            answer: "dozens",
            hint1: "Think in groups of 12.",
            hint2: "Remove the trailing S.",
            explanation: "DOZENS minus its final S spells DOZEN, which means 12.",
            theme: "wordplay", points: 1900
        },
        {
            id: "en-t8-03", tier: 8, difficulty: "HARD+",
            clue: "I am a two-digit number. My digits add up to 15. Reverse my digits and the result is 27 less than I am. What number am I?",
            answerHashes: ["7b1a278f5abe8e9da907fc9c29dfd432d60dc76e17b0fabab659d2a508bc65c4"],
            answer: "96",
            hint1: "Let the digits be a and b, with a+b=15.",
            hint2: "The reversal condition means the tens digit is 3 more than the ones digit.",
            explanation: "With a+b=15 and a−b=3 (from the reversal gap of 27=9×3), a=9 and b=6, giving 96; reversed is 69, and 96−69=27.",
            theme: "digit reversal", points: 1900
        },
        {
            id: "en-t8-04", tier: 8, difficulty: "HARD+",
            clue: "What letter comes next in this sequence? O, T, T, F, F, S, S, E, ...",
            answerHashes: ["1b16b1df538ba12dc3f97edbb85caa7050d46c148134290feba80f8236c83db9"],
            answer: "n",
            hint1: "These aren't random letters.",
            hint2: "Each one starts the spelling of a number: One, Two, Three...",
            explanation: "The letters are the first letters of One, Two, Three, Four, Five, Six, Seven, Eight — next comes Nine.",
            theme: "sequences", points: 1900
        }
    ],
    9: [
        {
            id: "en-t9-01", tier: 9, difficulty: "VERY HARD",
            clue: "A snail sits at the bottom of a 20-foot well. Each day it climbs 3 feet, but each night it slides back 2 feet. On what day number does it finally escape the well?",
            answerHashes: ["4ec9599fc203d176a301536c2e091a19bc852759b255bd6818810a42c5fed14a"],
            answer: "18",
            hint1: "The snail doesn't slide back on the day it finally escapes.",
            hint2: "It gains a net 1 foot per full day-night cycle until the last day.",
            explanation: "After 17 full cycles the snail is at 17 feet; on day 18 it climbs the remaining 3 feet to reach 20 and escapes before nightfall.",
            theme: "rate race", points: 2500
        },
        {
            id: "en-t9-02", tier: 9, difficulty: "VERY HARD",
            clue: "A number always leaves a remainder of 4 when divided by 5, by 6, or by 7. What is the smallest such number greater than 4?",
            answerHashes: ["802b906a18591ead8a6dd809b262ace4c65c16e89764c40ae326cfcff811e10c"],
            answer: "214",
            hint1: "The number minus 4 must be divisible by 5, 6, and 7 all at once.",
            hint2: "Find the least common multiple of 5, 6, and 7 first.",
            explanation: "The LCM of 5, 6, and 7 is 210, so the smallest qualifying number is 210 + 4 = 214.",
            theme: "modular arithmetic", points: 2500
        },
        {
            id: "en-t9-03", tier: 9, difficulty: "VERY HARD",
            clue: "In a certain code, MONEY is written as NPOFZ. Using that same code, how is RIDDLE written?",
            answerHashes: ["8524a43e8c31d058107f3d7d6132ba105c3ecd2cf19c893d50a065101c44946a"],
            answer: "sjeemf",
            hint1: "Compare each letter of MONEY to its coded version.",
            hint2: "Every letter is shifted forward by exactly one place in the alphabet.",
            explanation: "Shifting R,I,D,D,L,E forward by one letter each gives S,J,E,E,M,F.",
            theme: "ciphers", points: 2500
        },
        {
            id: "en-t9-04", tier: 9, difficulty: "VERY HARD",
            clue: "A bat and a ball together cost $1.10. The bat costs exactly $1.00 more than the ball. How many cents does the ball cost?",
            answerHashes: ["ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d"],
            answer: "5",
            hint1: "The ball does not cost 10 cents — check your assumption.",
            hint2: "If the ball is x cents, the bat is (x+100) cents, and 2x+100=110.",
            explanation: "Solving 2x + 100 = 110 gives x = 5, so the ball costs 5 cents and the bat costs 105 cents.",
            theme: "cost puzzle", points: 2500
        }
    ],
    10: [
        {
            id: "en-t10-01", tier: 10, difficulty: "FINAL",
            clue: "{{TRAIL}}Every riddle today has led here. Think about a clever solution and a small metal device that opens a lock — one four-letter word means both. It's also the very last word this game is always one riddle away from. What word is it?",
            answerHashes: ["2c70e12b7a0646f92279f427c7b38e7334d8e5389cff167a1dc30e73f826b683"],
            answer: "key",
            hint1: "It's the same word for \"a clever insight\" and \"what opens a lock.\"",
            hint2: "It's also hidden in the phrase \"the ___ to solving this.\"",
            explanation: "\"Key\" means both a clever, essential insight and the object that opens a lock — and this whole game is always one riddle away from it.",
            theme: "finale", points: 4000
        },
        {
            id: "en-t10-02", tier: 10, difficulty: "FINAL",
            clue: "{{TRAIL}}For the final calculation: multiply the number of hours shown on a clock face by the number of days in a week, then add the number of sides on a stop sign. What do you get?",
            answerHashes: ["8241649609f88ccd2a0a5b233a07a538ec313ff6adf695aa44a969dbca39f67d"],
            answer: "92",
            hint1: "A clock face shows 12 hours, a week has 7 days, a stop sign is an octagon.",
            hint2: "12 × 7 = 84, then add the stop sign's 8 sides.",
            explanation: "12 × 7 = 84, and 84 + 8 = 92.",
            theme: "synthesis", points: 4000
        },
        {
            id: "en-t10-03", tier: 10, difficulty: "FINAL",
            clue: "{{TRAIL}}One last puzzle: multiply the number of letters in \"FRIDAY\" by 5 (the weekday it usually falls on), then subtract the number of letters in \"RIDDLE\". What do you get?",
            answerHashes: ["c2356069e9d1e79ca924378153cfbbfb4d4416b1f99d41a2940bfdb66c5319db"],
            answer: "24",
            hint1: "FRIDAY has 6 letters.",
            hint2: "6 × 5 = 30, then subtract RIDDLE's 6 letters.",
            explanation: "6 × 5 = 30, and 30 − 6 = 24.",
            theme: "synthesis", points: 4000
        },
        {
            id: "en-t10-04", tier: 10, difficulty: "FINAL",
            clue: "{{TRAIL}}The finale: take the number of letters in \"CLUE\", cube it, then subtract the number of letters in \"RIDDLE\". What do you get?",
            answerHashes: ["6208ef0f7750c111548cf90b6ea1d0d0a66f6bff40dbef07cb45ec436263c7d6"],
            answer: "58",
            hint1: "CLUE has 4 letters. What's 4 cubed?",
            hint2: "4³ = 64, then subtract RIDDLE's 6 letters.",
            explanation: "4³ = 64, and 64 − 6 = 58.",
            theme: "synthesis", points: 4000
        }
    ]
};

const RIDDLE_TIERS = Object.keys(ENGLISH_RIDDLE_POOL).map(Number).sort((a, b) => a - b);
