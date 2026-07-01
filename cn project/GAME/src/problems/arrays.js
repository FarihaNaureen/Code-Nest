export const arrayProblems = [
  {
    id: 1, worldId: 'arrays-strings', title: "The First Harvest",
    difficulty: 'easy', concepts: ['Array', 'Indexing'],
    story: {
      scenario: "Welcome to the Grid Kingdom. The crops are stored in a linear plot. The player must access the first crop from the array and harvest it.",
      objective: "Access the first element of the `crops` array and store it in a variable called `firstCrop`. Print it.",
      controls: ['array[index]'],
    },
    relics: [{ name: 'WHEAT', x: 20 }, { name: 'CORN', x: 50 }, { name: 'CARROT', x: 80 }],
    hints: [
      { text: "In Java, array indices start at 0. So the first element is crops[0].", cost: 0 },
      { text: "Use crops[0] and print it: System.out.println(\"Harvested: \" + firstCrop);", cost: 10 },
    ],
    starterCode: `String[] crops = {"WHEAT", "CORN", "CARROT"};

// Access the first element of the array:
String firstCrop = ""; // replace "" with correct array access

System.out.println("Harvested: " + firstCrop);
`,
    hazards: [
      { id: "thorn_wrong_crop", type: "spikes", x: 40 },
      { id: "mud_out_of_bounds", type: "poison", x: 80 }
    ],
    validate: (stack, operations, context) => {
      if (context.error && context.error.includes("IndexOutOfBounds")) {
        return { 
          passed: false, message: 'Index must be inside array length. Warning trap triggered!', 
          testsRun: 1, testsPassed: 0,
          commands: [{ type: 'TAKE_DAMAGE', amount: 1 }]
        };
      }
      const logs = context.logs || [];
      if (logs.some(l => l.includes('WHEAT'))) return { passed: true, message: '✨ Harvest successful!', testsRun: 1, testsPassed: 1 };
      if (logs.some(l => l.includes('CORN') || l.includes('CARROT'))) {
        return { 
          passed: false, message: 'Arrays start at index 0. Scarecrow trap activates!', 
          testsRun: 1, testsPassed: 0,
          commands: [{ type: 'SPAWN_HAZARD', hazardType: 'enemy', x: 50 }, { type: 'TAKE_DAMAGE', amount: 1 }]
        };
      }
      return { passed: false, message: 'The output should be: Harvested: WHEAT', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "Welcome to the crop field. Crops are stored like an array, starting from index zero.",
      objectiveHelp: "Your goal is to access the first crop using crops[0].",
      codeHint: "Arrays start at index zero, so the first crop is crops[0]. Store it in firstCrop.",
      gameplayHint: "When your code is correct, your character will walk to the wheat crop and harvest it.",
      errorHint: "Check your index. If you used crops[1], that means you selected the second crop, not the first.",
      successMessage: "Great! You harvested the first crop using array indexing."
    },
    guide: {
      intro: "Welcome to this challenge! Listen carefully to the instructions.",
      objectiveHelp: "Your goal is to solve the problem described in the instructions.",
      codeHint: "Check the hints panel if you need more help with the code.",
      gameplayHint: "Remember to watch the character animation for clues.",
      errorHint: "Your code has an error or didn't produce the correct result. Check the console.",
      successMessage: "Excellent work! You solved it!"
    },
    sceneType: 'sunny_farm',
    levelActionConfig: { requiredTool: 'sickle', actionAnimation: 'swing', successEffect: 'harvest_particles' }
  },
  {
    id: 2, worldId: 'arrays-strings', title: "Two Sum Runes",
    difficulty: 'medium', concepts: ['Array', 'Two Pointers', 'Nested Loops'],
    story: {
      scenario: "Four rune stones are placed on platforms. To open the gates, find the pair that sums to the target.",
      objective: "Find two numbers in the array that add up to `target`. Print their indices like `0 2`.",
      controls: ['Nested for loop', 'if statement'],
    },
    relics: [
      { id: 'Rune_2', name: '2', emoji: '💎', x: 20, y: 40 },
      { id: 'Rune_7', name: '7', emoji: '💎', x: 40, y: 60 },
      { id: 'Rune_8', name: '8', emoji: '💎', x: 60, y: 40 },
      { id: 'Rune_5', name: '5', emoji: '💎', x: 80, y: 60 }
    ],
    hints: [
      { text: "Target is 10. We have 2 and 8 at indices 0 and 2.", cost: 10 },
    ],
    starterCode: `int[] runes = {2, 7, 8, 5};
int target = 10;
// Your code here:
// Expected output: 0 2

`,
    hazards: [
      { type: "fire", x: 30 },
      { type: "fire", x: 70 }
    ],
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      if (logs.some(l => l.includes('0') && l.includes('2'))) return { passed: true, message: '✨ Portal opened!', testsRun: 1, testsPassed: 1 };
      return { 
        passed: false, message: 'Check pairs until sum equals target. Portal shock hits!', 
        testsRun: 1, testsPassed: 0,
        commands: [{ type: 'TAKE_DAMAGE', amount: 1 }]
      };
    },
    guide: {
      intro: "Welcome to this challenge! Listen carefully to the instructions.",
      objectiveHelp: "Your goal is to solve the problem described in the instructions.",
      codeHint: "Check the hints panel if you need more help with the code.",
      gameplayHint: "Remember to watch the character animation for clues.",
      errorHint: "Your code has an error or didn't produce the correct result. Check the console.",
      successMessage: "Excellent work! You solved it!"
    },
    sceneType: 'portal_chamber',
    levelActionConfig: { requiredTool: 'magic_device', actionAnimation: 'poke', successEffect: 'magic_sparkles' }
  },
  {
    id: 3, worldId: 'arrays-strings', title: "Sliding Window",
    difficulty: 'medium', concepts: ['Array', 'Sliding Window', 'Subarray'],
    story: {
      scenario: "Chests are placed on a mine rail. A glowing 3-slot frame slides across the chests. Find the window with the most gold.",
      objective: "Find the maximum sum of a contiguous subarray of size 3. Print the max sum.",
      controls: ['for loop', 'Math.max'],
    },
    relics: [
      { id: 'Gold_0', name: 'Gold_0', emoji: '🪙', x: 10 },
      { id: 'Gold_1', name: 'Gold_1', emoji: '🪙', x: 25 },
      { id: 'Gold_2', name: 'Gold_2', emoji: '🪙', x: 40 },
      { id: 'Gold_3', name: 'Gold_3', emoji: '🪙', x: 55 },
      { id: 'Gold_4', name: 'Gold_4', emoji: '🪙', x: 70 }
    ],
    hints: [
      { text: "Calculate the sum of the first 3 elements. Then slide the window by subtracting the first element and adding the next.", cost: 10 },
    ],
    starterCode: `int[] chests = {1, 5, 2, 8, 3};
int k = 3;
int maxSum = 0;
// Your code here:

System.out.println("Max sum: " + maxSum);
`,
    hazards: [
      { type: "spikes", x: 20 },
      { type: "spikes", x: 60 }
    ],
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      if (logs.some(l => l.includes('15'))) return { passed: true, message: '✨ Maximum gold window found!', testsRun: 1, testsPassed: 1 };
      return { 
        passed: false, message: 'Sliding window means continuous chests only. Mimic chest activates!', 
        testsRun: 1, testsPassed: 0,
        commands: [{ type: 'SPAWN_HAZARD', hazardType: 'enemy', x: 40 }, { type: 'TAKE_DAMAGE', amount: 1 }]
      };
    },
    guide: {
      intro: "Welcome to this challenge! Listen carefully to the instructions.",
      objectiveHelp: "Your goal is to solve the problem described in the instructions.",
      codeHint: "Check the hints panel if you need more help with the code.",
      gameplayHint: "Remember to watch the character animation for clues.",
      errorHint: "Your code has an error or didn't produce the correct result. Check the console.",
      successMessage: "Excellent work! You solved it!"
    },
    sceneType: 'treasure_hall',
    levelActionConfig: { requiredTool: 'scanner', actionAnimation: 'scan', successEffect: 'magic_sparkles' }
  },
  {
    id: 4, worldId: 'arrays-strings', title: "Mirror Shield Palindrome",
    difficulty: 'easy', concepts: ['String', 'Palindrome'],
    story: {
      scenario: "A magic beam attacks! The mirror shield reflects magic only if the spell is a palindrome.",
      objective: "Check if the string `spell` is a palindrome. Print 'YES' or 'NO'.",
      controls: ['String.length()', 'charAt()', 'for loop'],
    },
    relics: [
      { name: 'R', emoji: '🔤', x: 10, y: 30 },
      { name: 'A', emoji: '🔤', x: 25, y: 45 },
      { name: 'D', emoji: '🔤', x: 40, y: 60 },
      { name: 'A', emoji: '🔤', x: 55, y: 45 },
      { name: 'R', emoji: '🔤', x: 70, y: 30 }
    ],
    hints: [
      { text: "Compare characters from the beginning and the end of the string.", cost: 0 },
      { text: "Use spell.charAt(i) to check individual letters.", cost: 10 },
    ],
    starterCode: `String spell = "RADAR";
// Your code here:

`,
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      if (logs.some(l => l.includes('YES'))) return { passed: true, message: '✨ Shield activated!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'RADAR is a palindrome. Print YES.', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "Welcome to this challenge! Listen carefully to the instructions.",
      objectiveHelp: "Your goal is to solve the problem described in the instructions.",
      codeHint: "Check the hints panel if you need more help with the code.",
      gameplayHint: "Remember to watch the character animation for clues.",
      errorHint: "Your code has an error or didn't produce the correct result. Check the console.",
      successMessage: "Excellent work! You solved it!"
    },
    sceneType: 'mirror_hall',
    levelActionConfig: { requiredTool: 'sword', actionAnimation: 'swing', successEffect: 'slash' }
  },
  {
    id: 5, worldId: 'arrays-strings', title: "Anagram Runes",
    difficulty: 'medium', concepts: ['String', 'Anagram', 'Sorting'],
    story: {
      scenario: "Two rune towers show LISTEN and SILENT. Prove they are anagrams to unlock the spell door.",
      objective: "Check if `s1` and `s2` are anagrams. Print 'TRUE' or 'FALSE'.",
      controls: ['Arrays.sort()', 'equals()', 'char[]'],
    },
    relics: [{ name: 'LISTEN', emoji: '📜', x: 25, y: 50 }, { name: 'SILENT', emoji: '📜', x: 65, y: 35 }],
    hints: [
      { text: "Convert strings to char arrays, sort them, and check if they are equal.", cost: 10 },
    ],
    starterCode: `String s1 = "LISTEN";
String s2 = "SILENT";
// Your code here:

`,
    hazards: [
      { type: "poison", x: 45 }
    ],
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      if (logs.some(l => l.toUpperCase().includes('TRUE'))) return { passed: true, message: '✨ The scripts match!', testsRun: 1, testsPassed: 1 };
      return { 
        passed: false, message: 'Anagrams must have the same letters with the same frequency. Cursed rune flashes!', 
        testsRun: 1, testsPassed: 0,
        commands: [{ type: 'TAKE_DAMAGE', amount: 1 }]
      };
    },
    guide: {
      intro: "Welcome to this challenge! Listen carefully to the instructions.",
      objectiveHelp: "Your goal is to solve the problem described in the instructions.",
      codeHint: "Check the hints panel if you need more help with the code.",
      gameplayHint: "Remember to watch the character animation for clues.",
      errorHint: "Your code has an error or didn't produce the correct result. Check the console.",
      successMessage: "Excellent work! You solved it!"
    },
    sceneType: 'rune_archive',
    levelActionConfig: { requiredTool: 'magic_device', actionAnimation: 'scan', successEffect: 'magic_sparkles' }
  },
  {
    id: 6, worldId: 'arrays-strings', title: "Purging the Duplicates",
    difficulty: 'medium', concepts: ['Array', 'Duplicates', 'HashSet'],
    story: {
      scenario: "The royal ledger archive has duplicate tiles. Clear the duplicates so the unique tiles become stepping stones.",
      objective: "Print the unique values from the `ledger` array. (Order does not matter).",
      controls: ['HashSet', 'for loop'],
    },
    relics: [
      { name: '1', emoji: '📄', x: 20, y: 60 },
      { name: '2', emoji: '📄', x: 40, y: 50 },
      { name: '2', emoji: '📄', x: 60, y: 40 },
      { name: '3', emoji: '📄', x: 80, y: 30 }
    ],
    hints: [
      { text: "A HashSet automatically removes duplicates.", cost: 0 },
      { text: "Add all elements to a HashSet and print them.", cost: 10 },
    ],
    starterCode: `int[] ledger = {1, 2, 2, 3, 4, 4, 5};
// Your code here:

`,
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      const joined = logs.join(' ');
      if (joined.includes('1') && joined.includes('2') && joined.includes('3') && joined.includes('4') && joined.includes('5')) return { passed: true, message: '✨ Ledger cleaned!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'Print the unique values: 1 2 3 4 5', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "Welcome to this challenge! Listen carefully to the instructions.",
      objectiveHelp: "Your goal is to solve the problem described in the instructions.",
      codeHint: "Check the hints panel if you need more help with the code.",
      gameplayHint: "Remember to watch the character animation for clues.",
      errorHint: "Your code has an error or didn't produce the correct result. Check the console.",
      successMessage: "Excellent work! You solved it!"
    },
    sceneType: 'royal_ledger',
    levelActionConfig: { requiredTool: 'sword', actionAnimation: 'swing', successEffect: 'slash' }
  },
  {
    id: 7, worldId: 'arrays-strings', title: "The Heaviest Stone",
    difficulty: 'easy', concepts: ['Array', 'Max', 'Comparison'],
    story: {
      scenario: "Find the heaviest stone in the quarry to build the castle wall.",
      objective: "Find the maximum value in the `stones` array and print it.",
      controls: ['for loop', 'if statement'],
    },
    relics: [
      { id: 'Boulder_15', name: '15', emoji: '🪨', x: 20, y: 50 },
      { id: 'Boulder_42', name: '42', emoji: '🪨', x: 50, y: 30 },
      { id: 'Boulder_7', name: '7', emoji: '🪨', x: 80, y: 60 }
    ],
    hints: [
      { text: "Initialize max to the first element, then compare each subsequent element.", cost: 0 },
      { text: "if (stones[i] > max) max = stones[i];", cost: 10 },
    ],
    starterCode: `int[] stones = {15, 42, 7, 25};
int maxStone = stones[0];
// Your code here:

System.out.println("Heaviest: " + maxStone);
`,
    hazards: [
      { type: "spikes", x: 30 },
      { type: "spikes", x: 70 }
    ],
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      if (logs.some(l => l.includes('42'))) return { passed: true, message: '✨ You found the heaviest stone!', testsRun: 1, testsPassed: 1 };
      return { 
        passed: false, message: 'Compare every value before choosing max. Falling rocks hazard damages player!', 
        testsRun: 1, testsPassed: 0,
        commands: [{ type: 'SPAWN_HAZARD', hazardType: 'fire', x: 50 }, { type: 'TAKE_DAMAGE', amount: 1 }]
      };
    },
    guide: {
      intro: "Welcome to this challenge! Listen carefully to the instructions.",
      objectiveHelp: "Your goal is to solve the problem described in the instructions.",
      codeHint: "Check the hints panel if you need more help with the code.",
      gameplayHint: "Remember to watch the character animation for clues.",
      errorHint: "Your code has an error or didn't produce the correct result. Check the console.",
      successMessage: "Excellent work! You solved it!"
    },
    sceneType: 'quarry',
    levelActionConfig: { requiredTool: 'hammer', actionAnimation: 'swing', successEffect: 'harvest_particles' }
  },
  {
    id: 8, worldId: 'arrays-strings', title: "Reversing the Row",
    difficulty: 'medium', concepts: ['Array', 'Reverse', 'In-place'],
    story: {
      scenario: "The garden was planted backwards! Reverse the array of flowers.",
      objective: "Print the elements of the `flowers` array in reverse order.",
      controls: ['for loop', 'array.length'],
    },
    relics: [
      { name: 'ROSE', emoji: '🌹', x: 20 },
      { name: 'LILY', emoji: '🪷', x: 50 },
      { name: 'TULIP', emoji: '🌷', x: 80 }
    ],
    hints: [
      { text: "Loop through the array starting from the last index down to 0.", cost: 0 },
    ],
    starterCode: `String[] flowers = {"ROSE", "LILY", "TULIP"};
// Your code here:

`,
    hazards: [
      { type: "poison", x: 35 },
      { type: "poison", x: 65 }
    ],
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      const joined = logs.join(' ');
      if (joined.includes('TULIP') && joined.indexOf('TULIP') < joined.indexOf('ROSE')) return { passed: true, message: '✨ Garden sorted!', testsRun: 1, testsPassed: 1 };
      return { 
        passed: false, message: 'Swap first and last using two pointers. Bee swarm attacks!', 
        testsRun: 1, testsPassed: 0,
        commands: [{ type: 'SPAWN_HAZARD', hazardType: 'enemy', x: 50 }, { type: 'TAKE_DAMAGE', amount: 1 }]
      };
    },
    guide: {
      intro: "Welcome to this challenge! Listen carefully to the instructions.",
      objectiveHelp: "Your goal is to solve the problem described in the instructions.",
      codeHint: "Check the hints panel if you need more help with the code.",
      gameplayHint: "Remember to watch the character animation for clues.",
      errorHint: "Your code has an error or didn't produce the correct result. Check the console.",
      successMessage: "Excellent work! You solved it!"
    },
    sceneType: 'garden',
    levelActionConfig: { requiredTool: 'magic_device', actionAnimation: 'scan', successEffect: 'magic_sparkles' }
  },
  {
    id: 9, worldId: 'arrays-strings', title: "The Missing Number",
    difficulty: 'medium', concepts: ['Array', 'Math'],
    story: {
      scenario: "A magical artifact is missing from the sequence.",
      objective: "Find the missing number in the array containing 1 to 5.",
      controls: ['for loop', 'Sum formula'],
    },
    relics: [
      { id: 'Artifact_1', name: '1', emoji: '🪨', x: 20, y: 40 },
      { id: 'Artifact_2', name: '2', emoji: '🪨', x: 50, y: 40 }
    ],
    hints: [
      { text: "Calculate the expected sum using n*(n+1)/2 and subtract the actual sum.", cost: 0 },
    ],
    starterCode: `int[] arr = {1, 2, 4, 5};
// Your code here:

`,
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      if (logs.some(l => l.includes('3'))) return { passed: true, message: '✨ Found the missing artifact!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'The missing number is 3.', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "Welcome to this challenge! Listen carefully to the instructions.",
      objectiveHelp: "Your goal is to solve the problem described in the instructions.",
      codeHint: "Check the hints panel if you need more help with the code.",
      gameplayHint: "Remember to watch the character animation for clues.",
      errorHint: "Your code has an error or didn't produce the correct result. Check the console.",
      successMessage: "Excellent work! You solved it!"
    },
    sceneType: 'quarry',
    levelActionConfig: { requiredTool: 'hammer', actionAnimation: 'swing', successEffect: 'harvest_particles' }
  },
  {
    id: 10, worldId: 'arrays-strings', title: "The Longest Substring",
    difficulty: 'hard', concepts: ['String', 'Sliding Window', 'HashSet'],
    story: {
      scenario: "Find the longest sequence of unique magical symbols in the inscription.",
      objective: "Find the length of the longest substring without repeating characters in `str`. Print the length.",
      controls: ['HashSet', 'for loop', 'Math.max'],
    },
    relics: [
      { name: 'A', emoji: '🔮', x: 20, y: 50 },
      { name: 'B', emoji: '🔮', x: 40, y: 35 },
      { name: 'C', emoji: '🔮', x: 60, y: 50 },
      { name: 'A', emoji: '🔮', x: 80, y: 35 }
    ],
    hints: [
      { text: "Use a sliding window. Expand the right side, and if you see a duplicate, shrink from the left.", cost: 15 },
    ],
    starterCode: `String str = "abcabcbb";
int maxLength = 0;
// Your code here:

System.out.println("Max length: " + maxLength);
`,
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      if (logs.some(l => l.includes('3'))) return { passed: true, message: '✨ You found the longest sequence! (abc)', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'The longest substring is "abc" with length 3.', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "Welcome to this challenge! Listen carefully to the instructions.",
      objectiveHelp: "Your goal is to solve the problem described in the instructions.",
      codeHint: "Check the hints panel if you need more help with the code.",
      gameplayHint: "Remember to watch the character animation for clues.",
      errorHint: "Your code has an error or didn't produce the correct result. Check the console.",
      successMessage: "Excellent work! You solved it!"
    },
    sceneType: 'enchanted_cave',
    levelActionConfig: { requiredTool: 'scanner', actionAnimation: 'scan', successEffect: 'magic_sparkles' }
  }
];
