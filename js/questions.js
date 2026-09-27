// Question Bank
const BASE_QUESTIONS = [
    {
        level: 1,
        difficulty: "SIMPLE",
        clue: "The more of them you take, the more you leave behind. What are they? (Write a single plural word)",
        answerHashes: ["b7595e2a863957fc6c225ed540d335dd1e859dd3032451c2e11bceb0329defa6","1a11a5a27be607e96d0205aa1304d7f39c97416ab35892049129d3f6eafa90fb"],
        answer: "steps",
        hint: "Think of walking in wet sand or soft dust.",
        points: 100
    },
    {
        level: 2,
        difficulty: "MODERATE",
        clue: "I am an odd number. Take away one letter and I become completely even. What number am I? (Spelled out in lowercase)",
        answerHashes: ["3ba8d02b16fd2a01c1a8ba1a1f036d7ce386ed953696fa57331c2ac48a80b255"],
        answer: "seven",
        hint: "Examine the letters S-E-V-E-N.",
        points: 200
    },
    {
        level: 3,
        difficulty: "LOGICAL",
        clue: "The mechanics of this chamber door depend on the final index of this series:\n1, 4, 9, 16, 25, 36, ...?",
        answerHashes: ["0e17daca5f3e175f448bacace3bc0da47d0655a74c8dd0dc497a3afbdad95f1f"],
        answer: "49",
        hint: "These are successive perfect squares ($1^2$, $2^2$, $3^2$, etc.).",
        points: 350
    },
    {
        level: 4,
        difficulty: "CLASSICAL",
        clue: "Brothers and sisters I have none, but this portrait subject's father is my father's son. Who is in the portrait? (Answer 'my son', 'myself', or 'my daughter')",
        answerHashes: ["38c3baac1ce5961866f65ec3a021aff8a48f1ea6643f5685a8e54b9f280b386d","98aa6675482552881925fe70d82559692d811b3bcd33f53b9a702c24d5322696","6d7504df87c5730ef4094bb8d087ab4e19e198e54b3b39de1ef2dbb8e46c02c3"],
        answer: "my son",
        hint: "'My father's son' must be 'me' since I have no siblings.",
        points: 500
    },
    {
        level: 5,
        difficulty: "HISTORIC",
        clue: "The parchment is encoded using an ancient Caesar Cipher, shifting letters forward by 3 paces (A -> D, B -> E, C -> F...). \n\nDecoded text: 'KHOOR'. \nDecrypt it to unlock this chamber.",
        answerHashes: ["2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"],
        answer: "hello",
        hint: "Trace back each letter by 3 places (e.g., K - 3 = H).",
        points: 700
    },
    {
        level: 6,
        difficulty: "DIFFICULT",
        clue: "What occurs once in a minute, twice in a moment, but never in a thousand years?",
        answerHashes: ["62c66a7a5dd70c3146618063c344e531e6d4b59e379808443ce962b3abd63c5a","d2010e8304e25d4de563c472f3a91d6219db7d738ff2a0a0e464902cf53327ed","d75ffd3083e80df716da1d54b000ae742e7973884ee3b293b605aa9905029099"],
        answer: "m",
        hint: "This riddle is strictly alphabetical. Inspect the visual text.",
        points: 1000
    },
    {
        level: 7,
        difficulty: "CRYPTIC",
        clue: "What sequence follows this logic step? \n2, 9, 30, 93, ...? \nWhat is the next numeral?",
        answerHashes: ["27e1615212f3c6ea846ed6c412df1361ce97f006ee20bb5aa2483a3b61d5cadd"],
        answer: "282",
        hint: "The mathematical rule: $(Current \\times 3) + 3$. For instance, $(2 \\times 3) + 3 = 9$.",
        points: 1400
    },
    {
        level: 8,
        difficulty: "SCHOLARLY",
        clue: "I have keys but open no locks. I have space but no room. You can enter, but you cannot leave. What am I? (One word)",
        answerHashes: ["91f060a9ad4b39eb228d9537292fab19d252faed06c169d0fdcb4a90560f5676","3693efb5a03a46fd3d14cccd4b47f0ffd0ec2251155f4a55f34227a8d42c962a","5107ba0d22f4869fd971771cdd8be6679893a29cc5351dbbe4f845ffdd04b4e4"],
        answer: "keyboard",
        hint: "You are pressing my keys right now.",
        points: 1900
    },
    {
        level: 9,
        difficulty: "COMPLEX",
        clue: "Convert this binary configuration back to its matching uppercase alphabetical character: \n\n'01011010'",
        answerHashes: ["594e519ae499312b29433b7dd8a97ff068defcba9755b6d5d00e84c524d67b06"],
        answer: "z",
        hint: "The base-10 value is 90. What uppercase ASCII letter is position 90?",
        points: 2500
    },
    {
        level: 10,
        difficulty: "LEGENDARY",
        clue: "I am the beginning of everything, the end of everywhere. I am the start of eternity, and the end of time and space. What am I?",
        answerHashes: ["3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea","d536aec09b07cfef921939e57ac668edd3751a00f1185162f4b4cf94fce4f133","b4bc40ef55dd0a6031a40f2c51e594144f7c557029abcb2fb5c5495e5cc8e1f1"],
        answer: "e",
        hint: "Look closely at the letter spelling of 'Everything', 'Everywhere', 'Eternity'.",
        points: 4000
    }
];

