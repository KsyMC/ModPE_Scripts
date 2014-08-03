//
// 무단 배포 금지
// ksy4362@naver.com
//

const VERSION = "1.0.1";
const blockId = 52;
const brighness = 7;
const distance = 2;
var inited = false;
var placed = false;
var touchX = 0, touchY = 0, touchZ = 0;

function newLevel() {
	placed = false;
	touchX = 0; touchY = 0; touchZ = 0;

	Block.setShape(blockId, 0, 0, 0, 0, 0, 0);
	Block.setLightLevel(blockId, 15);

	clientMessage("# DynamicLight " + VERSION + " By KsyMC");
}

function leaveGame() {
	inited = false;
}

function modTick() {
	if (getYaw() == 0) return;
	else if (!inited) init();

	var x = Math.floor(getPlayerX());
	var y = Math.floor(getPlayerY());
	var z = Math.floor(getPlayerZ());

	if (isGlowingItem(getCarriedItem()) && !isInWater(x, y, z) && !isInBlock(x, y, z) && (!placed ? brightnessCheck(x, y, z) : distanceCheck(x, y, z))) {
		if (!placed) {
			placed = true;
			touchX = x; touchY = y; touchZ = z;
			Level.setTile(x, y, z, blockId, 0);
		}
	} else if (placed) {
		placed = false;
		Level.setTile(touchX, touchY, touchZ, 0, 0);
	}
}

function init() {
	inited = true;

	var x = Math.floor(getPlayerX());
	var y = Math.floor(getPlayerY());
	var z = Math.floor(getPlayerZ());

	for (var ty = y - distance; ty <= y + distance; ty++) {
	for (var tx = x - distance; tx <= x + distance; tx++) {
	for (var tz = z - distance; tz <= z + distance; tz++) {
		if (Level.getTile(tx, ty, tz) == blockId) {
			Level.setTile(tx, ty, tz, 0, 0);
		}
	}}}
}

function brightnessCheck(x, y, z) {
	return Level.getBrightness(x, y - 1, z) <= brighness;
}

function distanceCheck(x, y, z) {
	var distanceX = Math.max(touchX, x) - Math.min(touchX, x);
	var distanceY = Math.max(touchY, y) - Math.min(touchY, y);
	var distanceZ = Math.max(touchZ, z) - Math.min(touchZ, z);
	return distanceX <= distance && distanceY <= distance && distanceZ <= distance;
}

function isInWater(x, y, z) {
	var id = Level.getTile(x, y, z);
	return id == 8 || id == 9;
}

function isInBlock(x, y, z) {
	var id = Level.getTile(x, y, z);
	return id != 0 && id != blockId;
}

function isGlowingItem(id) {
	switch (id) {
	case 10: case 11: case 50: case 51:
	case 89: case 91: case 327:
		return true;
	default:
		return false;
	}
}