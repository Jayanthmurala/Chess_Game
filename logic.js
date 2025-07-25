// --- SVG PIECE DEFINITIONS ---
const SVG_PIECES = {
  pawn: `<svg viewBox="0 0 100 100"><g style="opacity:1; fill:currentColor; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:2.5; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;"><path d="M 50,20 C 38.954,20 30,28.954 30,40 C 30,51.046 38.954,60 50,60 C 61.046,60 70,51.046 70,40 C 70,28.954 61.046,20 50,20 z M 40,65 L 60,65 L 60,70 L 40,70 L 40,65 z M 35,75 L 65,75 L 65,80 L 35,80 L 35,75 z" /></g></svg>`,
  rook: `<svg viewBox="0 0 100 100"><g style="opacity:1; fill:currentColor; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:2.5; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;"><path d="M 25,20 L 75,20 L 75,35 L 65,35 L 65,30 L 55,30 L 55,35 L 45,35 L 45,30 L 35,30 L 35,35 L 25,35 L 25,20 z M 30,40 L 70,40 L 70,75 L 30,75 L 30,40 z M 25,80 L 75,80 L 75,85 L 25,85 L 25,80 z" /></g></svg>`,
  knight: `<svg viewBox="0 0 100 100"><g style="opacity:1; fill:currentColor; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:2.5; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;"><path d="M 35,20 C 35,20 45,25 50,40 C 55,55 50,65 40,70 L 35,70 L 30,75 L 70,75 L 70,80 L 30,80 L 30,65 C 40,60 45,50 40,40 C 35,30 35,20 35,20 z M 50,20 L 60,20 C 65,30 70,40 65,50 C 60,60 50,65 50,65" /></g></svg>`,
  bishop: `<svg viewBox="0 0 100 100"><g style="opacity:1; fill:currentColor; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:2.5; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;"><path d="M 50,20 C 40,30 40,40 50,50 C 60,40 60,30 50,20 z M 45,55 C 40,60 40,70 45,75 L 55,75 C 60,70 60,60 55,55 L 45,55 z M 40,80 L 60,80 L 60,85 L 40,85 L 40,80 z" /></g></svg>`,
  queen: `<svg viewBox="0 0 100 100"><g style="opacity:1; fill:currentColor; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:2.5; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;"><path d="M 25,30 L 75,30 L 70,60 L 30,60 L 25,30 z M 20,25 L 80,25 M 50,20 L 50,15 M 35,20 L 30,15 M 65,20 L 70,15 M 40,65 L 60,65 L 60,75 L 40,75 L 40,65 z M 35,80 L 65,80 L 65,85 L 35,85 L 35,80 z" /></g></svg>`,
  king: `<svg viewBox="0 0 100 100"><g style="opacity:1; fill:currentColor; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:2.5; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;"><path d="M 45,25 L 55,25 L 55,15 L 45,15 L 45,25 z M 50,20 L 50,10 M 30,30 L 70,30 L 70,70 L 30,70 L 30,30 z M 25,75 L 75,75 L 75,80 L 25,80 L 25,75 z" /></g></svg>`,
};

// --- SOUND MANAGER ---
const soundManager = {
  isInitialized: false,
  init() {
    if (this.isInitialized) return;
    // No need to create synths here anymore
    this.isInitialized = true;
  },
  // FIX: Create a new synth for each sound to prevent timing conflicts.
  playMove() {
    if (!this.isInitialized) return;
    new Tone.Synth().toDestination().triggerAttackRelease("C4", "8n");
  },
  playCapture() {
    if (!this.isInitialized) return;
    new Tone.NoiseSynth().toDestination().triggerAttack();
  },
  playCheck() {
    if (!this.isInitialized) return;
    new Tone.Synth().toDestination().triggerAttackRelease("G5", "16n");
  },
  playGameOver() {
    if (!this.isInitialized) return;
    new Tone.Synth().toDestination().triggerAttackRelease("C3", "2n");
  },
  playStart() {
    if (!this.isInitialized) return;
    new Tone.Synth().toDestination().triggerAttackRelease("C5", "8n");
  },
};

