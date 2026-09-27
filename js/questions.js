// Question Bank
//
// Each riddle's clue is built on the answer to the previous riddle, so the
// chain only makes sense played in order: level 1 has no dependency, level 2
// explicitly restates level 1's answer and builds the next clue from it, and
// so on through level 10.
//
// NORMAL_CHAIN_EN and HARD_CHAIN_EN are two parallel phrasings of the exact
// same 10-answer sequence (7, 7, 15, 10, 30, 36, 6, 25, 5, 13) so that
// swapping a level from normal to hard difficulty (based on how fast/cleanly
// the player is answering) never breaks the chain — whichever variant is
// shown, the next clue always builds on the same true previous answer.
const NORMAL_CHAIN_EN = [
    {
        level: 1,
        difficulty: "SIMPLE",
        clue: "What number comes right after 6?",
        answerHashes: ["7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451"],
        answer: "7",
        hint: "Just count one step forward from 6.",
        points: 100
    },
    {
        level: 2,
        difficulty: "MODERATE",
        clue: "The previous answer was 7. What number multiplied by 7 gives 49?",
        answerHashes: ["7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451"],
        answer: "7",
        hint: "7 times what equals 49?",
        points: 200
    },
    {
        level: 3,
        difficulty: "LOGICAL",
        clue: "The previous answer was 7. Add it to itself, then add 1. What do you get?",
        answerHashes: ["e629fa6598d732768f7c726b4b621285f9c3b85303900aa912017db7617d8bdb"],
        answer: "15",
        hint: "7 + 7 + 1.",
        points: 350
    },
    {
        level: 4,
        difficulty: "CLASSICAL",
        clue: "The previous answer was 15. Subtract 5 from it. What do you get?",
        answerHashes: ["4a44dc15364204a80fe80e9039455cc1608281820fe2b24f1e5233ade6af1dd5"],
        answer: "10",
        hint: "15 - 5.",
        points: 500
    },
    {
        level: 5,
        difficulty: "HISTORIC",
        clue: "The previous answer was 10. Multiply it by 3. What do you get?",
        answerHashes: ["624b60c58c9d8bfb6ff1886c2fd605d2adeb6ea4da576068201b6c6958ce93f4"],
        answer: "30",
        hint: "10 x 3.",
        points: 700
    },
    {
        level: 6,
        difficulty: "DIFFICULT",
        clue: "The previous answer was 30. Add 6 to it. What do you get?",
        answerHashes: ["76a50887d8f1c2e9301755428990ad81479ee21c25b43215cf524541e0503269"],
        answer: "36",
        hint: "30 + 6.",
        points: 1000
    },
    {
        level: 7,
        difficulty: "CRYPTIC",
        clue: "The previous answer was 36. What is its square root?",
        answerHashes: ["e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683"],
        answer: "6",
        hint: "What number times itself gives 36?",
        points: 1400
    },
    {
        level: 8,
        difficulty: "SCHOLARLY",
        clue: "The previous answer was 6. Multiply it by 4, then add 1. What do you get?",
        answerHashes: ["b7a56873cd771f2c446d369b649430b65a756ba278ff97ec81bb6f55b2e73569"],
        answer: "25",
        hint: "(6 x 4) + 1.",
        points: 1900
    },
    {
        level: 9,
        difficulty: "COMPLEX",
        clue: "The previous answer was 25. What is its square root?",
        answerHashes: ["ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d"],
        answer: "5",
        hint: "What number times itself gives 25?",
        points: 2500
    },
    {
        level: 10,
        difficulty: "LEGENDARY",
        clue: "The previous answer was 5. Double it, then add 3. What do you get?",
        answerHashes: ["3fdba35f04dc8c462986c992bcf875546257113072a909c162f7e470e581e278"],
        answer: "13",
        hint: "(5 x 2) + 3.",
        points: 4000
    }
];

// Same 10-answer sequence as NORMAL_CHAIN_EN, phrased as harder word problems.
// Swapped in mid-game for a level when the player is answering fast and
// cleanly (see game.js maybeEscalateNextLevelDifficulty).
const HARD_CHAIN_EN = [
    {
        level: 1,
        difficulty: "SIMPLE",
        clue: "Take the number 3, double it, then add 1. What do you get?",
        answerHashes: ["7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451"],
        answer: "7",
        hint: "(3 x 2) + 1.",
        points: 100
    },
    {
        level: 2,
        difficulty: "MODERATE",
        clue: "The previous answer was 7. What is 7 factorial divided by 6 factorial?",
        answerHashes: ["7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451"],
        answer: "7",
        hint: "n! / (n-1)! always simplifies to n.",
        points: 200
    },
    {
        level: 3,
        difficulty: "LOGICAL",
        clue: "The previous answer was 7. Double it, then add 1. What do you get?",
        answerHashes: ["e629fa6598d732768f7c726b4b621285f9c3b85303900aa912017db7617d8bdb"],
        answer: "15",
        hint: "(7 x 2) + 1.",
        points: 350
    },
    {
        level: 4,
        difficulty: "CLASSICAL",
        clue: "The previous answer was 15. If you remove one third of it, what remains?",
        answerHashes: ["4a44dc15364204a80fe80e9039455cc1608281820fe2b24f1e5233ade6af1dd5"],
        answer: "10",
        hint: "A third of 15 is 5. 15 - 5 = ?",
        points: 500
    },
    {
        level: 5,
        difficulty: "HISTORIC",
        clue: "The previous answer was 10. Three friends each have that many coins. How many coins in total?",
        answerHashes: ["624b60c58c9d8bfb6ff1886c2fd605d2adeb6ea4da576068201b6c6958ce93f4"],
        answer: "30",
        hint: "10 x 3.",
        points: 700
    },
    {
        level: 6,
        difficulty: "DIFFICULT",
        clue: "The previous answer was 30. Add the number of items in half a dozen to it. What do you get?",
        answerHashes: ["76a50887d8f1c2e9301755428990ad81479ee21c25b43215cf524541e0503269"],
        answer: "36",
        hint: "Half a dozen is 6. 30 + 6 = ?",
        points: 1000
    },
    {
        level: 7,
        difficulty: "CRYPTIC",
        clue: "The previous answer was 36. What positive number, multiplied by itself, equals the previous answer?",
        answerHashes: ["e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683"],
        answer: "6",
        hint: "Its square root.",
        points: 1400
    },
    {
        level: 8,
        difficulty: "SCHOLARLY",
        clue: "The previous answer was 6. Quadruple it, then add 1. What do you get?",
        answerHashes: ["b7a56873cd771f2c446d369b649430b65a756ba278ff97ec81bb6f55b2e73569"],
        answer: "25",
        hint: "(6 x 4) + 1.",
        points: 1900
    },
    {
        level: 9,
        difficulty: "COMPLEX",
        clue: "The previous answer was 25. What positive number, when squared, gives the previous answer?",
        answerHashes: ["ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d"],
        answer: "5",
        hint: "Its square root.",
        points: 2500
    },
    {
        level: 10,
        difficulty: "LEGENDARY",
        clue: "The previous answer was 5. Double it, then add the smallest prime number greater than 2. What do you get?",
        answerHashes: ["3fdba35f04dc8c462986c992bcf875546257113072a909c162f7e470e581e278"],
        answer: "13",
        hint: "The smallest prime greater than 2 is 3. (5 x 2) + 3 = ?",
        points: 4000
    }
];

// Original Gujarati riddles with Gujarati-script and Gujlish answer support.
// Not yet converted to a chained sequence.
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
