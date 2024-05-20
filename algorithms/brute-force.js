var algorithmProcess;
var showDataInterval;

var optionsNumber;

function refreshData(){
	document.getElementById('showData2').innerHTML='megvizsgált: '+algorithmProcess+'/'+optionsNumber;
}

function factorial(number){
	if(number<=1) return 1;
	return number*factorial(number-1)
}

function choose(number1, number2){
	return Math.round(factorial(number1)/factorial(number2)/factorial(number1-number2))
}

async function myAlgorithm(){
	const myLines=document.getElementsByClassName('line');
	for(let a=0;a<myLines.length;a++){
		myLines[a].setAttribute('style','stroke:#ddd;stroke-width:7;transition: 0;cursor: default;z-index:1');
	}

	let connect=[];
	let showConnect=[];
	let connectDecoder=[];
	let connectLength=[];
	let minLength=0;

	connections.forEach((value, index) => {
		value.forEach(dotValue => {
			connect.push(0);
			connectDecoder[connect.length-1]=[];
			connectDecoder[connect.length-1][0]=index;
			connectDecoder[connect.length-1][1]=dotValue;
			showConnect.push(document.getElementById('l'+(index+1)+'t'+(dotValue+1)));
			connectLength.push(Math.sqrt((place[0][index]-place[0][dotValue])**2+(place[1][index]-place[1][dotValue])**2));
			minLength+=connectLength[connect.length-1];
		})
	})

	document.getElementById('showData').innerHTML='legrövidebb: '+Math.round(minLength)+'px';

	const myDots = new Set();
	for(let a=0;a<dots.length;a++) myDots.add(a);

	if(!isConnected(connections, myDots)){
		alert('Nincs feszítőfa');
		stopAlgorithm();
		return
	}

	const myConnection = [];
	myConnection.length = dots.length;
	for(a=0;a<myConnection.length;a++)
		myConnection[a] = new Set();

	let connectCount=0;

	optionsNumber=choose(connect.length,dots.length-1);
	showDataInterval=setInterval(refreshData, 20);
	for(;algorithmProcess<optionsNumber;algorithmProcess++){
		await sleep(7);
		if(!algorithmPlayed){
			stopAlgorithm();
			return
		}

		do{
			for(let a in connect){
				connectCount-=connect[a];
				connect[a]=1-connect[a];
				if(connect[a]==1) {
					myConnection[connectDecoder[a][0]].add(connectDecoder[a][1]);
					connectCount+=connect[a];
					break;
				} else myConnection[connectDecoder[a][0]].delete(connectDecoder[a][1]);
				connectCount+=connect[a];
			}
			if(!algorithmPlayed){
				stopAlgorithm();
				return
			}
		} while(connectCount!==dots.length-1)

		let length=0;
		for(let a=0;a<connect.length;a++) length+=connect[a]*connectLength[a];

		if(length<=minLength&&isConnected(myConnection, myDots)){
			for(let a=0;a<connect.length;a++){
				const myGroups= document.getElementsByTagName('g');
				if(connect[a]==1){
					showConnect[a].setAttribute('style','stroke:#ddd;stroke-width:7;transition: 0;z-index:1;cursor: default;');
					myGroups[1].appendChild(showConnect[a]);
				} else {
					showConnect[a].setAttribute('style','stroke:#555;stroke-width:7;transition: 0;z-index:-1;cursor: default;');
					myGroups[0].appendChild(showConnect[a]);
				}
			}
			minLength=length;
			document.getElementById('showData').innerHTML='legrövidebb: '+Math.round(minLength)+'px';
		}
	}
}
