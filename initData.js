var colorTable = [
	//number, rgba, radius
	[500, [255, 0, 0, 127], 175000],
	[200, [255, 127, 0, 127], 150000],
	[50, [255, 255, 0, 127], 125000],
	[0, [0, 0, 255, 127], 100000],
]

function buildColorTableToolbar(){
	var toolbar = document.getElementById('toolbar');
	toolbar.innerHTML = '<table border="1">' +
	'<tr>Confirmed case</tr>' +
	'<tr><td class ="circle" style="background-color:' + Cesium.Color.fromBytes(colorTable[0][1][0], colorTable[0][1][1], colorTable[0][1][2], colorTable[0][1][3]).toCssColorString() + '">    </td>' + 
	'<td>' + colorTable[0][0] + ' - </td></tr>' +
	'<tr><td class ="circle" style="background-color:' + Cesium.Color.fromBytes(colorTable[1][1][0], colorTable[1][1][1], colorTable[1][1][2], colorTable[1][1][3]).toCssColorString() + '"></td>' + 
	'<td>' + colorTable[1][0] + ' - ' + (colorTable[0][0]-1) + '</td></tr>' +
	'<tr><td class ="circle" style="background-color:' + Cesium.Color.fromBytes(colorTable[2][1][0], colorTable[2][1][1], colorTable[2][1][2], colorTable[2][1][3]).toCssColorString() + '"></td>' +
	'<td>' + colorTable[2][0] + ' - ' + (colorTable[1][0]-1) + '</td></tr>' +
	'<tr><td class ="circle" style="background-color:' + Cesium.Color.fromBytes(colorTable[3][1][0], colorTable[3][1][1], colorTable[3][1][2], colorTable[3][1][3]).toCssColorString() + '"></td>' +
	'<td>' + colorTable[3][0] + ' - ' + (colorTable[2][0]-1) + '</td></tr>' +
	'</table>';
}

function getFile(filepath){
	return new Promise((resolve, reject) => {
		var req = new XMLHttpRequest();
		req.open("GET", filepath, true);
		req.onload = () => {
			if (req.readyState === 4 && req.status === 200) {
				resolve(req.responseText);
			}else{
				alert(req.statusText);
				reject(new Error(req.statusText));
			}
		};
		req.onerror = () => {
			alert(req.statusText);
			reject(new Error(req.statusText));
		};
		req.send(null);
	});
}

function convertCSVtoArray(str) {
	var result = [];
	str.split(/\r\n|\n|\r/).forEach(tmp => 
		result.push(tmp.split(','))
	);
	return result;
}

function convertArraytolookupTable(data, keyId) {
	var lookupTable = {};
	var forEachRecord = function (currentRecord) {
		lookupTable[currentRecord[keyId]] = currentRecord;
	};
	data.forEach(forEachRecord);
	return lookupTable;
}

function makeCZMLAndStatsForListOfCountries(data, countries) {
	var czmlList = [
		{
			id: 'document',
			name: 'COVID-19',
			version: "1.0",
			clock: {
			  //interval: '',
			  startTime: '',
			  stopTime: '',
			  currentTime: '',
			  multiplier: 10000,
			  range: 'LOOP_STOP',
			  step: 'SYSTEM_CLOCK_MULTIPLIER'
			},
		}
	];

	var startDate = Cesium.JulianDate.fromDate(new Date(3000, 12, 31));
	var endDate = Cesium.JulianDate.fromDate(new Date(1000, 1, 3));

	for(var i=1; i<data.length; i++){
		var tmp = data[i];
		if(!tmp){
			continue;
		}
		var countrycode = tmp[7];
		if(!countrycode){
			continue;
		}
		var country = countries[countrycode];
		if(!country){
			continue;
		}

		var cc = country[3] + '_' + tmp[0] + '_' + tmp[4];
		var lon = country[2];
		var lat = country[1];

		var datestr = tmp[3] + (Number(tmp[2]) < 10 ? "-0" : "-") + tmp[2] + (Number(tmp[1]) < 10 ? "-0" : "-") + tmp[1];
		var jdate0 = Cesium.JulianDate.fromIso8601(datestr, new Cesium.JulianDate());
		var jdate1 = Cesium.JulianDate.addDays(jdate0, 1, new Cesium.JulianDate());

		if(Cesium.JulianDate.compare(startDate, jdate0) > 0){
			startDate = jdate0;
		}
		if(Cesium.JulianDate.compare(endDate, jdate1) < 0){
			endDate = jdate1;
		}

		var cylinderInfo = (tmp[4] > colorTable[0][0] ? colorTable[0] :
			(tmp[4] > colorTable[1][0] ? colorTable[1] :
				(tmp[4] > colorTable[2][0] ? colorTable[2] :
					colorTable[3])));

		try {
			var czmlItem = {
				id : i,
				name : cc,
				availability : Cesium.JulianDate.toIso8601(jdate0) + '/' + Cesium.JulianDate.toIso8601(jdate1),
				position : {
					cartographicDegrees: [lon, lat, 0]
				},
				cylinder : {
					length : tmp[4] * 100,
					topRadius : cylinderInfo[2],
					bottomRadius : cylinderInfo[2],
					material : {
						solidColor : {
							color : {
								rgba : cylinderInfo[1]
							}
						}
					},
					//heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
				},
			};

			czmlList.push(czmlItem);
		}catch(e){
			console.log(cc);	//test
		}
	}

	czmlList[0].clock.startTime = startDate;
	czmlList[0].clock.stopTime = endDate;
	czmlList[0].clock.currentTime = startDate;

	return czmlList;
}
