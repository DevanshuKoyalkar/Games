//global varibles
var painted;
var content;
var winningCombinations;
var comp;

var boxesFilled=0;
var w;
//var b;

//instanciating the arrays
window.onload=function(){
    painted= new Array();
    content= new Array();
    winningCombinations=[[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6],[0,3,6],[1,4,7],[2,5,8]]

    for(var i = 0;i <= 8; i++){
        painted[i]=false;
        content[i]='';
    }
}
function drawsymbol(id,symbol){
    var c=document.getElementById(id);
    var ctx=c.getContext("2d");
    ctx.font='50px Georgia';
    ctx.fillText(symbol,10,40);
}
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
function drawRandom(w){
    //see if we are winning and put that in bitch
    if(formLine('O')!= -1){
        comp=formLine('O')+1;
    }
    //obstruct a winner-how to know if two out of three form a line with empty space-write a function
    else if(formLine('X')!= -1){
        comp=formLine('X')+1;
    }
    //draw center if empty
    else if(painted[4]==false){
        comp=5;
    }
    else {
        var checking = true; // use this for the loop condition
        while (checking){
        comp = Math.ceil(Math.random()*content.length);
        if (content[comp-1] == '') {// check to see that the square is empty
            checking = false; // if so, set the loop condition to false so the loop ends
        }
        }
    }

    var theCanvas="canvas"+ comp ;
    drawsymbol(theCanvas,'O');
    // document.getElementById(theCanvas).style.backgroundColor='blue';
    content[comp-1]='O';
    painted[comp-1]=true;
    boxesFilled++;

    if(boxesFilled==9){
            alert("ITs a draw");
            playAgain();
    }
    checkForWinners('O');
}
function canvasClicked(w){
    var theCanvas="canvas"+ w ;
    if( painted[w-1] == false){
        drawsymbol(theCanvas,'X');
        // document.getElementById(theCanvas).style.backgroundColor='red';
        content[w-1]='X';
        painted[w-1]=true;
        boxesFilled++;
        checkForWinners('X');
        if((checker(content[w-1]))==false && boxesFilled!=9){
            drawRandom(w);
        }

        else if(boxesFilled==9){
            alert("ITs a draw");
            playAgain();
        }
    }
    else{
            alert("the space is already occupied with your heart");
        }
}

function checkForWinners(symbol){
    for(var a=0;a<winningCombinations.length;a++){
        if(content[winningCombinations[a][0]]==symbol &&
            content[winningCombinations[a][1]]==symbol &&
            content[winningCombinations[a][2]]==symbol
            ){
                if(symbol=='X'){
                    alert(" YOU WON");
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

function drawCorner(){
    painted= new Array();
    content= new Array();
    winningCombinations=[[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6],[0,3,6],[1,4,7],[2,5,8]];
    boxesFilled=0;
    for(var i = 0;i <= 8; i++){
        painted[i]=false;
        content[i]='';
        var comp=parseInt(i)+1;
        var theCanvas="canvas"+ comp;
        drawsymbol(theCanvas,'');
        // document.getElementById(theCanvas).style.backgroundColor='white';
    }
    var corner=[1,3,7,9];
    var rand=Math.floor(Math.random()*4);
    comp=corner[rand];
    var theCanvas="canvas"+ comp ;
    drawsymbol(theCanvas,'O');
    // document.getElementById(theCanvas).style.backgroundColor='blue';
    content[comp-1]='O';
    painted[comp-1]='O';
    boxesFilled++;

}