const BOARD_SIZE = 8;

const WHITE_PLAYER = "white_pieces";
const BLACK_PLAYER = "black_pieces";
const PAWN = "pawn";
const BISHOP = "BISHOP";
const ROOK = "rook";
const KING = "king";
const KNIGHT = "knight";
const QUEEN = "queen";

let tbl;
let boardData;
let selectedCell;
let firstCellClick = undefined;
let secondCellClick = null;
let selectedPiece;
window.addEventListener("load", createChessBoard);

class BoardData {
  constructor(pieces) {
    this.pieces = pieces;
  }

  getPiece(row, col) {
    for (let piece of this.pieces) {
      if (piece.row === row && piece.col === col) {
        return piece;
      }
    }
  }

  movePiece(piece, newRow, newCol) {
    //delete the photo
    let parent = document.getElementById(
      "td-" + piece.getRow().toString() + "-" + piece.getCol().toString()
    );
    parent.removeChild(parent.childNodes[0]);
    piece.setRow(newRow);
    piece.setCol(newCol);
    this.addPieceImage(piece);
    this.clearTable();
  }

  removePieceFromArr(row, col) {
    for (let i = 0; i < this.pieces.length; i++) {
      const piece = this.pieces[i];
      if (piece.row === row && piece.col === col) {
        this.pieces.splice(i, 1);
      }
    }
  }

  addPieceImage(piece) {
    addImage(tbl.rows[piece.row].cells[piece.col], piece.player, piece.type);
  }

  clearTable() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        tbl.rows[i].cells[j].classList.remove("path_square");
        tbl.rows[i].cells[j].classList.remove("selected_square");
      }
    }
  }

  isEmpty(row, col) {
    return this.getPiece(row, col) === undefined;
  }

  isPlayer(row, col, player) {
    const piece = this.getPiece(row, col);
    return piece !== undefined && piece.player === player;
  }
}

class Piece {
  constructor(row, col, type, player) {
    this.row = row;
    this.col = col;
    this.type = type;
    this.player = player;
    if (player === BLACK_PLAYER) {
      this.opponent = WHITE_PLAYER;
    }
    if (player === WHITE_PLAYER) {
      this.opponent = BLACK_PLAYER;
    }
  }

  getRow() {
    return this.row;
  }
  getCol() {
    return this.col;
  }

  setRow(r) {
    this.row = r;
  }
  setCol(c) {
    this.col = c;
  }
  getPossibleMoves() {
    let moves = [];
    if (this.type === PAWN) {
      moves = this.getPawnMoves();
    }
    if (this.type === KNIGHT) {
      moves = this.getKnightMoves();
    }
    if (this.type === ROOK) {
      moves = this.getRookMoves();
    }
    if (this.type === BISHOP) {
      moves = this.getBishopMoves();
    }
    if (this.type === KING) {
      moves = this.getKingMoves();
    }
    if (this.type === QUEEN) {
      moves = this.getQueenMoves();
    }

    let filterMoves = [];
    for (let move of moves) {
      if (move[0] >= 0 && move[0] <= 7 && move[1] >= 0 && move[1] <= 7) {
        filterMoves.push(move);
      }
    }
    return filterMoves;
  }

  getPawnMoves() {
    let result = [];
    let direction = 1;
    if (this.player === WHITE_PLAYER) {
      direction = -1;
    }
    let position = [this.row + direction, this.col];
    if (boardData.isEmpty(position[0], position[1])) {
      result.push(position);
    }

    position = [this.row + direction, this.col + direction];
    if (boardData.isPlayer(position[0], position[1], this.opponent)) {
      result.push(position);
    }

    position = [this.row + direction, this.col - direction];
    if (boardData.isPlayer(position[0], position[1], this.opponent)) {
      result.push(position);
    }
    return result;
  }

  getRookMoves() {
    let result = [];
    result = result.concat(this.removeUnlandableSquares(1, 0));
    result = result.concat(this.removeUnlandableSquares(-1, 0));
    result = result.concat(this.removeUnlandableSquares(0, 1));
    result = result.concat(this.removeUnlandableSquares(0, -1));
    return result;
  }

  getKingMoves() {
    let result = [];
    const relativeMoves = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    for (let relativeMove of relativeMoves) {
      let row = this.row + relativeMove[0];
      let col = this.col + relativeMove[1];
      if (!boardData.isPlayer(row, col, this.player)) {
        result.push([row, col]);
      }
    }
    return result;
  }