// --- DOM ELEMENTS ---
const gameBoard = document.getElementById("game-board");
const statusDisplay = document.getElementById("status");
const resetButton = document.getElementById("reset-button");
const advisorButton = document.getElementById("advisor-button");
const whiteCapturedDisplay = document.getElementById("white-captured");
const blackCapturedDisplay = document.getElementById("black-captured");
const promotionModal = document.getElementById("promotion-modal");
const promotionChoices = document.getElementById("promotion-choices");
const advisorModal = document.getElementById("advisor-modal");
const closeAdvisorModalButton = document.getElementById("close-advisor-modal");
const advisorContent = document.getElementById("advisor-content");
const advisorSpinner = document.getElementById("advisor-spinner");

// --- GAME STATE ---
let boardState = {};
let currentPlayer = "white";
let selectedPiece = null;
let legalMoves = [];
let enPassantTarget = null;
let castlingRights = {
  white: { kingSide: true, queenSide: true },
  black: { kingSide: true, queenSide: true },
};
let lastMove = null;
let isGameOver = false;
let moveCount = 0;

// --- PIECE DEFINITIONS (value only) ---
const PIECES = {
  pawn: { value: 1, fen: "p" },
  knight: { value: 3, fen: "n" },
  bishop: { value: 3, fen: "b" },
  rook: { value: 5, fen: "r" },
  queen: { value: 9, fen: "q" },
  king: { value: Infinity, fen: "k" },
};

const initialBoardSetup = {
  a1: { type: "rook", color: "white" },
  b1: { type: "knight", color: "white" },
  c1: { type: "bishop", color: "white" },
  d1: { type: "queen", color: "white" },
  e1: { type: "king", color: "white" },
  f1: { type: "bishop", color: "white" },
  g1: { type: "knight", color: "white" },
  h1: { type: "rook", color: "white" },
  a2: { type: "pawn", color: "white" },
  b2: { type: "pawn", color: "white" },
  c2: { type: "pawn", color: "white" },
  d2: { type: "pawn", color: "white" },
  e2: { type: "pawn", color: "white" },
  f2: { type: "pawn", color: "white" },
  g2: { type: "pawn", color: "white" },
  h2: { type: "pawn", color: "white" },
  a8: { type: "rook", color: "black" },
  b8: { type: "knight", color: "black" },
  c8: { type: "bishop", color: "black" },
  d8: { type: "queen", color: "black" },
  e8: { type: "king", color: "black" },
  f8: { type: "bishop", color: "black" },
  g8: { type: "knight", color: "black" },
  h8: { type: "rook", color: "black" },
  a7: { type: "pawn", color: "black" },
  b7: { type: "pawn", color: "black" },
  c7: { type: "pawn", color: "black" },
  d7: { type: "pawn", color: "black" },
  e7: { type: "pawn", color: "black" },
  f7: { type: "pawn", color: "black" },
  g7: { type: "pawn", color: "black" },
  h7: { type: "pawn", color: "black" },
};

// --- CORE FUNCTIONS ---
function initGame() {
  if (Tone.context.state !== "running") {
    Tone.start();
  }
  soundManager.init();
  soundManager.playStart();
  isGameOver = false;
  advisorButton.disabled = false;
  currentPlayer = "white";
  boardState = JSON.parse(JSON.stringify(initialBoardSetup));
  enPassantTarget = null;
  castlingRights = {
    white: { kingSide: true, queenSide: true },
    black: { kingSide: true, queenSide: true },
  };
  lastMove = null;
  moveCount = 1;
  clearHighlights();
  createBoardDOM();
  renderBoard();
  updateStatus();
  updateCapturedPieces();
}

function createBoardDOM() {
  gameBoard.innerHTML = "";
  for (let row = 8; row >= 1; row--) {
    for (let col = 1; col <= 8; col++) {
      const square = document.createElement("div");
      const file = String.fromCharCode("a".charCodeAt(0) + col - 1);
      const position = `${file}${row}`;
      square.id = position;
      square.className = `square ${(row + col) % 2 === 0 ? "dark" : "light"}`;
      square.addEventListener("click", () => handleSquareClick(position));
      gameBoard.appendChild(square);
    }
  }
}

