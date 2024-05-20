var place = [];
var dots = document.getElementsByClassName('dot');
var connections = [];

var id;
var idAct;

var screenWidth = window.visualViewport.width;
var screenHeight = window.visualViewport.height;

var isMoveBlocked=false;
var algorithmPlayed=false;
var blockDelete;

const MAX_DOT_NUMBER=15;
const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
const numerated = [];

var speed=80;
var isNumerated=false;
var isScaled=false;

function openTopNav() {
	const topnav = document.getElementById('myTopnav');
	if(topnav.className=='topnav') {
	topnav.className+=' responsive';
	}else {
	topnav.className = 'topnav';
	}
}

function screenModify(){
	if(screenWidth == window.visualViewport.width && screenHeight == window.visualViewport.height) return;
	let saveWidth=screenWidth;
	let saveHeight=screenHeight;
	screenWidth=window.visualViewport.width;
	screenHeight=window.visualViewport.height;

	for(let a=0;a<dots.length;a++){
		place[0][a]*=screenWidth/saveWidth;
		place[1][a]*=screenHeight/saveHeight;
	}

	refreshPlaces(false);
}

function getMinGap(argument1, argument2){
	let theta=31-argument2*0.4/100;
    return argument1/100*theta+(argument2/100)*30-10
}

function randomisePlace(argument){
	if(argument&&algorithmPlayed) return
	minGap=getMinGap(screenWidth, screenHeight)**2/4/(dots.length*1.2);
	place[0]=[];
	place[1]=[];
	const borderX = 0.7-(screenWidth/9000);
	const borderY = 0.7-(screenHeight/9000);
	const dotradius=parseInt(getCssVar('--dotradius'))
	for(let y=0;y<dots.length;y++){
		place[0].push((Math.random()*borderX+(1-borderX)/2)*screenWidth-dotradius)
		place[1].push((Math.random()*borderY+(1-borderY)/2)*screenHeight-dotradius)
	}
	for(let a=0;a<dots.length-1;a++){
		for(let b=a+1;b<dots.length;b++){
			if((place[0][a]-place[0][b])**2+(place[1][a]-place[1][b])**2<minGap) return randomisePlace();
		}
	}
	refreshPlaces(true);
}

async function refreshPlaces(argument){
	if(isScaled) {
		document.getElementsByTagName('g')[4].remove();
		const myGroup=document.createElementNS("http://www.w3.org/2000/svg", "g");
		document.getElementsByTagName('svg')[0].appendChild(myGroup);
		connections.forEach( (value, index) => value.forEach(value2=>{
			putLength(index+1, value2+1);
		}))
	}

	//argument: true->shake; false->screen resize
	const myLines=document.getElementsByClassName('line');

	for(let y=0;y<dots.length;y++){
		if(argument) dots[y].style.transition='top .1s, left .1s';
		dots[y].style.left=place[0][y]+'px';
		dots[y].style.top=place[1][y]+'px';
	}
	
	if(argument) await sleep(10, false)
	for(let a=0;argument&&a<dots.length;a++){
		dots[a].style.transition='top 0s, left 0s';
	}
	if(argument) await sleep(10, false)

	for(let a=0;a<myLines.length;a++){
		for(b=2;myLines[a].id[b]!=='t';b++);
		const firstDot=parseInt(myLines[a].id.slice(1, b));
		const secondDot=parseInt(myLines[a].id.slice(b+1, myLines[a].id.length));
		const dotradius=parseInt(getCssVar('--dotradius'));
		myLines[a].setAttribute('x1', place[0][firstDot-1]+dotradius);
		myLines[a].setAttribute('y1', place[1][firstDot-1]+dotradius);
		myLines[a].setAttribute('x2', place[0][secondDot-1]+dotradius);
		myLines[a].setAttribute('y2', place[1][secondDot-1]+dotradius);
	}
}

function addGlobalEventListener(type, selector, callback){
	document.addEventListener(type, e => {
		if(e.target.matches(selector)) callback(e)
	})
}

function getCssVar(name){
	return window.getComputedStyle(document.documentElement).getPropertyValue(name);
}

