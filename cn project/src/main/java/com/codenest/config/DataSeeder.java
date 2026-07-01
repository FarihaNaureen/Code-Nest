package com.codenest.config;

import com.codenest.model.Achievement;
import com.codenest.model.Level;
import com.codenest.model.World;
import com.codenest.repository.AchievementRepository;
import com.codenest.repository.LevelRepository;
import com.codenest.repository.WorldRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.codenest.model.User;
import com.codenest.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private WorldRepository worldRepository;

    @Autowired
    private LevelRepository levelRepository;

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Idempotent seeding: each seed method checks count() == 0 before inserting
        seedWorlds();
        seedLevels();
        seedAchievements();
        seedAdminUser();
    }

    private void seedAdminUser() {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User("admin", passwordEncoder.encode("admin"), "admin@codenest.com");
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("Seeded admin user successfully.");
        }
    }

    private void seedWorlds() {
        if (worldRepository.count() == 0) {
            List<World> worlds = Arrays.asList(
                new World("world_1", "Arrays & Strings Kingdom", "Floating green islands, ancient ruins, forest theme, soft magical glow", "Learn elements, array sorting, string reversals, character scanning, and prefix sums.", 1),
                new World("world_2", "Linked List Desert", "Golden desert, ancient temples, sandstone architecture, connected pathways", "Learn node referencing, list insertion, deletion, reversal, and circular list cycle detection.", 2),
                new World("world_3", "Stacks & Queues: The Cursed Vault", "Ancient magical vault, giant whirlpool, floating runes, blue magical theme", "Learn Last In First Out (LIFO) and First In First Out (FIFO) operations through relic sorting.", 3),
                new World("world_4", "Searching Algorithms Realm", "Mystical labyrinth in thick fog, dark stone chambers, glowing keys", "Learn linear scans, log-time binary partition search, and searching optimizations.", 4)
            );
            worldRepository.saveAll(worlds);
            System.out.println("Seeded game worlds successfully.");
        }
    }

    private void seedLevels() {
        if (levelRepository.count() == 0) {
            List<Level> levels = new ArrayList<>();

            // Seeding World 1 (Arrays & Strings Kingdom)
            levels.add(createLevel("world_1", 1, "Array Basics", "Arrays", "Easy",
                "Learn the basics of arrays.",
                "Given an array of integers <code>arr</code>, return the first element of the array.<br/><br/><b>Example 1:</b><br/>Input: arr = [1, 2, 3]<br/>Output: 1<br/><br/><b>Example 2:</b><br/>Input: arr = [10, 20, 30]<br/>Output: 10<br/><br/><b>Constraints:</b><ul><li><code>1 <= arr.length <= 100</code></li><li><code>-1000 <= arr[i] <= 1000</code></li></ul>",
                "get(index)",
                "class Solution {\n    public int solve(int[] arr) {\n        // Your code here\n        return arr[0];\n    }\n}",
                "def solve(arr):\n    # Your code here\n    return arr[0]",
                "int solve(int* arr, int size) {\n    // Your code here\n    return arr[0];\n}",
                "{\"input\":\"[1, 2, 3]\", \"output\":\"1\"}"
            ));

            for (int i = 2; i <= 10; i++) {
                if (i == 4) {
                    levels.add(createLevel("world_1", 4, "Reverse Array", "Arrays", "Medium",
                        "Reverse an array in-place.",
                        "Write a function that reverses an array of integers in-place.<br/><br/><b>Example 1:</b><br/>Input: arr = [1, 2, 3]<br/>Output: [3, 2, 1]<br/><br/><b>Example 2:</b><br/>Input: arr = [10, 20]<br/>Output: [20, 10]<br/><br/><b>Constraints:</b><ul><li><code>1 <= arr.length <= 10^5</code></li><li>Must be done in O(1) extra space.</li></ul>",
                        "reverse()",
                        "class Solution {\n    public void solve(int[] arr) {\n        // Your code here\n    }\n}",
                        "def solve(arr):\n    # Your code here\n    pass",
                        "void solve(int* arr, int size) {\n    // Your code here\n}",
                        "{\"input\":\"[1, 2, 3]\", \"output\":\"[3, 2, 1]\"}"
                    ));
                    continue;
                }
                String name = switch (i) {
                    case 2 -> "Traversal Quest";
                    case 3 -> "Missing Number Cave";
                    case 4 -> "Reverse Array Temple";
                    case 5 -> "String Explorer";
                    case 6 -> "Palindrome Forest";
                    case 7 -> "Frequency Castle";
                    case 8 -> "Sliding Window River";
                    case 9 -> "Prefix Sum Ruins";
                    default -> "Arrays & Strings Boss Battle";
                };
                levels.add(createLevel("world_1", i, name, "Arrays", i < 7 ? "Easy" : i < 10 ? "Medium" : "Hard",
                    "A journey through " + name + ".", "Solve the algorithm task to clear the checkpoint.", "traverse()",
                    "class Solution {\n    public int solve() {\n        return 0;\n    }\n}",
                    "def solve():\n    return 0",
                    "int solve() {\n    return 0;\n}",
                    "{\"input\":\"\", \"output\":\"0\"}"
                ));
            }

            // Seeding World 2 (Linked List Desert)
            for (int i = 1; i <= 10; i++) {
                if (i == 5) {
                    levels.add(createLevel("world_2", 5, "Reverse Linked List", "LinkedList", "Easy",
                        "Reverse a singly linked list.",
                        "Given the <code>head</code> of a singly linked list, reverse the list, and return the reversed list.<br/><br/><b>Example 1:</b><br/>Input: head = [1,2,3,4,5]<br/>Output: [5,4,3,2,1]<br/><br/><b>Constraints:</b><ul><li>The number of nodes in the list is the range <code>[0, 5000]</code>.</li><li><code>-5000 <= Node.val <= 5000</code></li></ul>",
                        "node.next",
                        "class Solution {\n    public ListNode solve(ListNode head) {\n        // Your code here\n        return null;\n    }\n}",
                        "def solve(head):\n    # Your code here\n    return None",
                        "struct ListNode* solve(struct ListNode* head) {\n    // Your code here\n    return NULL;\n}",
                        "{\"input\":\"[1,2,3,4,5]\", \"output\":\"[5,4,3,2,1]\"}"
                    ));
                    continue;
                }
                String name = switch (i) {
                    case 1 -> "Node Discovery";
                    case 2 -> "Insert Mission";
                    case 3 -> "Delete Mission";
                    case 4 -> "Search Operation";
                    case 5 -> "Reverse Journey";
                    case 6 -> "Middle Node Temple";
                    case 7 -> "Cycle Detection";
                    case 8 -> "Merge Lists";
                    case 9 -> "Advanced Traversal";
                    default -> "Linked List Boss Battle";
                };
                levels.add(createLevel("world_2", i, name, "LinkedList", i < 5 ? "Easy" : i < 9 ? "Medium" : "Hard",
                    "Welcome to the desert node of " + name + ".", "Manipulate node references to complete the objective.", "node.next",
                    "class Solution {\n    public int solve() {\n        return 0;\n    }\n}",
                    "def solve():\n    return 0",
                    "int solve() {\n    return 0;\n}",
                    "{\"input\":\"\", \"output\":\"0\"}"
                ));
            }

            // Seeding World 3 (Stacks & Queues: The Cursed Vault)
            // LEVEL 1: The Alchemist's Challenge (Our main demo gameplay level!)
            Level alchemistLevel = new Level();
            alchemistLevel.setId("world_3_1");
            alchemistLevel.setWorldId("world_3");
            alchemistLevel.setNumber(1);
            alchemistLevel.setName("The Alchemist's Challenge");
            alchemistLevel.setConcept("Stack");
            alchemistLevel.setDifficulty("Easy");
            alchemistLevel.setQuestStory("A Stack follows the Last-In-First-Out (LIFO) principle.");
            alchemistLevel.setQuestObjective("Push the items 'scroll', 'gold_idol', and 'sapphire' into the stack such that 'sapphire' is the top element.<br/><br/><b>Example 1:</b><br/>Input: ['scroll', 'gold_idol', 'sapphire']<br/>Output: Stack Top is 'sapphire'<br/><br/><b>Constraints:</b><ul><li>You must use exactly 3 push operations.</li><li>The stack must follow LIFO order.</li></ul>");
            alchemistLevel.setQuestControls("push(item), pop(), peek()");
            alchemistLevel.setInitialCodeJava(
                "class Solution {\n" +
                "    public int solve() {\n" +
                "        // Use stack methods here:\n" +
                "        // push(\"scroll\");\n" +
                "        // push(\"gold_idol\");\n" +
                "        // push(\"sapphire\");\n" +
                "        return 0;\n" +
                "    }\n" +
                "}"
            );
            alchemistLevel.setInitialCodePython(
                "def solve():\n" +
                "    # Use stack methods here:\n" +
                "    # push(\"scroll\")\n" +
                "    # push(\"gold_idol\")\n" +
                "    # push(\"sapphire\")\n" +
                "    pass"
            );
            alchemistLevel.setInitialCodeC(
                "int solve() {\n" +
                "    // Use stack methods here:\n" +
                "    // push(\"scroll\");\n" +
                "    // push(\"gold_idol\");\n" +
                "    // push(\"sapphire\");\n" +
                "    return 0;\n" +
                "}"
            );
            alchemistLevel.setTestCasesJson("{\"target\":\"SAPPHIRE\", \"items\":[\"scroll\",\"gold_idol\",\"sapphire\"]}");
            alchemistLevel.getHints().add("Try pushing the items into the stack in an order such that sapphire goes in last (so it is on top).");
            alchemistLevel.getHints().add("First push('scroll'), then push('gold_idol'), and finally push('sapphire').");
            alchemistLevel.getHints().add("The stack follows LIFO (Last In First Out), so whatever you push last is at the TOP.");
            alchemistLevel.setRelicsRequired(3);
            alchemistLevel.setTargetRelic("SAPPHIRE");
            levels.add(alchemistLevel);

            for (int i = 2; i <= 10; i++) {
                if (i == 3) {
                    levels.add(createLevel("world_3", 3, "Queue Operations", "Queue", "Easy",
                        "Implement basic queue operations.",
                        "Perform the given queue operations and ensure the queue behaves as FIFO (First-In-First-Out).<br/><br/><b>Example 1:</b><br/>Input: enqueue(1), enqueue(2), dequeue()<br/>Output: 1<br/><br/><b>Constraints:</b><ul><li>At most <code>100</code> calls will be made to enqueue and dequeue.</li></ul>",
                        "enqueue(), dequeue()",
                        "class Solution {\n    public void solve() {\n        // Your code here\n    }\n}",
                        "def solve():\n    # Your code here\n    pass",
                        "void solve() {\n    // Your code here\n}",
                        "{\"input\":\"\", \"output\":\"\"}"
                    ));
                    continue;
                }
                String name = switch (i) {
                    case 2 -> "Relic Sorting Room";
                    case 3 -> "Queue Escape Gate";
                    case 4 -> "Circular Queue Bridge";
                    case 5 -> "Priority Vault";
                    case 6 -> "Balanced Parentheses Chamber";
                    case 7 -> "Next Greater Element Corridor";
                    case 8 -> "Min Stack Dungeon";
                    case 9 -> "Two Stack Warehouse";
                    default -> "The Vault Guardian Boss Battle";
                };
                levels.add(createLevel("world_3", i, name, i < 4 ? "Stack" : "Queue", i < 6 ? "Easy" : i < 9 ? "Medium" : "Hard",
                    "Welcome to " + name + ".", "Unlock the puzzle block using stack or queue operators.", "push(), pop(), enqueue(), dequeue()",
                    "class Solution {\n    public int solve() {\n        return 0;\n    }\n}",
                    "def solve():\n    return 0",
                    "int solve() {\n    return 0;\n}",
                    "{\"input\":\"\", \"output\":\"0\"}"
                ));
            }

            // Seeding World 4 (Searching Algorithms Realm)
            for (int i = 1; i <= 10; i++) {
                if (i == 3) {
                    levels.add(createLevel("world_4", 3, "Binary Search", "Searching", "Easy",
                        "Implement Binary Search algorithm.",
                        "Given an array of integers <code>nums</code> which is sorted in ascending order, and an integer <code>target</code>, write a function to search <code>target</code> in <code>nums</code>. If <code>target</code> exists, then return its index. Otherwise, return <code>-1</code>.<br/><br/><b>Example 1:</b><br/>Input: nums = [-1,0,3,5,9,12], target = 9<br/>Output: 4<br/><br/><b>Constraints:</b><ul><li><code>1 <= nums.length <= 10^4</code></li><li><code>-10^4 < nums[i], target < 10^4</code></li><li>All the integers in <code>nums</code> are unique.</li><li><code>nums</code> is sorted in ascending order.</li></ul>",
                        "binarySearch()",
                        "class Solution {\n    public int solve(int[] nums, int target) {\n        // Your code here\n        return -1;\n    }\n}",
                        "def solve(nums, target):\n    # Your code here\n    return -1",
                        "int solve(int* nums, int numsSize, int target) {\n    // Your code here\n    return -1;\n}",
                        "{\"input\":\"[-1,0,3,5,9,12], 9\", \"output\":\"4\"}"
                    ));
                    continue;
                }
                String name = switch (i) {
                    case 1 -> "Search Basics";
                    case 2 -> "Find the Key";
                    case 3 -> "Binary Temple";
                    case 4 -> "Hidden Chamber";
                    case 5 -> "Sorted Kingdom";
                    case 6 -> "Search Forest";
                    case 7 -> "Search Challenge";
                    case 8 -> "Search Optimization";
                    case 9 -> "Advanced Search";
                    default -> "Search Boss Battle";
                };
                levels.add(createLevel("world_4", i, name, "Searching", i < 4 ? "Easy" : i < 9 ? "Medium" : "Hard",
                    "Welcome to the mystical labyrinth level " + i + ": " + name + ".", "Solve using search algorithms.", "linearSearch(), binarySearch()",
                    "class Solution {\n    public int solve() {\n        return 0;\n    }\n}",
                    "def solve():\n    return 0",
                    "int solve() {\n    return 0;\n}",
                    "{\"input\":\"\", \"output\":\"0\"}"
                ));
            }

            for (Level l : levels) {
                if (l.getId().equals("world_1_4")) {
                    l.getHints().clear();
                    l.getHints().add("You need to swap elements from the ends towards the center.");
                    l.getHints().add("Use two pointers. One starting at index 0, and another at arr.length - 1. Swap them and move them towards each other.");
                    l.getHints().add("```java\nint left = 0, right = arr.length - 1;\nwhile (left < right) {\n    int temp = arr[left];\n    arr[left] = arr[right];\n    arr[right] = temp;\n    left++; right--;\n}\n```");
                } else if (l.getId().equals("world_2_5")) {
                    l.getHints().clear();
                    l.getHints().add("You need to keep track of the previous node, current node, and next node during traversal.");
                    l.getHints().add("Iterate through the list. For each node, save its next pointer, point its next to previous, then step forward.");
                    l.getHints().add("```java\nListNode prev = null;\nListNode curr = head;\nwhile (curr != null) {\n    ListNode nextTemp = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = nextTemp;\n}\nreturn prev;\n```");
                } else if (l.getId().equals("world_3_1")) {
                    l.getHints().clear();
                    l.getHints().add("A stack follows LIFO (Last In, First Out). The last item pushed will be at the top.");
                    l.getHints().add("To make 'sapphire' the top element, you must push it last. Push 'scroll' and 'gold_idol' first.");
                    l.getHints().add("```java\npush(\"scroll\");\npush(\"gold_idol\");\npush(\"sapphire\");\n```");
                } else if (l.getId().equals("world_3_3")) {
                    l.getHints().clear();
                    l.getHints().add("A queue follows FIFO (First In, First Out). Enqueue adds to the back, dequeue removes from the front.");
                    l.getHints().add("Simply call enqueue() for 1 and 2, then call dequeue().");
                    l.getHints().add("```java\nenqueue(1);\nenqueue(2);\ndequeue();\n```");
                } else if (l.getId().equals("world_4_3")) {
                    l.getHints().clear();
                    l.getHints().add("Binary search works by repeatedly dividing the search interval in half.");
                    l.getHints().add("Initialize left = 0, right = nums.length - 1. While left <= right, find mid. If nums[mid] == target, return mid. Else adjust left or right.");
                    l.getHints().add("```java\nint left = 0, right = nums.length - 1;\nwhile (left <= right) {\n    int mid = left + (right - left) / 2;\n    if (nums[mid] == target) return mid;\n    else if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n}\nreturn -1;\n```");
                }
            }

            levelRepository.saveAll(levels);
            System.out.println("Seeded levels successfully.");
        }
    }

    private void seedAchievements() {
        if (achievementRepository.count() == 0) {
            List<Achievement> achievements = Arrays.asList(
                new Achievement("first_login", "First Login", "Successfully step into the world of Code Nest.", 100, 100, "badge_login.png"),
                new Achievement("first_challenge", "First Challenge", "Complete your first DSA challenge.", 150, 150, "badge_first.png"),
                new Achievement("array_master", "Array Master", "Master element index traversing.", 250, 200, "badge_array.png"),
                new Achievement("string_wizard", "String Wizard", "Solve string transformations.", 250, 200, "badge_string.png"),
                new Achievement("linked_list_hero", "Linked List Hero", "Manipulate node linkages.", 300, 250, "badge_list.png"),
                new Achievement("stack_master", "Stack Master", "Ascend the Cursed Vault stack challenge.", 300, 250, "badge_stack.png"),
                new Achievement("queue_champion", "Queue Champion", "Understand FIFO processing mechanics.", 300, 250, "badge_queue.png"),
                new Achievement("search_explorer", "Search Explorer", "Implement O(log N) binary search correctly.", 350, 300, "badge_search.png"),
                new Achievement("multiplayer_expert", "Multiplayer Expert", "Collaborate on a pair coding session.", 400, 350, "badge_multi.png"),
                new Achievement("coding_legend", "Coding Legend", "Unlock all DSA Realms and defeat the Bosses.", 1000, 1000, "badge_legend.png")
            );
            achievementRepository.saveAll(achievements);
            System.out.println("Seeded game achievements successfully.");
        }
    }

    private Level createLevel(String worldId, int number, String name, String concept, String difficulty,
                              String story, String objective, String controls,
                              String codeJava, String codePython, String codeC, String testCases) {
        Level level = new Level();
        level.setId(worldId + "_" + number);
        level.setWorldId(worldId);
        level.setNumber(number);
        level.setName(name);
        level.setConcept(concept);
        level.setDifficulty(difficulty);
        level.setQuestStory(story);
        level.setQuestObjective(objective);
        level.setQuestControls(controls);
        level.setInitialCodeJava(codeJava);
        level.setInitialCodePython(codePython);
        level.setInitialCodeC(codeC);
        level.setTestCasesJson(testCases);
        level.getHints().add("Review your code carefully before executing. Remember to check for edge cases.");
        return level;
    }
}
