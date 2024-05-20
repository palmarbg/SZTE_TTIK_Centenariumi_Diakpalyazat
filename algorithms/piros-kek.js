var color=['#555','#039','#c00'];

async function myAlgorithm(){
	const myLines=document.getElementsByClassName('line');
	const myGroups= document.getElementsByTagName('g');

	for(let a=0;a<myLines.length;a++){
		myLines[a].setAttribute('style','stroke:#555;stroke-width:7;transition: 0;cursor: default;z-index:1');
		myGroups[0].appendChild(myLines[a])
	}

	const showConnect=[];
	const connectDecoder=[];
	const connectLength=[];

	connections.forEach((value, index) => {
		value.forEach(dotValue => {
			connectDecoder.push([index, dotValue, 0]);
			showConnect.push(document.getElementById('l'+(index+1)+'t'+(dotValue+1)));
			connectLength.push(Math.sqrt((place[0][index]-place[0][dotValue])**2+(place[1][index]-place[1][dotValue])**2));
		})
	})

	const myDots = new Set();
	for(let a=0;a<dots.length;a++) myDots.add(a);

	if(!isConnected(connections, myDots)){
		alert('Nincs feszítőfa');
		stopAlgorithm();
		return
	}

	let activeDots=[];
	activeDots.length=dots.length;
	activeDots.fill(0);

	const selectedDots= new Set();

	console.log(connections)

	const myConnection=[];
	myConnection.length=dots.length;
	for(let a=0;a<dots.length;a++)
		myConnection[a]=new Set();

	const accessDots = document.getElementsByClassName('dot');

	while(!isConnected(myConnection, myDots)){
		for(let a=0;a<dots.length;a++){
			activeDots[a]=!activeDots[a];
			if(activeDots[a]){
				selectedDots.add(a);
				accessDots[a].style.backgroundColor='#0d0';
		}
			else {
				selectedDots.delete(a);
				accessDots[a].style.backgroundColor='';
			}
			if(activeDots[a]) break;
		}

		await sleep(10)


		//do blue
		let minOut=Infinity;
		let minOutId;
		let isGoodBlue=0;
		connectDecoder.forEach( (value, index) => {
			if(((selectedDots.has(value[0])&&!selectedDots.has(value[1]))||
				(selectedDots.has(value[1])&&!selectedDots.has(value[0])))&&value[2]!=2){
				if(value[2]==1) isGoodBlue=-1;
				if(value[2]==0&&isGoodBlue==0) isGoodBlue=1;
				if(minOut>connectLength[index]){
					minOut=connectLength[index];
					minOutId=index;
				}
			}
		})

		if(isGoodBlue==1){
			connectDecoder[minOutId][2]=1;
			showConnect[minOutId].setAttribute('style','stroke:'+color[1]+';stroke-width:7;transition: 0;z-index:1;cursor: default;');
			myGroups[2].appendChild(showConnect[minOutId])
			myConnection[connectDecoder[minOutId][0]].add(connectDecoder[minOutId][1]);
		}

		//do red
		if(isCyclic(connectDecoder, selectedDots)){
			let maxLength=0;
			let maxLengthId;
			connectDecoder.forEach((value, index) => {
				if(selectedDots.has(value[0])&&selectedDots.has(value[1])&&maxLength<connectLength[index]&&value[2]==0){
					maxLength=connectLength[index];
					maxLengthId=index;
				}
			})

			connectDecoder[maxLengthId][2]=2;
			showConnect[maxLengthId].setAttribute('style','stroke:'+color[2]+';stroke-width:7;transition: 0;z-index:1;cursor: default;');
			myGroups[1].appendChild(showConnect[maxLengthId]);
			
			deleteElement(connectDecoder, maxLengthId);
			deleteElement(showConnect, maxLengthId);
			deleteElement(connectLength, maxLengthId);
		}


		for(let a=0;a<showConnect.length;a++)
			showConnect[a].setAttribute('style','stroke:'+color[connectDecoder[a][2]]+';stroke-width:7;transition: 0;z-index:1;cursor: default;');

		if(!algorithmPlayed){
			stopAlgorithm();
			return
		}
		await sleep(10)
	}

	await sleep(200, false)
	alert('Algoritmus vége');
}