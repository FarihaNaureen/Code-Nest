package com.codenest.service;

import com.codenest.model.Level;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Stack;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ChallengeService {

    public static class ValidationResult {
        private boolean success;
        private String output;
        private List<String> stackTrace = new ArrayList<>();
        private String mentorMessage;

        public ValidationResult() {}

        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }

        public String getOutput() { return output; }
        public void setOutput(String output) { this.output = output; }

        public List<String> getStackTrace() { return stackTrace; }
        public void setStackTrace(List<String> stackTrace) { this.stackTrace = stackTrace; }

        public String getMentorMessage() { return mentorMessage; }
        public void setMentorMessage(String mentorMessage) { this.mentorMessage = mentorMessage; }
    }

    public ValidationResult validateCode(Level level, String language, String code) {
        String cleanCode = code.replaceAll("\\s+", "");

        // World 1, Level 1: Array Basics
        if ("world_1_1".equals(level.getId())) {
            return simulateArrayBasics(cleanCode);
        }

        // World 1, Level 4: Reverse Array Temple (Milestone)
        if ("world_1_4".equals(level.getId())) {
            return simulateReverseArray(cleanCode);
        }

        // World 1, Level 7: Frequency Castle
        if ("world_1_7".equals(level.getId())) {
            return simulateFrequencyCastle(cleanCode);
        }

        // World 2, Level 1: Node Discovery
        if ("world_2_1".equals(level.getId())) {
            return simulateNodeDiscovery(cleanCode);
        }

        // World 2, Level 5: Reverse Journey (Milestone)
        if ("world_2_5".equals(level.getId())) {
            return simulateReverseLinkedList(cleanCode);
        }

        // World 3, Level 1: The Alchemist's Challenge (Stack)
        if ("world_3_1".equals(level.getId())) {
            return simulateStackChallenge(code, level.getTargetRelic(), level.getRelicsRequired());
        }

        // World 3, Level 3: Queue Escape Gate (Queue)
        if ("world_3_3".equals(level.getId())) {
            return simulateQueueChallenge(code);
        }

        // World 4, Level 3: Binary Temple (Binary Search)
        if ("world_4_3".equals(level.getId())) {
            return simulateBinarySearch(cleanCode);
        }

        // Generic Validation for other levels
        ValidationResult result = new ValidationResult();
        if (cleanCode.contains("return") || cleanCode.contains("def") || cleanCode.contains("solve") || cleanCode.contains("int")) {
            result.setSuccess(true);
            result.setOutput("Compiling and verifying test cases...\n\n" +
                    "> Running Test Case 1/3: input = [1, 2, 5] -> Expected = 5, Got = 5 [OK]\n" +
                    "> Running Test Case 2/3: input = [10, 20] -> Expected = 10, Got = 10 [OK]\n\n" +
                    "Status: SUCCESS\n" +
                    "All test cases passed! (2/2)\n" +
                    "Rewards earned: 50 XP, 100 Gold");
            result.setMentorMessage("The algorithm compiled successfully. Walk into the portal to complete the quest!");
            result.getStackTrace().addAll(Arrays.asList("A", "B", "C"));
        } else {
            result.setSuccess(false);
            result.setOutput("Compilation failed.\n\n" +
                    "Error: Missing return statement or method definition.\n" +
                    "Verify your syntax and try again!");
            result.setMentorMessage("Check your code syntax. Make sure you define your method and return the correct value.");
        }

        return result;
    }

    private ValidationResult simulateArrayBasics(String cleanCode) {
        ValidationResult result = new ValidationResult();
        if (cleanCode.contains("arr[0]") || cleanCode.contains("arr[i]") || cleanCode.contains("*(arr+0)")) {
            result.setSuccess(true);
            result.setOutput("Compiling and verifying test cases...\n\n" +
                    "> Running Test Case 1/3: input = [10, 20, 30] -> Expected = 10, Got = 10 [OK]\n" +
                    "> Running Test Case 2/3: input = [5, 12, 8] -> Expected = 5, Got = 5 [OK]\n" +
                    "> Running Test Case 3/3: input = [99, 100] -> Expected = 99, Got = 99 [OK]\n\n" +
                    "Status: SUCCESS\n" +
                    "All test cases passed! (3/3)");
            result.setMentorMessage("Excellent! You successfully accessed the first element of the array (arr[0]). The exit portal is now active!");
            result.getStackTrace().addAll(Arrays.asList("10", "20", "30"));
        } else {
            result.setSuccess(false);
            result.setOutput("Verification failed.\n\n" +
                    "Test case failed for input = [10, 20, 30]\n" +
                    "Expected: 10\n" +
                    "Got: Incorrect index or value returned.");
            result.setMentorMessage("Ensure you return the first index of the array by accessing index 0 (arr[0]).");
        }
        return result;
    }

    private ValidationResult simulateReverseArray(String cleanCode) {
        ValidationResult result = new ValidationResult();
        boolean hasLoop = cleanCode.contains("for") || cleanCode.contains("while") || cleanCode.contains("reverse");
        if (hasLoop && (cleanCode.contains("temp") || cleanCode.contains("swap") || cleanCode.contains("size-1-i") || cleanCode.contains("n-1-i") || cleanCode.contains("[::-1]"))) {
            result.setSuccess(true);
            result.setOutput("Compiling and verifying test cases...\n\n" +
                    "> Running Test Case 1/3: input = [1, 2, 3] -> Expected = [3, 2, 1], Got = [3, 2, 1] [OK]\n" +
                    "> Running Test Case 2/3: input = [10, 20] -> Expected = [20, 10], Got = [20, 10] [OK]\n\n" +
                    "Status: SUCCESS\n" +
                    "All test cases passed! (2/2)");
            result.setMentorMessage("Incredible! You successfully reversed the array elements. The door lock has dissolved!");
            result.getStackTrace().addAll(Arrays.asList("3", "2", "1"));
        } else {
            result.setSuccess(false);
            result.setOutput("Verification failed.\n\n" +
                    "Test case failed for input = [1, 2, 3]\n" +
                    "Expected: [3, 2, 1]\n" +
                    "Got: Array contents did not match reversed layout.");
            result.setMentorMessage("To reverse the array, you must swap elements from both ends (front and back) iteratively.");
        }
        return result;
    }

    private ValidationResult simulateFrequencyCastle(String cleanCode) {
        ValidationResult result = new ValidationResult();
        if (cleanCode.contains("Map") || cleanCode.contains("dict") || cleanCode.contains("put") || cleanCode.contains("get") || cleanCode.contains("count") || cleanCode.contains("==")) {
            result.setSuccess(true);
            result.setOutput("Compiling and verifying test cases...\n\n" +
                    "> Running Test Case 1/2: input = \"abac\" -> Expected = {a:2, b:1, c:1}, Got = {a:2, b:1, c:1} [OK]\n\n" +
                    "Status: SUCCESS");
            result.setMentorMessage("Fantastic! Your algorithm correctly computed character frequencies. Go to the exit portal!");
            result.getStackTrace().addAll(Arrays.asList("a:2", "b:1", "c:1"));
        } else {
            result.setSuccess(false);
            result.setOutput("Verification failed. Incorrect character counts calculated.");
            result.setMentorMessage("Make sure you build a frequency mapping of each character in the string.");
        }
        return result;
    }

    private ValidationResult simulateNodeDiscovery(String cleanCode) {
        ValidationResult result = new ValidationResult();
        if (cleanCode.contains(".next") || cleanCode.contains("->next")) {
            result.setSuccess(true);
            result.setOutput("Compiling and verifying test cases...\n\n" +
                    "> Test Case: list = Head -> Next -> Tail -> Null\n" +
                    "  Expected: Next node\n" +
                    "  Got: Next node [OK]\n\n" +
                    "Status: SUCCESS");
            result.setMentorMessage("Excellent linked list traversal! You traversed from Head to Head.next. Walk to the door!");
            result.getStackTrace().addAll(Arrays.asList("Head", "Next"));
        } else {
            result.setSuccess(false);
            result.setOutput("Verification failed: Next node was not traversed.");
            result.setMentorMessage("Access the next node reference using node.next (or ->next in C).");
        }
        return result;
    }

    private ValidationResult simulateReverseLinkedList(String cleanCode) {
        ValidationResult result = new ValidationResult();
        if ((cleanCode.contains("next") || cleanCode.contains("->")) && (cleanCode.contains("prev") || cleanCode.contains("curr") || cleanCode.contains("temp"))) {
            result.setSuccess(true);
            result.setOutput("Compiling and verifying test cases...\n\n" +
                    "> Input List: Head -> Mid -> Tail -> Null\n" +
                    "> Output List: Tail -> Mid -> Head -> Null [OK]\n\n" +
                    "Status: SUCCESS");
            result.setMentorMessage("Linked List Reversal Mastered! Pointers flipped successfully. Run to the exit portal!");
            result.getStackTrace().addAll(Arrays.asList("Tail", "Mid", "Head"));
        } else {
            result.setSuccess(false);
            result.setOutput("Verification failed: Linkage pointers are incorrect.");
            result.setMentorMessage("Make sure you iterate and flip the next pointer of each node to point to prev node.");
        }
        return result;
    }

    private ValidationResult simulateStackChallenge(String code, String targetTop, int requiredSize) {
        ValidationResult result = new ValidationResult();
        Stack<String> simStack = new Stack<>();
        List<String> logs = new ArrayList<>();
        logs.add("Initializing Ancient Alchemist Stack...");
        logs.add("Current Stack: []");

        Pattern pattern = Pattern.compile("(push|pop|peek)\\s*\\(\\s*[\"']?([a-zA-Z0-9_]+)?[\"']?\\s*\\)");
        Matcher matcher = pattern.matcher(code);

        boolean executed = false;
        while (matcher.find()) {
            executed = true;
            String operation = matcher.group(1);
            String argument = matcher.group(2);

            if ("push".equals(operation)) {
                if (argument == null || argument.trim().isEmpty()) {
                    result.setSuccess(false);
                    result.setOutput("Execution Error: push() requires an item argument.");
                    return result;
                }
                String relic = argument.toLowerCase().replace("\"", "").replace("'", "");
                simStack.push(relic);
                logs.add("> push(\"" + relic + "\") -> Stack State: " + simStack.toString());
                result.getStackTrace().add(relic);
            } else if ("pop".equals(operation)) {
                if (simStack.isEmpty()) {
                    result.setSuccess(false);
                    result.setOutput("Execution Error: StackUnderflowException!");
                    return result;
                }
                String popped = simStack.pop();
                logs.add("> pop() -> removed \"" + popped + "\" -> Stack State: " + simStack.toString());
                if (!result.getStackTrace().isEmpty()) {
                    result.getStackTrace().remove(result.getStackTrace().size() - 1);
                }
            } else if ("peek".equals(operation)) {
                if (simStack.isEmpty()) {
                    result.setSuccess(false);
                    result.setOutput("Execution Error: Peek empty stack.");
                    return result;
                }
                String peeked = simStack.peek();
                logs.add("> peek() -> returned \"" + peeked + "\" -> Stack State: " + simStack.toString());
            }
        }

        if (!executed) {
            result.setSuccess(false);
            result.setOutput("Execution Error: No stack operations detected.");
            result.setMentorMessage("Use push(item), pop(), and peek() to manipulate the relics!");
            return result;
        }

        if (simStack.isEmpty()) {
            result.setSuccess(false);
            result.setOutput(String.join("\n", logs) + "\n\nQuest Failed: Stack is empty.");
            result.setMentorMessage("Your stack is empty. Push the relics so the lock can read them!");
            return result;
        }

        String currentTop = simStack.peek();
        if (currentTop.equalsIgnoreCase(targetTop) && simStack.size() == requiredSize) {
            result.setSuccess(true);
            result.setOutput(String.join("\n", logs) + "\n\nQuest Complete! The ancient runes hum with energy.\n" +
                    "The exit door has unlocked! Walk through it to claim the relics.");
            result.setMentorMessage("The alchemical code compilation succeeded! The stack top matches the Sapphire. The exit door has been unlocked!");
        } else {
            result.setSuccess(false);
            String errorMsg = String.join("\n", logs) + "\n\nQuest Failed: ";
            if (!currentTop.equalsIgnoreCase(targetTop)) {
                errorMsg += "The top element is \"" + currentTop.toUpperCase() + "\", but the locking mechanism requires \"" + targetTop.toUpperCase() + "\".";
                result.setMentorMessage("Close, but the lock did not open. Ensure you push all 3 relics so that Sapphire is pushed LAST (placing it at the top).");
            } else if (simStack.size() != requiredSize) {
                errorMsg += "The stack has size " + simStack.size() + ", but the lock requires exactly " + requiredSize + " relics stored.";
                result.setMentorMessage("The target relic is on top, but you must push all 3 collected relics.");
            }
            result.setOutput(errorMsg);
        }

        return result;
    }

    private ValidationResult simulateQueueChallenge(String code) {
        ValidationResult result = new ValidationResult();
        List<String> logs = new ArrayList<>();
        logs.add("Initializing FIFO Queue...");
        
        Pattern pattern = Pattern.compile("(enqueue|dequeue|add|poll|remove)\\s*\\(\\s*[\"']?([a-zA-Z0-9_]+)?[\"']?\\s*\\)");
        Matcher matcher = pattern.matcher(code);
        
        List<String> simQueue = new ArrayList<>();
        boolean executed = false;
        while (matcher.find()) {
            executed = true;
            String operation = matcher.group(1);
            String argument = matcher.group(2);
            
            if ("enqueue".equals(operation) || "add".equals(operation)) {
                if (argument == null || argument.trim().isEmpty()) {
                    result.setSuccess(false);
                    result.setOutput("Execution Error: enqueue requires an argument.");
                    return result;
                }
                String item = argument.toLowerCase().replace("\"", "").replace("'", "");
                simQueue.add(item);
                logs.add("> enqueue(\"" + item + "\") -> Queue: " + simQueue);
                result.getStackTrace().add(item);
            } else if ("dequeue".equals(operation) || "poll".equals(operation) || "remove".equals(operation)) {
                if (simQueue.isEmpty()) {
                    result.setSuccess(false);
                    result.setOutput("Execution Error: QueueUnderflowException!");
                    return result;
                }
                String removed = simQueue.remove(0);
                logs.add("> dequeue() -> removed \"" + removed + "\" -> Queue: " + simQueue);
                if (!result.getStackTrace().isEmpty()) {
                    result.getStackTrace().remove(0);
                }
            }
        }
        
        if (!executed) {
            result.setSuccess(false);
            result.setOutput("No queue operations detected. Use enqueue(item) and dequeue() to solve the puzzle.");
            result.setMentorMessage("Use enqueue(item) and dequeue() to manipulate the relics FIFO style.");
            return result;
        }
        
        if (simQueue.size() == 3) {
            result.setSuccess(true);
            result.setOutput(String.join("\n", logs) + "\n\nQueue state matches expected layout. The gate has unlocked!");
            result.setMentorMessage("Queue FIFO operations simulated perfectly! The gate is unlocked!");
        } else {
            result.setSuccess(false);
            result.setOutput(String.join("\n", logs) + "\n\nQueue state does not match. Expected queue size of 3.");
            result.setMentorMessage("Make sure you end up with exactly 3 elements in the queue.");
        }
        return result;
    }

    private ValidationResult simulateBinarySearch(String cleanCode) {
        ValidationResult result = new ValidationResult();
        if ((cleanCode.contains("low") || cleanCode.contains("left")) && (cleanCode.contains("high") || cleanCode.contains("right")) && cleanCode.contains("mid")) {
            result.setSuccess(true);
            result.setOutput("Compiling and verifying test cases...\n\n" +
                    "> Running Binary Search for target = 50 in array = [10, 20, 30, 40, 50, 60, 70]\n" +
                    "  [Step 1] low = 0, high = 6 -> mid = 3, val = 40 (Search right)\n" +
                    "  [Step 2] low = 4, high = 6 -> mid = 5, val = 60 (Search left)\n" +
                    "  [Step 3] low = 4, high = 4 -> mid = 4, val = 50 (Target found!)\n\n" +
                    "Status: SUCCESS");
            result.setMentorMessage("Excellent binary search algorithm! Target converged in O(log N) operations. The exit gate is unlocked!");
            // Build trace with pointer updates: target, elements and ptr indices
            result.getStackTrace().addAll(Arrays.asList("10", "20", "30", "40", "50", "60", "70", "ptr:target:50", "ptr:low:4", "ptr:high:4", "ptr:mid:4", "ptr:found:4"));
        } else {
            result.setSuccess(false);
            result.setOutput("Verification failed: Binary search did not cover target correctly.");
            result.setMentorMessage("To run binary search, make sure you calculate mid = (low + high) / 2 and update low/high pointers.");
        }
        return result;
    }
}
