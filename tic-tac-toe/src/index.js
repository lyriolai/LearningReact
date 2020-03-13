import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//     render() {
//       return (
//         <button 
//             className="square" 
//             onClick={() => { this.props.onClick()}}
//         >
//           {this.props.value}
//         </button>
//       );
//     }
//   }
  function Square(props){
      return(
          <button className={props.className}
                    onClick={props.onClick}
          >
              {props.value}
          </button>
      );
  }

//   function BoardHistory(props){
//         return(
//             <tr>
//                 <td>{props.stepNumber}</td>
//                 <td>{props.row}</td>
//                 <td>{props.col}</td>
//             </tr>
//         );
//   }

  class Board extends React.Component {
    
    renderSquare(i) {
      return <Square 
              key={i}
              value={this.props.squares[i]}
              onClick= {()=> this.props.onClick(i)}
              className = {this.props.end.includes(i) ? "square end" : "square"}
       />;
    }
    renderBoard(){
        return (
            <div>
            {
                [0,1,2].map((row,index) => {
                    return (
                        <div key={row} className="board-row">
                            { [1,2,3].map((col,index) => {
                                    return(
                                        this.renderSquare(row * 3 + col - 1)
                                    )                                  
                                })
                            }
                        </div>
                    )
                })
            }
            </div>
        )
  
    }
    render() {
    //   return (
    //     <div>
    //       <div className="board-row">
    //         {this.renderSquare(0)}
    //         {this.renderSquare(1)}
    //         {this.renderSquare(2)}
    //       </div>
    //       <div className="board-row">
    //         {this.renderSquare(3)}
    //         {this.renderSquare(4)}
    //         {this.renderSquare(5)}
    //       </div>
    //       <div className="board-row">
    //         {this.renderSquare(6)}
    //         {this.renderSquare(7)}
    //         {this.renderSquare(8)}
    //       </div>
    //     </div>
    //   );
    return (
        this.renderBoard()
    )
    }
  }
  
  class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [
                {
                    squares : Array(9).fill(null),
                    pos : [],
                    player : null,
                    end : null
                }
            ],
            stepNumber : 0,
            xIsNext: true,
            result : null,
            selectedStep : null
        }
    }

    handleClick(i){
        const history = this.state.history.slice(0,this.state.stepNumber + 1);

        const current = history[history.length - 1];

        const squares = current.squares.slice();
        
        

        if(squares[i] || this.state.result){
            return;
        }
        
        var player = this.state.xIsNext ? 'X' : 'O';
        squares[i] = player;
        var result = null;
        var end = calculateWinner(squares);
        if(end){
            result = player;
        }
        else if(end === null && history.length === 9){
            result = 'Draw';
        }

        this.setState({
            history:history.concat([{
                squares:squares,
                pos : [Math.floor( i / 3 ) + 1, i % 3 + 1] ,
                player : player,
                end : end
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            result: result,
            selectedStep: null
        });
    }

    jumpTo(step,result){
        this.setState({
            stepNumber : step,
            xIsNext: (step % 2) === 0,
            result: result,
            selectedStep : step
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        const moves = history.map((step,move) => {
            const desc = move ? 'Go to move #' + move + '.Location [' + step.pos[0] + ',' + step.pos[1] + '] . Player : ' + step.player + '' : 'Go to the game start';
            return (
                <li key={move}>
                <button className={this.state.selectedStep === move ? "bold" : ""} onClick={() => this.jumpTo(move,step.result)}>{desc}</button> 
              </li>
            );
        });

        let status;

        if(this.state.result === 'Draw'){
            status = 'Draw !!!!!!!!!!';
        }
        else if(this.state.result){
            status = 'Winner :' + this.state.result;
        }
        else {
            status = 'Next player:' + (this.state.xIsNext ? 'X' : 'O')
        }
      return (
        <div className="game">
          <div className="game-board">
            <Board
                squares = {current.squares}
                onClick={(i) => this.handleClick(i)}
                end = {current.end ?? []}
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
        return lines[i];
      }
    }
    return null;
  }