function renderBoard() {
  document.querySelectorAll(".piece").forEach((p) => p.remove());
  for (const position in boardState) {
    const pieceData = boardState[position];
    const square = document.getElementById(position);
    if (square && pieceData) {
      const pieceElement = document.createElement("div");
      pieceElement.className = `piece ${pieceData.color}`;
      pieceElement.dataset.position = position;
      pieceElement.innerHTML = SVG_PIECES[pieceData.type];
      pieceElement.addEventListener("mousedown", (e) =>
        handlePieceDragStart(e, pieceElement)
      );
      square.appendChild(pieceElement);
    }
  }
}

function handleSquareClick(position) {
  if (isGameOver) return;
  const pieceAtPosition = boardState[position];
  if (selectedPiece) {
    const isValidMove = legalMoves.includes(position);
    if (isValidMove) {
      movePiece(selectedPiece.position, position);
    }
    clearHighlights();
    selectedPiece = null;
    legalMoves = [];
  } else if (pieceAtPosition && pieceAtPosition.color === currentPlayer) {
    selectPiece(position);
  }
}

function selectPiece(position) {
  clearHighlights();
  const pieceElement = document.querySelector(`[data-position="${position}"]`);
  if (pieceElement) {
    selectedPiece = { element: pieceElement, position: position };
    document.getElementById(position).classList.add("selected");
    legalMoves = getLegalMovesForPiece(position);
    showLegalMoves();
  }
}

function movePiece(from, to) {
  const piece = boardState[from];
  const capturedPiece = boardState[to];

  if (capturedPiece) {
    soundManager.playCapture();
  } else {
    soundManager.playMove();
  }

  if (piece.type === "pawn" && to === enPassantTarget) {
    const capturedPawnPosition = to[0] + from[1];
    delete boardState[capturedPawnPosition];
  }

  if (piece.type === "king") {
    const fileDiff = to.charCodeAt(0) - from.charCodeAt(0);
    if (Math.abs(fileDiff) === 2) {
      const rookFrom = fileDiff > 0 ? `h${from[1]}` : `a${from[1]}`;
      const rookTo = fileDiff > 0 ? `f${from[1]}` : `d${from[1]}`;
      boardState[rookTo] = boardState[rookFrom];
      delete boardState[rookFrom];
    }
  }

  boardState[to] = piece;
  delete boardState[from];

  if (piece.type === "king") {
    castlingRights[piece.color].kingSide = false;
    castlingRights[piece.color].queenSide = false;
  }
  if (piece.type === "rook") {
    if (from === `a${piece.color === "white" ? 1 : 8}`)
      castlingRights[piece.color].queenSide = false;
    if (from === `h${piece.color === "white" ? 1 : 8}`)
      castlingRights[piece.color].kingSide = false;
  }

  enPassantTarget = null;
  if (piece.type === "pawn" && Math.abs(to[1] - from[1]) === 2) {
    enPassantTarget =
      from[0] + (parseInt(from[1]) + (piece.color === "white" ? 1 : -1));
  }

  lastMove = { from, to };
  if (currentPlayer === "black") {
    moveCount++;
  }

  animateMove(from, to, capturedPiece, () => {
    if (piece.type === "pawn" && (to[1] === "8" || to[1] === "1")) {
      handlePawnPromotion(to);
    } else {
      endTurn();
    }
  });
}

function endTurn() {
  currentPlayer = currentPlayer === "white" ? "black" : "white";
  const opponentColor = currentPlayer;
  const allOpponentMoves = getAllLegalMoves(opponentColor);

  if (isKingInCheck(opponentColor, boardState)) {
    soundManager.playCheck();
  }

  if (allOpponentMoves.length === 0) {
    isGameOver = true;
    advisorButton.disabled = true;
    soundManager.playGameOver();
    if (isKingInCheck(opponentColor, boardState)) {
      updateStatus(
        `Checkmate! ${currentPlayer === "white" ? "Black" : "White"} wins.`
      );
    } else {
      updateStatus("Stalemate! It's a draw.");
    }
  } else {
    updateStatus();
  }
}

