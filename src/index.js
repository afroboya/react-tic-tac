import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props){
    return <button className="square" onClick={props.onClick}>{props.value}</button> }

class Row extends React.Component{
    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />;
    }
    doRow(){
        const row = [];
        for(let i =this.props.startIndex;i<this.props.startIndex+this.props.rowLength;i++){
            row.push(this.renderSquare(i));
        }
        return row;
    }
    render(){
        return <div className="board-row">{this.doRow()}</div>;
    }
}

class Board extends React.Component {

    createBoard() {
       const rowLength = this.props.boardSize;
        const board = [];

        for (let i = 0; i < this.props.squares.length; i= i+rowLength) {
            board.push(<Row startIndex = {i} rowLength = {rowLength} squares = {this.props.squares} onClick={this.props.onClick} />);
        }
        return board;
    }

  render() {
     // debugger
    return (
      <div>
        {this.createBoard()}
      </div>
    );
  }


}

class Game extends React.Component {
   constructor(props) {
       super(props);
       const boardSize =4; //used for calculating row/col -   can only be 3 currently due to winning alg
       this.state={
           boardSize: boardSize,
           history:[{squares: Array(boardSize*boardSize).fill(null), row:null, col:null,moveText:"No Move",winner:null}],
           stepNumber: 0,
           xIsNext: true,

       };

   }

    handleClick(i) {

        const history = this.state.history.slice(0,this.state.stepNumber+1);

        //do history
        //update board
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();
        //if square filled or winner exists in history
        if (squares[i]||current.winner) {      return;    }


        //update squares
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        const row = Math.floor(i/this.state.boardSize);
        const col = (i % this.state.boardSize);
        //check for win
        let winner = calculateWinner(squares,row,col,i,this.state.boardSize);
        //convert move to text form

        if(this.state.history[0].squares.length === this.state.history.length){
            //tie game
           if(winner === null){
               winner = "Tie";
           }
        }

        this.setState({
            history: history.concat([{squares: squares, row:row,col:col,winner:winner}]),
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



      const moves = history.map((step,move) => {
          const moveText = `(${step.row+1},${step.col+1})`;
          const tempDesc = move ? 'go To move ' + moveText : 'Go to game start';
          const desc = this.state.stepNumber === move ? "➤ "+tempDesc : tempDesc;
          return (<li key={move} onClick={()=>this.jumpTo(move)}>
              {desc}
          </li>)
      })




      let status;
      if (current.winner) {
          status = 'Winner: ' + current.winner;
      } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

    return (
      <div className="game">
        <div className="game-board">
          <Board
              boardSize = {this.state.boardSize}
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

function convertToIndex(row,col,size){return row*size+col; }

function checkAcross(squares,row,col, boardSize){
    const index = convertToIndex(row,col,boardSize);
    const startIndex = index - col;
    const desiredIcon = squares[index];

    for(let i=startIndex;i<startIndex+boardSize;i++){
        if(squares[i] !== desiredIcon ){
            return null;
        }
    }

    return desiredIcon;
}
function checkVertical(squares,row,col,boardSize){
    const index = convertToIndex(row,col,boardSize);
    const desiredIcon = squares[index];

    for(let i=0;i<boardSize;i++){

        if(squares[convertToIndex(i,col,boardSize)] !== desiredIcon){
            return null
        }
    }

    return desiredIcon;
}
function downLeft(squares,boardSize,desiredIcon){

    const step = boardSize-1;
    for(let i=step;i<=(boardSize*step);i=i+step){
        if(squares[i]!== desiredIcon){
            return null;
        }
    }
    return desiredIcon;
}
function downRight(squares,boardSize,desiredIcon){
    for(let i=0;i<squares.length;i=i+(boardSize+1)){
        if(squares[i]!== desiredIcon){

            return null;
        }
    }
    return squares[boardSize];
}
function checkDiag(squares,row,col,boardSize){
    const index = convertToIndex(row,col,boardSize);

    const desiredIcon = squares[index];

    const doDownleft = (index%(boardSize-1) === 0);
    const doDownRight = (index%(boardSize+1) === 0);


    if(doDownleft && downLeft(squares,boardSize,desiredIcon)!==null){
        return desiredIcon;
    }
    if(doDownRight && downRight(squares,boardSize,desiredIcon)!==null){
        return desiredIcon;
    }
    return null;
}
function calculateWinner(squares,row,col,index,boardSize) {
    const across = checkAcross(squares,row,col,boardSize);
    const vertical = checkVertical(squares,row,col,boardSize);
    const diag = checkDiag(squares,row,col,boardSize);
    if(across){console.log("across: "+across);return across}
    if(vertical){console.log("vertical: "+vertical);return vertical}
    if(diag){console.log("diag: "+diag);return diag}
    return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

