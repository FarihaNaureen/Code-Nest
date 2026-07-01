package com.codenest.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "levels")
public class Level {
    @Id
    private String id;
    private String worldId;
    private String name;
    private String concept;
    private int number;
    private String difficulty; // Easy, Medium, Hard
    private String questStory;
    private String questObjective;
    private String questControls;
    private String initialCodeJava;
    private String initialCodePython;
    private String initialCodeC;
    private String testCasesJson; // Simple JSON representation of test inputs and outputs
    private List<String> hints = new ArrayList<>();
    private int relicsRequired = 0;
    private String targetRelic; // e.g. "SAPPHIRE"

    public Level() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getWorldId() { return worldId; }
    public void setWorldId(String worldId) { this.worldId = worldId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getConcept() { return concept; }
    public void setConcept(String concept) { this.concept = concept; }

    public int getNumber() { return number; }
    public void setNumber(int number) { this.number = number; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getQuestStory() { return questStory; }
    public void setQuestStory(String questStory) { this.questStory = questStory; }

    public String getQuestObjective() { return questObjective; }
    public void setQuestObjective(String questObjective) { this.questObjective = questObjective; }

    public String getQuestControls() { return questControls; }
    public void setQuestControls(String questControls) { this.questControls = questControls; }

    public String getInitialCodeJava() { return initialCodeJava; }
    public void setInitialCodeJava(String initialCodeJava) { this.initialCodeJava = initialCodeJava; }

    public String getInitialCodePython() { return initialCodePython; }
    public void setInitialCodePython(String initialCodePython) { this.initialCodePython = initialCodePython; }

    public String getInitialCodeC() { return initialCodeC; }
    public void setInitialCodeC(String initialCodeC) { this.initialCodeC = initialCodeC; }

    public String getTestCasesJson() { return testCasesJson; }
    public void setTestCasesJson(String testCasesJson) { this.testCasesJson = testCasesJson; }

    public List<String> getHints() { return hints; }
    public void setHints(List<String> hints) { this.hints = hints; }

    public int getRelicsRequired() { return relicsRequired; }
    public void setRelicsRequired(int relicsRequired) { this.relicsRequired = relicsRequired; }

    public String getTargetRelic() { return targetRelic; }
    public void setTargetRelic(String targetRelic) { this.targetRelic = targetRelic; }
}
