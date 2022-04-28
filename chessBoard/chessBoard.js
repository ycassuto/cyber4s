
let tbl;
let boardData;
let selectedCell;
let selectedPiece;
let whichPlayerTurn = WHITE_PLAYER;
let winner = undefined;

window.addEventListener("load", createChessBoard);

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
  for (let i = 0; i < BOARD_SIZE; i++) {
    result.push(new Piece(0, i, PIECES_ARR[i], BLACK_PLAYER));
    result.push(new Piece(1, i, PAWN, BLACK_PLAYER));
    result.push(new Piece(7, i, PIECES_ARR[i], WHITE_PLAYER));
    result.push(new Piece(6, i, PAWN, WHITE_PLAYER));
  }
  return new BoardData(result);
}

function tryMove(piece, row, col) {
  const possibleMoves = piece.getPossibleMoves();
  for (const possibleMove of possibleMoves) {
    if (possibleMove[0] === row && possibleMove[1] === col) {
      whichPlayerTurn = piece.opponent ;
      return true;
    }
  }
  return false;
}

function isPlayerTurn(piece){
  if(piece.player === whichPlayerTurn){
    return false;
  }
  return true;
}

function removePhotoElem(row, col){
  let parent = document.getElementById("td-" + row.toString() + "-" + col.toString());
  parent.removeChild(parent.childNodes[0]);
  boardData.removePieceFromArr(row, col); // remove the eaten piece from the array
}

function onCellClick(event, row, col) {
  if (selectedPiece === undefined) {
    selectedPiece = boardData.getPiece(row, col);
    if(isPlayerTurn(selectedPiece)){
      selectedPiece = undefined;
      return;
    }
    onPieceCellClick(selectedPiece, event);
  } else {
    if (tryMove(selectedPiece, row, col)) {
      if (!boardData.isEmpty(row, col)) {
        if(boardData.getPiece(row, col).type === KING && winner === undefined){
          winner = selectedPiece.player;
        }
        removePhotoElem(row, col);
      }
      boardData.movePiece(selectedPiece, row, col);
      selectedPiece = undefined;
    } else {
      if (!boardData.isEmpty(row, col)) {
        selectedPiece = boardData.getPiece(row, col);
        if(isPlayerTurn(selectedPiece)){
          selectedPiece = undefined;
          return;
        }
        onPieceCellClick(selectedPiece, event);
        return;
      }
      onPieceCellClick(selectedPiece, event);
      selectedPiece = undefined;
    }
  }

  if(winner !== undefined){
    finishGame(winner);
  }
}

function onPieceCellClick(piece, event) {
  boardData.clearTable();
  selectedCell = event.currentTarget;
  selectedCell.classList.add("selected_square");
  let possibleMoves = piece.getPossibleMoves();
  for (let possibleMove of possibleMoves) {
    tbl.rows[possibleMove[0]].cells[possibleMove[1]].classList.add("path_square");
  }
}

function finishGame(winner){
  console.log(winner + " player won!!!")
}