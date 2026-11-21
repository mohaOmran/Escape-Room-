const puzzleModal = document.querySelector("#puzzleModal");
const gameOverModal = document.querySelector("#gameOverModal");
const puzzleForm = document.querySelector("#puzzleForm");
const puzzleAnswer = document.querySelector("#puzzleAnswer");
const modalTitle = document.querySelector("#modalTitle");
const modalText = document.querySelector("#modalText");
const feedback = document.querySelector("#feedback");
const clueCount = document.querySelector("#clueCount");
const inventoryList = document.querySelector("#inventoryList");
const timerDisplay = document.querySelector("#timer");

const puzzles = {
  painting: {
    title: "The Painted Sun",
    text: "The artist left a message beneath the frame: 'I begin many, but end only one. Remove every letter except my last.' What am I?",
    answers: ["time", "a time"],
    clue: "Sun Key"
  },
  desk: {
    title: "The Locked Drawer",
    text: "Three small numbers are carved inside the drawer: 2, 6, 12, 20. What number comes next?",
    answers: ["30"],
    clue: "Silver Riddle"
  },
  clock: {
    title: "The Silent Clock",
    text: "What has hands and a face, but cannot clap or smile?",
    answers: ["clock", "a clock"],
    clue: "Clock Code"
  },
  door: {
    title: "The Final Lock",
    text: "Combine the names of all three clues in the order they were found, then enter your escape code.",
    answers: ["sunsilverclockcode", "sun key silver riddle clock code", "sun silver clock"],
    clue: "Exit Key"
  }
};

let activePuzzle = null;
let solved = new Set();
let secondsRemaining = 600;
let timerId;

function normalize(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function openPuzzle(name) {
  activePuzzle = name;
  const puzzle = puzzles[name];

  if (solved.has(name)) {
    modalTitle.textContent = `${puzzle.title} — Solved`;
    modalText.textContent = "This clue has already been collected.";
  } else {
    modalTitle.textContent = puzzle.title;
    modalText.textContent = puzzle.text;
  }

  feedback.textContent = "";
  feedback.className = "";
  puzzleAnswer.value = "";
  puzzleAnswer.disabled = solved.has(name);
  puzzleModal.hidden = false;
  puzzleAnswer.focus();
}

function closePuzzleModal() {
  puzzleModal.hidden = true;
  activePuzzle = null;
}

function updateInventory() {
  const clueElements = [...solved]
    .filter((name) => name !== "door")
    .map((name) => `<span class="clue-chip">${puzzles[name].clue}</span>`)
    .join("");

  inventoryList.innerHTML = clueElements || '<span class="empty-clue">No clues found</span>';
  clueCount.textContent = `${[...solved].filter((name) => name !== "door").length}/3`;
}

function collectClue(name) {
  solved.add(name);
  document.querySelector(`[data-puzzle="${name}"]`)?.classList.add("solved");
  updateInventory();
}

puzzleForm.addEventListener("submit", (event) => {
  event.preventEvent;
  event.preventDefault();

  if (!activePuzzle || solved.has(activePuzzle)) return;

  const puzzle = puzzles[activePuzzle];
  const answer = normalize(puzzleAnswer.value);

  if (puzzle.answers.some((validAnswer) => normalize(validAnswer) === answer)) {
    if (activePuzzle === "door") {
      if (solved.size !== 3) {
        feedback.textContent = "Collect all three clues before opening the door.";
        return;
      }
      collectClue("door");
      endGame(true);
      return;
    }

    collectClue(activePuzzle);
    feedback.textContent = `Clue found: ${puzzle.clue}`;
    feedback.className = "success";
    puzzleAnswer.disabled = true;
  } else {
    feedback.textContent = "Not quite. Look closer and try again.";
  }
});

document.querySelectorAll(".prop").forEach((prop) => {
  prop.addEventListener("click", () => openPuzzle(prop.dataset.puzzle));
});

document.querySelector("#closeModal").addEventListener("click", closePuzzleModal);

puzzleModal.addEventListener("click", (event) => {
  if (event.target === puzzleModal) closePuzzleModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !puzzleModal.hidden) closePuzzleModal();
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function startTimer() {
  clearInterval(timerId);
  timerId = setInterval(() => {
    secondsRemaining -= 1;
    timerDisplay.textContent = formatTime(secondsRemaining);

    if (secondsRemaining <= 0) {
      clearInterval(timerId);
      endGame(false);
    }
  }, 1000);
}

function endGame(won) {
  clearInterval(timerId);
  closePuzzleModal();
  document.querySelector("#gameOverTitle").textContent = won ? "You escaped!" : "Time ran out";
  document.querySelector("#gameOverText").textContent = won
    ? "The final lock clicks open. The corridor beyond the door leads to freedom."
    : "The room grows silent. Gather the clues faster next time.";
  gameOverModal.hidden = false;
}

document.querySelector("#restartButton").addEventListener("click", () => {
  solved = new Set();
  secondsRemaining = 600;
  timerDisplay.textContent = "10:00";
  document.querySelectorAll(".prop").forEach((prop) => prop.classList.remove("solved"));
  updateInventory();
  gameOverModal.hidden = true;
  startTimer();
});

updateInventory();
startTimer();
