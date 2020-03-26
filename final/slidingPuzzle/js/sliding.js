// js coded by following: https://code.tutsplus.com/tutorials/create-an-html5-canvas-tile-swapping-puzzle--active-10747
// determines amount of puzzle pieces
const PUZZLE_DIFFICULTY = 4;
const PUZZLE_HOVER_TINT = '#00d0ff';

var canvas;
var stage;

var img;
var pieces;
var puzzleWidth;
var puzzleHeight;
var pieceWidth;
var pieceHeight;
var currentPiece;
var currentDropPiece;

var mouse;

// create image/canvas and set puzzle piece variables
function startGame(){
    img = new Image();
    img.addEventListener('load', onImage, false);
    img.src = "media/mountain.jpg";
}
function onImage(e){
    pieceWidth = Math.floor(img.width / PUZZLE_DIFFICULTY)
    pieceHeight = Math.floor(img.height / PUZZLE_DIFFICULTY)
    puzzleWidth = pieceWidth * PUZZLE_DIFFICULTY;
    puzzleHeight = pieceHeight * PUZZLE_DIFFICULTY;
    setCanvas();
    initPuzzle();
}
function setCanvas(){
    canvas = document.getElementById('canvas');
    stage = canvas.getContext('2d');
    canvas.width = puzzleWidth;
    canvas.height = puzzleHeight;
    canvas.style.border = "1px solid grey";
}
// initialize puzzle and title screen
function initPuzzle(){
    pieces = [];
    mouse = {x:0, y:0};
    currentPiece = null;
    currentDropPiece = null;
    stage.drawImage(img, 0, 0, puzzleWidth, puzzleHeight, 0, 0, puzzleWidth, puzzleHeight);
    createTitle("Click to Start Puzzle");
    buildPieces();
}
function createTitle(msg){
    stage.fillStyle = "#000000";
    stage.globalAlpha = .4;
    stage.fillRect(100, puzzleHeight - 40, puzzleWidth - 200, 40);
    stage.fillStyle = "#FFFFFF";
    stage.globalAlpha = 1;
    stage.textAlign = "center";
    stage.textBaseline = "middle";
    stage.font = "20px Arial";
    stage.fillText(msg, puzzleWidth / 2, puzzleHeight - 20);
}
// create puzzle pieces
function buildPieces(){
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    for(i = 0; i < PUZZLE_DIFFICULTY * PUZZLE_DIFFICULTY; i++){
        piece = {};
        piece.sx = xPos;
        piece.sy = yPos;
        pieces.push(piece);
        xPos += pieceWidth;
        if(xPos >= puzzleWidth){
            xPos = 0;
            yPos += pieceHeight;
        }
    }
    document.onmousedown = shufflePuzzle;
}
// shuffle puzzle pieces on canvas
function shufflePuzzle(){
    pieces = shuffleArray(pieces);
    stage.clearRect(0,0, puzzleWidth, puzzleHeight);
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    for(i = 0; i < pieces.length; i++){
        piece = pieces[i];
        piece.xPos = xPos;
        piece.yPos = yPos;
        stage.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, xPos, yPos, pieceWidth, pieceHeight);
        stage.strokeRect(xPos, yPos, pieceWidth, pieceHeight);
        xPos += pieceWidth;
        if(xPos >= puzzleWidth){
            xPos = 0;
            yPos += pieceHeight;
        }
    }
    document.onmousedown = onPuzzleClick;
}
function shuffleArray(o){
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}
// sets click events (drag/drop)
function onPuzzleClick(e){
    if(e.layerX || e.layerX == 0){
        mouse.x = e.layerX - canvas.offsetLeft;
        mouse.y = e.layerY - canvas.offsetTop;
    }
    else if(e.offsetX || e.offsetX == 0){
        mouse.x = e.offsetX - canvas.offsetLeft;
        mouse.y = e.offsetY - canvas.offsetTop;
    }
    currentPiece = checkPieceClicked();
    if(currentPiece != null){
        stage.clearRect(currentPiece.xPos, currentPiece.yPos, pieceWidth, pieceHeight);
        stage.save();
        stage.globalAlpha = .9;
        stage.drawImage(img, currentPiece.sx, currentPiece.sy, pieceWidth, pieceHeight,
            mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2 ), pieceWidth, pieceHeight);
        stage.restore();
        document.onmousemove = updatePuzzle;
        document.onmouseup = pieceDropped; 
    }
    function checkPieceClicked(){
        var i;
        var piece;
        for(i = 0; i < pieces.length; i++){
            piece = pieces[i];
            if(mouse.x < piece.xPos || mouse.x > (piece.xPos + pieceWidth) 
            || mouse.y < piece.yPos || mouse.y > (piece.yPos + pieceHeight)){
                // piece not hit
            }
            else{
                // piece in bounds of click, so return piece
                return piece;
            }
        }
        return null;
    }
    function updatePuzzle(e){
        currentDropPiece = null;
        if(e.layerX || e.layerX == 0){
            mouse.x = e.layerX - canvas.offsetLeft;
            mouse.y = e.layerY - canvas.offsetTop;
        }
        else if(e.offsetX || e.offsetX == 0){
            mouse.x = e.offsetX - canvas.offsetLeft;
            mouse.y = e.offsetY - canvas.offsetTop;
        }
        stage.clearRect(0,0,puzzleWidth,puzzleHeight);
        var i;
        var piece;
        for(i = 0; i < pieces.length; i++){
            piece = pieces[i];
            if(piece == currentPiece){
                continue;
            }
            stage.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, 
                piece.xPos, piece.yPos, pieceWidth, pieceHeight);
            stage.strokeRect(piece.xPos, piece.yPos, pieceWidth, pieceHeight);
            if(currentDropPiece == null){
                if(mouse.x < piece.xPos || mouse.x > (piece.xPos + pieceWidth) 
                || mouse.y < piece.yPos || mouse.y > (piece.yPos + pieceHeight)){
                    // not over
                }
                else{
                    currentDropPiece = piece;
                    stage.save();
                    stage.globalAlpha = .4;
                    stage.fillStyle = PUZZLE_HOVER_TINT;
                    stage.fillRect(currentDropPiece.xPos, currentDropPiece.yPos, 
                        pieceWidth, pieceHeight);
                    stage.restore();
                }
            }
        }
        
        stage.save();
        stage.globalAlpha = .6;
        stage.drawImage(img, currentPiece.sx, currentPiece.sy, pieceWidth, pieceHeight,
            mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
        stage.restore();
        stage.strokeRect(mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
    }
    function pieceDropped(e){
        document.onmousemove = null;
        document.onmouseup = null;
        if(currentDropPiece != null){
            var tmp = {xPos : currentPiece.xPos, yPos : currentPiece.yPos};
            currentPiece.xPos = currentDropPiece.xPos;
            currentPiece.yPos = currentDropPiece.yPos;
            currentDropPiece.xPos = tmp.xPos;
            currentDropPiece.yPos = tmp.yPos;
        }
        resetPuzzleAndCheckWin();
    }
    function resetPuzzleAndCheckWin(){
        stage.clearRect(0,0, puzzleWidth, puzzleHeight);
        var gameWin = true;
        var i;
        var piece;
        for(i = 0; i < pieces.length; i++){
            piece = pieces[i];
            stage.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, piece.xPos, piece.yPos, pieceWidth, pieceHeight)
            stage.strokeRect(piece.xPos, piece.yPos, pieceWidth, pieceHeight);
            if(piece.xPos != piece.sx || piece.yPos != piece.sy){
                gameWin = false;
            }
        }
        if(gameWin){
            setTimeout(gameOver, 500);
        }
    }
    function gameOver(){
        document.onmousedown = null;
        document.onmousemove = null;
        document.onmouseup = null;
        initPuzzle();
    }
}