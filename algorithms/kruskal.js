async function myAlgorithm(){
	const myGroups= document.getElementsByTagName('g');
	const connect=[];

	const myDots = new Set();
	for(let a=0;a<dots.length;a++)
		myDots.add(a);

	if(!isConnected(connections, myDots)){
		alert('Nincs feszítőfa');
		stopAlgorithm();
		return
	}

	connections.forEach( (value, index) => value.forEach( value2 => {
		const bin=[];
		bin.push(index);
		bin.push(value2);
		bin.push(Math.sqrt((place[0][index]-place[0][value2])**2+(place[1][index]-place[1][value2])**2));
		bin.push(document.getElementById('l'+(index+1)+'t'+(value2+1)));
		bin[3].setAttribute('style','stroke:#555;stroke-width:7;transition: 0;cursor: default;z-index:1');
		myGroups[1].appendChild(bin[3]);
		connect.push(bin);
	}))

	connect.sort(sortFunction);

	let edges=0;
	const myConnect = [];
	for(let a=0;a<dots.length;a++)
		myConnect[a] = new Set();

	document.getElementById('showData').innerHTML='megvizsgált: '+0+'/'+connect.length;
	document.getElementById('showData2').innerHTML='élek száma: '+0+'/'+(dots.length-1);

	for(let a=0;edges<dots.length-1;a++){
		connect[a][3].setAttribute('style','stroke:#0c0;stroke-width:7;transition: 0;cursor: default;z-index:1');
		myGroups[2].appendChild(connect[a][3])
		await sleep(30);
		myConnect[connect[a][0]].add(connect[a][1]);
		if(hasCycle(myConnect, connect[a][0])){
			myConnect[connect[a][0]].delete(connect[a][1]);
			connect[a][3].setAttribute('style','stroke:#222222;stroke-width:7;transition: 0;cursor: default;z-index:1');
			myGroups[0].appendChild(connect[a][3])
		} else {
			connect[a][3].setAttribute('style','stroke:#ddd;stroke-width:7;transition: 0;cursor: default;z-index:1');
			myGroups[2].appendChild(connect[a][3])
			edges++;
		}
		document.getElementById('showData').innerHTML='megvizsgált: '+a+'/'+connect.length;
		document.getElementById('showData2').innerHTML='élek száma: '+edges+'/'+(dots.length-1);
		if(!algorithmPlayed){
			stopAlgorithm();
			return;
		}
	}
}

