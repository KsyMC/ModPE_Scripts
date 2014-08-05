//
// 무단 배포 금지
// ksy4362@naver.com
//

const VERSION = "2.0";
var mPlayer = null;
var nowplaying = null;
var nowplayingText = null;
var jukebox = {};
var saveTick = -1;
var hue = 0;
 
const sdcardPath = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
const resPath = sdcardPath + "/games/com.mojang/minecraftResources/ScriptManager/";
const sounds = ["Minecraft.ogg", "Clark.ogg", "Sweden.ogg", "Subwoofer_lullaby.ogg", "Living_mice.ogg", "Haggstrom.ogg", "Danny.ogg", "Key.ogg", "Oxygene.ogg", "Dry_hands.ogg", "Wet_hands.ogg", "Mice_on_venus.ogg"];
const jukebox_sounds = ["13.ogg", "cat.ogg", "blocks.ogg", "chirp.ogg", "far.ogg", "mall.ogg", "mellohi.ogg", "stal.ogg", "strad.ogg", "ward.ogg", "11.ogg", "wait.ogg"];
const jukebox_name = ["13", "cat", "blocks", "chirp", "far", "mall", "mellohi", "stal", "strad", "ward", "11", "wait"];

const context = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();

const MATCH_PARENT = -1;
const WRAP_CONTENT = -2;

const Gravity = android.view.Gravity;

function init() {
	ModPE.setItem(500, "record_13", 0, "13 disc", 1);
	ModPE.setItem(501, "record_cat", 0, "cat disc", 1);
	ModPE.setItem(502, "record_blocks", 0, "blocks disc", 1);
	ModPE.setItem(503, "record_chirp", 0, "chirp disc", 1);
	ModPE.setItem(504, "record_far", 0, "far disc", 1);
	ModPE.setItem(505, "record_mall", 0, "mall disc", 1);
	ModPE.setItem(506, "record_mellohi", 0, "mellohi disc", 1);
	ModPE.setItem(507, "record_stal", 0, "stal disc", 1);
	ModPE.setItem(508, "record_strad", 0, "strad disc", 1);
	ModPE.setItem(509, "record_ward", 9, "ward disc", 1);
	ModPE.setItem(510, "record_11", 0, "11 disc", 1);
	ModPE.setItem(511, "record_wait", 0, "wait disc", 1);

	Block.defineBlock(84, "Jukebox", [["jukebox_side", 0], ["jukebox_top", 0], ["jukebox_side", 0], ], 3, false, 10);
	Block.setDestroyTime(84, 1);

	Player.addItemCreativeInv(84, 1, 0);
	for (var i = 500; i <= 511; i++) {
		Player.addItemCreativeInv(i, 1, 0);
	}
}
init();

function newLevel() {
	jukebox = {};
	mPlayer = new android.media.MediaPlayer();

	clientMessage("# Minecraft BGM " + VERSION + " By KsyMC");
}

function useItem(x, y, z, item, block, side, itemdata, blockdata) {
	if (block == 84) {
		if (!isExists(x, y, z)) setXYZ(x, y, z, false);

		var record = getXYZ(x, y, z);
		if (!record && item >= 500 && item <= 511) {
			playSound(jukebox_sounds[item - 500]);
			setXYZ(x, y, z, item);

			showNowPlaying(jukebox_name[item - 500]);
			if (Level.getGameMode() != 1) {
				var slotId = Player.getSelectedSlotId();
				Player.clearInventorySlot(slotId);
			}
		} else if (record) {
			if(mPlayer.isPlaying()) mPlayer.pause();
			setXYZ(x, y, z, false);

			Level.dropItem(x, y + 1, z, 0, record, 1, 0);
			preventDefault();
		}
	}
}

function destroyBlock(x, y, z, side) {
	if (getTile(x, y, z) == 84) {
		var record = getXYZ(x, y, z);
		if (isExists(x, y, z) && record) {
			if (mPlayer.isPlaying()) mPlayer.pause();
			setXYZ(x, y, z, false);

			if (Level.getGameMode() != 1) {
				Level.dropItem(x, y + 1, z, 0, record, 1, 0);
			}
		}
	}
}