function handlePawnPromotion(position) {
  promotionModal.classList.remove("hidden");
  promotionChoices.innerHTML = "";
  const promotionOptions = ["queen", "rook", "bishop", "knight"];

  promotionOptions.forEach((type) => {
    const choiceEl = document.createElement("div");
    choiceEl.className = `promotion-piece ${currentPlayer} p-4 rounded-md cursor-pointer`;
    choiceEl.innerHTML = SVG_PIECES[type];
    choiceEl.onclick = () => {
      boardState[position].type = type;
      promotionModal.classList.add("hidden");
      renderBoard();
      endTurn();
    };
    promotionChoices.appendChild(choiceEl);
  });
}

function getLegalMovesForPiece(position) {
  const piece = boardState[position];
  if (!piece) return [];
  let pseudoLegalMoves = [];
  switch (piece.type) {
    case "pawn":
      pseudoLegalMoves = getPawnMoves(position, piece.color);
      break;
    case "knight":
      pseudoLegalMoves = getKnightMoves(position);
      break;
    case "bishop":
      pseudoLegalMoves = getSlidingMoves(position, [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ]);
      break;
    case "rook":
      pseudoLegalMoves = getSlidingMoves(position, [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]);
      break;
    case "queen":
      pseudoLegalMoves = getSlidingMoves(position, [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]);
      break;
    case "king":
      pseudoLegalMoves = getKingMoves(position, piece.color);
      break;
  }
  return pseudoLegalMoves.filter((move) => {
    const tempState = JSON.parse(JSON.stringify(boardState));
    tempState[move] = tempState[position];
    delete tempState[position];
    return !isKingInCheck(piece.color, tempState);
  });
}

function getPawnMoves(position, color) {
  const moves = [];
  const [file, rank] = [position[0], parseInt(position[1])];
  const direction = color === "white" ? 1 : -1;
  const oneStep = file + (rank + direction);
  if (!boardState[oneStep]) {
    moves.push(oneStep);
    const isStartingRank =
      (color === "white" && rank === 2) || (color === "black" && rank === 7);
    const twoSteps = file + (rank + 2 * direction);
    if (isStartingRank && !boardState[twoSteps]) {
      moves.push(twoSteps);
    }
  }
  [-1, 1].forEach((fileOffset) => {
    const newFile = String.fromCharCode(file.charCodeAt(0) + fileOffset);
    if (newFile >= "a" && newFile <= "h") {
      const capturePos = newFile + (rank + direction);
      if (boardState[capturePos] && boardState[capturePos].color !== color) {
        moves.push(capturePos);
      }
      if (capturePos === enPassantTarget) {
        moves.push(capturePos);
      }
    }
  });
  return moves;
}

function getKnightMoves(position) {
  return getOffsetMoves(position, [
    [1, 2],
    [1, -2],
    [-1, 2],
    [-1, -2],
    [2, 1],
    [2, -1],
    [-2, 1],
    [-2, -1],
  ]);
}

function getKingMoves(position, color) {
  let moves = getOffsetMoves(position, [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]);
  const rank = color === "white" ? "1" : "8";
  if (
    castlingRights[color].kingSide &&
    !boardState[`f${rank}`] &&
    !boardState[`g${rank}`] &&
    !isSquareAttacked(`e${rank}`, color, boardState) &&
    !isSquareAttacked(`f${rank}`, color, boardState) &&
    !isSquareAttacked(`g${rank}`, color, boardState)
  ) {
    moves.push(`g${rank}`);
  }
  if (
    castlingRights[color].queenSide &&
    !boardState[`d${rank}`] &&
    !boardState[`c${rank}`] &&
    !boardState[`b${rank}`] &&
    !isSquareAttacked(`e${rank}`, color, boardState) &&
    !isSquareAttacked(`d${rank}`, color, boardState) &&
    !isSquareAttacked(`c${rank}`, color, boardState)
  ) {
    moves.push(`c${rank}`);
  }
  return moves;
}

