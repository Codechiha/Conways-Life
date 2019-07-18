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
let resolution = 10;

// Setup function to setup the whole array
// i is columns ( x axis ), j is rows ( y axis )
function setup() {
    createCanvas(600, 400);
    cols = width / resolution;
    rows = height / resolution;

    grid = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = floor(random(2));
        }
    }
}

// x = columns / 40
// y = rows / 40
function draw() {
    background(0);

    //initial 2D Array
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * resolution;
            let y = j * resolution;
            if (grid[i][j] == 1) {
                fill(255);
                stroke(0);
                rect(x, y, resolution - 1, resolution - 1); 
            }  
        }
    }

    //Next State
    let next = make2DArray(cols, rows);

    //Compute next based on grid
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let state = grid[i][j];
            //Count Live Neighbors
            // sum += grid[i-1][j+1];//ul
            // sum += grid[i][j+1];//u
            // sum += grid[i+1][j+1];//ur
            // sum += grid[i+1][j];//r
            // sum += grid[i+1][j-1];//br
            // sum += grid[i][j-1];//b
            // sum += grid[i-1][j-1];//bl
            // sum += grid[i-1][j];//l
            let neighbors = countNeighbors(grid, i, j);
            
            //Next state behaves based on these rules 
                //Rules for Algorithm
                //Definitions: Neighbors = 8 surrounding cells (ul, u, ur, r, br, b, bl, l)
                //States: Dead = 0, Live = 1
                //Next: 
                //Dead Becomes Live if State(0) had 3 live neighbors
                //Live Becomes Dead if State(1) had < 2 neighbors or > 3 neighbors
                //Otherwise, stay the same
            if (state == 0 && neighbors == 3) {
                next[i][j] = 1;
            } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
                next[i][j] = 0;
            } else {
                next[i][j] = state;
            }
        }
    }
    grid = next;
}

function countNeighbors(grid, x, y){
    let sum = 0;
    //iterate through all combinations between the offset count i = -1 and j = -1
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            //Wrap around
            //x example
            //(i + x + cols) % cols
            //(-1 + 9 + 10) % 10 = 8
            //(-1 + 0 + 10) % 10 = 9
            //(-1 + 1 + 10) % 10 = 0
            //(-1 + 2 + 10) % 10 = 1
            //(-1 + 3 + 10) % 10 = 2
            
            let colWrap = (i + x + cols) % cols;
            let rowWrap = (j + y + rows) % rows;

            sum += grid[colWrap][rowWrap];
        }
    }
    //removes the cell in question
    sum -= grid[x][y];
    return sum;
}

