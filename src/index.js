import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props){
    return <button className={`square ${props.highlight ? "active":""}`} onClick={props.onClick}>{props.value}</button> }

class Row extends React.Component{
    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            highlight={this.props.highlight.includes(i)}
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
            board.push(<Row startIndex = {i} rowLength = {rowLength} squares = {this.props.squares} onClick={this.props.onClick} highlight={this.props.highlight}/>);
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
       const boardSize =3;
       this.state={
           boardSize: boardSize,
           history:[{squares: Array(boardSize*boardSize).fill(null), row:null, col:null,moveText:"No Move",winner:[null]}],
           stepNumber: 0,
           xIsNext: true,
           highlight:Array(boardSize*boardSize).fill(null),
       };

   }

    handleClick(i) {

        const history = this.state.history.slice(0,this.state.stepNumber+1);

        //do history
        //update board
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();
        //if square filled or winner exists in history

        if (squares[i] || current.winner[0] !==  null) {     return;    }


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
               winner = [-1];
           }
        }
        if(!winner){
            winner = Array(this.state.boardSize).fill(null);
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
      if(current.winner[0] === -1){
          //tie
          status = "tie";
      }else if (current.winner[0] !== null ) {
          status = 'Winner: ' + current.squares[current.winner[0]];
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
              highlight={current.winner}
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
    const arrIndex = [];
    for(let i=startIndex;i<startIndex+boardSize;i++){
        if(squares[i] !== desiredIcon ){
            return null;
        }
        arrIndex.push(i);
    }

    return arrIndex;
}
function checkVertical(squares,row,col,boardSize){
    const index = convertToIndex(row,col,boardSize);
    const desiredIcon = squares[index];
    const arrIndex = [];
    for(let i=0;i<boardSize;i++){
        const curIndex = convertToIndex(i,col,boardSize);
        if(squares[curIndex] !== desiredIcon){
            return null
        }
        arrIndex.push(curIndex);
    }

    return arrIndex;
}
function downLeft(squares,boardSize,desiredIcon){
    const arrIndex = [];
    const step = boardSize-1;
    for(let i=step;i<=(boardSize*step);i=i+step){
        if(squares[i]!== desiredIcon){
            return null;
        }
        arrIndex.push(i);
    }
    return arrIndex;
}
function downRight(squares,boardSize,desiredIcon){
    const arrIndex = [];
    for(let i=0;i<squares.length;i=i+(boardSize+1)){
        if(squares[i]!== desiredIcon){
            return null;
        }
        arrIndex.push(i);
    }
    return arrIndex;
}
function checkDiag(squares,row,col,boardSize){
    const index = convertToIndex(row,col,boardSize);

    const desiredIcon = squares[index];

    const doDownleft = (index%(boardSize-1) === 0);
    const doDownRight = (index%(boardSize+1) === 0);


    if(doDownleft){
        const result = downLeft(squares,boardSize,desiredIcon);
        if(result!==null) {
            return result;
        }
    }
    if(doDownRight){
        const result = downRight(squares,boardSize,desiredIcon)
        if(result!==null) {
            return result;
        }
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

