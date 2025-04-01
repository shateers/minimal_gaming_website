
export type WordSet = {
  category: string;
  words: string[];
  difficulty: "easy" | "medium" | "hard";
};

export const WORD_SETS: WordSet[] = [
  {
    category: "Fruits",
    words: ["Apple", "Banana", "Orange", "Grape", "Strawberry"],
    difficulty: "easy"
  },
  {
    category: "Countries",
    words: ["France", "Japan", "Brazil", "Egypt", "Australia"],
    difficulty: "easy"
  },
  {
    category: "Sports",
    words: ["Soccer", "Basketball", "Tennis", "Golf", "Swimming"],
    difficulty: "easy"
  },
  {
    category: "Colors",
    words: ["Red", "Blue", "Green", "Yellow", "Purple"],
    difficulty: "easy"
  },
  {
    category: "Musical Instruments",
    words: ["Piano", "Guitar", "Violin", "Trumpet", "Drums"],
    difficulty: "medium"
  },
  {
    category: "Planets",
    words: ["Mercury", "Venus", "Earth", "Mars", "Jupiter"],
    difficulty: "medium"
  },
  {
    category: "Occupations",
    words: ["Doctor", "Teacher", "Engineer", "Chef", "Lawyer"],
    difficulty: "medium"
  },
  {
    category: "Mammals",
    words: ["Elephant", "Lion", "Dolphin", "Bear", "Kangaroo"],
    difficulty: "medium"
  },
  {
    category: "Programming Languages",
    words: ["JavaScript", "Python", "Java", "C++", "Ruby"],
    difficulty: "hard"
  },
  {
    category: "Greek Gods",
    words: ["Zeus", "Athena", "Apollo", "Poseidon", "Hermes"],
    difficulty: "hard"
  },
  {
    category: "Chemical Elements",
    words: ["Hydrogen", "Oxygen", "Carbon", "Gold", "Sodium"],
    difficulty: "hard"
  },
  {
    category: "Shakespeare Plays",
    words: ["Hamlet", "Macbeth", "Othello", "Romeo and Juliet", "King Lear"],
    difficulty: "hard"
  }
];