function startLine(e){
	if(e.button!==0) return
	
	const startLineId=parseInt(id.slice(1, id.length))-1;
	const dotradius=parseInt(getCssVar('--dotradius'));

	setLine(place[0][startLineId]+dotradius, place[1][startLineId]+dotradius, e.clientX, e.clientY, id, 'line drawing');
	document.body.style.cursor='crosshair';

	document.addEventListener('mousemove', modifyLine);
	document.addEventListener('mouseup', endLine);
	document.addEventListener('mousedown', endLine, true);
}

function setLine(x1, y1, x2, y2, idName, className){
	const myGroups = document.getElementsByTagName("g");
	const newLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
	
	newLine.setAttribute('x1',x1);
	newLine.setAttribute('y1',y1);
	newLine.setAttribute('x2',x2);
	newLine.setAttribute('y2',y2);
	newLine.setAttribute('style','stroke:#f90;stroke-width:7;z-index:1');
	if(idName.length>0) newLine.setAttribute('id',idName);
	if(className.length>0) newLine.setAttribute('class',className);

	myGroups[3].appendChild(newLine);
}

function modifyLine(e){
	const myLine = document.getElementById(id);

	myLine.setAttribute('x2', e.clientX);
	myLine.setAttribute('y2', e.clientY);
}

function endLine(e){
	e.stopPropagation();

	const myLine = document.getElementById(id);

	document.body.style.cursor='default';

	document.removeEventListener('mousemove', modifyLine);
	document.removeEventListener('mouseup', endLine);
	document.removeEventListener('mousedown', endLine, true);

	if(id==idAct||idAct==0) {
		myLine.remove()
		return
	}

	const startLineId=parseInt(id.slice(1, id.length))-1;
	const endLineId=parseInt(idAct.slice(1, idAct.length))-1;
	const dotradius=parseInt(getCssVar('--dotradius'));

	if(connections[startLineId].has(endLineId)||connections[endLineId].has(startLineId)) {
		myLine.remove()
		return
	}

	connections[startLineId].add(endLineId);

	if(isScaled) putLength(myLine.id.slice(1, myLine.id.length), idAct.slice(1, idAct.length))
	
	myLine.setAttribute('x2', place[0][endLineId]+dotradius);
	myLine.setAttribute('y2', place[1][endLineId]+dotradius);
	myLine.setAttribute('onmouseover','lineHover("'+myLine.id+'t'+idAct.slice(1, idAct.length)+'")');
	myLine.setAttribute('onmouseleave','lineLeave("'+myLine.id+'t'+idAct.slice(1, idAct.length)+'")');
	myLine.setAttribute('onclick','lineDelete('+myLine.id.slice(1, myLine.id.length)+','+idAct.slice(1, idAct.length)+')');
	myLine.setAttribute('id',myLine.id+'t'+idAct.slice(1, idAct.length));
	myLine.setAttribute('class','line active');
	myLine.setAttribute('style','stroke:#f90;stroke-width:7;transition: stroke .2s;z-index:1;cursor: pointer');
}

function startMoveDot(e){
	if(e.button!==2||isMoveBlocked) return

	isMoveBlocked=false;

	const myDot = document.getElementById(id);
	myDot.className='dot active moving';

	document.addEventListener('mousemove', moveDot);
	document.addEventListener('mouseup', endMoveDot);
	document.addEventListener('mousedown', endMoveDot, true);
}

function moveDot(e){
	blockDelete=true;

	if(isMoveBlocked) return

	isMoveBlocked=true;
	setTimeout(function(){isMoveBlocked=false}, 10);

	const myDot = document.getElementById(id);
	const myDotNumber = parseInt(id.slice(1,id.length))-1;
	const dotradius = parseInt(getCssVar('--dotradius'));

	myDot.style.left=e.clientX-dotradius+'px';
	myDot.style.top=e.clientY-dotradius+'px';

	connections[myDotNumber].forEach( value => {
		const myLine = document.getElementById('l'+(myDotNumber+1)+'t'+(value+1));
		myLine.setAttribute('x1', e.clientX);
		myLine.setAttribute('y1', e.clientY);
		if(isScaled){
			document.getElementById('pathLink'+(myDotNumber+1)+'t'+(value+1)).remove();
			document.getElementById('textId'+(myDotNumber+1)+'t'+(value+1)).remove();
			putLength(myDotNumber+1, value+1)
		}
	})

	connections.forEach( (value, index) => {
		if(value.has(myDotNumber)){
			const myLine = document.getElementById('l'+(index+1)+'t'+(myDotNumber+1));
			myLine.setAttribute('x2', e.clientX);
			myLine.setAttribute('y2', e.clientY);
			if(isScaled){
				document.getElementById('pathLink'+(index+1)+'t'+(myDotNumber+1)).remove();
				document.getElementById('textId'+(index+1)+'t'+(myDotNumber+1)).remove();
				putLength(index+1, myDotNumber+1)
			}
		}
	})

	place[0][myDotNumber]=e.clientX-dotradius;
	place[1][myDotNumber]=e.clientY-dotradius;
}

