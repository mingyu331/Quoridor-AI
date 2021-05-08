
var canvas, ctx;
var walls = [[], []];
var players = [[4, 0], [4, 8]];
var PlayerMovement = [false, 0];
// PlayerMovement[0]: is currently moving
// playerMovement[1]: what player is moving
var Mouse = [0, 0];
var CurrentGameList = [];

function DrawBackground() {
    ctx.beginPath();
    ctx.fillStyle = "#00c49a";
    ctx.strokeStyle = "#00c49a";
    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            ctx.rect(80 * x, 80 * y, 60, 60);
            ctx.fill();
        }
    }
}

function DrawWall(walls) {
    // orientation == 0: --
    // orientation == 1: |
    ctx.beginPath();
    ctx.fillStyle = "#f8e16c";
    ctx.strokeStyle = "#f8e16c";
    for (let i = 0; i < walls[0].length; i++) {
        if (!walls[0][i][2]) ctx.rect(80 * (walls[0][i][0]) + 80, 80 * (walls[0][i][1]) + 60, 140, 20);
        else ctx.rect(80 * walls[0][i][0] + 60, 80 * walls[0][i][1] + 80, 20, 140);
        ctx.fill();
    }
    ctx.beginPath();
    ctx.fillStyle = "#ff3562"
    ctx.strokeStyle = "#ff3562"
    for (let i = 0; i < walls[1].length; i++) {
        if (!walls[1][i][2]) ctx.rect(80 * (walls[1][i][0]) + 80, 80 * (walls[1][i][1]) + 60, 140, 20);
        else ctx.rect(80 * walls[1][i][0] + 60, 80 * walls[1][i][1] + 80, 20, 140);
        ctx.fill();
    }
}

