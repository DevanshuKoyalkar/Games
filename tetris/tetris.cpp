#include <FL/Fl.H>
#include <FL/Fl_Window.H>
#include <FL/Fl_Box.H>
#include <FL/fl_draw.H>

#include <iostream>
#include <cstdlib>
#include <ctime>
#include <string>
#include<sstream>
using namespace std;
//the global constants

static const int tilesize = 30;
static const int bgcolor=250;
static const int xmaxtiles=14;
static const int ymaxtiles=20;
static const double timeout=0.3;

// *****************************TILE  AND FUNCTION MOVEMENTS**************************
class Tile{
public:
	int x;int y;
};
	
void ts_down (Tile ts[4]){ //moving it down
	for (int i=0; i<4; i++) ts[i].y++; 
	}
	
void ts_right (Tile ts[4]) {//moving it right
	for (int i=0; i<4; i++) ts[i].x++;
	}
	
void ts_left (Tile ts[4]) {//moving it left
	for (int i=0; i<4; i++) ts[i].x--;
	}
	
void ts_copy (Tile in[4], Tile out[4]) {//copying it on the board
	for (int i=0; i<4; i++) {
		out[i].x=in[i].x;
		out[i].y=in[i].y;
	}
}
void ts_rotate(Tile ts[4], int midpointTile, int direction ){//cis the central tile
		Tile rot[4];Tile c;int a,b;
		c.x=ts[midpointTile].x ;
		 c.y=ts[midpointTile].y;
		if(direction==1){
			for(int i=0;i<4;i++){		//shifting the coordinates to origin as centre piece and rotating
			a = ts[i].x - c.x;
			b=ts[i].y - c.y;
			rot[i].x = -(b);
			rot[i].y = a;
		}
	}
	else if(direction==-1){
			for(int i=0;i<4;i++){		//shifting the coordinates to origin as centre piece and rotating
			a = ts[i].x - c.x;
			b=ts[i].y - c.y;
			rot[i].x = -(b);
			rot[i].y = a;
		}
	}
	
		for(int i=0;i<4;i++){		//reshifting the coordinates 
			ts[i].x=rot[i].x + c.x;
			ts[i].y=rot[i].y + c.y;
		}
}
			
			
	
	
	
//*************************************BOARD ******
class Board;
class ActivePiece{
	friend class Board;
	Tile tileSet[4];
	int color;
	int midpointTile; 
	Board*b;
	
public:
	ActivePiece(Board*container);	
	bool moveDown ();
	bool moveLeft ();
	bool moveRight ();
	bool rotate(int direction);//whether to move/rotate or not 
	bool check();
};
class Board : public Fl_Widget {
public:
	
	int occup[xmaxtiles][ymaxtiles];
	ActivePiece *p;
	
	int score;
	char* scoreLabel; // label used to display the score
	Fl_Box *scoreBox;// private member of class for scorebox

	Board();
	//void setScoreBox(Fl_Box *b);
	bool isFree(Tile ts[4]); // before moving down
	bool inBoard(Tile ts[4]); // check boundaries
	bool transferTiles(Tile ts[4], int color);	// when the piece comes to rest
	void deleteRow(int row);
	bool rowDone(int row);
	void draw();
	int handle(int e);// keypress events
	int periodic();
	void setScoreBox(Fl_Box** sb); //to set scorebox pointer to class member
};
void Board::setScoreBox(Fl_Box** sb)
{
	scoreBox = *sb ;
	score=0;
	scoreLabel = (char*) malloc(sizeof(char)*10);
}

void timeractions(void *p) {
	((Board *)p)->periodic ();
}


int Board::periodic() {
	if(p->moveDown ()){}
	else{transferTiles(p->tileSet,p->color);}
	stringstream strs;
		strs << score;
		string temp_str = strs.str();
		strcpy(scoreLabel,"Score: ");
		strcat(scoreLabel,(char*) temp_str.c_str() );

		scoreBox->label(scoreLabel);
	redraw();
	Fl::repeat_timeout (0.5,timeractions,this);
}

