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
    this.checkIfCheck()
  }

  removePieceFromArr(row, col) {
    for (let i = 0; i < this.pieces.length; i++) {
      const piece = this.pieces[i];
      if (piece.row === row && piece.col === col) {
        this.pieces.splice(i, 1);
      }
    }
  }

  checkIfCheck(){
    for(let piece of this.pieces){
      let moves = piece.getPossibleMoves();
      for(let move of moves){
        if(this.getPiece(move[0],move[1]) !== undefined){
          let eatablePiece = this.getPiece(move[0],move[1]);
          if(eatablePiece.opponent === piece.player && eatablePiece.type === KING){
            tbl.rows[eatablePiece.row].cells[eatablePiece.col].classList.add("check");
          }
        }
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
        tbl.rows[i].cells[j].classList.remove("check");
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
