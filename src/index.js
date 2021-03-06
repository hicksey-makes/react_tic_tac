import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button
        className="square"
        onClick={props.onClick}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  createBoard() {
    let boardOuter = [];
    for (let i = 0; i < 3; i++) {
      let start = 0;
      let stop = 3;
      if (i === 1) {
        start = 3;
        stop = 6;
      } else if (i === 2) {
        start = 6;
        stop = 9;
      }
      let boardInner = [];
      for (let j = start; j < stop; j++) {
        boardInner.push(this.renderSquare(j));
      }
    boardOuter.push(<div className="board-row" key={i}>{boardInner}</div>);
    }
  return boardOuter;
  }

  render() {
    return (
      <div className="board">
        {
          this.createBoard()
        }
      </div>

    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
          squares: Array(9).fill(null),
          positions: [],
        }],
      stepNumber: 0,
      xIsNext: true,
      currentMove: 0
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const positions = current.positions.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // positions[i] = i;
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        positions: positions.concat([i]),
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      // posIndex: this.state.posIndex.concat([i]),
    });

  }

  jumpTo(step) {
    console.log(step);
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    // console.log(this.state.posIndex);
    console.log(this.state.stepNumber);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      //
      // console.log(step);
      // console.log(move);

      const rowsCols = step.positions.map((val, move) => {
        let row;
        let col;
        if (val === 0) {
          row = 1;
          col = 1;
        } else if (val === 1) {
          row = 1;
          col = 2;
        } else if (val === 2) {
          row = 1;
          col = 3;
        } else if (val === 3) {
          row = 2;
          col = 1;
        } else if (val === 4) {
          row = 2;
          col = 2;
        } else if (val === 5) {
          row = 2;
          col = 3;
        } else if (val === 6) {
          row = 3;
          col = 1;
        } else if (val === 7) {
          row = 3;
          col = 2;
        } else if (val === 8) {
          row =3;
          col = 3;
        }
        return [row, col];
      });
      let classDark;
      //
      // console.log(step);
      // console.log(rowsCols);
      return (
        <li key={move}>
          <button className={this.state.stepNumber === move ? "active" : ""} onClick={() => this.jumpTo(move)}>{desc}</button>
          <span>
          {rowsCols[move - 1] && `row: ${rowsCols[move - 1][0]} col: ${rowsCols[move - 1][1]}`}
        </span>
        </li>
      );
    });

    let status;
    if (winner) {
      status = `The winner is: ${winner}`;
    } else {
      status = `Next Player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            positions={current.positions}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