async function endMoveDot(e){
	document.removeEventListener('mousemove', moveDot);
	document.removeEventListener('mouseup', endMoveDot);
	document.removeEventListener('mousedown', endMoveDot, true);

	const myDot = document.getElementById(id);
	myDot.className='dot active';

	isMoveBlocked=false;

	await sleep(10, false);
	if(!isScaled) return
	connections[id.slice(1, id.length)-1].forEach( value => {
		document.getElementById('pathLink'+id.slice(1, id.length)+'t'+(value+1)).remove();
		document.getElementById('textId'+id.slice(1, id.length)+'t'+(value+1)).remove();
		putLength(id.slice(1, id.length), value+1)
	})
	connections.forEach( (value, index) => {
		if(value.has(id.slice(1, id.length)-1)){
			document.getElementById('pathLink'+(index+1)+'t'+id.slice(1, id.length)).remove();
			document.getElementById('textId'+(index+1)+'t'+id.slice(1, id.length)).remove();
			putLength(index+1, id.slice(1, id.length))
		}
	})

}

function setId(argument){
	id=argument
	idAct=0
}

function setActId(argument){
	idAct=argument
}

function lineHover(idName){
	if(algorithmPlayed) return;
	document.getElementById(idName).style.stroke='#70b';
	if(!isScaled) return
	const myText = document.getElementById('textId'+idName.slice(1, idName.length)).getElementsByTagName('tspan')[0];
	myText.setAttribute('class', 'highlighted')
	const myGroups=document.getElementsByTagName('g')
	myGroups[4].appendChild(document.getElementById('textId'+idName.slice(1, idName.length)))
}

function lineLeave(idName){
	if(algorithmPlayed) return;
	document.getElementById(idName).style.stroke='#f90';
	if(!isScaled) return
	const myText = document.getElementById('textId'+idName.slice(1, idName.length)).getElementsByTagName('tspan')[0];
	myText.setAttribute('class', '')
}

function lineDelete(startId, endId){
	if(algorithmPlayed) return;
	document.getElementById('l'+startId+'t'+endId).remove();
	if(isScaled) document.getElementById('pathLink'+startId+'t'+endId).remove();
	if(isScaled) document.getElementById('textId'+startId+'t'+endId).remove();
	connections[startId-1].delete(endId-1);
}

function startAlgorithm(){
	document.body.style.color='#fc0';

	algorithmProcess=0;

	const myImage = document.getElementById('startButton');
	myImage.src='../library/stop-button.png';
	myImage.style.left='15px';
	const myDiv = document.getElementsByClassName('action')[0];
	myDiv.setAttribute('onmouseup','stopAlgorithm()');

	const myDots=document.getElementsByClassName('dot');
	for(let a=0;a<myDots.length;a++){
		myDots[a].className='dot';
	}

	algorithmPlayed=true;

	myAlgorithm();
}

function stopAlgorithm(){
	document.body.style.color='#0bf';

	if(typeof showDataInterval !=='undefined') clearInterval(showDataInterval);

	const myImage = document.getElementById('startButton');
	myImage.src='../library/play-button.png';
	myImage.style.left='18px';
	const myDiv = document.getElementsByClassName('action')[0];
	myDiv.setAttribute('onmouseup','startAlgorithm()');

	const myDots=document.getElementsByClassName('dot');
	for(let a=0;a<myDots.length;a++){
		myDots[a].className='dot active';
		myDots[a].style.backgroundColor='';
	}

	const myLines=document.getElementsByClassName('line');
	for(let a=0;a<myLines.length;a++){
		myLines[a].setAttribute('style','stroke:#f90;stroke-width:7;transition: stroke .2s;cursor: pointer;z-index:0');
	}

	algorithmPlayed=false;
}

