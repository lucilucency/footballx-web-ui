var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");


var WIDTH = 1587;
var HEIGHT = 1379;
var CANVAS_WIDTH = 0;
var CANVAS_HEIGHT = 0;


var currentState;
var states = {Splash:0, Game: 1, Score:2};
var images = {};
function drawImage(name,x,y,w,h){
	if(w==null) w = images[name].width;
	if(h==null) h = images[name].height;
	ctx.drawImage(images[name],x-w/2,y-h/2,w,h);}

var totalResources = 7;
var numResourcesLoaded = 0;

var frame = 0;
function pointInRect(px, py, rx, ry, rw, rh){

	return (px>rx-rw/2&&px<rx+rw/2&&py>ry-rh/2&&py<ry+rh/2);}
var mX, mY;

var teams = {
	_teams:[],
	level:1,
	init:function(){
		this._teams.push({
			name:'vietnam',
			positions:['LogoWC','clb2','clb3','clb4','clb5','clb6','clb7','clb8','clb9','clb10','clb11']
		});
	},
	draw:function(position,x,y){
		drawImage(this._teams[this.level-1].positions[0],x,y);
	}
};

var hiddenpositions={
	positions:[],
	ps:[
		[815,826],[678,686],[50+WIDTH-678,686],
		[416,587],[50+WIDTH-416,587],[676,467],
		[50+WIDTH-676,467],[470,373],
		[50+WIDTH-470,373],[675,266],
		[50+WIDTH-675,266],
		],
	breadth:0,
	breadthLimit:10,
	numberOpened:0,
	init:function(){
		this.players = [];
		for(var i = 0; i<this.ps.length; i++){
			this.positions.push({
				x:this.ps[i][0],
				y:this.ps[i][1],
				width:images['HiddenPosition'].width,
				height:images['HiddenPosition'].height,
				_mouseover:false,
				opened:false
			});
		}
	},
	update:function(){
		this.breadth = this.breadthLimit*Math.cos(3*frame*3.141592/180.0);
	},
	draw:function(){
		for(var i = this.positions.length-1; i>=0;i--){
			if(!this.positions[i].opened){
				if(this.positions[i]._mouseover)
					drawImage('HiddenPosition',this.positions[i].x,this.positions[i].y,
					this.positions[i].width+this.breadthLimit*1.5,this.positions[i].height+this.breadthLimit*1.5);
				else
					drawImage('HiddenPosition',this.positions[i].x,this.positions[i].y,
					this.positions[i].width+this.breadth,this.positions[i].height+this.breadth);
			}else{
				teams.draw(i,this.positions[i].x,this.positions[i].y);
			}
			ctx.fillText(i+1,this.positions[i].x,this.positions[i].y);
		}
	},
	mouseover:function(x,y){
		for(var i = 0; i<this.positions.length;i++){
			this.positions[i]._mouseover=(pointInRect(x,y,this.positions[i].x,this.positions[i].y,
				this.positions[i].width+this.breadth,this.positions[i].height+this.breadth));
		}},
	open:function(x,y){
		for(var i = 0; i<this.positions.length;i++){
			if(pointInRect(x,y,this.positions[i].x,this.positions[i].y,
				this.positions[i].width+this.breadth,this.positions[i].height+this.breadth)){
					this.positions[i].opened=true;
					this.numberOpened++;
				}
		}}
};


function onpress(evt){
	switch(currentState){
		case states.Splash:
			currentState = states.Game;
			break;
		case states.Game:
			hiddenpositions.open(mX, mY);
			break;
		case states.Score:
			break;

	}
}
function onmousemove(evt){
	mX = evt.offsetX*WIDTH/CANVAS_WIDTH;
	mY = evt.offsetY*HEIGHT/CANVAS_HEIHGT;

	if(currentState===states.Game)
		hiddenpositions.mouseover(mX, mY);
}


function main(){

	//to solve the problem of canvas resizing//////////////////////////
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
		cvs.style.height = ''+CANVAS_HEIHGT+'px';}
	resizeCanvas();
	window.addEventListener('resize',function(){resizeCanvas();});
	/////////////////////////////////////////////
	var evt = "touchstart";
	if(CANVAS_WIDTH>700){
		evt = "mousedown";
		document.addEventListener('mousemove',onmousemove);
	}
	document.addEventListener(evt,onpress);

	ctx.fillStyle='#fff';
	ctx.font = 'bold 100px Open Sans';
	ctx.textAlign = 'center';

	//load images
	{
		loadImage('Background');
		loadImage('CorrectAnswer');
		loadImage('WrongAnswer');
		loadImage('ScoreIcon');
		loadImage('LogoWC');
		loadImage('OfficialMascot');

		//run function is called here..
		loadImage('HiddenPosition');	}
	function loadImage(name){

		images[name] = new Image();
		images[name].onload = function(){
			numResourcesLoaded += 1;
			if(numResourcesLoaded===totalResources){
				init();
				run();
			}
		}
		images[name].src = 'assets/'+name+'.png';//'WhichTeamIsThis/'+
	}
	//end load images
}
function init(){
	teams.init();
	hiddenpositions.init();
	currentState = states.Splash;
}
function run(){
	var loop = function(){
		update();
		render();
		window.requestAnimationFrame(loop,cvs);
	}	
	window.requestAnimationFrame(loop,cvs);	
}
function update(){
	frame>100*3*3.141592?frame=0:frame++;
	if(currentState === states.Game)
		hiddenpositions.update();
}
function render(){
	if(currentState === states.Splash){
		drawImage('LogoWC',WIDTH/2,HEIGHT/2);
	}
	if(currentState === states.Score||currentState===states.Game){
		drawImage('Background',WIDTH/2,HEIGHT/2);
		hiddenpositions.draw();
	}
}

main();

