export const linkedListProblems = [
  // Level 1
  {
    id: 1, worldId: 'linked-lists', title: "Create a Chain", difficulty: 'easy', concepts: ['Linked List', 'Node', 'Pointer'],
    story: {
      scenario: "In the desert, each ruin points to the next. Create your first chain of nodes.",
      objective: "Create 3 nodes with values 1 → 2 → 3. Traverse and print each value.",
      controls: ['{ val, next }', 'while loop'],
    },
    relics: [{ name: '1', emoji: '1️⃣', x: 20 }, { name: '2', emoji: '2️⃣', x: 50 }, { name: '3', emoji: '3️⃣', x: 80 }],
    hints: [
      { text: "Create node objects: { val: 1, next: null }. Link them with n1.next = n2.", cost: 0 },
      { text: "let head={val:1,next:{val:2,next:{val:3,next:null}}}; let c=head; while(c){console.log(c.val);c=c.next;}", cost: 15 },
    ],
    starterCode: `// Create a linked list: 1 → 2 → 3
// Each node: { val: value, next: pointer }
const head = { val: 1, next: null };

// Link the nodes:

// Traverse and print:
let current = head;
while (current) {
  console.log(current.val);
  current = current.next;
}
`,
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      const nums = logs.map(l => parseInt(l)).filter(n => !isNaN(n));
      if (nums.length >= 3 && nums[0] === 1 && nums[1] === 2 && nums[2] === 3) return { passed: true, message: '✨ Chain forged! 1 → 2 → 3!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'Print 1, 2, 3 in order by traversing the list!', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "Welcome to this challenge! Listen carefully to the instructions.",
      objectiveHelp: "Your goal is to solve the problem described in the instructions.",
      codeHint: "Check the hints panel if you need more help with the code.",
      gameplayHint: "Remember to watch the character animation for clues.",
      errorHint: "Your code has an error or didn't produce the correct result. Check the console.",
      successMessage: "Excellent work! You solved it!"
    },
    sceneType: 'desert_ruins',
    levelActionConfig: { requiredTool: 'hammer', actionAnimation: 'poke', successEffect: 'magic_sparkles' }
  },
  // Level 2
  {
    id: 2, worldId: 'linked-lists', title: "Count the Links", difficulty: 'easy', concepts: ['Linked List', 'Traversal', 'Count'],
    story: {
      scenario: "Count every ruin in the chain to know its total length.",
      objective: "Given a linked list, count the number of nodes. Print the count.",
      controls: ['while loop', 'counter'],
    },
    relics: [{ name: 'A', emoji: '🏛️', x: 20 }, { name: 'B', emoji: '🏛️', x: 40 }, { name: 'C', emoji: '🏛️', x: 60 }, { name: 'D', emoji: '🏛️', x: 80 }],
    hints: [
      { text: "Traverse the list, incrementing a counter for each node.", cost: 0 },
    ],
    starterCode: `const head = { val: 'A', next: { val: 'B', next: { val: 'C', next: { val: 'D', next: null } } } };
let count = 0;
// Your code here:

console.log("Length:", count);
`,
    validate: (stack, operations, context) => {
      if ((context.logs || []).some(l => l.includes('4'))) return { passed: true, message: '✨ 4 ruins counted!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'The list has 4 nodes!', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "Welcome to this challenge! Listen carefully to the instructions.",
      objectiveHelp: "Your goal is to solve the problem described in the instructions.",
      codeHint: "Check the hints panel if you need more help with the code.",
      gameplayHint: "Remember to watch the character animation for clues.",
      errorHint: "Your code has an error or didn't produce the correct result. Check the console.",
      successMessage: "Excellent work! You solved it!"
    },
    sceneType: 'ruin_counting',
    levelActionConfig: { requiredTool: 'scanner', actionAnimation: 'scan', successEffect: 'magic_sparkles' }
  },
  // Level 3
  {
    id: 3, worldId: 'linked-lists', title: "Search the Sands", difficulty: 'easy', concepts: ['Linked List', 'Search'],
    story: {
      scenario: "An ancient artifact is hidden in one of the ruins. Search for 'RUBY' in the chain.",
      objective: "Traverse the list and check if 'RUBY' exists. Print 'FOUND' or 'NOT FOUND'.",
      controls: ['while loop', 'comparison'],
    },
    relics: [{ name: 'EMERALD', emoji: '💚', x: 20 }, { name: 'RUBY', emoji: '❤️', x: 50 }, { name: 'TOPAZ', emoji: '💛', x: 80 }],
    hints: [
      { text: "Loop through, compare each val to 'RUBY'.", cost: 0 },
    ],
    starterCode: `const head = { val: 'EMERALD', next: { val: 'RUBY', next: { val: 'TOPAZ', next: null } } };
// Search for "RUBY":

`,
    validate: (stack, operations, context) => {
      if ((context.logs || []).some(l => l.includes('FOUND') && !l.includes('NOT'))) return { passed: true, message: '✨ RUBY discovered!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'RUBY exists in the list. Print FOUND.', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "Welcome to this challenge! Listen carefully to the instructions.",
      objectiveHelp: "Your goal is to solve the problem described in the instructions.",
      codeHint: "Check the hints panel if you need more help with the code.",
      gameplayHint: "Remember to watch the character animation for clues.",
      errorHint: "Your code has an error or didn't produce the correct result. Check the console.",
      successMessage: "Excellent work! You solved it!"
    },
    sceneType: 'desert_oasis',
    levelActionConfig: { requiredTool: 'scanner', actionAnimation: 'scan', successEffect: 'magic_sparkles' }
  },
  // Level 4
  {
    id: 4, worldId: 'linked-lists', title: "Append to the End", difficulty: 'easy', concepts: ['Linked List', 'Append'],
    story: {
      scenario: "A new ruin has been discovered! Append it to the end of the chain.",
      objective: "Given a list 10 → 20, append a node with value 30 at the end. Print all values.",
      controls: ['traversal', 'node creation'],
    },
    relics: [{ name: '10', emoji: '🏛️', x: 20 }, { name: '20', emoji: '🏛️', x: 50 }, { name: '30', emoji: '🆕', x: 80 }],
    hints: [
      { text: "Traverse to the last node (where next is null), then set its next to the new node.", cost: 0 },
    ],
    starterCode: `const head = { val: 10, next: { val: 20, next: null } };
const newNode = { val: 30, next: null };
// Append newNode to the end:

// Print all:
let c = head;
while (c) { console.log(c.val); c = c.next; }
`,
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      const nums = logs.map(l => parseInt(l)).filter(n => !isNaN(n));
      if (nums.length >= 3 && nums[2] === 30) return { passed: true, message: '✨ New ruin appended!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'The list should be 10 → 20 → 30.', testsRun: 1, testsPassed: 0 };
    },
    guideText: 'Find the tail node,\nthen link the new one!', sceneType: 'desert_ruins',
    levelActionConfig: { requiredTool: 'hammer', actionAnimation: 'swing', successEffect: 'magic_sparkles' }
  },
  // Level 5
  {
    id: 5, worldId: 'linked-lists', title: "Delete the Cursed Node", difficulty: 'medium', concepts: ['Linked List', 'Deletion'],
    story: {
      scenario: "One of the ruins is cursed! Remove the node with value 'CURSED' from the chain.",
      objective: "Delete the node containing 'CURSED' from the list. Print the remaining nodes.",
      controls: ['previous pointer', 'relinking'],
    },
    relics: [{ name: 'SAFE', emoji: '✅', x: 20 }, { name: 'CURSED', emoji: '☠️', x: 50 }, { name: 'SAFE', emoji: '✅', x: 80 }],
    hints: [
      { text: "Keep track of the previous node. When you find 'CURSED', set prev.next = current.next.", cost: 10 },
    ],
    starterCode: `let head = { val: 'ALPHA', next: { val: 'CURSED', next: { val: 'OMEGA', next: null } } };
// Delete the node with val "CURSED":

// Print remaining:
let c = head;
while (c) { console.log(c.val); c = c.next; }
`,
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      if (logs.some(l => l.includes('ALPHA')) && logs.some(l => l.includes('OMEGA')) && !logs.some(l => l.includes('CURSED')))
        return { passed: true, message: '✨ Curse removed!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'Remove CURSED. Print ALPHA and OMEGA.', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "Welcome to this challenge! Listen carefully to the instructions.",
      objectiveHelp: "Your goal is to solve the problem described in the instructions.",
      codeHint: "Check the hints panel if you need more help with the code.",
      gameplayHint: "Remember to watch the character animation for clues.",
      errorHint: "Your code has an error or didn't produce the correct result. Check the console.",
      successMessage: "Excellent work! You solved it!"
    },
    sceneType: 'cursed_ruins',
    levelActionConfig: { requiredTool: 'sword', actionAnimation: 'swing', successEffect: 'slash' }
  },
  // Level 6
  {
    id: 6, worldId: 'linked-lists', title: "Reverse the Chain", difficulty: 'medium', concepts: ['Linked List', 'Reversal'],
    story: {
      scenario: "The chain must be reversed to decode the hidden message.",
      objective: "Reverse the linked list 1 → 2 → 3 to become 3 → 2 → 1. Print the reversed list.",
      controls: ['prev, current, next pointers'],
    },
    relics: [{ name: '1', emoji: '🔗', x: 20 }, { name: '2', emoji: '🔗', x: 50 }, { name: '3', emoji: '🔗', x: 80 }],
    hints: [
      { text: "Use three pointers: prev=null, current=head, next. Flip current.next to prev each step.", cost: 15 },
    ],
    starterCode: `let head = { val: 1, next: { val: 2, next: { val: 3, next: null } } };
// Reverse the list:
let prev = null;
let current = head;
// Your code here:

// Print reversed:
let c = prev; // prev becomes the new head
while (c) { console.log(c.val); c = c.next; }
`,
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      const nums = logs.map(l => parseInt(l)).filter(n => !isNaN(n));
      if (nums.length >= 3 && nums[0] === 3 && nums[1] === 2 && nums[2] === 1) return { passed: true, message: '✨ Chain reversed!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'Print 3, 2, 1 in order.', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "Welcome to this challenge! Listen carefully to the instructions.",
      objectiveHelp: "Your goal is to solve the problem described in the instructions.",
      codeHint: "Check the hints panel if you need more help with the code.",
      gameplayHint: "Remember to watch the character animation for clues.",
      errorHint: "Your code has an error or didn't produce the correct result. Check the console.",
      successMessage: "Excellent work! You solved it!"
    },
    sceneType: 'mystic_ruins',
    levelActionConfig: { requiredTool: 'magic_device', actionAnimation: 'scan', successEffect: 'magic_sparkles' }
  },
  // Level 7
  {
    id: 7, worldId: 'linked-lists', title: "The Middle Ruin", difficulty: 'medium', concepts: ['Linked List', 'Fast-Slow'],
    story: {
      scenario: "Find the exact middle ruin in the chain using the slow-fast pointer technique.",
      objective: "Find the middle node of 1→2→3→4→5. Print the middle value (3).",
      controls: ['slow pointer', 'fast pointer'],
    },
    relics: [{ name: '1', emoji: '🏛️', x: 10 }, { name: '3', emoji: '📍', x: 50 }, { name: '5', emoji: '🏛️', x: 90 }],
    hints: [
      { text: "slow moves 1 step, fast moves 2 steps. When fast reaches end, slow is at middle.", cost: 10 },
    ],
    starterCode: `let head = { val: 1, next: { val: 2, next: { val: 3, next: { val: 4, next: { val: 5, next: null } } } } };
let slow = head;
let fast = head;
// Your code here:

console.log("Middle:", slow.val);
`,
    validate: (stack, operations, context) => {
      if ((context.logs || []).some(l => l.includes('3'))) return { passed: true, message: '✨ Middle found!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'The middle of 1→2→3→4→5 is 3.', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "Welcome to this challenge! Listen carefully to the instructions.",
      objectiveHelp: "Your goal is to solve the problem described in the instructions.",
      codeHint: "Check the hints panel if you need more help with the code.",
      gameplayHint: "Remember to watch the character animation for clues.",
      errorHint: "Your code has an error or didn't produce the correct result. Check the console.",
      successMessage: "Excellent work! You solved it!"
    },
    sceneType: 'mystic_ruins',
    levelActionConfig: { requiredTool: 'scanner', actionAnimation: 'scan', successEffect: 'magic_sparkles' }
  },
  // Level 8
  {
    id: 8, worldId: 'linked-lists', title: "Detect the Loop", difficulty: 'hard', concepts: ['Linked List', 'Cycle Detection'],
    story: {
      scenario: "A deadly loop traps travelers forever. Detect if the chain has a cycle.",
      objective: "Use Floyd's algorithm (slow/fast pointers). Print 'CYCLE' or 'NO CYCLE'.",
      controls: ['Floyd\'s Algorithm'],
    },
    relics: [{ name: 'START', emoji: '🟢', x: 20 }, { name: 'LOOP', emoji: '🔄', x: 60 }],
    hints: [
      { text: "If slow and fast ever meet (point to same node), there's a cycle.", cost: 15 },
    ],
    starterCode: `// Create a list with a cycle: 1→2→3→4→(back to 2)
let n1 = { val: 1, next: null };
let n2 = { val: 2, next: null };
let n3 = { val: 3, next: null };
let n4 = { val: 4, next: null };
n1.next = n2; n2.next = n3; n3.next = n4; n4.next = n2; // cycle!

let slow = n1, fast = n1;
let hasCycle = false;
// Your code here:

console.log(hasCycle ? "CYCLE" : "NO CYCLE");
`,
    validate: (stack, operations, context) => {
      if ((context.logs || []).some(l => l.includes('CYCLE') && !l.includes('NO'))) return { passed: true, message: '✨ Cycle detected!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'This list HAS a cycle. Print CYCLE.', testsRun: 1, testsPassed: 0 };
    },
    guideText: 'If slow meets fast,\nthere is a cycle!', sceneType: 'deadly_loop',
    levelActionConfig: { requiredTool: 'scanner', actionAnimation: 'scan', successEffect: 'magic_sparkles' }
  },
  // Level 9
  {
    id: 9, worldId: 'linked-lists', title: "Merge Two Chains", difficulty: 'hard', concepts: ['Linked List', 'Merge'],
    story: {
      scenario: "Two sorted chains must merge into one sorted chain.",
      objective: "Merge two sorted lists (1→3→5) and (2→4→6) into one sorted list. Print all values.",
      controls: ['comparison', 'pointer manipulation'],
    },
    relics: [{ name: '1', emoji: '🔗', x: 10 }, { name: '3', emoji: '🔗', x: 30 }, { name: '6', emoji: '🔗', x: 90 }],
    hints: [
      { text: "Compare heads of both lists. Take the smaller one and advance that pointer.", cost: 15 },
    ],
    starterCode: `let l1 = { val: 1, next: { val: 3, next: { val: 5, next: null } } };
let l2 = { val: 2, next: { val: 4, next: { val: 6, next: null } } };
// Merge into sorted list:
let dummy = { val: 0, next: null };
let tail = dummy;
// Your code here:

// Print merged:
let c = dummy.next;
while (c) { console.log(c.val); c = c.next; }
`,
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      const nums = logs.map(l => parseInt(l)).filter(n => !isNaN(n));
      if (nums.length >= 6 && nums[0] === 1 && nums[1] === 2 && nums[5] === 6) return { passed: true, message: '✨ Chains merged!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'Print 1 2 3 4 5 6 in sorted order.', testsRun: 1, testsPassed: 0 };
    },
    guideText: 'Compare heads,\ntake the smaller one!', sceneType: 'mystic_ruins',
    levelActionConfig: { requiredTool: 'hammer', actionAnimation: 'poke', successEffect: 'magic_sparkles' }
  },
  // Level 10
  {
    id: 10, worldId: 'linked-lists', title: "Nth From the End", difficulty: 'medium', concepts: ['Linked List', 'Two Pointers'],
    story: {
      scenario: "Find the treasure buried N steps from the end of the chain.",
      objective: "Find the 2nd node from the end of list 10→20→30→40→50. Print its value (40).",
      controls: ['two pointers', 'offset'],
    },
    relics: [{ name: '10', emoji: '🏛️', x: 10 }, { name: '40', emoji: '💰', x: 70 }, { name: '50', emoji: '🏛️', x: 90 }],
    hints: [
      { text: "Move the fast pointer N steps ahead first. Then move both. When fast reaches end, slow is at the answer.", cost: 10 },
    ],
    starterCode: `let head = { val: 10, next: { val: 20, next: { val: 30, next: { val: 40, next: { val: 50, next: null } } } } };
const n = 2; // 2nd from the end
let slow = head, fast = head;
// Move fast n steps ahead:

// Move both until fast reaches end:

console.log("Nth from end:", slow.val);
`,
    validate: (stack, operations, context) => {
      if ((context.logs || []).some(l => l.includes('40'))) return { passed: true, message: '✨ Treasure found at node 40!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'The 2nd from end is 40.', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "Welcome to this challenge! Listen carefully to the instructions.",
      objectiveHelp: "Your goal is to solve the problem described in the instructions.",
      codeHint: "Check the hints panel if you need more help with the code.",
      gameplayHint: "Remember to watch the character animation for clues.",
      errorHint: "Your code has an error or didn't produce the correct result. Check the console.",
      successMessage: "Excellent work! You solved it!"
    },
    sceneType: 'desert_oasis',
    levelActionConfig: { requiredTool: 'scanner', actionAnimation: 'scan', successEffect: 'magic_sparkles' }
  }
];
