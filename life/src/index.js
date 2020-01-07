import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ButtonToolbar, Dropdown, DropdownButton } from 'react-bootstrap';

//1. Create the Main Component that will Contain everything
//1a. Everything is Title, Grid, Generation count
//2. set up contructor and super() for props passing later
//3. In the Main state, initialize the generation variable that will be used later
//4. Create Grid component

class Box extends React.Component {
    //This selectBox belongs to Box Component, but will call the selectBox function
    //of the selectBox function from the Main Component
    selectBox = () => {
        this.props.selectBox(this.props.row, this.props.col)
    }

    render() {
        return(
            <div
                className = {this.props.boxClass}
                id = {this.props.id}
                onClick = {this.selectBox}    
            />
            //this.selectBox indicates the selectBox function in this Component.
        );
    }
}

class Grid extends React.Component {
    render() {
        const width = (this.props.cols * 14);
        var rowsArr = []

        var boxClass = "";
        //For every coordinate of rows and cols
        //Create a box ID
        //use CSS for box on and box off
        //push a Box Component per coordinate
        //The Box component will have properties and selected function
        for (var i = 0; i < this.props.rows; i++) {
            for (var j = 0; j < this.props.cols; j++) {
                let boxId = i + "_" + j;

                boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
                rowsArr.push(
                    <Box 
                        boxClass = {boxClass}
                        key = {boxId}
                        boxId = {boxId}
                        row = {i}
                        col = {j}
                        selectBox = {this.props.selectBox}
                    />
                );
            }
        }
        return(
            <div className="grid" style={{width: width}}>
                {rowsArr}
            </div>
        );
    }
}

class Buttons extends React.Component {
    
    render() {
        return (
            <div className="center">
                <ButtonToolbar>
                    <button className="btn btn-default" onClick={this.props.playButton}>
                        Play
                    </button>
                    <button className="btn btn-default" onClick={this.props.pauseButton}>
                        Pause
                    </button>
                    <button className="btn btn-default" onClick={this.props.clear}>
                        Clear
                    </button>
                    <button className="btn btn-default" onClick={this.props.slow}>
                        Slow
                    </button>
                    <button className="btn btn-default" onClick={this.props.fast}>
                        Fast
                    </button>
                    <button className="btn btn-default" onClick={this.props.seed}>
                        Seed
                    </button>
                    <DropdownButton
                        title="Grid Size"
                        id="size-menu"
                        onSelect={this.handleSelect}
                    >
                        <Dropdown.Item eventKey="1">20x10</Dropdown.Item>
                        <Dropdown.Item eventKey="2">50x30</Dropdown.Item>
                        <Dropdown.Item eventKey="3">70x10</Dropdown.Item>
                    </DropdownButton>     
                </ButtonToolbar>
            </div>
        )
    }
}

class Main extends React.Component {
    constructor() {
        super();
        //speed, rows, cols not in state so it can be referenced inside the state
        this.speed = 100;
        this.rows = 30;
        this.cols = 50;

        this.state = {
            generation: 0,
            gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false))

        }
    }

    selectBox = (row, col) => {
        let gridCopy = arrayClone(this.state.gridFull);
        gridCopy[row][col] = !gridCopy[row][col];
        this.setState({
            gridFull: gridCopy
        });
    }

    seed = () => {
        let gridCopy = arrayClone(this.state.gridFull);
        for (let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                if (Math.floor(Math.random() * 4) === 1) {
                    gridCopy[i][j] = true;
                }
            }
        }
        this.setState({
            gridFull: gridCopy
        })
    }

    playButton = () => {
        clearInterval(this.intervalId)
        this.intervalId = setInterval(this.play, this.speed);
    }

    pauseButton = () => {
        clearInterval(this.intervalId);
    }

    play = () => {
        let g = this.state.gridFull;
        let g2 = arrayClone(this.state.gridFull);
        //Rules algorithms
        //  1. Births: Each dead cell adjacent to exactly three live neighbors will become live in the next generation.
        //  2. Death by isolation: Each live cell with one or fewer live neighbors will die in the next generation.
        //  3. Death by overcrowding: Each live cell with four or more live neighbors will die in the next generation.
        //  4. Survival: Each live cell with either two or three live neighbors will remain alive for the next generation.
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                //Counting Neighbor
                let count = 0;
                if (i > 0) if (g[i-1][j]) count++;
                if (i > 0 && j > 0) if (g[i-1][j - 1]) count++;
                if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
                if (j < this.cols - 1) if (g[i][j+1]) count++;
                if (j > 0) if (g[i][j - 1]) count++;
                if (i < this.rows - 1) if (g[i + 1][j]) count++;
                if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
                if (i < this.rows - 1 && this.cols - 1) if (g[i + 1][j + 1]) count++;
                // g[i][j] is a live iteration of the grid
                if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
                // !g[i][j] is a dead iteration of the grid
                if (!g[i][j] && count === 3) g2[i][j] = true;
            }
        }
        this.setState({
            gridFull: g2,
            generation: this.state.generation + 1
        });
    }

    //Lifecycle Hook: componentDidMount(){}
    //Loads once component runs
    componentDidMount() {
        this.seed();
        this.playButton();
    }

    render() {
        return (
            <div>
                <h1>The Game of Life</h1>
                <Buttons 
                    playButton={this.playButton}
                    pauseButton={this.pauseButton}
                    slow={this.slow}
                    fast={this.fast}
                    clear={this.clear}
                    seed={this.seed}
                    gridSize={this.gridSize}
                />
                <Grid 
                    gridFull = {this.state.gridFull}
                    rows = {this.rows}
                    cols = {this.cols}
                    selectBox = {this.selectBox}
                />
                <h2>Generation: {this.state.generation} </h2>
            </div>
        );
    }
}

function arrayClone(arr) {
    return JSON.parse(JSON.stringify(arr));
}

ReactDOM.render(<Main />, document.getElementById('root'));