function getSlidingMoves(position, directions) {
  const moves = [];
  const pieceColor = boardState[position].color;
  for (const [dx, dy] of directions) {
    let currentPos = position;
    while (true) {
      const [file, rank] = [
        currentPos.charCodeAt(0) - "a".charCodeAt(0),
        parseInt(currentPos[1]) - 1,
      ];
      const [newFile, newRank] = [file + dx, rank + dy];
      if (newFile < 0 || newFile > 7 || newRank < 0 || newRank > 7) break;
      const nextPos =
        String.fromCharCode("a".charCodeAt(0) + newFile) + (newRank + 1);
      const pieceAtNext = boardState[nextPos];
      if (pieceAtNext) {
        if (pieceAtNext.color !== pieceColor) moves.push(nextPos);
        break;
      }
      moves.push(nextPos);
      currentPos = nextPos;
    }
  }
  return moves;
}

function getOffsetMoves(position, offsets) {
  const moves = [];
  const pieceColor = boardState[position]?.color;
  const [file, rank] = [
    position.charCodeAt(0) - "a".charCodeAt(0),
    parseInt(position[1]) - 1,
  ];
  for (const [dx, dy] of offsets) {
    const [newFile, newRank] = [file + dx, rank + dy];
    if (newFile >= 0 && newFile <= 7 && newRank >= 0 && newRank <= 7) {
      const newPos =
        String.fromCharCode("a".charCodeAt(0) + newFile) + (newRank + 1);
      if (!boardState[newPos] || boardState[newPos].color !== pieceColor) {
        moves.push(newPos);
      }
    }
  }
  return moves;
}

function getAllLegalMoves(color) {
  let allMoves = [];
  for (const pos in boardState) {
    if (boardState[pos].color === color) {
      allMoves.push(...getLegalMovesForPiece(pos));
    }
  }
  return allMoves;
}

function isKingInCheck(kingColor, currentBoardState) {
  const kingPos = Object.keys(currentBoardState).find(
    (p) =>
      currentBoardState[p].type === "king" &&
      currentBoardState[p].color === kingColor
  );
  if (!kingPos) return true;
  return isSquareAttacked(kingPos, kingColor, currentBoardState);
}

function isSquareAttacked(targetPos, friendlyColor, currentBoardState) {
  const opponentColor = friendlyColor === "white" ? "black" : "white";
  for (const pos in currentBoardState) {
    const piece = currentBoardState[pos];
    if (piece.color === opponentColor) {
      let pseudoMoves;
      switch (piece.type) {
        case "pawn":
          pseudoMoves = getPawnMoves(pos, piece.color);
          break;
        case "knight":
          pseudoMoves = getKnightMoves(pos);
          break;
        case "bishop":
          pseudoMoves = getSlidingMoves(pos, [
            [1, 1],
            [1, -1],
            [-1, 1],
            [-1, -1],
          ]);
          break;
        case "rook":
          pseudoMoves = getSlidingMoves(pos, [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ]);
          break;
        case "queen":
          pseudoMoves = getSlidingMoves(pos, [
            [1, 1],
            [1, -1],
            [-1, 1],
            [-1, -1],
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ]);
          break;
        case "king":
          pseudoMoves = getOffsetMoves(pos, [
            [1, 1],
            [1, -1],
            [-1, 1],
            [-1, -1],
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ]);
          break;
        default:
          pseudoMoves = [];
      }
      if (pseudoMoves.includes(targetPos)) return true;
    }
  }
  return false;
}

function clearHighlights() {
  document
    .querySelectorAll(".selected, .last-move, .check")
    .forEach((el) => el.classList.remove("selected", "last-move", "check"));
  document
    .querySelectorAll(".legal-move-dot, .capture-move-ring")
    .forEach((dot) => dot.remove());
}

function showLegalMoves() {
  legalMoves.forEach((move) => {
    const square = document.getElementById(move);
    if (square) {
      const indicator = document.createElement("div");
      if (boardState[move]) {
        indicator.className = "capture-move-ring";
      } else {
        indicator.className = "legal-move-dot";
      }
      square.appendChild(indicator);
    }
  });
}

