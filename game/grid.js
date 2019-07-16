// Creating array by making a 2D Array
function make2DArray(cols, rows) {
    let arr = new Array(cols);
    // Iterate through the array
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);       
    }
    return arr;
}

// grid is our variable that holds the 2D array
let grid;
let cols;
let rows;
let resolution = 40;

// Setup function to setup the whole array
// i is columns, j is rows
function setup() {
    createCanvas(400, 400);
    cols = width / resolution;
    rows = height / resolution;
    grid = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = Math.floor(Math.random() * 2);
        }
    }
}

// x = columns / 40
// y = rows / 40
function draw() {
    background(0);

    // let next = make2DArray(cols, rows);

    // //Compute next based on grid

    // grid = next;

    //initial 2D Array
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * resolution;
            let y = j * resolution
            if (grid[i][j] == 1) {
                fill(255);
                stroke(0)
                rect(x, y, resolution-1, resolution-1) 
            }  
        }
    }

    let next = make2DArray(cols, rows);

    //Compute next based on grid
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {

            //Count Live Neighbors
            // let sum = 0;
            // sum += grid[i-1][j+1];//ul
            // sum += grid[i][j+1];//u
            // sum += grid[i+1][j+1];//ur
            // sum += grid[i+1][j];//r
            // sum += grid[i+1][j-1];//br
            // sum += grid[i][j-1];//b
            // sum += grid[i-1][j-1];//bl
            // sum += grid[i-1][j];//l
            let neighbors = count(grid, i, j);

        }
    }

    grid = next;
}

// function countNeighbors(grid, x, y){
//     let sum = 0;
//     for (let i = -1; i < 2; i++){
//         for (let j = -1; j < 2; j++){
//             sum += grid[i][j];
//         }
//     }
//     sum -= grid[x][y];
//     return sum;
// }

//Rules for Algorithm
//Definitions: Neighbors = 8 surrounding cells (ul, u, ur, r, br, b, bl, l)
//States: Dead = 0, Live = 1
//Next: 
//Dead Becomes Live if State(0) had 3 live neighbors
//Live Becomes Dead if State(1) had less than 2 neighbors
//or more than 3 neighbors