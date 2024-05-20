const goodEdges=new Set();

async function myAlgorithm(){
	const accessDot=document.getElementsByClassName("dot");
	const myGroups=document.getElementsByTagName('g');
	const myDots = new Set();

	goodEdges.clear()

	for(let a=0;a<dots.length;a++)
		myDots.add(a);

	if(!isConnected(connections, myDots)){
		alert('Nincs feszítőfa');
		stopAlgorithm();
		return
	}

	myDots.clear();
	myDots.add(0);

	for(let a=0;a<accessDot.length;a++)
		accessDot[a].style.backgroundColor='';

	const connect=[];
	connections.forEach((value, index) => {
		value.forEach(value2 => {
			const bin=[];
			bin.push(index);
			bin.push(value2);
			bin.push(Math.sqrt((place[0][index]-place[0][value2])**2+(place[1][index]-place[1][value2])**2))
			bin.push(document.getElementById('l'+(index+1)+'t'+(value2+1)));
			bin[3].setAttribute('style','stroke:#555;stroke-width:7;transition: 0;cursor: default;z-index:1');
			myGroups[1].appendChild(bin[3]);
			connect.push(bin);
		})
	})

	accessDot[0].style.backgroundColor='#186';

	for(let vertices=1;vertices<dots.length;vertices++){
		await sleep(80);
		let minOut=Infinity;
		let minOutId;
		for(let a=0;a<connect.length;a++)
			if(  ((myDots.has(connect[a][0])&&!myDots.has(connect[a][1])) || (!myDots.has(connect[a][0])&&myDots.has(connect[a][1])))  &&  minOut>connect[a][2]  ){
				minOut=connect[a][2];
				minOutId=a;
			}
		accessDot[connect[minOutId][0]].style.backgroundColor='#186';
		accessDot[connect[minOutId][1]].style.backgroundColor='#186';

		myDots.add(connect[minOutId][0]);
		myDots.add(connect[minOutId][1]);

		//connect[minOutId][3].setAttribute('style','stroke:#ddd;stroke-width:7;transition: 0;cursor: default;z-index:1');

		goodEdges.add(connect[minOutId][3].id);

		paintGraph(myDots, '#186')

		if(!algorithmPlayed){
			stopAlgorithm();
			return
		}
	}
}