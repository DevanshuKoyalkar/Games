//global varibles
var painted;
var content;
var winningCombinations;
var theCanvas;
var boxesFilled=0;

//instantiating the arrays
window.onload=function(){
    painted= new Array();
    content= new Array();
    winningCombinations=[[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6],[0,3,6],[1,4,7],[2,5,8]]
    turn=0;
    for(var i = 0;i <= 8; i++){
        painted[i]=false;
        content[i]='';
    }
}

function changeturn(v){
    turn=1;
}

function canvasClicked(w){
    theCanvas="canvas"+ w ;
    var c=document.getElementById(theCanvas);
    var ctx = c.getContext("2d");
    ctx.font='50px Georgia';

    if( painted[w-1] == false){
        if(turn%2==0 ){
            ctx.fillText("X",10,40);
            content[w-1]='X';
        }
        else{
            ctx.fillText("O",10,40);
            content[w-1]='O';
        }
        turn++;
        painted[w-1]=true;
        boxesFilled++;
        checkForWinners(content[w-1]);
        if(boxesFilled==9 && checker(content[w-1])==false){
            alert("It's a draw");
            playAgain();
        }
    }
    else {
        alert("the space is already occupied with your heart");
    }
}

function checkForWinners(symbol){
    for(var a=0;a<winningCombinations.length;a++){
        if(content[winningCombinations[a][0]]==symbol &&
            content[winningCombinations[a][1]]==symbol &&
            content[winningCombinations[a][2]]==symbol
            ){
            alert("Player "+symbol+"  YOU WON");
            playAgain();
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