function numerate(){
	document.getElementById('num').setAttribute('src', '../library/clean.png');
	document.getElementById('numerateAction').setAttribute('onmouseup', 'cleanNumbers()');
	for(let a=0;a<dots.length;a++){
		dots[a].innerHTML=alphabet[a];
		numerated[a]=true;
	}
	isNumerated=true;
}

function cleanNumbers(){
	document.getElementById('num').setAttribute('src', '../library/numerate.png');
	document.getElementById('numerateAction').setAttribute('onmouseup', 'numerate()');
	for(let a=0;a<dots.length;a++)
		dots[a].innerHTML='';
	isNumerated=false;
	numerated.fill(false);
}

function addDot(e){
	console.log(numerated)
	blockDelete=true;

	const newDot = document.createElement('div');

	if(dots.length==MAX_DOT_NUMBER) return

	const dotradius = parseInt(getCssVar('--dotradius'));

	newDot.setAttribute('class', 'dot active');
	newDot.setAttribute('id', 'l'+(dots.length+1));
	newDot.setAttribute('onmousedown', "setId('l"+(dots.length+1)+"')");
	newDot.setAttribute('onmouseup', "setActId('l"+(dots.length+1)+"')");
	newDot.setAttribute('oncontextmenu', "deleteDot('l"+(dots.length+1)+"')");
	for(let a=0;a<numerated.length&&isNumerated;a++)
		if(!numerated[a]){
			numerated[a]=true;
			newDot.innerHTML=alphabet[a];
			break;
		}
	newDot.style.transition='top 0s, left 0s';
	newDot.style.left=e.clientX-dotradius+'px';
	newDot.style.top=e.clientY-dotradius+'px';

	place[0].push(e.clientX-dotradius);
	place[1].push(e.clientY-dotradius);

	connections.push(new Set());

	document.getElementsByClassName('playground')[0].appendChild(newDot);
}

function deleteDot(argument){
	if(blockDelete||algorithmPlayed){
		blockDelete=false;
		return
	}

	const myInner = document.getElementById(argument).innerHTML;
	numerated.forEach( (value, index) => {
		if(myInner==alphabet[index]){
			numerated[index]=false;
		}
	})

	document.getElementById(argument).remove();

	for(let a=0;a<parseInt(argument.slice(1,argument.length))-1;a++){
		place[0].push(place[0].shift());
		place[1].push(place[1].shift());
	}
	place[0].shift();
	place[1].shift();
	for(let a=0;a<dots.length-parseInt(argument.slice(1,argument.length))+1;a++){
		place[0].push(place[0].shift());
		place[1].push(place[1].shift());
		
	}

	const myLines=document.getElementsByClassName('line');

	connections.length=dots.length;
	for(a=0;a<connections.length;a++)
		connections[a] = new Set();

	if(isScaled) {
		document.getElementsByTagName('g')[4].remove();
		const myGroup=document.createElementNS("http://www.w3.org/2000/svg", "g");
		document.getElementsByTagName('svg')[0].appendChild(myGroup);
	}

	for(let a=0;a<myLines.length;a++){
		let b;
		for(b=2;myLines[a].id[b]!=='t';b++);
		if(myLines[a].id.slice(1, b)==argument.slice(1,argument.length)||
			myLines[a].id.slice(b+1, myLines[a].id.length)==argument.slice(1,argument.length)){
			myLines[a].remove();
			a--;
			continue;
		}
		const firstId=(parseInt(myLines[a].id.slice(1, b))>parseInt(argument.slice(1,argument.length))) ? parseInt(myLines[a].id.slice(1, b))-1 : parseInt(myLines[a].id.slice(1, b));
		const secondId=(parseInt(myLines[a].id.slice(b+1, myLines[a].id.length))>parseInt(argument.slice(1,argument.length))) ? parseInt(myLines[a].id.slice(b+1, myLines[a].id.length))-1 : parseInt(myLines[a].id.slice(b+1, myLines[a].id.length));
		myLines[a].id='l'+firstId+'t'+secondId;
		myLines[a].setAttribute('onmouseover', 'lineHover("'+myLines[a].id+'")');
		myLines[a].setAttribute('onmouseleave', 'lineLeave("'+myLines[a].id+'")');
		myLines[a].setAttribute('onclick', 'lineDelete('+firstId+','+secondId+')');

		if(isScaled)
			putLength(firstId, secondId)

		connections[firstId-1].add(secondId-1);
	}
	
	for(let a=0;a<dots.length;a++){
		dots[a].id='l'+(a+1);
		dots[a].setAttribute('onmousedown', "setId('l"+(a+1)+"')");
		dots[a].setAttribute('onmouseup', "setActId('l"+(a+1)+"')");
		dots[a].setAttribute('oncontextmenu', "deleteDot('l"+(a+1)+"')");
	}
}

