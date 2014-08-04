//
// 무단 배포 금지
// ksy4362@naver.com
//

const VERSION = "1.0.0";
var treeType = 0;
var startY = 0;

function newLevel() {
	clientMessage("# ChopTree " + VERSION + " By KsyMC");
}

function destroyBlock(x, y, z, side) {
	if (Level.getTile(x, y, z) == 17 && Level.getTile(x, y - 1, z) == 3 && isTree(x, y, z)) {
		if (isAxe(getCarriedItem())) {
			startY = y;
			treeType = Level.getData(x, y, z);
			destoryTree(x, y, z);
		}
	}
}

function isAxe(id) {
	switch (id) {
	case 271:
	case 258:
	case 275:
	case 286:
	case 279:
		return true;
	default:
		return false;
	}
}

function isTree(x, y, z) {
	for (var ty = y; getTile(x, ty, z) == 17; ty++) {
		if (getTile(x, ty + 1, z) == 18) {
			return true;
		}
	}
	return false;
}

function destoryTree(x, y, z) {
	for (var ty = y; getTile(x, ty, z) == 17; ty++) {
		destory(x, ty, z);
	}

	new java.lang.Thread(new java.lang.Runnable({
		run: function() {
			java.lang.Thread.sleep(500);
			Level.setTile(x, y, z, 6, treeType);
		}
	})).start();
}

function destory(x, y, z) {
	removeLeaves(x, y, z);
	destoryWood(x, y, z);

	var woods = getNearestWood(x, y, z);
	for (var i in woods) {
		var wood = woods[i];
		destory(wood[0], wood[1], wood[2]);
	}
}

function destoryWood(x, y, z) {
	for (var tx = x - 1; tx <= x + 1; tx++) {
	for (var tz = z - 1; tz <= z + 1; tz++) {
		var id = Level.getTile(tx, y, tz);
		if (id == 17) {
			Level.destroyBlock(tx, y, tz, true);
		}
	}}
}

function removeLeaves(x, y, z) {
	for (var ty = y - 1; ty <= y + 1; ty++) {
	for (var tx = x - 1; tx <= x + 1; tx++) {
	for (var tz = z - 1; tz <= z + 1; tz++) {
		var id = Level.getTile(tx, ty, tz);
		if (id == 18) {
			Level.setTile(tx, ty, tz, 0, 0);
			if (getRandomInt(0, 50) == 10) {
				Level.dropItem(x, startY, z, 0, 260, 1, 0);
			}
			if (getRandomInt(0, 50) == 20) {
				Level.dropItem(x, startY, z, 0, 6, 1, treeType);
			}
		}
	}}}
}

function getNearestWood(x, y, z) {
	var result = [];
	for (var tx = x - 2; tx <= x + 2; tx++) {
	for (var tz = z - 2; tz <= z + 2; tz++) {
		var id = Level.getTile(tx, y, tz);
		if (id == 17) {
			result.push([tx, y, tz]);
		}
	}}
	return result;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}