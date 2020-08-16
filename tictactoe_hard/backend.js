/*
    GLOBAL VARIABLES
    isFilled                Keeps track if cell is free/occupied, makes it easier to track state
    content                 Keeps track of contents of cell
    cellObj                 Accessing HTML DOM is slow so cache all cell objects at the start itself
    numCellsFilled          No. of boxes filled till now      

    CONSTANTS
    winComb                 All possible winning combinations
*/

var isFilled    = new Array();
var content     = new Array();
var cellObj     = new Array();
var numCellsFilled  = 0;
var isComputerFirst = false;
var playerSymbol, computerSymbol;
var isGameEnded = false;

const winComb       = [[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6],[0,3,6],[1,4,7],[2,5,8]];
const centerCell    = 4;
const corners       = [0, 2, 6, 8];
const sides         = [1, 3, 5, 7];
const cellIDPrefix  = "div";
const resultHeaderID  = "resultHeader";
const infoParaID      = "infoPara";

//Initialize state
function init(isComputerFirst){  
    isComputerFirst = isComputerFirst;
    for(var i = 0; i < 9; i++){
        isFilled[i]    = false;
        content[i]     = '';
        cellObj[i]     = document.getElementById(cellIDPrefix.concat(i));
    }
    playerSymbol    = (isComputerFirst)? 'O' : 'X';
    computerSymbol  = (isComputerFirst)? 'X' : 'O';
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

//Onload Function
window.onload=function(){
    var rand = Math.floor(Math.random() * 2);
    if(rand){
        init(false);
        document.getElementById(infoParaID).innerHTML = "You play first, you are X and computer is O. Click on any of the boxes";
    }
    else{
        init(true);
        document.getElementById(infoParaID).innerHTML = "Computer has played first, its X and you are O. Click on any of the boxes";
        drawSymbol(centerCell, computerSymbol);//optimal to play center
    }
}

//Draw symbol on the canvas and store state
function drawSymbol(id, symbol){
    cellObj[id].append(symbol);

    //store the variables
    content[id]     = symbol;
    isFilled[id]    = true;
    numCellsFilled++;
}

//Called when someone clicks on Canvas
function cellClicked(idStr){
    if(isGameEnded){
        alert("Game has ended, please click on restart or refresh browser");
        return;
    }
    ID = parseInt(idStr);
    if( isFilled[ID] == false ){
        drawSymbol(ID, playerSymbol);
        sleep(300);//And some delay to make UX better
        checkForWinAndDraw(content[ID]);
        if(!isGameEnded)
            computerMove();   
    }
    else 
        alert("The space is already occupied");
}

//computer move
function computerMove(){
    var move = -1;
    /*
        Priority of Moves
        1. Form your Line
        2. Block opponent's Line
        3. Form your Fork
        4. Block opponent Fork
        5. Take center
        6. Take corner
        7. Take side
    */

    var case1 = formLine(computerSymbol);
    var case2 = formLine(playerSymbol);
    var case3 = formFork(computerSymbol);
    var case4 = formFork(playerSymbol);

    if( case1 != -1 )
        move = case1;

    else if( case2 != -1 )
        move = case2;
    
    else if( case3 != -1)
        move = case3;
    
    else if( case4!=-1)
        move = case4;
    
    else if(!isFilled[centerCell])
        move = centerCell;

    else if( !isFilled[0] || !isFilled[2] || !isFilled[6] || !isFilled[8] ){
        for(var i=0; i<4; i++){
            if(!isFilled[corners[i]]){
                move = corners[i];
                break;
            }
        }
    }

    else{
        for(var i=0; i<4; i++){
            if(!isFilled[sides[i]]){
                move = sides[i];
                break;
            }
        }
    }

    drawSymbol(move, computerSymbol);
    checkForWinAndDraw(content[move]);
}

//Checks if its a win/loss or draw and updates the page
function checkForWinAndDraw(symbol){

    //WIN
    for(var i=0; i<winComb.length; i++){
        if(content[winComb[i][0]]==symbol &&
            content[winComb[i][1]]==symbol &&
            content[winComb[i][2]]==symbol
        ){
            var resultHeaderElement = document.getElementById(resultHeaderID);
            var resultColor;

            if(symbol==playerSymbol){
                resultHeaderElement.innerHTML   = "You have won :)";
                resultColor = "green";
            }
            else{
                resultHeaderElement.innerHTML   = "You have lost :(";
                resultColor = "red";
            }

            resultHeaderElement.style.color = resultColor;
            document.getElementById(cellIDPrefix.concat(winComb[i][0])).style.color = resultColor;
            document.getElementById(cellIDPrefix.concat(winComb[i][1])).style.color = resultColor;
            document.getElementById(cellIDPrefix.concat(winComb[i][2])).style.color = resultColor;
            isGameEnded = true;
        }
    }

    //DRAW
    if( !isGameEnded && numCellsFilled == 9){
        document.getElementById(resultHeaderID).innerHTML="IT's A DRAW";
        isGameEnded = true;
    }
}


//Check if a symbol can form a line and returns index where one has to put symbol, else returns -1
function formLine(symbol){
    for(var i=0; i<winComb.length;i++){
        if(	(content[winComb[i][0]]=='')
            &&(content[winComb[i][1]]==symbol)
            &&(content[winComb[i][2]]==symbol)){
            return winComb[i][0];
        }
        else if ((content[winComb[i][0]]==symbol)
                &&(content[winComb[i][1]]=='')
                &&(content[winComb[i][2]]==symbol))	{
            return winComb[i][1];
        }
        else if((content[winComb[i][0]]==symbol)
                &&(content[winComb[i][1]]==symbol)
                &&(content[winComb[i][2]]=='')){
            return winComb[i][2];
        }
    }
    return -1;
}

/*
    Returns cell where a fork can be formed, else returns -1
    We place the symbol at a unoccupied place and calculate no. of possible line formations
*/
function formFork(symbol){
    for(var i=0; i<9; i++){
        if(content[i]==''){
            content[i]=symbol;
            var count=0;//the number of lines formed
            for(var j=0; j<winComb.length; j++){
                if(	(content[winComb[j][0]]=='')
                    &&(content[winComb[j][1]]==symbol)
                    &&(content[winComb[j][2]]==symbol)){
                    count++;
                }
                if ((content[winComb[j][0]]==symbol)
                    &&(content[winComb[j][1]]=='')
                    &&(content[winComb[j][2]]==symbol))	{
                    count++;
                }
                if((content[winComb[j][0]]==symbol)
                    &&(content[winComb[j][1]]==symbol)
                    &&(content[winComb[j][2]]=='')){
                    count++;
                }
            }
            content[i]='';
            if(count>=2)
                return i;
        }
    }
    return -1;
}
