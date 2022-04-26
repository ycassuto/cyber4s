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
