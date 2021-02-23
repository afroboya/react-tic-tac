import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props){
    return <button className="square" onClick={props.onClick}>{props.value}</button> }

class Board extends React.Component {

  renderSquare(i) {
    return <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    return (
      <div>
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
       this.state={
           history:[{squares: Array(9).fill(null), moveText:"No Move"}],
           stepNumber: 0,
           xIsNext: true,
           boardSize: 3, //used for calculating row/col -   can only be 3 currently
       };

   }

    handleClick(i) {
        const history = this.state.history.slice(0,this.state.stepNumber+1);

        //do history
        //update board
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {      return;    }
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        //convert move to text form
        const row = Math.floor(i/this.state.boardSize);
        const col = (i % this.state.boardSize);
        const moveText = `(${row+1},${col+1})`;

        this.setState({
            history: history.concat([{squares: squares, moveText:moveText}]),
            stepNumber:history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

     jumpTo(step){
       this.setState({
           stepNumber:step,
           xIsNext: (step%2 ===0),
       })
     }

  render() {
      const history = this.state.history;

      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const moves = history.map((step,move) => {
          const tempDesc = move ? 'go To move ' + step.moveText : 'Go to game start';
          const desc = this.state.stepNumber === move ? "➤ "+tempDesc : tempDesc;
          return (<li key={move} onClick={()=>this.jumpTo(move)}>
              {desc}
          </li>)
      })




      let status;
      if (winner) {
          status = 'Winner: ' + winner;
      } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
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
          <ol className="history">{moves}</ol>
        </div>
      </div>
    );
  }
}

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

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