  getQueenMoves() {
    let result;
    result = this.getBishopMoves().concat(this.getRookMoves());
    return result;
  }

  getKnightMoves() {
    let result = [];
    const relativeMoves = [
      [2, 1],
      [2, -1],
      [-2, 1],
      [-2, -1],
      [-1, 2],
      [1, 2],
      [-1, -2],
      [1, -2],
    ];
    for (let relativeMove of relativeMoves) {
      let row = this.row + relativeMove[0];
      let col = this.col + relativeMove[1];
      if (!boardData.isPlayer(row, col, this.player)) {
        result.push([row, col]);
      }
    }
    return result;
  }

  getBishopMoves() {
    let result = [];
    result = result.concat(this.removeUnlandableSquares(-1, -1));
    result = result.concat(this.removeUnlandableSquares(-1, 1));
    result = result.concat(this.removeUnlandableSquares(1, -1));
    result = result.concat(this.removeUnlandableSquares(1, 1));
    return result;
  }

  removeUnlandableSquares(rowDir, colDir) {
    let result = [];
    for (let i = 1; i < BOARD_SIZE; i++) {
      let row = this.row + rowDir * i;
      let col = this.col + colDir * i;
      if (boardData.isEmpty(row, col)) {
        result.push([row, col]);
      } else if (boardData.getPiece(row, col).player === this.player) {
        return result;
      } else {
        result.push([row, col]);
        return result;
      }
    }
    return result;
  }
}

function createChessBoard() {
  tbl = document.createElement("table");
  document.body.appendChild(tbl);
  for (let i = 0; i < BOARD_SIZE; i++) {
    const tr = tbl.insertRow();
    for (let j = 0; j < BOARD_SIZE; j++) {
      const td = tr.insertCell();
      td.id = "td-" + i.toString() + "-" + j.toString();
      if ((i + j) % 2 === 0) {
        td.className = "white_square";
      } else {
        td.className = "black_square";
      }
      td.addEventListener("click", (event) => onCellClick(event, i, j));
    }
  }
  boardData = getInitialBoard();
  for (let piece of boardData.pieces) {
    addImage(tbl.rows[piece.row].cells[piece.col], piece.player, piece.type);
  }
}

function addImage(cell, player, name) {
  const image = document.createElement("img");
  image.src = "pieces photos/" + player + "/" + name + ".png";
  cell.appendChild(image);
}

function getInitialBoard() {
  let result = [];
  let temp = [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK];
  for (let i = 0; i < BOARD_SIZE; i++) {
    result.push(new Piece(0, i, temp[i], BLACK_PLAYER));
    result.push(new Piece(1, i, PAWN, BLACK_PLAYER));
    result.push(new Piece(7, i, temp[i], WHITE_PLAYER));
    result.push(new Piece(6, i, PAWN, WHITE_PLAYER));
  }
  return new BoardData(result);
}

function tryMove(piece, row, col) {
  const possibleMoves = piece.getPossibleMoves();
  for (const possibleMove of possibleMoves) {
    if (possibleMove[0] === row && possibleMove[1] === col) {
      return true;
    }
  }
  return false;
}

function onCellClick(event, row, col) {
  if (selectedPiece === undefined) {
    selectedPiece = boardData.getPiece(row, col);
    onPieceCellClick(selectedPiece, event);
  } else {
    if (tryMove(selectedPiece, row, col)) {
      if (!boardData.isEmpty(row, col)) {
        let parent = document.getElementById(
          "td-" + row.toString() + "-" + col.toString()
        );
        parent.removeChild(parent.childNodes[0]);
        boardData.removePieceFromArr(row, col); // remove the eaten piece from the array
      }
      boardData.movePiece(selectedPiece, row, col);
      selectedPiece = undefined;
    } else {
      if (!boardData.isEmpty(row, col)) {
        selectedPiece = boardData.getPiece(row, col);
        onPieceCellClick(selectedPiece, event);
        return;
      }
      onPieceCellClick(selectedPiece, event);
      selectedPiece = undefined;
    }
  }
}

function onPieceCellClick(piece, event) {
  boardData.clearTable();
  selectedCell = event.currentTarget;
  selectedCell.classList.add("selected_square");
  let possibleMoves = piece.getPossibleMoves();
  for (let possibleMove of possibleMoves) {
    tbl.rows[possibleMove[0]].cells[possibleMove[1]].classList.add(
      "path_square"
    );
  }
}