function sleep(argument, argument2=true) {
  if(argument2) return new Promise(resolve => setTimeout(resolve, argument*(100-speed)));
  else return new Promise(resolve => setTimeout(resolve, argument))
}

function showSlider(){
	document.getElementsByClassName("action")[1].innerHTML='<input type="range" min="0" max="100" value="'+speed+'" class="slider" oninput="setSpeed()">';
	document.getElementsByClassName("action")[1].style.width='200px';
	document.getElementsByClassName("action")[1].style.margin='15px 0 15px '+(screenWidth-215)+'px';
}

function hideSlider(){
	document.getElementsByClassName("action")[1].innerHTML='<img src="../library/speed.png" class="actionImage" alt="Sebesség" width="40px" height="40px" draggable="false" id="speed">';
	document.getElementsByClassName("action")[1].style.width=parseInt(getCssVar('--actionradius'))*2 + 'px'; 
	document.getElementsByClassName("action")[1].style.margin='15px 0 15px '+(screenWidth-parseInt(getCssVar('--actionradius'))*2-15)+'px';
}

function setSpeed(){
	speed = document.getElementsByClassName('slider')[0].value;
}

function startDrive(){
	window.addEventListener('contextmenu', e => {e.preventDefault();})

	numerated.length=MAX_DOT_NUMBER;
	numerated.fill(false);
	
	connections.length=dots.length;
	for(a=0;a<connections.length;a++)
		connections[a] = new Set();

	document.addEventListener('mousedown', e=>{
		if(e.target.matches('.dot.active')){
			startLine(e);
			startMoveDot(e);
		} else if(!e.target.matches('.line')&&e.button==2&&!algorithmPlayed){
			addDot(e);
		}
	})

	setInterval(screenModify, 50);
	randomisePlace(false);
}

function isConnected(connect, myDots){
	const visitedDots = new Set();
	const unvisitedDots = new Set();
	const unreachedDots = new Set(myDots);

	//delete unnecessary connections
	const copyConnect = Array.from(connect);
	const copyDots = new Set(myDots);
	const myIterator = copyDots.values();

	copyConnect.forEach((value, index) => value.forEach(value2 => {
		if(!copyDots.has(value2)||!copyDots.has(index)) value.delete(value2)
	}) );

	for(const myPlace of myIterator)
		return isConnectedDrive(unvisitedDots, visitedDots, unreachedDots, copyConnect, myPlace);
}

function isConnectedDrive(unvisitedDots, visitedDots, unreachedDots, connect, place){
	unvisitedDots.delete(place);
	visitedDots.add(place)
	unreachedDots.delete(place);

	connect.forEach((value, index) => {
		value.forEach( dotValue => {
			if(dotValue==place) {
				unreachedDots.delete(index);
				if(!visitedDots.has(index)) unvisitedDots.add(index);
			}
		})
	})

	connect[place].forEach(value => {
		unreachedDots.delete(value);
		if(!visitedDots.has(value)) unvisitedDots.add(value);
	});

	if(unreachedDots.size==0) return true;
	if(unvisitedDots.size==0) return false;
	
	const myIterator = unvisitedDots.values();
	for(myPlace of myIterator)
		return isConnectedDrive(unvisitedDots, visitedDots, unreachedDots, connect, myPlace);
}

function isCyclic(connect, myDots){
	if(myDots.size<3) return false;
	const connectCount=[];
	connectCount.length=dots.length;
	connectCount.fill(0);

	connect.forEach((value, index) => {
		if(myDots.has(value[0])&&myDots.has(value[1])&&value[2]!=2){
			connectCount[value[0]]++;
			connectCount[value[1]]++;
		}
	});

	for(let a=0;a<connectCount.length;a++)
		if(connectCount[a]!=2&&myDots.has(a)) return false

	return true
}

