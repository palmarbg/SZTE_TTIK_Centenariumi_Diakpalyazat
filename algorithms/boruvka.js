const color=['#186', '#f54', '#94b', '#fa1', '#3ae', '#3d7', '#fe7'];
          //kék-zöld, piros, lila,   narancs, kék,   zöld,   sárga
const goodEdges=new Set();

async function myAlgorithm(){
	const myGroups= document.getElementsByTagName('g');
	const connect=[];
	goodEdges.clear();

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

	const myGraphs=[];
	for(let a=0;a<dots.length;a++)
		myGraphs[a]=new Set([a]);

	for(let a=0;myGraphs.length!=1;){
		//sort array!!
		for(let x=0;x<myGraphs.length;x++)
			for(let y=myGraphs.length-1;y>x;y--){
				if(myGraphs[y].size>myGraphs[y-1].size){
					const tempSet= new Set(myGraphs[y]);
					myGraphs[y]=myGraphs[y-1]
					myGraphs[y-1]=tempSet;
					const tempColor=color[y];
					color[y]=color[y-1];
					color[y-1]=tempColor
				}
			}
		a%=myGraphs.length;

		await sleep(40)		

		const minId=getMinOutId(connect, myGraphs[a]);
		connect[minId][3].setAttribute('style','stroke:#ddd;stroke-width:7;transition: 0;cursor: default;z-index:1');
		await sleep(40)
		myGroups[2].appendChild(connect[minId][3])
		goodEdges.add(connect[minId][3].id);

		const otherId=(myGraphs[a].has(connect[minId][0]))?connect[minId][1]:connect[minId][0];
		let b=0;
		for(;b<connect.length;b++)
			if(myGraphs[b].has(otherId)) break;
		

		const static=(a>b)?b:a;
		b=(a>b)?a:b;

		myGraphs[static]=new Set([...myGraphs[static], ...myGraphs[b]]);

		deleteElement(myGraphs, b);
		color.push(color[b])
		deleteElement(color, b)

		paintGraph(myGraphs[static], color[static]);

		if(static==a) a=(a+1)%myGraphs.length;

		if(!algorithmPlayed){
			stopAlgorithm();
			return;
		}
	}

	const arr=[1,2,3,4];
	deleteElement(arr, 2);
	console.log(arr);
}

function getMinOutId(connect, myDots){
	for(let a=0;a<connect.length;a++)
		if(  (myDots.has(connect[a][0])&&!myDots.has(connect[a][1]))  ||  (!myDots.has(connect[a][0])&&myDots.has(connect[a][1]))  )
			return a
}