function DrawPlayer(player) {
    ctx.fillStyle = "#f8e16c";
    ctx.strokeStyle = "#f8e16c";
    ctx.beginPath()
    if (!PlayerMovement[0] || (PlayerMovement[1] == 1 && PlayerMovement[0])) ctx.arc(80 * player[0][0] + 30, 80 * player[0][1] + 30, 20, 0, Math.PI * 2, false);
    else if (PlayerMovement[0] && PlayerMovement[1] == 0) ctx.arc(Mouse[0], Mouse[1], 20, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = "#ff3562";
    ctx.strokeStyle = "#ff3562";
    ctx.beginPath();
    if (!PlayerMovement[0] || (PlayerMovement[1] == 0 && PlayerMovement[0])) ctx.arc(80 * player[1][0] + 30, 80 * player[1][1] + 30, 20, 0, Math.PI * 2, false);
    else if (PlayerMovement[0] && PlayerMovement[1] == 1) ctx.arc(Mouse[0], Mouse[1], 20, 0, Math.PI * 2, false);
    ctx.fill();
}

function MainLoop(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    DrawBackground();
    DrawWall(walls);
    DrawPlayer(players);
    CurrentGameList = GetGrid(walls);
    window.requestAnimationFrame(MainLoop);
}

function IncludesList(wall, locX, locY, rot) {
    for (let i = 0; i < wall.length; i++) {
        if (wall[i][0] == locX && wall[i][1] == locY && wall[i][2] == rot) return true;
    }
    return false;
}

// code for ai
var CurrentPlayer = 0;
function PlaceWall(locX, locY, rot) {
    if (walls[CurrentPlayer].length < 10) {
        if (!(IncludesList(walls[0], [locX, locY, rot]) || IncludesList(walls[1], [locX, locY, rot]))) {
            if (rot) {
                if (!(
                    IncludesList(walls[0], locX - 1, locY + 1, 0) ||
                    IncludesList(walls[0], locX, locY - 1, 1) ||
                    IncludesList(walls[0], locX, locY + 1, 1) ||
                    IncludesList(walls[1], locX - 1, locY + 1, 0) ||
                    IncludesList(walls[1], locX, locY - 1, 1) ||
                    IncludesList(walls[1], locX, locY + 1, 1)
                )) {
                    walls[CurrentPlayer].push([locX, locY, rot]);
                }
                else return false;
            }
            else if (!rot) {
                if (!(
                    IncludesList(walls[0], locX + 1, locY - 1, 1) ||
                    IncludesList(walls[0], locX - 1, locY, 0) ||
                    IncludesList(walls[0], locX + 1, locY, 0) ||
                    IncludesList(walls[1], locX + 1, locY - 1, 1) ||
                    IncludesList(walls[1], locX - 1, locY, 0) ||
                    IncludesList(walls[1], locX + 1, locY, 0)
                )) {
                    walls[CurrentPlayer].push([locX, locY, rot]);
                }
                else return false;
            }
        }
    }
    // change player
    if (CurrentPlayer == 0) CurrentPlayer = 1;
    else if (CurrentPlayer == 1) CurrentPlayer = 0;
    return true;
}

function MovePlayer(x, y) {
    var locX = players[CurrentPlayer][0]
    var locY = players[CurrentPlayer][1]
    if (x != 0 && y != 0) return false;
    if (x == 0 && y == 0) return false;

    if (x == 1 && !(IncludesList(walls[0], locX, locY - 1, true) || IncludesList(walls[0], locX, locY - 2, true))) players[CurrentPlayer][0] += 1;
    else if (x == -1 && !(IncludesList(walls[0], locX - 1, locY - 1, true) || IncludesList(walls[0], locX, locY - 2, true))) players[CurrentPlayer][0] -= 1;
    else if (y == 1 && !(IncludesList(walls[0], locX - 1, locY, false) || IncludesList(walls[0], locX - 2, locY, false))) players[CurrentPlayer][1] += 1;
    else if (y == -1 && !(IncludesList(walls[0], locX - 1, locY - 1, false) || IncludesList(walls[0], locX - 2, locY - 1, false))) players[CurrentPlayer][1] -= 1;
    else return false;

    if (CurrentPlayer == 0) CurrentPlayer = 1;
    else if (CurrentPlayer == 1) CurrentPlayer = 0;
}

function GetGrid(wall) {
    var grid = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    for (let i = 0; i < walls[0].length; i++) {
        if (wall[0][i][2] == true) {
            console.log(wall[0][i])
            grid[wall[0][i][1] * 2 + 2][wall[0][i][0] * 2 + 1] = 1;
            grid[wall[0][i][1] * 2 + 4][wall[0][i][0] * 2 + 1] = 1;
        }
        else {
            grid[wall[0][i][1] * 2 + 1][wall[0][i][0] * 2 + 2] = 1;
            grid[wall[0][i][1] * 2 + 1][wall[0][i][0] * 2 + 4] = 1;
        }
    }
    for (let i = 0; i < wall[1].length; i++) {
        if (wall[1][i][2] == true) {
            grid[wall[1][i][1] * 2 + 2][wall[1][i][0] * 2 + 1] = 1;
            grid[wall[1][i][1] * 2 + 4][wall[1][i][0] * 2 + 1] = 1;
        }
        else {
            grid[wall[1][i][1] * 2 + 1][wall[1][i][0] * 2 + 2] = 1;
            grid[wall[1][i][1] * 2 + 1][wall[1][i][0] * 2 + 4] = 1;
        }
    }
    
    // render grid
    ctx.beginPath();
    ctx.strokeStyle = "#f8e16c"
    ctx.fillStyle = "#f8e16c"
    ctx.rect(40 * players[0][0] + 750, 40 * players[0][1] + 50, 20, 20);
    ctx.fill();
    ctx.beginPath();
    ctx.strokeStyle = "#ff3562"
    ctx.fillStyle = "#ff3562"
    ctx.rect(40 * players[1][0] + 750, 40 * players[1][1] + 50, 20, 20);
    ctx.fill();
    ctx.beginPath();
    ctx.stroke = "#777777"
    ctx.fillStyle = "#777777";
    for (let y = 0; y < 17; y++) {
        for (let x = 0; x < 17; x++) {
            if (grid[y][x] == 1) {
                ctx.rect(20 * x + 750, 20 * y + 50, 20, 20);
                ctx.fill();
            }
            
        }
    }
    return grid;
}

// setup
function QuoridorSetup() {
    canvas = document.getElementById('Main');
    ctx = canvas.getContext('2d');

    canvas.addEventListener('click', (event) => {
        var clickX = Math.floor((event.clientX - 10) / 80);
        var clickY = Math.floor((event.clientY - 10) / 80);
        var ot_temp = [(event.clientX - 10) % 80 > 60, (event.clientY - 10) % 80 > 60];
        if (ot_temp[0] || ot_temp[1] && !PlayerMovement[0]) {
            if (ot_temp[0]) clickY -= 1;
            if (ot_temp[1]) clickX -= 1;
            if (!(ot_temp[0] ^ ot_temp[1])) return 0;
            PlaceWall(clickX, clickY, (ot_temp[0] && !ot_temp[1]));
        }
        else {
            if (!PlayerMovement[0]) {
                // move player
                if ((clickX == players[0][0] && clickY == players[0][1] && CurrentPlayer == 0) || (clickX == players[1][0] && clickY == players[1][1] && CurrentPlayer == 1)) PlayerMovement[0] = true;
                if (clickX == players[0][0] && clickY == players[0][1] && CurrentPlayer == 0) PlayerMovement[1] = 0;
                if (clickX == players[1][0] && clickY == players[1][1] && CurrentPlayer == 1) PlayerMovement[1] = 1;
            }
            else {
                // change player location
                MovePlayer(clickX - players[CurrentPlayer][0], clickY - players[CurrentPlayer][1]);
                PlayerMovement[0] = false;
            }
        }
        if (CurrentPlayer == 1) AI_Move();
    });

    canvas.addEventListener('mousemove', (event) => {
        Mouse[0] = event.offsetX;
        Mouse[1] = event.offsetY;
    });

    MainLoop(0);
}
