export const treeProblems = [
  // Level 1
  {
    id: 1, worldId: 'trees-graphs', title: "Count the Leaves", difficulty: 'easy', concepts: ['Binary Tree', 'Leaf Nodes'],
    story: {
      scenario: "Count the number of leaf nodes (nodes with no children) in the forest.",
      objective: "Count all leaf nodes in the tree and print the count.",
      controls: ['Recursion'],
    },
    relics: [{ name: 'LEAF', emoji: '🍃', x: 20 }, { name: 'LEAF', emoji: '🍃', x: 50 }, { name: 'LEAF', emoji: '🍃', x: 80 }],
    hints: [
      { text: "A leaf has no left and no right child. Count recursively.", cost: 0 },
    ],
    starterCode: `const root = {
  val: 1,
  left: { val: 2, left: { val: 4, left: null, right: null }, right: { val: 5, left: null, right: null } },
  right: { val: 3, left: null, right: { val: 6, left: null, right: null } }
};

function countLeaves(node) {
  if (!node) return 0;
  // Your code here:

}
console.log("Leaves:", countLeaves(root));
`,
    validate: (stack, operations, context) => {
      if ((context.logs || []).some(l => l.includes('3'))) return { passed: true, message: '✨ 3 leaves counted!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'There are 3 leaf nodes (4, 5, 6).', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "Welcome to the autumn forest. The wind is blowing hard!",
      objectiveHelp: "Your task is to count every single leaf node in this tree.",
      codeHint: "A leaf node is a node with no left or right children. Use recursion!",
      gameplayHint: "Watch the golden leaves fall as you count them.",
      errorHint: "Your count is off. Make sure you only count nodes where both left and right are null.",
      successMessage: "Perfect! You've counted all the leaves before they blew away!"
    },
    sceneType: 'autumn_leaf_fall',
    levelActionConfig: { requiredTool: 'sickle', actionAnimation: 'swing', successEffect: 'harvest_particles' }
  },
  // Level 2
  {
    id: 2, worldId: 'trees-graphs', title: "Shortest Path", difficulty: 'hard', concepts: ['Graph', 'BFS', 'Shortest Path'],
    story: {
      scenario: "Find the shortest path through the enchanted maze from START to END.",
      objective: "Use BFS to find the shortest path from 'S' to 'E'. Print the distance.",
      controls: ['BFS', 'Distance Map'],
    },
    relics: [{ name: 'S', emoji: '🟢', x: 20 }, { name: 'E', emoji: '🏁', x: 80 }],
    hints: [
      { text: "BFS naturally finds shortest paths in unweighted graphs. Track distance for each node.", cost: 15 },
    ],
    starterCode: `const graph = {
  'S': ['A', 'B'],
  'A': ['S', 'C'],
  'B': ['S', 'C', 'E'],
  'C': ['A', 'B', 'E'],
  'E': ['B', 'C']
};
const dist = { 'S': 0 };
const queue = ['S'];
// BFS to find shortest distance to 'E':

console.log("Shortest distance:", dist['E']);
`,
    validate: (stack, operations, context) => {
      if ((context.logs || []).some(l => l.includes('2'))) return { passed: true, message: '✨ Shortest path found!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'Shortest path S→B→E = 2.', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "You are trapped in the Enchanted Hedge Maze! You must find the quickest way out.",
      objectiveHelp: "Find the shortest path from 'S' (Start) to 'E' (End).",
      codeHint: "Breadth-First Search (BFS) is perfect for finding the shortest path in unweighted graphs.",
      gameplayHint: "Follow the floating fairy dust to see the shortest route.",
      errorHint: "That's not the shortest path. Are you keeping track of distances correctly?",
      successMessage: "You escaped the maze in record time!"
    },
    sceneType: 'enchanted_hedge_maze',
    levelActionConfig: { requiredTool: 'magic_device', actionAnimation: 'poke', successEffect: 'magic_sparkles' }
  },
  // Level 3
  {
    id: 3, worldId: 'trees-graphs', title: "Graph Explorer", difficulty: 'medium', concepts: ['Graph', 'BFS', 'Adjacency List'],
    story: {
      scenario: "The forest paths form a graph. Explore all reachable clearings from the start.",
      objective: "Given an adjacency list, perform BFS from node 0. Print all visited nodes.",
      controls: ['Queue', 'Visited Set'],
    },
    relics: [{ name: '0', emoji: '🟢', x: 20 }, { name: '3', emoji: '🏁', x: 80 }],
    hints: [
      { text: "Use a queue and a visited set. Enqueue start, then process neighbors.", cost: 10 },
    ],
    starterCode: `const graph = {
  0: [1, 2],
  1: [0, 3],
  2: [0],
  3: [1]
};
const visited = {};
const queue = [0];
visited[0] = true;
// BFS:

`,
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      if (logs.some(l => l.includes('0')) && logs.some(l => l.includes('3')))
        return { passed: true, message: '✨ All clearings explored!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'Visit all nodes: 0, 1, 2, 3.', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "Welcome to the dense jungle ruins. Ancient shrines are hidden here.",
      objectiveHelp: "You need to explore all reachable shrines from your starting point.",
      codeHint: "Use a queue for BFS and keep track of visited nodes so you don't go in circles.",
      gameplayHint: "The mossy stone idols will light up as you discover them.",
      errorHint: "You missed some shrines! Make sure your queue processes every neighbor.",
      successMessage: "Incredible! You've mapped out the entire ruins!"
    },
    sceneType: 'overgrown_ruins_graph',
    levelActionConfig: { requiredTool: 'scanner', actionAnimation: 'scan', successEffect: 'magic_sparkles' }
  },
  // Level 4
  {
    id: 4, worldId: 'trees-graphs', title: "Level Order Signal", difficulty: 'medium', concepts: ['Binary Tree', 'BFS', 'Queue'],
    story: {
      scenario: "Send a signal to each level of the forest, top to bottom, left to right.",
      objective: "Perform a level-order (BFS) traversal. Print values level by level.",
      controls: ['Queue (array)', 'shift/push'],
    },
    relics: [{ name: '1', emoji: '🌳', x: 50 }, { name: '2', emoji: '🌿', x: 25 }, { name: '3', emoji: '🌿', x: 75 }],
    hints: [
      { text: "Use an array as a queue. Start with root. Dequeue, print, enqueue children.", cost: 10 },
    ],
    starterCode: `const root = {
  val: 1,
  left: { val: 2, left: { val: 4, left: null, right: null }, right: { val: 5, left: null, right: null } },
  right: { val: 3, left: null, right: null }
};
const queue = [root];
// Your code here:

`,
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      const nums = logs.map(l => parseInt(l)).filter(n => !isNaN(n));
      if (nums.length >= 5 && nums[0] === 1 && nums[1] === 2 && nums[2] === 3)
        return { passed: true, message: '✨ Signal sent level by level!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'BFS order: 1, 2, 3, 4, 5', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "You've reached the Great Watchtower. We need to send a signal across the forest.",
      objectiveHelp: "Send the signal level by level, from the top of the tower to the bottom.",
      codeHint: "This requires a Level-Order Traversal (BFS). Use an array as a queue.",
      gameplayHint: "Watch the signal fires light up on each floor of the tower.",
      errorHint: "The signal order is wrong. Make sure you dequeue, print, and then enqueue children.",
      successMessage: "The signal has been seen across the entire forest!"
    },
    sceneType: 'signal_tower_forest',
    levelActionConfig: { requiredTool: 'magic_device', actionAnimation: 'poke', successEffect: 'magic_sparkles' }
  },
  // Level 5
  {
    id: 5, worldId: 'trees-graphs', title: "Plant the First Tree", difficulty: 'easy', concepts: ['Binary Tree', 'Node'],
    story: {
      scenario: "In the Enchanted Forest, data grows on trees. Create your first binary tree node.",
      objective: "Create a tree with root 1, left child 2, right child 3. Print the root value.",
      controls: ['{ val, left, right }'],
    },
    relics: [{ name: '1', emoji: '🌳', x: 50 }, { name: '2', emoji: '🌿', x: 25 }, { name: '3', emoji: '🌿', x: 75 }],
    hints: [
      { text: "A tree node has val, left, and right. Set left and right to child nodes or null.", cost: 0 },
    ],
    starterCode: `// Create a binary tree:
//       1
//      / \\
//     2   3
const root = { val: 1, left: null, right: null };
// Add children:

console.log("Root:", root.val);
console.log("Left:", root.left?.val);
console.log("Right:", root.right?.val);
`,
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      if (logs.some(l => l.includes('1')) && logs.some(l => l.includes('2')) && logs.some(l => l.includes('3')))
        return { passed: true, message: '✨ Tree planted!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'Print root (1), left (2), and right (3).', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "Welcome to the Enchanted Forest, where data grows on trees!",
      objectiveHelp: "You must plant the very first binary tree by creating a root and two children.",
      codeHint: "Create a javascript object with 'val', 'left', and 'right' properties.",
      gameplayHint: "Watch the magical saplings sprout as you link your nodes.",
      errorHint: "The tree didn't grow right. Did you link the left and right children to the root?",
      successMessage: "A beautiful new tree has blossomed!"
    },
    levelActionConfig: { requiredTool: 'sickle', actionAnimation: 'poke', successEffect: 'harvest_particles' }
  },
  // Level 6
  {
    id: 6, worldId: 'trees-graphs', title: "Mirror the Forest", difficulty: 'medium', concepts: ['Binary Tree', 'Mirror', 'Inversion'],
    story: {
      scenario: "The enchanted mirror flips the entire forest. Invert the binary tree.",
      objective: "Invert (mirror) the tree. Print an inorder traversal of the result.",
      controls: ['Recursion', 'swap left/right'],
    },
    relics: [{ name: 'MIRROR', emoji: '🪞', x: 50 }],
    hints: [
      { text: "At each node, swap left and right children, then recurse.", cost: 10 },
    ],
    starterCode: `const root = {
  val: 1,
  left: { val: 2, left: null, right: null },
  right: { val: 3, left: null, right: null }
};

function invert(node) {
  if (!node) return;
  // Swap left and right:

  // Recurse:

}
invert(root);

// Print inorder to verify (should be 3, 1, 2):
function inorder(node) {
  if (!node) return;
  inorder(node.left);
  console.log(node.val);
  inorder(node.right);
}
inorder(root);
`,
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      const nums = logs.map(l => parseInt(l)).filter(n => !isNaN(n));
      if (nums.length >= 3 && nums[0] === 3 && nums[1] === 1 && nums[2] === 2)
        return { passed: true, message: '✨ Forest mirrored!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'After inversion, inorder should be 3, 1, 2.', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "You stand before the Mirror Lake. Everything here is perfectly reflected.",
      objectiveHelp: "You must invert the binary tree so it becomes its own mirror image.",
      codeHint: "Swap the left and right pointers of every single node recursively.",
      gameplayHint: "The mirror shards will glow as the forest flips around you.",
      errorHint: "The reflection is broken. Make sure you are swapping left and right at every level.",
      successMessage: "The forest is perfectly mirrored!"
    },
    sceneType: 'mirror_forest',
    levelActionConfig: { requiredTool: 'magic_device', actionAnimation: 'scan', successEffect: 'magic_sparkles' }
  },
  // Level 7
  {
    id: 7, worldId: 'trees-graphs', title: "Path Sum Quest", difficulty: 'medium', concepts: ['Binary Tree', 'Path Sum', 'DFS'],
    story: {
      scenario: "Find if there's a root-to-leaf path that sums to the magic number.",
      objective: "Check if there's a root-to-leaf path summing to 7. Print 'YES' or 'NO'.",
      controls: ['DFS', 'Recursion'],
    },
    relics: [{ name: '1', emoji: '🌳', x: 50 }, { name: '3', emoji: '🍃', x: 25 }, { name: '3', emoji: '🍃', x: 75 }],
    hints: [
      { text: "Subtract node val from target at each step. At leaf, check if remaining is 0.", cost: 10 },
    ],
    starterCode: `const root = {
  val: 1,
  left: { val: 2, left: { val: 4, left: null, right: null }, right: null },
  right: { val: 3, left: null, right: { val: 3, left: null, right: null } }
};
const target = 7;

function hasPathSum(node, remaining) {
  if (!node) return false;
  // Your code here:

}
console.log(hasPathSum(root, target) ? "YES" : "NO");
`,
    validate: (stack, operations, context) => {
      if ((context.logs || []).some(l => l.includes('YES'))) return { passed: true, message: '✨ Path found! (1→2→4=7)', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'Path 1→2→4 = 7 exists. Print YES.', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "You are deep inside the Crystal Caverns. The crystals hum with numerical energy.",
      objectiveHelp: "Find a path from the top of the cave to the bottom that sums exactly to the target.",
      codeHint: "Use DFS. Subtract the current node's value from the target as you go down.",
      gameplayHint: "The massive crystals will glow as you trace the correct sum.",
      errorHint: "That path doesn't equal the magic number. Keep searching the caves!",
      successMessage: "You found the magic path and unlocked the crystal's power!"
    },
    sceneType: 'crystal_cave_path',
    levelActionConfig: { requiredTool: 'scanner', actionAnimation: 'scan', successEffect: 'magic_sparkles' }
  },
  // Level 8
  {
    id: 8, worldId: 'trees-graphs', title: "The Tree's Height", difficulty: 'easy', concepts: ['Binary Tree', 'Height', 'Recursion'],
    story: {
      scenario: "Measure the height of the Great Tree to plan the expedition.",
      objective: "Calculate the height (max depth) of the binary tree and print it.",
      controls: ['Recursion', 'Math.max'],
    },
    relics: [{ name: 'ROOT', emoji: '🌳', x: 50 }, { name: 'LEAF', emoji: '🍃', x: 25 }],
    hints: [
      { text: "Height = 1 + max(height(left), height(right)). Base case: null returns 0.", cost: 0 },
    ],
    starterCode: `const root = {
  val: 1,
  left: { val: 2, left: { val: 4, left: null, right: null }, right: null },
  right: { val: 3, left: null, right: null }
};

function height(node) {
  if (!node) return 0;
  // Your code here:

}
console.log("Height:", height(root));
`,
    validate: (stack, operations, context) => {
      if ((context.logs || []).some(l => l.includes('3'))) return { passed: true, message: '✨ Height measured!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'The height is 3 (root→2→4).', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "You stand before the Great Tree, towering high into the canopy.",
      objectiveHelp: "Determine the height of the tree by recursively calculating its deepest branch.",
      codeHint: "The height is 1 plus the maximum height of the left and right subtrees.",
      gameplayHint: "Look up as the branches light up to show the tree's depth.",
      errorHint: "The measurement is inaccurate. Ensure your base case returns 0 for null nodes.",
      successMessage: "The Great Tree's height has been recorded!"
    },
    sceneType: 'great_tree',
    levelActionConfig: { requiredTool: 'scanner', actionAnimation: 'scan', successEffect: 'magic_sparkles' }
  },
  // Level 9
  {
    id: 9, worldId: 'trees-graphs', title: "DFS Depths", difficulty: 'medium', concepts: ['Graph', 'DFS', 'Recursion'],
    story: {
      scenario: "Explore as deep as possible before backtracking. That is the way of DFS.",
      objective: "Perform DFS on the graph from node 'A'. Print visited nodes.",
      controls: ['Recursion', 'Visited Set'],
    },
    relics: [{ name: 'A', emoji: '🟢', x: 20 }, { name: 'D', emoji: '🏁', x: 80 }],
    hints: [
      { text: "Mark current as visited, print it, then recurse on unvisited neighbors.", cost: 10 },
    ],
    starterCode: `const graph = {
  'A': ['B', 'C'],
  'B': ['A', 'D'],
  'C': ['A'],
  'D': ['B']
};
const visited = {};

function dfs(node) {
  if (visited[node]) return;
  visited[node] = true;
  console.log(node);
  // Visit neighbors:

}
dfs('A');
`,
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      if (logs.some(l => l.includes('A')) && logs.some(l => l.includes('D')))
        return { passed: true, message: '✨ Depths explored!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'Visit all nodes: A, B, C, D.', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "You are peering into the terrifying Abyssal Chasm. How deep does it go?",
      objectiveHelp: "Plunge as deep as possible into the graph before backtracking.",
      codeHint: "Depth-First Search (DFS) uses recursion (or a stack) to go deep fast.",
      gameplayHint: "Avoid the toxic spores as you descend into the darkness.",
      errorHint: "You didn't go deep enough! Make sure you visit unvisited neighbors recursively.",
      successMessage: "You survived the depths of the abyss!"
    },
    levelActionConfig: { requiredTool: 'scanner', actionAnimation: 'scan', successEffect: 'magic_sparkles' }
  },
  // Level 10
  {
    id: 10, worldId: 'trees-graphs', title: "Inorder Walk", difficulty: 'easy', concepts: ['Binary Tree', 'Inorder', 'Recursion'],
    story: {
      scenario: "Walk through the forest in 'inorder' — left, root, right — to read the ancient message.",
      objective: "Perform an inorder traversal of the tree and print the values.",
      controls: ['Recursion', 'left → root → right'],
    },
    relics: [{ name: '2', emoji: '🍃', x: 25 }, { name: '1', emoji: '🌳', x: 50 }, { name: '3', emoji: '🍃', x: 75 }],
    hints: [
      { text: "Inorder: visit left subtree, then print current, then visit right subtree.", cost: 0 },
    ],
    starterCode: `const root = {
  val: 4,
  left: { val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } },
  right: { val: 6, left: { val: 5, left: null, right: null }, right: { val: 7, left: null, right: null } }
};

function inorder(node) {
  if (!node) return;
  // Your code here:

}
inorder(root);
`,
    validate: (stack, operations, context) => {
      const logs = context.logs || [];
      const nums = logs.map(l => parseInt(l)).filter(n => !isNaN(n));
      if (nums.length >= 7 && nums[0] === 1 && nums[3] === 4 && nums[6] === 7)
        return { passed: true, message: '✨ Inorder traversal complete!', testsRun: 1, testsPassed: 1 };
      return { passed: false, message: 'Inorder should print: 1 2 3 4 5 6 7', testsRun: 1, testsPassed: 0 };
    },
    guide: {
      intro: "You have arrived at the ancient Grove of Whispers.",
      objectiveHelp: "Traverse the nodes in 'inorder' to translate the ancient message.",
      codeHint: "An inorder walk visits the left child, then the current node, then the right child.",
      gameplayHint: "The ancient stones will light up in sequence as you walk.",
      errorHint: "The message is garbled. Are you visiting the nodes in the correct order?",
      successMessage: "The full message has been revealed!"
    },
    sceneType: 'ancient_message_forest',
    levelActionConfig: { requiredTool: 'scanner', actionAnimation: 'scan', successEffect: 'magic_sparkles' }
  }
];