function animateMove(from, to, capturedPiece, callback) {
  const fromRect = document.getElementById(from).getBoundingClientRect();
  const toRect = document.getElementById(to).getBoundingClientRect();
  const pieceEl = document.querySelector(`[data-position="${from}"]`);

  if (!pieceEl) {
    renderBoard();
    highlightLastMoveAndCheck();
    if (callback) callback();
    return;
  }

  if (capturedPiece) {
    const capturedEl = document.querySelector(`[data-position="${to}"]`);
    if (capturedEl) capturedEl.classList.add("captured-glitch");
  }

  const dx = toRect.left - fromRect.left;
  const dy = toRect.top - fromRect.top;

  pieceEl.style.transform = `translate(${dx}px, ${dy}px)`;
  pieceEl.style.zIndex = "30";

  setTimeout(() => {
    pieceEl.style.transform = "";
    pieceEl.style.zIndex = "10";
    renderBoard();
    highlightLastMoveAndCheck();
    updateCapturedPieces();
    if (callback) callback();
  }, 250);
}

function updateStatus(message) {
  if (message) {
    statusDisplay.textContent = message;
  } else {
    statusDisplay.textContent = `${
      currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)
    }'s Turn`;
    if (isKingInCheck(currentPlayer, boardState)) {
      statusDisplay.textContent += " - CHECK!";
    }
  }
}

function highlightLastMoveAndCheck() {
  clearHighlights();
  if (lastMove) {
    document.getElementById(lastMove.from)?.classList.add("last-move");
    document.getElementById(lastMove.to)?.classList.add("last-move");
  }
  if (isKingInCheck(currentPlayer, boardState)) {
    const kingPos = Object.keys(boardState).find(
      (p) =>
        boardState[p].type === "king" && boardState[p].color === currentPlayer
    );
    if (kingPos) {
      document.getElementById(kingPos).classList.add("check");
    }
  }
}

