// js coded by following: https://code.tutsplus.com/tutorials/create-an-html5-canvas-tile-swapping-puzzle--active-10747
// determines amount of puzzle pieces
const DIFFICULTY = 4;
const PUZZLE_TINT = '#00d0ff';

var gameCanvas;
var gameStage;

var image;
var puzzlePieces;
// puzzle variables
var puzW;
var puzH;
// puzzle piece variables
var pieceW;
var pieceH;
var curPiece;
var curDropPiece;

var cntrlMouse;

// create image/canvas and set puzzle piece variables
function startGame(){
    image = new Image();
    image.addEventListener('load', onImage, false);
    image.src = "media/mountain.jpg";
}
function onImage(e){
    pieceW = Math.floor(image.width / DIFFICULTY)
    pieceH = Math.floor(image.height / DIFFICULTY)
    puzW = pieceW * DIFFICULTY;
    puzH = pieceH * DIFFICULTY;
    setGameCanvas();
    startPuzzle();
}
function setGameCanvas(){
    gameCanvas = document.getElementById('canvas');
    gameStage = gameCanvas.getContext('2d');
    gameCanvas.width = puzW;
    gameCanvas.height = puzH;
    gameCanvas.style.border = "1px solid grey";
}
// initialize puzzle and title screen
function startPuzzle(){
    puzzlePieces = [];
    cntrlMouse = {x:0, y:0};
    curPiece = null;
    curDropPiece = null;
    gameStage.drawImage(image, 0, 0, puzW, puzH, 0, 0, puzW, puzH);
    writeTitle("Click to Start Puzzle");
    createPieces();
}
function writeTitle(message){
    gameStage.fillStyle = "#000000";
    gameStage.globalAlpha = .4;
    gameStage.fillRect(100, puzH - 40, puzW - 200, 40);
    gameStage.fillStyle = "#FFFFFF";
    gameStage.globalAlpha = 1;
    gameStage.textAlign = "center";
    gameStage.textBaseline = "middle";
    gameStage.font = "20px Arial";
    gameStage.fillText(message, puzW / 2, puzH - 20);
}
// create puzzle pieces
function createPieces(){
    var i;
    var puzzlePiece;
    var xPosition = 0;
    var yPosition = 0;
    for(i = 0; i < DIFFICULTY * DIFFICULTY; i++){
        puzzlePiece = {};
        puzzlePiece.sx = xPosition;
        puzzlePiece.sy = yPosition;
        puzzlePieces.push(puzzlePiece);
        xPosition += pieceW;
        if(xPosition >= puzW){
            xPosition = 0;
            yPosition += pieceH;
        }
    }
    document.onmousedown = shufflePieces;
}
// shuffle puzzle pieces on canvas
function shufflePieces(){
    puzzlePieces = arrayShuffle(puzzlePieces);
    gameStage.clearRect(0,0, puzW, puzH);
    var i;
    var puzzlePiece;
    var xPosition = 0;
    var yPosition = 0;
    for(i = 0; i < puzzlePieces.length; i++){
        puzzlePiece = puzzlePieces[i];
        puzzlePiece.xPosition = xPosition;
        puzzlePiece.yPosition = yPosition;
        gameStage.drawImage(image, puzzlePiece.sx, puzzlePiece.sy, pieceW, pieceH, xPosition, yPosition, pieceW, pieceH);
        gameStage.strokeRect(xPosition, yPosition, pieceW, pieceH);
        xPosition += pieceW;
        if(xPosition >= puzW){
            xPosition = 0;
            yPosition += pieceH;
        }
    }
    document.onmousedown = onClick;
}
function arrayShuffle(o){
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}
// sets click events (drag/drop)
function onClick(e){
    if(e.layerX || e.layerX == 0){
        cntrlMouse.x = e.layerX - gameCanvas.offsetLeft;
        cntrlMouse.y = e.layerY - gameCanvas.offsetTop;
    }
    else if(e.offsetX || e.offsetX == 0){
        cntrlMouse.x = e.offsetX - gameCanvas.offsetLeft;
        cntrlMouse.y = e.offsetY - gameCanvas.offsetTop;
    }
    curPiece = checkClicked();
    if(curPiece != null){
        gameStage.clearRect(curPiece.xPosition, curPiece.yPosition, pieceW, pieceH);
        gameStage.save();
        gameStage.globalAlpha = .9;
        gameStage.drawImage(image, curPiece.sx, curPiece.sy, pieceW, pieceH,
            cntrlMouse.x - (pieceW / 2), cntrlMouse.y - (pieceH / 2 ), pieceW, pieceH);
        gameStage.restore();
        document.onmousemove = updateCanvas;
        document.onmouseup = dropPiece; 
    }
    function checkClicked(){
        var i;
        var puzzlePiece;
        for(i = 0; i < puzzlePieces.length; i++){
            puzzlePiece = puzzlePieces[i];
            if(cntrlMouse.x < puzzlePiece.xPosition || cntrlMouse.x > (puzzlePiece.xPosition + pieceW) 
            || cntrlMouse.y < puzzlePiece.yPosition || cntrlMouse.y > (puzzlePiece.yPosition + pieceH)){
                // piece not hit
            }
            else{
                // piece in bounds of click, so return piece
                return puzzlePiece;
            }
        }
        return null;
    }
    function updateCanvas(e){
        curDropPiece = null;
        if(e.layerX || e.layerX == 0){
            cntrlMouse.x = e.layerX - gameCanvas.offsetLeft;
            cntrlMouse.y = e.layerY - gameCanvas.offsetTop;
        }
        else if(e.offsetX || e.offsetX == 0){
            cntrlMouse.x = e.offsetX - gameCanvas.offsetLeft;
            cntrlMouse.y = e.offsetY - gameCanvas.offsetTop;
        }
        gameStage.clearRect(0,0,puzW,puzH);
        var i;
        var puzzlePiece;
        for(i = 0; i < puzzlePieces.length; i++){
            puzzlePiece = puzzlePieces[i];
            if(puzzlePiece == curPiece){
                continue;
            }
            gameStage.drawImage(image, puzzlePiece.sx, puzzlePiece.sy, pieceW, pieceH, 
                puzzlePiece.xPosition, puzzlePiece.yPosition, pieceW, pieceH);
            gameStage.strokeRect(puzzlePiece.xPosition, puzzlePiece.yPosition, pieceW, pieceH);
            if(curDropPiece == null){
                if(cntrlMouse.x < puzzlePiece.xPosition || cntrlMouse.x > (puzzlePiece.xPosition + pieceW) 
                || cntrlMouse.y < puzzlePiece.yPosition || cntrlMouse.y > (puzzlePiece.yPosition + pieceH)){
                    // not over
                }
                else{
                    curDropPiece = puzzlePiece;
                    gameStage.save();
                    gameStage.globalAlpha = .4;
                    gameStage.fillStyle = PUZZLE_TINT;
                    gameStage.fillRect(curDropPiece.xPos, curDropPiece.yPos, 
                        pieceW, pieceH);
                    gameStage.restore();
                }
            }
        }
        
        gameStage.save();
        gameStage.globalAlpha = .6;
        gameStage.drawImage(image, curPiece.sx, curPiece.sy, pieceW, pieceH,
            cntrlMouse.x - (pieceW / 2), cntrlMouse.y - (pieceH / 2), pieceW, pieceH);
        gameStage.restore();
        gameStage.strokeRect(cntrlMouse.x - (pieceW / 2), cntrlMouse.y - (pieceH / 2), pieceW, pieceH);
    }
    function dropPiece(e){
        document.onmousemove = null;
        document.onmouseup = null;
        if(curDropPiece != null){
            var tmp = {xPosition : curPiece.xPosition, yPosition : curPiece.yPosition};
            curPiece.xPosition = curDropPiece.xPosition;
            curPiece.yPosition = curDropPiece.yPosition;
            curDropPiece.xPosition = tmp.xPosition;
            curDropPiece.yPosition = tmp.yPosition;
        }
        resetPuzWinCheck();
    }
    function resetPuzWinCheck(){
        gameStage.clearRect(0,0, puzW, puzH);
        var win = true;
        var i;
        var puzzlePiece;
        for(i = 0; i < puzzlePieces.length; i++){
            puzzlePiece = puzzlePieces[i];
            gameStage.drawImage(image, puzzlePiece.sx, puzzlePiece.sy, pieceW, pieceH, puzzlePiece.xPosition, puzzlePiece.yPosition, pieceW, pieceH)
            gameStage.strokeRect(puzzlePiece.xPosition, puzzlePiece.yPosition, pieceW, pieceH);
            if(puzzlePiece.xPosition != puzzlePiece.sx || puzzlePiece.yPosition != puzzlePiece.sy){
                win = false;
            }
        }
        if(win){
            setTimeout(gameEnd, 500);
        }
    }
    function gameEnd(){
        document.onmousedown = null;
        document.onmousemove = null;
        document.onmouseup = null;
        startPuzzle();
    }
}