Board::Board() : Fl_Widget (0,0,xmaxtiles*tilesize,ymaxtiles*tilesize,"tetris game") {
	
	for(int i=0;i<14;i++){//initialising the boxes as unoccupied
		for(int j=0;j<20;j++){
			occup[i][j]=250;
		}
	}
	score=0;
	p =new ActivePiece(this);
	}

bool Board::isFree(Tile ts[4]){
	if ((occup[ts[0].x][ts[0].y] == 250) && (occup[ts[1].x][ts[1].y] == 250) && (occup[ts[2].x][ts[2].y] == 250) && (occup[ts[3].x][ts[3].y] == 250) )
	return true;
	else return false;
}
bool Board::inBoard(Tile ts[4]){
	if (ts[0].x<xmaxtiles && ts[0].y<ymaxtiles &&
		ts[1].x<xmaxtiles && ts[1].y<ymaxtiles &&
		ts[2].x<xmaxtiles && ts[2].y<ymaxtiles &&
		ts[3].x<xmaxtiles && ts[3].y<ymaxtiles && 
		ts[0].x>=0 && ts[1].x>=0 && ts[2].x>=0 && ts[3].x>=0  )
		return true;
	else return false;
}
bool Board::transferTiles(Tile ts[4], int color){//on the board make save the changes
	for(int i=0;i<4;i++){
		occup[ts[i].x][ts[i].y]=color;
	}
	p =new ActivePiece(this);
	if(p->moveDown()==false){exit(0);}
}
	
bool Board::rowDone(int row){
	bool a=true;
	for(int i=0;i<14;i++){
		if(occup[i][20-row]==250) {a=false;break;}//counting the rows as 1 2....so on from the bottom
	}
	 return a;
}
void Board::deleteRow(int row){			//deleting the row and then the required transformations
	for(int i=0;i<14;i++){
		for(int j=19-row;j>0;j--){
			occup[i][j+1]=occup[i][j];
		}
	}
	//score=score+10;
	
}
		
int Board::handle(int e) {
	
	if (e==8) { 									
	
	switch (Fl::event_key()) { 				
		case 65361 : p->moveLeft(); break;			//left movement
		case 65364 : if(p->moveDown ()){break;}
					else{transferTiles(p->tileSet,p->color);break;} //down movement
		case 65363 : p->moveRight (); break; 		//right movement 
		case 32:	for(int i=0;i<20;i++){
			if(p->moveDown ()){}
			else{transferTiles(p->tileSet,p->color);break;}
				}
			break;					//spacebar;break;
		case 97	:p->rotate(1);break;	//a is for CW rotation 
		case 115:p->rotate(-1);break;	//s is for ACW rotation
	}
	}
	
	redraw();
}
void Board::draw () {
	
	for (int i=0;i<14;i++){
		for (int j=0;j<20;j++){
		fl_draw_box(FL_BORDER_BOX,i*tilesize,j*tilesize,tilesize,tilesize,occup[i][j]);
		}
	}
	
	for(int i=0;i<4;i++){
		fl_draw_box(FL_BORDER_BOX,(p->tileSet[i].x)*tilesize,(p->tileSet[i].y)*tilesize,tilesize,tilesize,p->color);
	}
	for(int row=1;row<20;row++){//for all the rows ie from 1 to 20
		 if(rowDone(row)){
			 deleteRow(row);
			 score=score+10;
		 }
	 }
}


	
//*******************************************ACTIVE PIECE CLASS*****************************************

		
ActivePiece::ActivePiece(Board*container) {
	srand(time(0));
	int r = rand()%7;
	int color =rand()%256;//random color
	while(color>=54 && color <=58&& color!=0 )color=rand()%256;
	int c = (int) (xmaxtiles/2); //xcenter
	b = container;
	switch(r) {
	case 4:
	tileSet[0].x=c-2; tileSet[0].y=0; // horizontal
	tileSet[1].x=c-1; tileSet[1].y=0;
	tileSet[2].x=c; tileSet[2].y=0;
	tileSet[3].x=c+1; tileSet[3].y=0;
	midpointTile = 2;
	break;
	case 1:
	tileSet[0].x=c; tileSet[0].y=0; // right L
	tileSet[1].x=c; tileSet[1].y=1;
	tileSet[2].x=c; tileSet[2].y=2;
	tileSet[3].x=c+1; tileSet[3].y=2;
	midpointTile = 2;
	break;
	case 2:
	tileSet[0].x=c; tileSet[0].y=0; // left L
	tileSet[1].x=c; tileSet[1].y=1;
	tileSet[2].x=c; tileSet[2].y=2;
	tileSet[3].x=c-1; tileSet[3].y=2;
	midpointTile = 2;
	break;
	case 3:
	tileSet[0].x=c; tileSet[0].y=0; // T shape 
	tileSet[1].x=c; tileSet[1].y=1;
	tileSet[2].x=c-1; tileSet[2].y=1;
	tileSet[3].x=c+1; tileSet[3].y=1;
	midpointTile = 1;
	break;
	case 0:
	tileSet[0].x=c; tileSet[0].y=0; // square 
	tileSet[1].x=c-1; tileSet[1].y=0;
	tileSet[2].x=c; tileSet[2].y=1;
	tileSet[3].x=c-1; tileSet[3].y=1;
	midpointTile = -1;
	break;
	case 5:
	tileSet[0].x=c; tileSet[0].y=0; // zigzag 1 right chair
	tileSet[1].x=c-1; tileSet[1].y=0;
	tileSet[2].x=c; tileSet[2].y=1;
	tileSet[3].x=c+1; tileSet[3].y=1;
	midpointTile = 2;
	break;
	case 6:
	tileSet[0].x=c; tileSet[0].y=0; // zigzag 2 left chair
	tileSet[1].x=c-1; tileSet[1].y=0;
	tileSet[2].x=c-1; tileSet[2].y=1;
	tileSet[3].x=c-2; tileSet[3].y=1;
	midpointTile = 2;
	break;
}
};
bool ActivePiece::moveRight () {
	Tile proposedSet[4];
	ts_copy(tileSet, proposedSet);
	ts_right(proposedSet);
	if(b->inBoard(proposedSet) && (b->isFree(proposedSet))){
		ts_copy(proposedSet, tileSet);
		return true;
	}
	else return false;
}