function isExists(x, y, z) {
	return jukebox[x + "," + y + "," + z] !== undefined;
}

function getXYZ(x, y, z) {
	return jukebox[x + "," + y + "," + z];
}

function setXYZ(x, y, z, item) {
	jukebox[x + "," + y + "," + z] = item
}

function leaveGame() {
	runOnUiThread(function() {
		if (nowplaying !== null) {
			nowplaying.dismiss();
			nowplaying = null;
		}
		if (mPlayer !== null) {
			mPlayer.release();
			mPlayer = null;
		}
	});
}

function modTick() {
	if (nowplaying !== null) {
		saveTick--;
		runOnUiThread(function() {
			if (saveTick == 0) {
				nowplaying.dismiss();
				nowplaying = null;
			} else {
				if (hue > 360) hue = 0;
				nowplayingText.setTextColor(Hsv(hue, 1, 1));
				hue += 5;
			}
		});
	}

	var time = Level.getTime();
	var random = parseInt(Math.random() * 100) + 1;
	time %= 14400;

	if(mPlayer == null || mPlayer.isPlaying() || random != 100) return;
	if(time >= 7200 && time <= 8280) playSound(sounds[0]);
	else if(time >= 4000 && time <= 5000) playSound(getRandomSound(0));
}

function showNowPlaying(title) {
	var layout = new android.widget.LinearLayout(context);
	layout.setOrientation(1);
	nowplayingText = TextView(layout, "Now Playing: C418 - " + title, 18, [MATCH_PARENT, MATCH_PARENT, 0], Gravity.CENTER);
	saveTick = 200; red = 0; green = 0; blue = 0;

	runOnUiThread(function() {
		if (nowplaying !== null) nowplaying.dismiss();

		nowplaying = new android.widget.PopupWindow(layout, context.getScreenWidth(), dip2px(context, 50));
		nowplaying.setTouchable(false);
		nowplaying.showAtLocation(context.getWindow().getDecorView(), Gravity.CENTER | Gravity.BOTTOM, 0, 100);
	});
}

function getRandomSound(type) {
	switch (type) {
		case 0: return sounds[parseInt(Math.random() * 12)];
		case 1: return jukebox_sounds[parseInt(Math.random() * 12)];
	}
}

function playSound(sndname) {
	try {
		if (mPlayer.isPlaying()) mPlayer.pause();
		mPlayer.reset();
		mPlayer.setDataSource(resPath + "musics/" + sndname);
		mPlayer.prepare();
		mPlayer.start();
	} catch (e) {
		clientMessage("[Error] 음악 파일을 찾을 수 없습니다.");
	}
}

function dip2px(context, dips) {
	return Math.ceil(dips * context.getResources().getDisplayMetrics().density);
}

function TextView(layout, text, size, params, gravity) {
	var textView = new android.widget.TextView(context);
	textView.setText(text);
	textView.setTextSize(size);
	textView.setLayoutParams(LayoutParams(params[0], params[1], params[2]));
	Typeface(textView);
	textView.setGravity(gravity);
	if (layout !== null) layout.addView(textView);
	return textView;
}

function Typeface(view) {
	try {
		var filename = "minecraft.ttf";
		view.setTypeface(android.graphics.Typeface.createFromFile(resPath + "fonts/" + filename));
	} catch (e) {
		clientMessage("[Error] 폰트 파일을 찾을 수 없습니다.");
	}
}

function Hsv(h, s, v) {var hsv = java.lang.reflect.Array.newInstance(java.lang.Float.TYPE, 3);hsv[0] = h;hsv[1] = s; hsv[2] = v;return android.graphics.Color.HSVToColor(hsv);}
function runOnUiThread(func) {context.runOnUiThread(new java.lang.Runnable({run: function() {func();}}));}
function LayoutParams(width, height, weight) {return new android.widget.LinearLayout.LayoutParams(width, height, weight);}