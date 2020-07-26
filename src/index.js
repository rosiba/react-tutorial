import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
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

	renderBoardRow(row) {
		const perRow = 3;
		const squares = [];
		for (let i = 0; i < perRow; i++) {
			squares.push(this.renderSquare(i + perRow * row));
		}
		return (
			<div key={row} className="board-row">
				{squares}
			</div>
		);
	}

	renderBoardRows() {
		const maxRows = 3;
		const boardRows = [];
		for (let i = 0; i < maxRows; i++) {
			boardRows.push(this.renderBoardRow(i));
		}
		return boardRows;
	}

	render() {
		return <div>{this.renderBoardRows()}</div>;
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [
				{
					squares: Array(9).fill(null),
				},
			],
			stepNumber: 0,
			xIsNext: true,
			ascending: true,
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? "X" : "O";
		this.setState({
			history: history.concat([
				{
					lastMove: i,
					squares: squares,
				},
			]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: step % 2 === 0,
		});
	}

	handleSort() {
		this.setState({
			ascending: !this.state.ascending,
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map((step, move) => {
			const row = Math.floor(step.lastMove / 3) + 1;
			const col = (step.lastMove % 3) + 1;
			const desc = move
				? "Move " + move + ":  (" + row + "," + col + ")"
				: "Beginning";

			return (
				<li key={move}>
					<button
						style={move === this.state.stepNumber ? { fontWeight: "bold" } : {}}
						onClick={() => this.jumpTo(move)}
					>
						{desc}
					</button>
				</li>
			);
		});

		const sortedMoves = () => {
			let reversed = !this.state.ascending;
			// if (!this.state.ascending) {
			// 	reversed = true;
			// }
			return (
				<ol reversed={reversed}>
					{this.state.ascending ? moves : moves.reverse()}
				</ol>
			);
		};

		var sortButton = () => {
			const sortType = this.state.ascending ? "Ascending" : "Descending";
			return (
				<div>
					<button onClick={() => this.handleSort()}>Sort: {sortType}</button>
				</div>
			);
		};

		let status;
		if (winner) {
			status = "Winner: " + winner;
		} else {
			status = "Next player: " + (this.state.xIsNext ? "X" : "O");
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
					{sortButton()}
					<div>{status}</div>
					{sortedMoves()}
				</div>
			</div>
		);
	}
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

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
