export const stackProblems = [
  // Level 1
  {
    id: 1, worldId: 'stacks-queues', title: "The Relic Vault", difficulty: 'easy', concepts: ['Stack', 'Push', 'LIFO'],
    story: {
      scenario: "Ancient magic in this golden castle requires you to secure the sacred jewels using the Stack Tower.",
      objective: "Collect the Ruby, Emerald, and Sapphire relics and store them in the stack. The Golden Vault Door will open only if the most recently stored relic is Sapphire.",
      controls: ['push(item)', 'pop()', 'peek()'],
    },
    relics: [ { name: 'Ruby', emoji: '♦️', x: 20 }, { name: 'Emerald', emoji: '❇️', x: 45 }, { name: 'Sapphire', emoji: '💎', x: 70 } ],
    hints: [ { text: 'Try pushing the relics into the stack in any order.', cost: 0 }, { text: 'Remember: Last In, First Out! The last item you push will be on top.', cost: 10 } ],
    starterCode: `// Use stack.push(item) to add relics to the Stack Tower
// Available relics: "Ruby", "Emerald", "Sapphire"
// Make sure "Sapphire" is pushed last so it sits on top!

// Write your code here:

`,
    validate: (stack, operations, context) => {
      const items = stack.getItems();
      if (!items.includes('Ruby') || !items.includes('Emerald') || !items.includes('Sapphire')) return { passed: false, message: 'Push all 3 relics!', testsRun: 1, testsPassed: 0 };
      if (stack.peek() !== 'Sapphire') return { 
        passed: false, 
        message: 'Sapphire must be on top! A trap was triggered!', 
        testsRun: 2, 
        testsPassed: 1,
        commands: [{ type: 'SPAWN_HAZARD', hazardType: 'spikes', x: 75 }, { type: 'TAKE_DAMAGE', amount: 1 }]
      };
      return { passed: true, message: '✨ The vault door opens!', testsRun: 2, testsPassed: 2 };
    },
    guideText: 'Use push() to store relics.\nLast In, First Out!', sceneType: 'temple',
    levelActionConfig: { requiredTool: 'magic_device', actionAnimation: 'poke', successEffect: 'magic_sparkles' }
  },
  // Level 2
  {
    id: 2, worldId: 'stacks-queues', title: "The Reverse Spell", difficulty: 'easy', concepts: ['Stack', 'Push', 'Pop', 'Reversal'],
    story: {
      scenario: "A magical inscription reads backwards. Use the stack to reverse the word and break the spell.",
      objective: "Push each letter of 'HELLO' onto the stack, then pop all letters to spell 'OLLEH'.",
      controls: ['push(item)', 'pop()', 'peek()', 'isEmpty()'],
    },
    relics: [ { id: 'H_1', name: 'H', emoji: '🪨', x: 10 }, { id: 'E_1', name: 'E', emoji: '🪨', x: 30 }, { id: 'L_1', name: 'L', emoji: '🪨', x: 50 }, { id: 'L_2', name: 'L', emoji: '🪨', x: 70 }, { id: 'O_1', name: 'O', emoji: '🪨', x: 90 } ],
    hints: [ { text: 'Iterate over the word "HELLO". Push each char to the stack. Then pop them all to get the reversed string.', cost: 10 } ],
    starterCode: `const word = "HELLO";
let reversed = "";

// 1. Push each character of "HELLO" into the stack:
// Write your code here:


// 2. Pop all characters from the stack into 'reversed':
// Write your code here:


console.log("Reversed: ", reversed);
`,
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      // Accept any solution that outputs OLLEH anywhere in the logs
      if (logs.some(l => l.includes('OLLEH'))) return { passed: true, message: '✨ Spell broken!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'The reversed word should be exactly OLLEH.', testsRun: 1, testsPassed: 0 };
    },
    guideText: 'Push chars one by one,\nthen pop to reverse!', sceneType: 'library',
    levelActionConfig: { requiredTool: 'magic_device', actionAnimation: 'poke', successEffect: 'magic_sparkles' }
  },
  // Level 3
  {
    id: 3, worldId: 'stacks-queues', title: "Balanced Runes", difficulty: 'medium', concepts: ['Stack', 'Matching', 'Brackets'],
    story: {
      scenario: "Ancient runes on the wall must be balanced to open the passage.",
      objective: "Check if the bracket string '({[]})' is balanced using a stack. Print 'BALANCED'.",
      controls: ['push(item)', 'pop()', 'peek()', 'isEmpty()'],
    },
    relics: [ { id: 'bracket_1', name: '(', emoji: '☀️', x: 10 }, { id: 'bracket_2', name: '{', emoji: '☀️', x: 25 }, { id: 'bracket_3', name: '[', emoji: '☀️', x: 40 }, { id: 'bracket_4', name: ']', emoji: '🌙', x: 55 }, { id: 'bracket_5', name: '}', emoji: '🌙', x: 70 }, { id: 'bracket_6', name: ')', emoji: '🌙', x: 85 } ],
    hints: [ { text: 'For each opening bracket, push it. For each closing bracket, pop and check if it matches.', cost: 15 } ],
    starterCode: `const brackets = "({[]})";
const matchMap = { ')': '(', '}': '{', ']': '[' };

// Write your code here:
// Loop through each character in 'brackets'.
// If it is an opening bracket ( ( { [ ), push it onto the stack.
// If it is a closing bracket ( ) } ] ), pop from the stack and check if it matches.


if (stack.isEmpty()) console.log("BALANCED");
else console.log("UNBALANCED");
`,
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      if (logs.some(l => l.includes('BALANCED') && !l.includes('UNBALANCED'))) return { passed: true, message: '✨ Passage opens!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'Print BALANCED for valid brackets.', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "Welcome to this challenge! Listen carefully to the instructions.",
      objectiveHelp: "Your goal is to solve the problem described in the instructions.",
      codeHint: "Check the hints panel if you need more help with the code.",
      gameplayHint: "Remember to watch the character animation for clues.",
      errorHint: "Your code has an error or didn't produce the correct result. Check the console.",
      successMessage: "Excellent work! You solved it!"
    },
    sceneType: 'dungeon_scale',
    levelActionConfig: { requiredTool: 'scanner', actionAnimation: 'scan', successEffect: 'magic_sparkles' }
  },
  // Level 4
  {
    id: 4, worldId: 'stacks-queues', title: "The Undo Potion", difficulty: 'medium', concepts: ['Stack', 'Undo'],
    story: {
      scenario: "The alchemist's potion recipe requires precise steps. Undo mistakes using pop.",
      objective: "Push Water, Herb, Poison. Undo the Poison (pop it), then add Honey. The final stack should have [Water, Herb, Honey].",
      controls: ['push(item)', 'pop()'],
    },
    relics: [ { name: 'Water', emoji: '💧', x: 15 }, { name: 'Herb', emoji: '🌿', x: 35 }, { name: 'Poison', emoji: '☠️', x: 60 }, { name: 'Honey', emoji: '🍯', x: 85 } ],
    hints: [ { text: 'Push "Water", "Herb", "Poison". Then call pop() to remove Poison. Then push "Honey".', cost: 0 } ],
    starterCode: `// Brew the potion!
// Push ingredients in order: "Water", "Herb", "Poison"
// Undo the mistake (pop the Poison), then add "Honey"

// Write your code here:

`,
    validate: (stack) => {
      const items = stack.getItems();
      if (items.includes('Poison')) return { 
        passed: false, 
        message: 'Poison is still in the cauldron! It exploded!', 
        testsRun: 1, 
        testsPassed: 0,
        commands: [{ type: 'SPAWN_HAZARD', hazardType: 'poison', x: 60 }, { type: 'TAKE_DAMAGE', amount: 2 }]
      };
      if (!items.includes('Herb')) return { passed: false, message: 'You forgot the Herb!', testsRun: 2, testsPassed: 1 };
      if (!items.includes('Water')) return { passed: false, message: 'You forgot the Water!', testsRun: 2, testsPassed: 1 };
      if (stack.peek() === 'Honey') return { passed: true, message: '✨ Perfect potion!', testsRun: 3, testsPassed: 3 };
      return { passed: false, message: 'Stack should have [Water, Herb, Honey] with Honey on top.', testsRun: 3, testsPassed: 2 };
    },
    guideText: 'Pour ingredients, undo with pop(),\nthen pour the right one!', sceneType: 'laboratory',
    levelActionConfig: { requiredTool: 'magic_device', actionAnimation: 'poke', successEffect: 'magic_sparkles' }
  },
  // Level 5
  {
    id: 5, worldId: 'stacks-queues', title: "The Twin Stack Bridge", difficulty: 'medium', concepts: ['Stack', 'Queue'],
    story: {
      scenario: "To cross the bridge, you need a queue — but you only have two stacks!",
      objective: "Enqueue 1, 2, 3 using two stacks (stack and stack2). Then dequeue and print them in FIFO order: 1, 2, 3.",
      controls: ['push(item)', 'pop()'],
    },
    relics: [ { name: '1', emoji: '🪵', x: 20 }, { name: '2', emoji: '🪵', x: 50 }, { name: '3', emoji: '🪵', x: 80 } ],
    hints: [ { text: 'Push 1, 2, 3 onto stack. Then transfer all to stack2 by popping from stack and pushing to stack2. Then pop from stack2 to get FIFO order.', cost: 10 } ],
    starterCode: `// Simulate a Queue using two Stacks!
// Enqueue: push items onto stack
stack.push("1");
stack.push("2");
stack.push("3");

// Dequeue: transfer to stack2, then pop from stack2 for FIFO order
// Write your code here:


// Print each dequeued item:

`,
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      // Check that items appear in FIFO order in the logs
      const allText = logs.join(' ');
      const has1 = allText.includes('1');
      const has2 = allText.includes('2');
      const has3 = allText.includes('3');
      if (has1 && has2 && has3) {
        // Check order: first occurrence of 1 before 2 before 3
        const pos1 = allText.indexOf('1');
        const pos2 = allText.indexOf('2');
        const pos3 = allText.indexOf('3');
        if (pos1 < pos2 && pos2 < pos3) return { passed: true, message: '✨ Bridge built!', testsRun: 1, testsPassed: 1 };
      }
      return { passed: false, message: 'Print items in FIFO order: 1, 2, 3', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "Welcome to this challenge! Listen carefully to the instructions.",
      objectiveHelp: "Your goal is to solve the problem described in the instructions.",
      codeHint: "Check the hints panel if you need more help with the code.",
      gameplayHint: "Remember to watch the character animation for clues.",
      errorHint: "Your code has an error or didn't produce the correct result. Check the console.",
      successMessage: "Excellent work! You solved it!"
    },
    sceneType: 'chasm',
    levelActionConfig: { requiredTool: 'hammer', actionAnimation: 'swing', successEffect: 'magic_sparkles' }
  },
  // Level 6
  {
    id: 6, worldId: 'stacks-queues', title: "The Palindrome Gate", difficulty: 'medium', concepts: ['Stack', 'Palindrome'],
    story: {
      scenario: "The gate will only open for palindromic words.",
      objective: "Check if 'RACECAR' is a palindrome using the stack. Print 'PALINDROME' if it is.",
      controls: ['push(item)', 'pop()'],
    },
    relics: [ { name: 'R', emoji: '🛡️', x: 10 }, { name: 'A', emoji: '🛡️', x: 22 }, { name: 'C', emoji: '🛡️', x: 34 }, { name: 'E', emoji: '🛡️', x: 46 }, { name: 'C', emoji: '🛡️', x: 58 }, { name: 'A', emoji: '🛡️', x: 70 }, { name: 'R', emoji: '🛡️', x: 82 } ],
    hints: [ { text: 'Push all chars of "RACECAR", pop all to get reversed, compare strings.', cost: 10 } ],
    starterCode: `const word = "RACECAR";

// 1. Push all characters of "RACECAR" into the stack:
// Write your code here:


let reversed = "";
// 2. Pop all characters from the stack into 'reversed':
// Write your code here:


// 3. Compare and print result:
// Write your code here:

`,
    validate: (stack, operations, context) => {
      if ((context.logs || []).some(l => l.toUpperCase().includes('PALINDROME'))) return { passed: true, message: '✨ Gate opens!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'Print PALINDROME if the word matches its reverse.', testsRun: 1, testsPassed: 0 };
    },
    guideText: 'Reverse with stack,\ncompare with original!', sceneType: 'castle_gate',
    levelActionConfig: { requiredTool: 'hammer', actionAnimation: 'swing', successEffect: 'magic_sparkles' }
  },
  // Level 7
  {
    id: 7, worldId: 'stacks-queues', title: "The Expression Altar", difficulty: 'hard', concepts: ['Stack', 'Postfix'],
    story: {
      scenario: "The altar requires you to evaluate a sacred expression written in postfix notation.",
      objective: "Evaluate the postfix expression '3 4 + 2 *' = 14. Print the result.",
      controls: ['push(item)', 'pop()'],
    },
    relics: [ { name: '3', emoji: '💀', x: 15 }, { name: '4', emoji: '💀', x: 30 }, { name: '+', emoji: '➕', x: 45 }, { name: '2', emoji: '💀', x: 60 }, { name: '*', emoji: '✖️', x: 80 } ],
    hints: [ { text: 'For numbers: push. For operators: pop two operands, compute, push result.', cost: 10 } ],
    starterCode: `const expression = ["3", "4", "+", "2", "*"];

// Evaluate the postfix expression:
// Write your code here:
// For each token:
//   If it is a number, push it onto the stack.
//   If it is an operator (+, -, *, /):
//     Pop two operands, compute the result, push it back.

// Print the final result:

`,
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      // Check that the final output contains 14
      if (logs.some(l => {
        // Match 14 as a standalone number, not part of another number like 140 or 214
        return (/\b14\b/).test(l);
      })) return { passed: true, message: '✨ Altar activated!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'The postfix expression 3 4 + 2 * should evaluate to 14.', testsRun: 1, testsPassed: 0 };
    },
    guideText: 'Push numbers, pop and\ncompute for operators.', sceneType: 'ritual_temple',
    levelActionConfig: { requiredTool: 'magic_device', actionAnimation: 'scan', successEffect: 'magic_sparkles' }
  },
  // Level 8
  {
    id: 8, worldId: 'stacks-queues', title: "Next Greater Element", difficulty: 'hard', concepts: ['Monotonic Stack'],
    story: {
      scenario: "The towering golems only yield to someone taller than them to their right.",
      objective: "For array [4, 1, 2, 5], find the next greater element for each. Print the result array [5, 2, 5, -1].",
      controls: ['Monotonic Stack'],
    },
    relics: [ { name: '4', emoji: '🪨', x: 20 }, { name: '1', emoji: '🪨', x: 40 }, { name: '2', emoji: '🪨', x: 60 }, { name: '5', emoji: '🪨', x: 80 } ],
    hints: [ { text: 'Iterate backwards. Maintain a stack of elements. Pop smaller elements. The top of the stack is the next greater element.', cost: 15 } ],
    starterCode: `const arr = [4, 1, 2, 5];
const result = new Array(arr.length).fill(-1);

// Find the Next Greater Element for each position:
// Write your code here:
// Hint: Iterate from right to left.
// For each element, pop smaller elements from the stack.
// If the stack is not empty, the top is the next greater element.
// Push the current element onto the stack.


console.log(result);
`,
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      // Accept any format that contains the correct answer: [5, 2, 5, -1]
      if (logs.some(l => {
        const normalized = l.replace(/\s/g, '');
        return normalized.includes('5,2,5,-1') || normalized.includes('[5,2,5,-1]');
      })) return { passed: true, message: '✨ Golems yield!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'Result should be [5, 2, 5, -1]', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "Welcome to this challenge! Listen carefully to the instructions.",
      objectiveHelp: "Your goal is to solve the problem described in the instructions.",
      codeHint: "Check the hints panel if you need more help with the code.",
      gameplayHint: "Remember to watch the character animation for clues.",
      errorHint: "Your code has an error or didn't produce the correct result. Check the console.",
      successMessage: "Excellent work! You solved it!"
    },
    sceneType: 'mine',
    levelActionConfig: { requiredTool: 'pickaxe', actionAnimation: 'swing', successEffect: 'magic_sparkles' }
  },
  // Level 9
  {
    id: 9, worldId: 'stacks-queues', title: "The Min Stack", difficulty: 'medium', concepts: ['Stack', 'Minimum'],
    story: {
      scenario: "The vault requires you to always know the smallest treasure you've stored in O(1) time.",
      objective: "Implement a Min Stack. Push values [5, 2, 7, 1]. Print the minimum value at the end (should be 1).",
      controls: ['Two Stacks'],
    },
    relics: [ { name: '5', emoji: '📦', x: 10 }, { name: '2', emoji: '📦', x: 30 }, { name: '7', emoji: '📦', x: 50 }, { name: '1', emoji: '📦', x: 70 } ],
    hints: [ { text: 'Use stack for values, and stack2 to keep track of the minimums. Push to stack2 only if the value is <= the current min.', cost: 10 } ],
    starterCode: `const values = [5, 2, 7, 1];

// Implement Min Stack:
// Use 'stack' for values, 'stack2' for tracking minimums.
// Write your code here:
// For each value:
//   Push it onto stack.
//   If stack2 is empty OR value <= stack2.peek(), push onto stack2.
//   Otherwise, push stack2.peek() again onto stack2.


// Print the minimum value:
console.log("Min is:", stack2.peek());
`,
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      // Check that the minimum value 1 is printed, and not just any random "1"
      if (logs.some(l => l.toLowerCase().includes('min') && l.includes('1'))) return { passed: true, message: '✨ Vault secured!', testsRun: 1, testsPassed: 1 };
      // Also accept if stack2.peek() is simply "1"
      if (context.stack2 && context.stack2.peek && context.stack2.peek() !== undefined) {
        const minVal = String(context.stack2.peek());
        if (minVal === '1' || minVal.endsWith('_1')) return { passed: true, message: '✨ Vault secured!', testsRun: 1, testsPassed: 1 };
      }
      return { passed: false, message: 'The minimum value should be 1.', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "Welcome to this challenge! Listen carefully to the instructions.",
      objectiveHelp: "Your goal is to solve the problem described in the instructions.",
      codeHint: "Check the hints panel if you need more help with the code.",
      gameplayHint: "Remember to watch the character animation for clues.",
      errorHint: "Your code has an error or didn't produce the correct result. Check the console.",
      successMessage: "Excellent work! You solved it!"
    },
    sceneType: 'treasure_vault',
    levelActionConfig: { requiredTool: 'key', actionAnimation: 'poke', successEffect: 'magic_sparkles' }
  },
  // Level 10
  {
    id: 10, worldId: 'stacks-queues', title: "Daily Temperatures", difficulty: 'hard', concepts: ['Monotonic Stack'],
    story: {
      scenario: "The climate here is chaotic. Find out how many days you must wait for a warmer temperature.",
      objective: "For temps [73, 74, 75, 71, 69, 72, 76, 73], print the array of wait days: [1,1,4,2,1,1,0,0].",
      controls: ['Monotonic Stack'],
    },
    relics: [ { name: '73', emoji: '🌡️', x: 10 }, { name: '74', emoji: '🌡️', x: 20 }, { name: '75', emoji: '🌡️', x: 30 }, { name: '71', emoji: '🌡️', x: 40 }, { name: '69', emoji: '🌡️', x: 50 }, { name: '72', emoji: '🌡️', x: 60 }, { name: '76', emoji: '❄️', x: 70 }, { name: '73', emoji: '🌡️', x: 80 } ],
    hints: [ { text: 'Store indices in the stack. If current temp > temps[stack.peek()], pop and calculate the index difference.', cost: 20 } ],
    starterCode: `const temps = [73, 74, 75, 71, 69, 72, 76, 73];
const wait = new Array(temps.length).fill(0);

// Find how many days until a warmer temperature:
// Write your code here:
// Use the stack to store indices.
// For each day, while the stack is not empty AND
// the current temp > temps[stack.peek()]:
//   Pop the index and set wait[poppedIndex] = currentIndex - poppedIndex.
// Push the current index onto the stack.


console.log(wait);
`,
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      if (logs.some(l => {
        const normalized = l.replace(/\s/g, '');
        return normalized.includes('1,1,4,2,1,1,0,0') || normalized.includes('[1,1,4,2,1,1,0,0]');
      })) return { passed: true, message: '✨ Weather predicted!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'Output should be [1,1,4,2,1,1,0,0]', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "Welcome to this challenge! Listen carefully to the instructions.",
      objectiveHelp: "Your goal is to solve the problem described in the instructions.",
      codeHint: "Check the hints panel if you need more help with the code.",
      gameplayHint: "Remember to watch the character animation for clues.",
      errorHint: "Your code has an error or didn't produce the correct result. Check the console.",
      successMessage: "Excellent work! You solved it!"
    },
    sceneType: 'snowy_peak',
    levelActionConfig: { requiredTool: 'scanner', actionAnimation: 'scan', successEffect: 'magic_sparkles' }
  }
];
