
//mst doesnt exists-----------------------------------------------------------------------------------------------

async function myAlgorithm(){
	const myGroups= document.getElementsByTagName('g');
	const connect=[];

	const myDots=new Set();
	for(let a=0;a<dots.length;a++)
		myDots.add(a);

	if(!isConnected(connections, myDots)){
		alert('Nincs feszítőfa');
		stopAlgorithm();
		return
	}

	const copyConnections=[];

	connections.forEach( (value, index) => {
		copyConnections[index]=new Set();
		value.forEach( value2 => {
			copyConnections[index].add(value2);
			const bin=[];
			bin.push(index);
			bin.push(value2);
			bin.push(Math.sqrt((place[0][index]-place[0][value2])**2+(place[1][index]-place[1][value2])**2));
			bin.push(document.getElementById('l'+(index+1)+'t'+(value2+1)));
			bin[3].setAttribute('style','stroke:#555;stroke-width:7;transition: 0;cursor: default;z-index:1');
			myGroups[1].appendChild(bin[3]);
			connect.push(bin);
		})
	})

	connect.sort(sortFunction);

	let edges=0;

	document.getElementById('showData').innerHTML='megvizsgált: '+0+'/'+connect.length;
	document.getElementById('showData2').innerHTML='élek száma: '+0+'/'+(dots.length-1);

	for(let a=connect.length-1;edges<dots.length-1;a--){
		connect[a][3].setAttribute('style','stroke:#0c0;stroke-width:7;transition: 0;cursor: default;z-index:1');
		myGroups[2].appendChild(connect[a][3])
		await sleep(30);
		copyConnections[connect[a][0]].delete(connect[a][1]);
		if(isConnected(copyConnections, myDots)){
			connect[a][3].setAttribute('style','stroke:#222;stroke-width:7;transition: 0;cursor: default;z-index:1');
			myGroups[0].appendChild(connect[a][3])
		} else {
			copyConnections[connect[a][0]].add(connect[a][1])
			connect[a][3].setAttribute('style','stroke:#ddd;stroke-width:7;transition: 0;cursor: default;z-index:1');
			myGroups[2].appendChild(connect[a][3])
			edges++;
		}
		if(dots.length-1-edges==a){
			a--;
			for(let b=a;b>=0;b--){
				connect[b][3].setAttribute('style','stroke:#ddd;stroke-width:7;transition: 0;cursor: default;z-index:1');
				myGroups[2].appendChild(connect[b][3])
				edges++;
			}
			console.log('+///+')
			break;
		}
		document.getElementById('showData').innerHTML='megvizsgált: '+(connect.length-a)+'/'+connect.length;
		document.getElementById('showData2').innerHTML='élek száma: '+edges+'/'+(dots.length-1);
		if(!algorithmPlayed){
			stopAlgorithm();
			return;
		}
	}
}

