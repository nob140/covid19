"use strict";

//Cesium.Ion.defaultAccessToken = '';

var clock = new Cesium.Clock({
	startTime : Cesium.JulianDate.fromDate(new Date(2019, 12, 31)),
	stopTime : Cesium.JulianDate.now(),
	currentTime : Cesium.JulianDate.now(),
	clockRange : Cesium.ClockRange.LOOP_STOP,
	clockStep : Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER,
	multiplier : 36000*4,
	canAnimate : true,
	shouldAnimate : true,
});

var viewer = new Cesium.Viewer("cesium", {
	//terrainProvider: Cesium.createWorldTerrain(),
	terrainProvider: Cesium.EllipsoidTerrainProvider(),
	clockViewModel : new Cesium.ClockViewModel(clock),
	infoBox: true,
	//scene3DOnly: true,
	sceneModePicker: true,
	shouldAnimate: true,
	timeline: true,

	baseLayerPicker: false,
	geocoder: false,
	homeButton: false,
	navigationHelpButton: false,
	navigationInstructionsInitiallyVisible: false,
	selectionIndicator: false,
});
viewer.scene.globe.depthTestAgainstTerrain = true;	//absolute height
viewer.scene.globe.enableLightning = true;

async function init() {
	//2020-05-06 Data download doesn't work when ussing GitHub Pages
	var today = new Date();
	var todaystr = "YEAR-MONTH-DAY".replace("YEAR", today.getFullYear())
		.replace("MONTH", (today.getMonth()+1 < 10 ? "0" + Number(today.getMonth()+1) : today.getMonth()+1))
		.replace("DAY", (today.getDate() < 10 ? "0" + today.getDate() : today.getDate()));
	var filename = "covid19_" + todaystr + ".csv";
	
	//2020-05-06 Using local file tentatively
	//filename = "covid19_2020-05-06.csv";
	
	var filepath = "./data/" + filename;

	//Read data
	var covdata;
	try{
		try{
			//local file
			covdata = await getFile(filepath);
			covdata = convertCSVtoArray(covdata);
		}catch(e){
			//covdata = await getFile("https://opendata.ecdc.europa.eu/covid19/casedistribution/csv/");
			covdata = await getFile("http://opendata.ecdc.europa.eu/covid19/casedistribution/csv/");

			//download -> downloaded file should be moved to ./data folder manually...
			var blob = new Blob([covdata], {type: "text/plain"});
			const a = document.createElement('a');
			a.setAttribute('download', filename);
			a.setAttribute('href', window.URL.createObjectURL(blob));
			a.click(); // EXECUTING CLICK EVENT WILL AUTO-DOWNLOAD THE FILE

			covdata = convertCSVtoArray(covdata);
		}
	}catch(e){
		covdata = await getFile("./data/covid19_2020-05-06.csv");
		covdata = convertCSVtoArray(covdata);		
	}

	//Country's location
	//https://developers.google.com/public-data/docs/canonical/countries_csv
	var countries = await getFile("./data/countries.csv");
	countries = convertCSVtoArray(countries);
	countries = convertArraytolookupTable(countries, 0);

	//CZML
	var dataSource = new Cesium.CzmlDataSource();
	var czmlList = makeCZMLAndStatsForListOfCountries(covdata, countries);
	dataSource.load(czmlList);
	viewer.dataSources.add(dataSource);

	//Adjust clock
	clock.startTime = czmlList[0].clock.startTime;
	clock.stopTime = czmlList[0].clock.stopTime;
	clock.currentTime = czmlList[0].clock.currentTime;

	//View around Japan
	var viewRect = viewer.camera.computeViewRectangle();
	if (Cesium.defined(viewRect)) {
		var horizontalDegrees = Cesium.Math.toDegrees(viewRect.east - viewRect.west) - 140.0;
		viewer.camera.rotateRight(Cesium.Math.toRadians(horizontalDegrees));
	}

	//Legend & Courtesy
	buildColorTableToolbar();
	viewer.scene.frameState.creditDisplay.addDefaultCredit(new Cesium.Credit(
		'<a href="https://www.ecdc.europa.eu/en/publications-data/download-todays-data-geographic-distribution-covid-19-cases-worldwide">'
		+ 'COVID-19 cases data courtesy of ECDC (European Centre for Disease Prevention and Control)</a>'
	));

	//information
	buildInfobar("Ver 114");
}

window.onload = init
