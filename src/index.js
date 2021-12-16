import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button
        className="square"
        /* function definition so not called with every render() */
        onClick={props.onClick}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="status">{}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
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
        }],
      stepNumber: 0,
      xIsNext: true,
      posIndex: [],
      rowsCols: [],
    }
  }

  handleClick(i) {

    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      posIndex: this.state.posIndex.concat([i]),
    });

  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      posIndex: this.state.posIndex.slice(0, step),
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    console.log(this.state.posIndex);
    console.log(this.state.stepNumber);
    // const rowsCols = [];

    // console.log(rowsCols);
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      // let pos = rowsCols.map((xy, index) => {
      //  return `row: ${xy[0]} col: ${xy[1]}`;
      // })
      const rowsCols = this.state.posIndex.map((val, step) => {
        console.log(val);
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
      return (
        <li key={move}>

          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          <p>
            {rowsCols[move] && `row: ${rowsCols[move][0]} col: ${rowsCols[move][1]}`}
          </p>
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