bool ActivePiece::moveLeft () {
	Tile proposedSet[4];
	ts_copy(tileSet, proposedSet);
	ts_left(proposedSet);
	if(b->inBoard(proposedSet) && (b->isFree(proposedSet))){
			ts_copy(proposedSet, tileSet);
			return true;
		}
	else return false;
}

bool ActivePiece::moveDown () {
	Tile proposedSet[4];
	ts_copy(tileSet, proposedSet);
	ts_down(proposedSet);
	if(b->inBoard(proposedSet) && (b->isFree(proposedSet))){
		ts_copy(proposedSet, tileSet);
		return true;
	}
	else return false;
}
bool ActivePiece::rotate (int direction) {
	Tile proposedSet[4];
	ts_copy(tileSet, proposedSet);
	ts_rotate(proposedSet,this->midpointTile,direction);
	if(b->inBoard(proposedSet) && (b->isFree(proposedSet))){
			ts_copy(proposedSet, tileSet);
			return true;
		}
	else return false;
}

	




/************************************TIMEOUT ACTIONS***************************************
bool timeoutAction();
static void timerHandler (void *b) {
if ( ((Board *) b)->timeoutAction())
Fl::repeat_timeout(timeout, timerHandler, b);
else {cout << "Game OVER!\n";}
}
*/  //***********************************
int main(int argc, char *argv[]) {
    Fl_Window *window = new Fl_Window (800,700,"TETRIS"); // outer window
	window->color(56);   
	Board *b = new Board();
	//ActivePiece *p =new ActivePiece(Board *b);
	        Fl_Box *scorebox = new Fl_Box(tilesize*xmaxtiles+10,50,180,200,"Score: 0\0");
	scorebox->box(FL_UP_BOX);
        scorebox->labelfont(FL_BOLD+FL_ITALIC);
        scorebox->labelsize(36);
        scorebox->labeltype(FL_ENGRAVED_LABEL);
	b->setScoreBox(&scorebox); // setting scorebox created in main to class. Board
	window->end();  
   	window->show();
	
   	Fl::add_timeout(0.1, timeractions,b);
    return(Fl::run());  // the process waits from here on for events
}
	
				
