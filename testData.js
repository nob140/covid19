function makeTestData(){
	var czmlList = [
		{
			"id": "document",
			"name": "COVID-19",
			"version": "1.0",
			"clock": {
				"interval": "2020-03-25/2020-03-29",		// This is the time range of our simulation
				"currentTime": "2020-03-25",	// This is the time associated with the start view
				"multiplier": 36000*2,
				"range": "LOOP_STOP",
				"step": "SYSTEM_CLOCK_MULTIPLIER"
			},
		},{
			"id" : 1,
			"name" : "JP_28/03/2020",
			"availability" : "2020-03-28/2020-03-29",
			//"position" : Cesium.Cartesian3.fromDegrees(lon, lat, 0),
			"position" : {
				//"epoch" : "2020-03-28",
				//"cartographicDegrees" : [0, 138.252924, 36.204824, 0]
				"cartographicDegrees" : [138.252924, 36.204824, 0]
			},
			"cylinder" : {
				"length" : 1350*100,
				"topRadius" : 100000,
				"bottomRadius" : 100000,
				"material" : Cesium.Color.BROWN.withAlpha(0.5),
			},
		},{
			"id" : 2,
			"name" : "JP_27/03/2020",
			"availability" : "2020-03-27/2020-03-28",
			//"position" : Cesium.Cartesian3.fromDegrees(lon, lat, 0),
			"position" : {
				//"epoch" : "2020-03-27",
				//"cartographicDegrees" : [0, 138.252924, 36.204824, 0]
				"cartographicDegrees" : [138.252924, 36.204824, 0]
			},
			"cylinder" : {
				"length" : 960*100,
				"topRadius" : 100000,
				"bottomRadius" : 100000,
				"material" : Cesium.Color.BROWN.withAlpha(0.5),
			},
		},{
			"id" : 3,
			"name" : "JP_26/03/2020",
			"availability" : "2020-03-26/2020-03-27",
			//"position" : Cesium.Cartesian3.fromDegrees(lon, lat, 0),
			"position" : {
				//"epoch" : "2020-03-26",
				//"cartographicDegrees" : [0, 138.252924, 36.204824, 0]
				"cartographicDegrees" : [138.252924, 36.204824, 0]
			},
			"cylinder" : {
				"length" : 750*100,
				"topRadius" : 100000,
				"bottomRadius" : 100000,
				"material" : Cesium.Color.BROWN.withAlpha(0.5),
			},
		},{
			"id" : 4,
			"name" : "JP_25/03/2020",
			"availability" : "2020-03-25/2020-03-26",
			//"position" : Cesium.Cartesian3.fromDegrees(lon, lat, 0),
			"position" : {
				//"epoch" : "2020-03-25",
				//"cartographicDegrees" : [0, 138.252924, 36.204824, 0]
				"cartographicDegrees" : [138.252924, 36.204824, 0]
			},
			"cylinder" : {
				"length" : 650*100,
				"topRadius" : 100000,
				"bottomRadius" : 100000,
				"material" : Cesium.Color.BROWN.withAlpha(0.5),
			},
		}
	];
    
    return czmlList;
}