const ALT_QUESTIONS = [
    {
        level: 1, difficulty: "SIMPLE",
        clue: "I repeat what you say, but I have no voice. What am I?",
        answerHashes: ["092c79e8f80e559e404bcf660c48f3522b67aba9ff1484b0367e1a4ddef7431d","73bbe8fe8b2b7b72adc45c0b767e401f5c3072b21bd1da2316e6df93bd207cf7"],
        answer: "echo",
        hint: "You may hear it in a cave or an empty hall.", points: 100
    },
    {
        level: 2, difficulty: "MODERATE",
        clue: "What gets wetter the more it dries?",
        answerHashes: ["10ca50a8a7148afd6d2a563e8ef8e05cfedd17fc97a6a5327cf9e5300b933e4b","b99f2a4d3849ceacf7835615378904b9cdcad6510f2c1349c296e6f6bc2ead72"],
        answer: "towel",
        hint: "You use it after a bath or shower.", points: 200
    },
    {
        level: 3, difficulty: "LOGICAL",
        clue: "What number comes next? 1, 2, 3, 5, 8, 13, ...",
        answerHashes: ["6f4b6612125fb3a0daecd2799dfd6c9c299424fd920f9b308110a2c1fbd8f443","ab5f56b635ce83e4331b7fceae2b9266cb06bf1428abca09ad74dbdee39dd7ec","a69edb489f4eb7f23d85766e3f60af8326fa7f4d0fbf1f14ad276336a18e1dfe"],
        answer: "21",
        hint: "Add the previous two numbers.", points: 350
    },
    {
        level: 4, difficulty: "CLASSICAL",
        clue: "Two fathers and two sons went fishing. They caught three fish, and each took one home. How many people were there?",
        answerHashes: ["4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce","8b5b9db0c13db24256c829aa364aa90c6d2eba318b9232a4ab9313b954d3555f","0b0710080abf95ba4e055debcc0eda0762eedb67c0be9d02257bee940680f3e8"],
        answer: "3",
        hint: "Think of a grandfather, a father, and a son.", points: 500
    },
    {
        level: 5, difficulty: "HISTORIC",
        clue: "A word was shifted forward by 3 letters in the alphabet and became FRGH. Shift it back by 3. What is the word?",
        answerHashes: ["5694d08a2e53ffcae0c3103e5ad6f6076abd960eb1f8a56577040bc1028f702b"],
        answer: "code",
        hint: "F becomes C, R becomes O, G becomes D, and H becomes E.", points: 700
    },
    {
        level: 6, difficulty: "DIFFICULT",
        clue: "What comes once in a year, twice in every, but never in a week?",
        answerHashes: ["3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea","d536aec09b07cfef921939e57ac668edd3751a00f1185162f4b4cf94fce4f133","b4bc40ef55dd0a6031a40f2c51e594144f7c557029abcb2fb5c5495e5cc8e1f1"],
        answer: "e",
        hint: "Look at the letters in the words.", points: 1000
    },
    {
        level: 7, difficulty: "CRYPTIC",
        clue: "What number comes next? 1, 2, 6, 24, 120, ...",
        answerHashes: ["d829857eb1366e70be857a69886d1555af0d32681beab068afb93492c2e2b843","00861645dd60d3592d41794c7ea9eb7a9931a28bbe202e9b621684fff1179661"],
        answer: "720",
        hint: "Multiply by 2, then 3, then 4, then 5.", points: 1400
    },
    {
        level: 8, difficulty: "SCHOLARLY",
        clue: "I have branches, but no fruit, trunk, or leaves. What am I?",
        answerHashes: ["4381dc2ab14285160c808659aee005d51255add7264b318d07c7417292c7442c","3b60d1de12f3775d1a7b220a0c4fb5d7fb3448382d90d687f2a179100c3c9251"],
        answer: "bank",
        hint: "This kind of branch handles money.", points: 1900
    },
    {
        level: 9, difficulty: "COMPLEX",
        clue: "Which uppercase letter is represented by the binary ASCII code 01000001?",
        answerHashes: ["ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb","262490e446ad1f6bafb199565bd3eb181704be9d9f70f154bca80cc505b04998","d570ab2768626b3abc2eb95a8bf65bd726566a3119853dae404217671ce65e9c"],
        answer: "a",
        hint: "The decimal value is 65.", points: 2500
    },
    {
        level: 10, difficulty: "LEGENDARY",
        clue: "What five-letter word becomes shorter when you add two letters to it?",
        answerHashes: ["f9b0078b5df596d2ea19010c001bbd009e651de2c57e8fb7e355f31eb9d3f739"],
        answer: "short",
        hint: "Add E and R to describe what happens to the word.", points: 4000
    }
];

