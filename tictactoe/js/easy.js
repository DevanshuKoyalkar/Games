//global varibles
	var painted;
	var content;
	var winningCombinations;
	var comp;
	var boxesFilled;
	var theCanvas;
	window.onload=function(){
		painted= new Array();
		content= new Array();
		winningCombinations=[[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6],[0,3,6],[1,4,7],[2,5,8]]
		boxesFilled=0;
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
	function drawRandom(w){
		var checking = true; // use this for the loop condition
		while (checking){
    		comp = Math.ceil(Math.random()*content.length)
    		if (content[comp-1] == '') {// check to see that the square is empty
       			checking = false; // if so, set the loop condition to false so the loop ends
    		}
		}
		theCanvas="canvas"+ comp ;
		// draw(theCanvas,'O');
		drawsymbol(theCanvas,'O')
		// document.getElementById(theCanvas).style.backgroundColor='blue';
		content[comp-1]='O';
		painted[comp-1]=true;
		boxesFilled++;
		checkForWinners(content[comp-1]);
		if((checker(content[w-1]))==false && boxesFilled==9){
					alert("ITs a draw");
					playAgain();
				}

	}
	function canvasClicked(w){

		theCanvas="canvas"+ w ;
		if( painted[w-1] == false){
				drawsymbol(theCanvas,'X');
				// document.getElementById(theCanvas).style.backgroundColor='red';
				content[w-1]='X';
				painted[w-1]=true;
				boxesFilled++;
				checkForWinners(content[w-1]);
				if((checker(content[w-1]))==false && boxesFilled==9){
					alert("ITs a draw");
					playAgain();
				}
				if((checker(content[w-1]))==false && boxesFilled!=9){
					drawRandom(w);
				}

			}
		else {
				alert("the space is already occupied with your heart")
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
	function drawCorner(){
		painted= new Array();
		content= new Array();
		winningCombinations=[[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6],[0,3,6],[1,4,7],[2,5,8]];
		boxesFilled=0;
		for(var i = 0;i <= 8; i++){
			painted[i]=false;
			content[i]='';
			var comp=parseInt(i)+1;
			theCanvas="canvas"+ comp;
			// document.getElementById(theCanvas).style.backgroundColor='white';
			drawsymbol(theCanvas,'');
		}
		var corner=[1,3,7,9];
		var rand=Math.floor(Math.random()*4);
		comp=corner[rand];
		theCanvas="canvas"+ comp ;
		drawsymbol(theCanvas,'O');
		// document.getElementById(theCanvas).style.backgroundColor='blue';
		content[comp-1]='O';
		painted[comp-1]=true;
		boxesFilled++;

	}
	function playAgain(){
		y=confirm("PLAY AGAIN?");
		if(y==true){
			location.reload(true);
		}
		else{
		}
	}