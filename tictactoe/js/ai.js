/*
    GLOBAL VARIABLES
    painted                 Keeps track if cell is free/occupied
    content                 Keeps track of contents of cell
    winningCombinations     All possible winning combinations
    comp
    boxesFilled             No. of boxes filled till now
    w
*/
var painted;
var content;
var winningCombinations;
var comp;
var turn;
var boxesFilled;

//Onload: initialize variables
window.onload=function(){
    painted= new Array();
    content= new Array();
    winningCombinations=[[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6],[0,3,6],[1,4,7],[2,5,8]];
    boxesFilled=0;
    for(var i = 0;i < ; i++){
        painted[i]=false;
        content[i]='';
    }
}

//Decide if First Player/ Second Player / Random
function drawCorner(){
    for(var i = 0;i < 9; i++){
        painted[i]=false;
        content[i]='';
        var comp=parseInt(i)	;
        var theCanvas="canvas"+ comp;
        drawsymbol(theCanvas,'');
    }
    var corner=[1,3,7,9];
    var rand=Math.floor(Math.random()*4);
    comp=corner[rand];
    var theCanvas="canvas"+ comp ;
    drawsymbol(theCanvas,'O');
    // document.getElementById(theCanvas).style.backgroundColor='blue';
    content[comp-1]='O';
    painted[comp-1]=true;
    boxesFilled++;
}

//Called when someone clicks on Canvas
function canvasClicked(w){
    var currCanvas="canvas"+ w ;
    if( painted[w] == false ){
        drawsymbol(currCanvas,'X');
        content[w]='X';
        painted[w]=true;
        boxesFilled++;
        checkForWinners(content[w]);
        if((checker(content[w]))==false && boxesFilled!=9){
            drawRandom(w);
        }
        else if(boxesFilled==9){
            alert("It's a DRAW");
            playAgain();
        }
    }
    else {
        alert("The space is already occupied")
    }
}

//Draw symbol on the canvas
function drawsymbol(id,symbol){
    var c=document.getElementById(id);
    var ctx=c.getContext("2d");
    ctx.font='50px Georgia';
    ctx.fillText(symbol,10,40);
}

//Check if a symbol forms a line
function formLine(symbol){//-1 if no box is found and box number if one is found
    for(var a=0;a<winningCombinations.length;a++){
        if(	(content[winningCombinations[a][0]]=='')
            &&(content[winningCombinations[a][1]]==symbol)
            &&(content[winningCombinations[a][2]]==symbol)){
            return winningCombinations[a][0];
        }
        else if ((content[winningCombinations[a][0]]==symbol)
                &&(content[winningCombinations[a][1]]=='')
                &&(content[winningCombinations[a][2]]==symbol))	{
            return winningCombinations[a][1];
        }
        else if((content[winningCombinations[a][0]]==symbol)
                &&(content[winningCombinations[a][1]]==symbol)
                &&(content[winningCombinations[a][2]]=='')){
            return winningCombinations[a][2];
        }
    }
    return -1;
}


function isLine(x,symbol){
    if(content[x]=='')content[x]=symbol;
    if(formLine(symbol)!=-1){content[x]='';return true;}
    content[x]='';
    return false;
}

function formFork(symbol){//place the symbol at a non occupied place and calculate no. of possible line formations in next step
    for(var i=0;i<=8;i++){//fill the empty spaces and check for next step kinda
        if(content[i]==''){
            content[i]=symbol;
            var count=0;//the number of lines formed
            for(var a=0;a<winningCombinations.length;a++){
                if(	(content[winningCombinations[a][0]]=='')
                    &&(content[winningCombinations[a][1]]==symbol)
                    &&(content[winningCombinations[a][2]]==symbol)){
                    count++;
                }
                if ((content[winningCombinations[a][0]]==symbol)
                    &&(content[winningCombinations[a][1]]=='')
                    &&(content[winningCombinations[a][2]]==symbol))	{
                    count++;
                }
                if((content[winningCombinations[a][0]]==symbol)
                    &&(content[winningCombinations[a][1]]==symbol)
                    &&(content[winningCombinations[a][2]]=='')){
                    count++;
                }
            }
            if(count>=2){
                content[i]='';
                return i;
            }
            content[i]='';
        }
    }
    return -1;
}

function isFork(x,symbol){
    if(content[x]=='')content[x]=symbol;//content is from 0-8
    if(formFork(symbol)!=-1){content[x]='';return true;}
    else{
        content[x]='';
        return false;
    }
}


function drawRandom(w){
    //see if we are winning
    if(formLine('O')!= -1){
        comp=formLine('O')+1;
    }
    //obstruct a winner-how to know if two out of three form a line with empty space-write a function
    else if(formLine('X')!= -1){
        comp=formLine('X')+1;
    }
    else if(formFork('O')!= -1){//form a fork if possible
        comp=formFork('O')+1;
    }
    // formFork('X');
    // alert('came');
    else if(formFork('X')!=-1){//block a fork of the opposite side if possible

        for(var i=0;i<=8;i++){
            if(content[i]==''){
                // alert(i);
                content[i]='O';//now check whether a line is formed
                var line=formLine('O');
                if(line!=-1){
                    if(line!=formFork('X')){content[i]='';comp=i+1;break;}
                }
                content[i]='';
            }
        }
        // comp=formFork('X')+1;
    }
    //draw center if empty
    else if(painted[4]==false){
        comp=5;
    }
    //draw corner if empty
    else {
        var corner=[0,2,6,8];
        var checking = true; // use this for the loop condition
        while (checking){
            var rand = Math.floor(Math.random()*4);
            if (content[corner[rand]] == '') {// check to see that the square is empty
                checking = false; // if so, set the loop condition to false so the loop ends
            }
        }
        comp=parseInt(corner[rand])+1;
    }
    var theCanvas="canvas"+ comp ;
    // alert(theCanvas);
    drawsymbol(theCanvas,'O');
    // document.getElementById(theCanvas).style.backgroundColor='blue';
    content[comp-1]='O';

    painted[comp-1]=true;
    boxesFilled++;
    checkForWinners(content[comp-1]);
    if(boxesFilled==9){
            alert("ITs a draw");
            playAgain();
    }
}

function checkForWinners(symbol){
    for(var a=0;a<winningCombinations.length;a++){
        if(content[winningCombinations[a][0]]==symbol &&
            content[winningCombinations[a][1]]==symbol &&
            content[winningCombinations[a][2]]==symbol
            ){
                if(symbol=='X'){
                    alert("YOU WON");
                    playAgain();
                }
                else{
                    alert("You Loose");
                    playAgain();
                }
        }
    }
}

function checker(symbol){
    var b=false;
    for(var a=0;a<winningCombinations.length;a++){
        if(content[winningCombinations[a][0]]==symbol &&
            content[winningCombinations[a][1]]==symbol &&
            content[winningCombinations[a][2]]==symbol
            ){
            b=true;break;
        }
    }
    return b;
}

function playAgain(){
    y=confirm("PLAY AGAIN?");
    if(y==true){
        location.reload(true);
    }
    else{
    }
}
