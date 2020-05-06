//Rotate the earth
//https://qiita.com/code_monkey/items/e1a3f6c48cbda3fa0e72
var eventHelper = new Cesium.EventHelper();
var removeCallback;
var rot_flag = false;
var defLen = 10000;

function rotation(){
	if (!rot_flag) {
		rot_flag = true;
		removeCallback = eventHelper.add(viewer.clock.onTick, onTick);
	}else{
		removeCallback();
		rot_flag = false;
	}
}

function onTick() {
	var horizontalDegrees = document.getElementById('sokudo').value;
	var viewRect = viewer.camera.computeViewRectangle();
	if (Cesium.defined(viewRect)) {
		horizontalDegrees *= Cesium.Math.toDegrees(viewRect.east - viewRect.west) / 360.0;
	}
	viewer.camera.rotateRight(Cesium.Math.toRadians(horizontalDegrees));
}
