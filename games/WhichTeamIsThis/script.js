var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

var bg = new Image();
bg.src = "assets/Background.png";


var mouseX;
var mouseY;

var isPlaying = false;


//to solve the problem of canvas resizing//////////////////////////
//while draw to the pixel world use the actual position with respect
//to the background dimensions WIDTH and HEIGHT
//to check against the mouse use the canvas's actual dimensions
//i.e. CANVAS_WIDTH and CANVAS_HEIGHT

var WIDTH = 1587;
var HEIGHT = 1379;
var CANVAS_WIDTH = 0;
var CANVAS_HEIGHT = 0;

let resizeCanvas = function(){
	CANVAS_WIDTH = window.innerWidth-25;
	CANVAS_HEIHGT = window.innerHeight-25;

	let ratio = 1587/1379;
	if(CANVAS_HEIHGT<CANVAS_WIDTH/ratio){
		CANVAS_WIDTH = CANVAS_HEIHGT*ratio;
	}else{
		CANVAS_HEIHGT = CANVAS_WIDTH/ratio;
	}

	cvs.width = WIDTH;
	cvs.height = HEIGHT;
	ctx.font = '30px Arial';
	ctx.mozImageSmoothingEnabled = false;
	ctx.msImageSmoothingEnabled = false;
	ctx.imageSmoothingEnabled = false;


	cvs.style.width = ''+CANVAS_WIDTH+'px';
	cvs.style.height = ''+CANVAS_HEIHGT+'px';
}
resizeCanvas();
window.addEventListener('resize',function(){
	resizeCanvas();
});

///////////////////////////////////////////////////////////////////

//load all the image assets and store in 'images'/////////////////
var images = {};
var totalResources = 7;
var numResourcesLoaded = 0;

loadImage('Background');
loadImage('CorrectAnswer');
loadImage('WrongAnswer');
loadImage('ScoreIcon');
loadImage('LogoWC');
loadImage('OfficialMascot');
loadImage('HiddenPlayer');

function loadImage(name){
	images[name] = new Image();
	images[name].onload = function(){
		numResourcesLoaded += 1;
		if(numResourcesLoaded===totalResources){
			init();
		}
	}
	images[name].src = 'assets/'+name+'.png';//'WhichTeamIsThis/'+
}

function drawImage(name,posX,posY,width = images[name].width,height = images[name].height){	
	ctx.drawImage(images[name],posX-width/2,posY-width/2,width,height);
}

//end of images
///////////////////////////////////////////////////////////////////


//utility functions

function pointOnRect(px, py, rx, ry, rw, rh){
	return (px>rx-rw/2&&px<rx+rw/2&&py>ry-rh/2&&py<ry+rh/2);
}
//end of utility functions
///////////////////









function HiddenPlayer(posX, posY){
	this.posX = posX;
	this.posY = posY;
	this.width = 108;
	this.height = 108;
	this.mouseOver = false
	this.draw = function(){
		if(this.mouseOver)
			drawImage('HiddenPlayer',this.posX,this.posY,this.width*1.2,this.height*1.2);
		else 
			drawImage('HiddenPlayer',this.posX,this.posY,this.width,this.height);
	}
	this.checkMouseOver = function(mouseX, mouseY){
		this.mouseOver = pointOnRect(mouseX,mouseY,this.posX, this.posY, this.width, this.height);
			 
	}
}
var hiddenPlayers = new Array();
function initPlayers(){
	var positions = [
		[815,826],
		[470,373],
		[675,266],
		[676,467],
		[416,587],
		[678,686]
	];
	for(var i = 0; i<positions.length; i++)
		hiddenPlayers[i] = new HiddenPlayer(positions[i][0],positions[i][1]);
	for(var i = 1; i<positions.length; i++)
		hiddenPlayers.push(new HiddenPlayer(50+WIDTH-positions[i][0],positions[i][1]));
}













//main function
var onMenu = true;
var logo = new Button('LogoWC',WIDTH/2,HEIGHT/2,500,500,1.5);



function State(){
	this.running = false;
}
State.prototype.loop = function(){
	if(running){
		cvs.width = cvs.width;

		this.draw();

		requestAnimationFrame(menu);
	}
}

function Menu(){
	State.call();
}
Menu.prototype.draw = function(){
	logo.draw();
	if(logo.mouseClicked){
		this.running = false;
		playGame();
	}
}










function init(){
	initPlayers();
	var menu = new Menu();
	menu.loop();
}
function playGame(){
	startDrawing();	
}
function draw(){
	ctx.width = ctx.width;//clear the canvas
	if(isPlaying){
		drawBg();
		for(var i = 0; i<hiddenPlayers.length; i++)
			hiddenPlayers[i].draw();

	    requestAnimationFrame(draw);
	}
}
function startDrawing(){
	isPlaying = true;
	draw();
}
function stopDrawing(){
	isPlaying = false;
}







document.onmousemove = function(mouse){
	mouseX = mouse.clientX - cvs.getBoundingClientRect().left;
	mouseY = mouse.clientY - cvs.getBoundingClientRect().top;
	mouseX *= WIDTH/CANVAS_WIDTH;
	mouseY *= HEIGHT/CANVAS_HEIHGT;

	for(var i = 0; i<hiddenPlayers.length; i++)
		hiddenPlayers[i].checkMouseOver(mouseX,mouseY);

	logo.checkMouseOver(mouseX,mouseY);
}
document.onmousedown = function(mouse){
	logo.mouseDown();
}
//end of main function



function drawBg(){
	ctx.drawImage(images['Background'],0,0);	
}



function Button(imageName, posX, posY, width, height,ratio = 1.2){
	this.posX = posX;
	this.posY = posY;
	this.width = width;
	this.height = height;
	this.mouseOver = false;
	this.mouseClicked = false;
	this.ratio = ratio;

	this.draw = function(){
		if(this.mouseOver)
			drawImage(imageName,this.posX,this.posY,this.width*this.ratio,this.height*this.ratio);
		else 
			drawImage(imageName,this.posX,this.posY,this.width,this.height);
	}
	this.checkMouseOver = function(mouseX, mouseY){
		this.mouseOver = pointOnRect(mouseX,mouseY,this.posX, this.posY, this.width, this.height);
		return this.mouseOver;
	}
	this.mouseDown = function(){
		this.mouseClicked = pointOnRect(mouseX,mouseY,this.posX, this.posY, this.width, this.height);
		return this.mouseClicked;
	}
}