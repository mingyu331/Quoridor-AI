var Grid, Path = [];
var Finder = new PF.BreadthFirstFinder();
var Min_Length, Min_Num;
function AI_Move() {
    Min_Length = Infinity;
    Grid = new PF.Grid(CurrentGameList);
    for (let i = 0; i < 9; i++) {
        let GridBackup = Grid.clone();
        Path[i] = Finder.findPath(players[0][0] * 2, players[0][1] * 2, i * 2, 16, GridBackup);
        if (Min_Length > Path[i].length) {
            Min_Length = Path[i].length;
            Min_Num = i;
        }
    }
    console.log(Path[Min_Num]);

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
            if (CurrentGameList[y][x] == 1) {
                ctx.rect(20 * x + 750, 20 * y + 50, 20, 20);
                ctx.fill();
            }

        }
    }

    ctx.beginPath();
    ctx.fillStyle = "#156064"
    ctx.strokeStyle = "#156064"

    for (let i = 1; i < Path[Min_Num].length - 1; i++) {
        ctx.rect(20 * Path[Min_Num][i][0] + 750, 20 * Path[Min_Num][i][1] + 50, 20, 20);
        ctx.fill();
    }
}

/*
 *
    for (let y = 0; y < 17; y++) {
        for (let x = 0; x < 17; x++) {
            if (grid[y][x] == 1) {
                ctx.rect(20 * x + 750, 20 * y + 50, 20, 20);
                ctx.fill();
            }

        }
    }
 * */