function hasCycle(connect, place, visitedDots = new Set(), parent=-1){
	if(visitedDots.has(place)) return true;
	visitedDots.add(place);
	const next = [];
	connect.forEach( (value, index) => value.forEach( value2 => {
		if(parent!=index&&value2==place) next.push(index)
	}))
	connect[place].forEach( value => {
		if(parent!=value) next.push(value)
	})
	for(let a=0;a<next.length;a++)
		if(hasCycle(connect, next[a], visitedDots, place)) return true;
	return false;
}

function sortFunction(value1, value2) {
	if(value1[2]==value2[2]) return 0;
	return (value1[2] < value2[2]) ? -1 : 1;
}

function deleteElement(array, index1, index2=-1){
	if(index2==-1) index2=index1+1;
	for(let a=0;a<array.length+(index2-index1);a++){
		if(a<index1||a>=index2)array.push(array[0]);
		array.shift()
	}
}

function putLength(idFrom, idTo){
	const mySVG=document.getElementsByTagName('svg')[0];
	const myPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
	const dotradius = parseInt(getCssVar('--dotradius'));

	const idUp=(place[0][idFrom-1]>place[0][idTo-1])?idFrom:idTo;
	const idDown=(place[0][idFrom-1]>place[0][idTo-1])?idTo:idFrom;

	let pathString='M '+parseInt(place[0][idDown-1]+dotradius)+','+parseInt(place[1][idDown-1]+dotradius)+
	' L '+parseInt(place[0][idUp-1]+dotradius)+','+parseInt(place[1][idUp-1]+dotradius);
	
	myPath.setAttribute('id', 'pathLink'+idFrom+'t'+idTo);
	myPath.setAttribute('fill', 'none');
	myPath.setAttribute('d', pathString);

	const myGroups = document.getElementsByTagName('g');
	myGroups[4].appendChild(myPath);

	const myText = document.createElementNS("http://www.w3.org/2000/svg", "text");
	const myTextPath = document.createElementNS("http://www.w3.org/2000/svg", "textPath");
	const myTspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");

	myText.setAttribute('id', 'textId'+idFrom+'t'+idTo);

	myTextPath.setAttribute('href', '#pathLink'+idFrom+'t'+idTo);
	myTextPath.setAttribute('startOffset', '50%');
	myTextPath.setAttribute('text-anchor', 'middle');

	myTspan.setAttribute('dy', '-10')
	myTspan.setAttribute('fill', '#a00')
	myTspan.innerHTML=parseInt(Math.sqrt((place[0][idUp-1]-place[0][idDown-1])**2+(place[1][idUp-1]-place[1][idDown-1])**2))+'px';

	myTextPath.appendChild(myTspan);
	myText.appendChild(myTextPath);
	myGroups[4].appendChild(myText);
}

function scale(){
	if(isScaled){
		document.getElementsByTagName('g')[4].remove();
		const myGroup=document.createElementNS("http://www.w3.org/2000/svg", "g");
		document.getElementsByTagName('svg')[0].appendChild(myGroup);
		isScaled=false;
	} else {
		connections.forEach( (value, index) => value.forEach(value2=>{
			console.log(index+1, value2+1)
			putLength(index+1, value2+1);
		}))
		isScaled=true;
	}
}

function paintGraph(myGraph, color){
	console.log(myGraph)
	console.log(goodEdges)
	const myDots=document.getElementsByClassName('dot');
	for(let a=0;a<myDots.length;a++)
		if(myGraph.has(a)) myDots[a].style.backgroundColor=color;
	const myGroups=document.getElementsByTagName('g');
	myGraph.forEach( value => {
			myGraph.forEach( value2 => {
				if(value==value2) return;
				const myLine=document.getElementById('l'+(value+1)+'t'+(value2+1));
				if(myLine==null||!goodEdges.has(myLine.id)) return;
				myLine.setAttribute('style','stroke:'+color+';stroke-width:7;transition: 0;cursor: default;z-index:1');
				myGroups[2].appendChild(myLine);
			})
		})
}

startDrive();