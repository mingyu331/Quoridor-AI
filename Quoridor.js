
var canvas, ctx;
var walls = [[], []];
var players = [[4, 0], [4, 8]];
var PlayerMovement = [false, 0];
// PlayerMovement[0]: is currently moving
// playerMovement[1]: what player is moving
var Mouse = [0, 0];

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
    ctx.fillStyle = "#156064";
    ctx.strokeStyle = "#156064";
    for (let i = 0; i < walls[0].length; i++) {
        if (!walls[0][i][2]) ctx.rect(80 * (walls[0][i][0]) + 80, 80 * (walls[0][i][1]) + 60, 140, 20);
        else ctx.rect(80 * walls[0][i][0] + 60, 80 * walls[0][i][1] + 80, 20, 140);
        ctx.fill();
    }
    ctx.beginPath();
    ctx.fillStyle = "#ff4200"
    ctx.strokeStyle = "#ff4200"
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
    ctx.beginPath();
    ctx.rect(80 * (players[0][0]) + 80, 80 * (players[0][1]) + 60, 140, 20)
    ctx.fill()
}

function MainLoop(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    DrawBackground();
    DrawWall(walls);
    DrawPlayer(players);
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
            }
        }
    }
    // change player
    //if (CurrentPlayer == 0) CurrentPlayer = 1;
    //else if (CurrentPlayer == 1) CurrentPlayer = 0;
}

function MovePlayer(x, y) {
    var locX = players[CurrentPlayer][0]
    var locY = players[CurrentPlayer][1]
    if (x != 0 && y != 0) return false;
    if (x == 0 && y == 0) return false;
    if (x != 0 && !(IncludesList(walls[0], locX + (x-1)/2, locY - 1, true) || IncludesList(walls[0], locX + (x-1)/2, locY - 2, true) ||
        IncludesList(walls[1], locX + (x-1)/2, locY - 1, true) || IncludesList(walls[0], locX + (x-1)/2, locY - 2, true))) {
        players[CurrentPlayer][0] += x;
    }
    if (y != 0 && !(IncludesList(walls[0], locX + 1, locY + (3 + y) / 2, false) || IncludesList(walls[0], locX, locY + (3 + y) / 2, false) ||
        IncludesList(walls[1], locX + 1, locY + (3 + y) / 2, false) || IncludesList(walls[0], locX, locY + (3 + y) / 2, false))) {
        players[CurrentPlayer][1] += y;
    }
    //if (CurrentPlayer == 0) CurrentPlayer = 1;
    //else if (CurrentPlayer == 1) CurrentPlayer = 0;
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
                if ((clickX == players[0][0] && clickY == players[0][1]) || (clickX == players[1][0] && clickY == players[1][1])) PlayerMovement[0] = true;
                if (clickX == players[0][0] && clickY == players[0][1]) PlayerMovement[1] = 0;
                if (clickX == players[1][0] && clickY == players[1][1]) PlayerMovement[1] = 1;
            }
            else {
                // change player location
                MovePlayer(clickX - players[CurrentPlayer][0], clickY - players[CurrentPlayer][1]);
                PlayerMovement[0] = false;
            }
        }
    });

    canvas.addEventListener('mousemove', (event) => {
        Mouse[0] = event.offsetX;
        Mouse[1] = event.offsetY;
    });

    MainLoop(0);
}
