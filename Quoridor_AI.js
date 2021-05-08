var Grid, Path = [];
var Finder = new PF.BreadthFirstFinder();
function AI_Move() {
    let Min_Length = Infinity, Min_Num;
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

    for (let i = 0; i < Path[Min_Num].length; i++) {
        
    }
}