// Original Gujarati riddles with Gujarati-script and Gujlish answer support.
const GUJARATI_QUESTIONS = [
    {
        level: 1, difficulty: "SIMPLE",
        clue: "એવી કઈ વસ્તુ છે જે પાણી પીતા જ મરી જાય?",
        answerHashes: ["a309ccaf5fc9d83ad228c4057f792d53e448a2482e93630270f93e339398cb0d","cdc93f57b82c7d1cec5f75b426889c9d3c5212a0ec9ca03a8f3f6890f81077a5","9aaf680776b98fd17fe63376120525cbcdffc01bc66f71df96b6e90b87f39b86"],
        answer: "આગ", hint: "તે ગરમી અને પ્રકાશ આપે છે.", points: 100
    },
    {
        level: 2, difficulty: "MODERATE",
        clue: "માથું અને પૂંછડી છે, પણ શરીર નથી. હું કોણ?",
        answerHashes: ["30669041d1dfb820734f39025f9b783165e22bcf5aa1e7027e0d0710ae5a9925","e8d5b0b630a59f375144a2c009e389b8a93879ff46454cd95244f96dfe54c891","8f48ed843b5974ee8800d80efe969f2c1d553fb2eeb68065ec67fbbbd1ca31cc"],
        answer: "સિક્કો", hint: "તે પૈસા તરીકે વપરાય છે.", points: 200
    },
    {
        level: 3, difficulty: "LOGICAL",
        clue: "મારા ઘણા દાંત છે, છતાં હું ખાઈ શકતો નથી. હું કોણ?",
        answerHashes: ["dbe3a4b13683d8ac78bf09e24ba0d7ebb6eaa42c2bc4e42828496e581784c550","3db4be71048e175fc651169bb004074f431ad79f8241cee3ddf5104e77a3f374","1aa66622ad29273813260ad0ed0c3ec4ec081d7d6a88746703af17ffc6f38fb8"],
        answer: "કાંસકો", hint: "વાળ ગોઠવવામાં તેનો ઉપયોગ થાય છે.", points: 350
    },
    {
        level: 4, difficulty: "CLASSICAL",
        clue: "પગ વગર દોડું છું અને રસ્તો બનાવ્યા વગર આગળ વધું છું. હું કોણ?",
        answerHashes: ["c9101adff02def84584b164c4d231d75d34640e6369b9b35a44bca23d1607c06","646fe999c9dad33dc91ecd03c2883b68661f523f78d697ef8a8a8de0dd185388"],
        answer: "નદી", hint: "હું પર્વતથી સમુદ્ર તરફ વહું છું.", points: 500
    },
    {
        level: 5, difficulty: "HISTORIC",
        clue: "મારી અંદરથી જેટલું વધારે કાઢો, હું એટલો જ મોટો થાઉં. હું કોણ?",
        answerHashes: ["59c0f0f474b9e409ee1d9abc9beea62fc480f75f961e1af60dc6796c39ae7ce5","d00330b4d79b918f26aa007c8caec62ad257d26284a7b48a00b0151a6c01233c"],
        answer: "ખાડો", hint: "જમીન ખોદવાથી હું બનુ છું.", points: 700
    },
    {
        level: 6, difficulty: "DIFFICULT",
        clue: "મારી એક આંખ છે, છતાં હું જોઈ શકતી નથી. હું કોણ?",
        answerHashes: ["8e03a59ba9327210728d64f9e9fcf2a26f2c4a670183b8cebb2de2e31f11c6eb","e676b5103a4f9d9371d56d19648e8c2838986d67eb58ce94dd8441999f4cddc5","9eba12ac972f2245d31b3a5783a403a552831f090b0ffc1f16666c54d1b9f4f0"],
        answer: "સોય", hint: "દોરો મારી આંખમાંથી પસાર થાય છે.", points: 1000
    },
    {
        level: 7, difficulty: "CRYPTIC",
        clue: "નાનું સફેદ ઘર, બારી કે બારણું નહીં; અંદર પીળો મહેમાન. શું છે?",
        answerHashes: ["44e8fafa31212136c630294adaab64e0a42779ab67c41d474fd35c014f9dd998","5998f8359854c483ca05c373a9f0982b77f06516cff0dac75be26c09e4bae146","06621718a5ca2926ea6cf21dd02b2eff3a162a9e1554dd57aad5f7a4307d3f6a","3d7313dbda83d22183751a73881993a69d1bf35f48568976102a8e80c6a056b8"],
        answer: "ઈંડું", hint: "તેનું કવચ તોડીને રસોઈ થાય છે.", points: 1400
    },
    {
        level: 8, difficulty: "SCHOLARLY",
        clue: "સફેદ ખેતરમાં કાળા બીજ; વાંચો તો જ્ઞાન મળે. શું છે?",
        answerHashes: ["4887b0d12fd0349da434c9d8b4b5c1e7ee28788422d9637e64be67096cafaf46","b7a3d09aec2fe48f057269ef7049ab0bcc11cf94fa78d218951b08028e4dd679","92719fe0cf8cd51592af31ee8a5736d79f7273777fa3f7b70bfe993a4cd32180"],
        answer: "પુસ્તક", hint: "તેમાં પાનાં અને અક્ષરો હોય છે.", points: 1900
    },
    {
        level: 9, difficulty: "COMPLEX",
        clue: "હું તમારો છું, છતાં તમારાથી વધારે બીજા લોકો મને બોલે છે. હું શું?",
        answerHashes: ["023b7865bf9258899be7e89bb58a171c90837741bdd28d691ba793a88b067565","805363c9d5a023c8eb2d74755f9c120f3833dbd02b5e5625dae51e5e0b90c90e","592372bb39bc1c652ceb4091a694d77fa9ef5f144e3747c0539babe1a407428c"],
        answer: "નામ", hint: "લોકો તમને બોલાવવા માટે તેનો ઉપયોગ કરે છે.", points: 2500
    },
    {
        level: 10, difficulty: "LEGENDARY",
        clue: "સવારે ચાર પગે, બપોરે બે પગે અને સાંજે ત્રણ પગે કોણ ચાલે છે?",
        answerHashes: ["73ac8af991b12b48401c0486c375dee1b225764343a641ec3adfa2f33f5ce856","612f14433c2d02e3d4360665272589a6ca9c593b7527ec2d9543376d812f2008","627eed7b8c02c77bfcbcacf624e4c1ea33065b29845f091f67c8210ed3ab9409"],
        answer: "માણસ", hint: "બાળપણ, યુવાની અને વૃદ્ધાવસ્થા વિશે વિચારો.", points: 4000
    }
];
