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

  movePiece(piece, curruntCell, transferCell) {
    let parent = document.getElementById(curruntCell.id);
    parent.removeChild(parent.childNodes[0]);
    piece.setRow(parseInt(transferCell.id[3]));
    piece.setCol(parseInt(transferCell.id[5]));
    this.addPieceImage(piece);
  }

  addPieceImage(piece) {
    addImage(tbl.rows[piece.row].cells[piece.col], piece.player, piece.type);
  }
  //cleans the table from selected squares
  clearTable() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        tbl.rows[i].cells[j].classList.remove("path_square");
        tbl.rows[i].cells[j].classList.remove("selected_square");
      }
    }
  }

  isEmpty(row, col){
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
    if(player===BLACK_PLAYER){this.opponent = WHITE_PLAYER;}
    if(player===WHITE_PLAYER){this.opponent = BLACK_PLAYER;}
  }

  setRow(r){this.row = r;}
  setCol(c){this.col = c;}
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
      if (
        move[0] >= 0 &&
        move[0] <= 7 &&
        move[1] >= 0 &&
        move[1] <= 7
      ) {
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
    result = result.concat(this.removeUnlandableSquares(1,0));
    result = result.concat(this.removeUnlandableSquares(-1,0));
    result = result.concat(this.removeUnlandableSquares(0,1));
    result = result.concat(this.removeUnlandableSquares(0,-1));
    return result;
  }

  getKingMoves() {
    let result = [];
    const relativeMoves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
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
    const relativeMoves = [[2, 1], [2, -1], [-2, 1], [-2, -1], [-1, 2], [1, 2], [-1, -2], [1, -2]];
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
    for(let i=1; i<BOARD_SIZE; i++){
      let row = this.row + rowDir*i;
      let col = this.col + colDir*i;
      if(boardData.isEmpty(row, col)){
        result.push([row, col]);
      } else if(boardData.getPiece(row, col).player === this.player){
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

function onCellClick(event, row, col) {
  let cell = tbl.rows[row].cells[col];
  //clears the variables if both with cells
  if (firstCellClick != undefined && secondCellClick != undefined) {
    firstCellClick = undefined;
    secondCellClick = null;
  }
  //check if the first click is a cell with a piece
  if (firstCellClick === undefined) {
    if (cell.getElementsByTagName("img").length > 0) {
      firstCellClick = cell;
    } else {
      return;
    }
  }
  //check if the second click is a cell without a piece
  if (secondCellClick === undefined) {
    if (!(cell.getElementsByTagName("img").length > 0)) {
      secondCellClick = cell;
    } else {
      return;
    }
  } else {
    secondCellClick = undefined;
  }

  let piece = boardData.getPiece(
    parseInt(firstCellClick.id[3]),
    parseInt(firstCellClick.id[5])
  );
  if (piece != undefined) {
    onPieceCellClick(piece);
    selectedCell = event.currentTarget;
    selectedCell.classList.add("selected_square");
  } else {
    onEmptyCellClick();
  }
  if (firstCellClick != undefined && secondCellClick != undefined) {
    if (secondCellClick.classList.contains("path_square")) {
      boardData.movePiece(piece, firstCellClick, secondCellClick);
    }
    boardData.clearTable();
  }
}

function onPieceCellClick(piece) {
  let possibleMoves = piece.getPossibleMoves();
  for (let possibleMove of possibleMoves) {
    tbl.rows[possibleMove[0]].cells[possibleMove[1]].classList.add("path_square");
  }
}

function onEmptyCellClick() {}