function updateCapturedPieces() {
  const allPieces = Object.values(initialBoardSetup);
  const currentPieces = Object.values(boardState);

  let whiteCaptured = [];
  let blackCaptured = [];

  const pieceCounts = currentPieces.reduce((acc, p) => {
    const key = `${p.type}_${p.color}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const initialCounts = allPieces.reduce((acc, p) => {
    const key = `${p.type}_${p.color}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  for (const key in initialCounts) {
    const [type, color] = key.split("_");
    const capturedCount = initialCounts[key] - (pieceCounts[key] || 0);
    if (capturedCount > 0) {
      for (let i = 0; i < capturedCount; i++) {
        if (color === "white") blackCaptured.push({ type, color });
        else whiteCaptured.push({ type, color });
      }
    }
  }

  const sortFn = (a, b) => PIECES[a.type].value - PIECES[b.type].value;
  whiteCaptured.sort(sortFn);
  blackCaptured.sort(sortFn);

  whiteCapturedDisplay.innerHTML = whiteCaptured
    .map(
      (p) => `<div class="piece ${p.color} w-8 h-8">${SVG_PIECES[p.type]}</div>`
    )
    .join("");
  blackCapturedDisplay.innerHTML = blackCaptured
    .map(
      (p) => `<div class="piece ${p.color} w-8 h-8">${SVG_PIECES[p.type]}</div>`
    )
    .join("");
}

let draggedPiece = null;
function handlePieceDragStart(e, pieceElement) {
  e.preventDefault();
  if (!soundManager.isInitialized) {
    initGame();
    return;
  }
  if (isGameOver) return;
  const position = pieceElement.dataset.position;
  const pieceData = boardState[position];
  if (pieceData && pieceData.color === currentPlayer) {
    selectPiece(position);
    draggedPiece = pieceElement;
    draggedPiece.classList.add("dragging");
    document.addEventListener("mousemove", handlePieceDrag);
    document.addEventListener("mouseup", handlePieceDragEnd);
  }
}

function handlePieceDrag(e) {
  if (draggedPiece) {
    draggedPiece.style.left = `${e.clientX - draggedPiece.offsetWidth / 2}px`;
    draggedPiece.style.top = `${e.clientY - draggedPiece.offsetHeight / 2}px`;
  }
}

function handlePieceDragEnd(e) {
  if (draggedPiece) {
    draggedPiece.classList.remove("dragging");
    draggedPiece.style.position = "absolute";
    draggedPiece.style.left = "";
    draggedPiece.style.top = "";
    const targetSquare = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest(".square");
    if (targetSquare) {
      handleSquareClick(targetSquare.id);
    } else {
      clearHighlights();
      selectedPiece = null;
      legalMoves = [];
    }
    draggedPiece = null;
    document.removeEventListener("mousemove", handlePieceDrag);
    document.removeEventListener("mouseup", handlePieceDragEnd);
  }
}

// --- GEMINI API INTEGRATION ---

/** Converts the current board state to Forsyth-Edwards Notation (FEN) */
function boardToFEN() {
  let fen = "";
  for (let rank = 8; rank >= 1; rank--) {
    let emptySquares = 0;
    for (let file = 0; file < 8; file++) {
      const pos = String.fromCharCode("a".charCodeAt(0) + file) + rank;
      const piece = boardState[pos];
      if (piece) {
        if (emptySquares > 0) {
          fen += emptySquares;
          emptySquares = 0;
        }
        let fenChar = PIECES[piece.type].fen;
        fen += piece.color === "white" ? fenChar.toUpperCase() : fenChar;
      } else {
        emptySquares++;
      }
    }
    if (emptySquares > 0) {
      fen += emptySquares;
    }
    if (rank > 1) {
      fen += "/";
    }
  }

  fen += ` ${currentPlayer === "white" ? "w" : "b"}`;

  let castleStr = "";
  if (castlingRights.white.kingSide) castleStr += "K";
  if (castlingRights.white.queenSide) castleStr += "Q";
  if (castlingRights.black.kingSide) castleStr += "k";
  if (castlingRights.black.queenSide) castleStr += "q";
  fen += ` ${castleStr || "-"}`;

  fen += ` ${enPassantTarget || "-"}`;

  // For simplicity, halfmove and fullmove clocks are set to 0 and moveCount.
  fen += ` 0 ${moveCount}`;

  return fen;
}

async function getStrategicAdvice() {
  if (isGameOver) return;

  advisorModal.classList.remove("hidden");
  advisorContent.classList.add("hidden");
  advisorSpinner.classList.remove("hidden");
  advisorButton.disabled = true;

  const fen = boardToFEN();
  const prompt = `
                You are a world-class chess coach. Analyze the following chess position, provided in Forsyth-Edwards Notation (FEN).
                Position: ${fen}
                It is ${currentPlayer}'s turn to move.
                Provide a brief, high-level strategic analysis for the ${currentPlayer} player.
                - What is the overall state of the game?
                - What are the key threats for ${currentPlayer} to watch out for?
                - What are the main opportunities or strategic goals for ${currentPlayer}?
                - Suggest one or two key moves or plans to consider, but do not give a single "best" move. Explain the idea behind the suggestions.
                Keep the advice concise and easy for an intermediate player to understand. Format the response in simple HTML paragraphs.
            `;

  try {
    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = ""; // Will be handled by the environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();

    if (
      result.candidates &&
      result.candidates.length > 0 &&
      result.candidates[0].content &&
      result.candidates[0].content.parts &&
      result.candidates[0].content.parts.length > 0
    ) {
      const text = result.candidates[0].content.parts[0].text;
      advisorContent.innerHTML = text.replace(/\n/g, "<br>");
    } else {
      throw new Error("Invalid response structure from API.");
    }
  } catch (error) {
    console.error("Error fetching strategic advice:", error);
    advisorContent.innerHTML = `<p class="text-red-400">Error: Could not retrieve strategic advice. Please try again later.</p>`;
  } finally {
    advisorContent.classList.remove("hidden");
    advisorSpinner.classList.add("hidden");
    advisorButton.disabled = false;
  }
}

// --- EVENT LISTENERS ---
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Tone.js only when the user interacts with the page
  document.body.addEventListener(
    "click",
    () => {
      if (Tone.context.state !== "running") {
        Tone.start();
      }
    },
    { once: true }
  );
});

resetButton.addEventListener("click", initGame);
advisorButton.addEventListener("click", getStrategicAdvice);
closeAdvisorModalButton.addEventListener("click", () =>
  advisorModal.classList.add("hidden")
);

window.onload = () => {
  // Set up the initial board state so pieces are visible on load
  initGame();
};
