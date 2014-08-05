//
// 무단 배포 금지
// ksy4362@naver.com
//

var context = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
var contextBL = net.zhuoweizhang.mcpelauncher.ScriptManager.androidContext;

var sdcardPath = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
var savePath = sdcardPath + "/games/com.mojang/minecraftpe/ksymc_scriptmanager.json";
var resPath = sdcardPath + "/games/com.mojang/minecraftResources/ScriptManager/";

var newsHTML = "<!doctype html><html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0\"></head><body><h3>오프라인 모드</h3><hr><p style=\"text-align: center\">제조일자(KsyMC) <a href=\"mailto:ksy4362@naver.com\">ksy4362@naver.com</a><br>MDS - Minecraft Dev Space <a href=\"http://cafe.naver.com/minecraftdev\">http://cafe.naver.com/minecraftdev</a></p></body></html>";

const CODE = 0;
const VERSION_CODE = 4;
const VERSION = "1.1.3 Alpha";

const SCRIPT_URL = "https%3A%2F%2Fraw.github.com%2FKsyMC%2Fmodpe_scripts%2Fmaster%2F";
const DATA_URL = SCRIPT_URL + "data%2F";
const CRASH_URL = "https%3A%2F%2Fdocs.google.com%2Fforms%2Fd%2F1LileGpXDo6cFbPgycedFST7cByXC_ZtFpZ38sP6nHh8%2FformResponse%3Fentry.744513758%3D";

const HORIZONTAL = 0;
const VERTICAL = 1;

const MATCH_PARENT = -1;
const WRAP_CONTENT = -2;

const STYLE_SPINNER = 0;
const STYLE_HORIZONTAL = 1;

const Gravity = android.view.Gravity;
const ScaleType = android.widget.ImageView.ScaleType;
const ScriptManager = net.zhuoweizhang.mcpelauncher.ScriptManager;

const NO_COLOR = 0;
const BLACK = 1;
const WHITE = 2;
const RED = 3;
const BASE_COLOR = 4;
const TITLE_COLOR = 5;
const BUTTON_COLOR = 6;

const WINDOW_BUTTON = 0;
const WINDOW_MAIN = 1;
const WINDOW_CRASH = 2;
const WINDOW_SCRIPT = 3;
const WINDOW_ALERT = 4;
const WINDOW_INPUT = 5;

const TAB_HOME = 0;
const TAB_NEWS = 1;
const TAB_DOWNLOAD = 2;
const TAB_OPTONS = 3;
const TAB_ABOUT = 4;

Map = function() {
	this.map = new Object();
};
Map.prototype = {
	put : function(key, value) {
		this.map[key] = value;
	},
	get : function(key) {
		return this.map[key];
	},
	containsKey : function(key) {
		return key in this.map;
	},
	remove : function(key) {
		delete this.map[key];
	},
	size : function() {
		var count = 0;
		for (var prop in this.map) {
			count++;
		}
		return count;
	}
};

function Script(code, name, version, versionCode, changelog, filename, desc, dataFiles) {
	this.code = code; this.name = name; this.version = version;
	this.versionCode = versionCode; this.changelog = changelog;
	this.filename = filename; this.desc = desc; this.dataFiles = dataFiles;
}
Script.prototype = {
	isExists : function() {
		return scriptVersion.containsKey(this.code);
	},
	isOldVersion : function() {
		var versionData = scriptVersion.get(this.code);
		if (!offlineMode && this.isExists() && versionData !== undefined) {
			return versionData['version_code'] < this.versionCode;
		}
		return false;
	},
	install : function(dialog) {
		if (!this.isExists() || this.code == CODE) {
			try {
				if (this.dataFiles.length > 0) {
					this.installData(dialog);
				}

				var source = getStringFromURL(new java.net.URL(decodeURIComponent(SCRIPT_URL) + this.filename));
				var file = ScriptManager.getScriptFile(this.filename);
				var buf = new java.io.BufferedOutputStream(new java.io.FileOutputStream(file));
				buf.write(source.getBytes(java.nio.charset.Charset.forName("UTF-8")));
				buf.flush();
				buf.close();

				ScriptManager.setEnabled(file, true);
				if (this.code != CODE) {
					scriptVersion.put(this.code, {
						"name" : this.name,
						"version" : this.version,
						"file_name" : this.filename,
						"version_code" : this.versionCode
					});
					saveData();
				}
				return true;
			} catch (e) {
				showPopupWindow(WINDOW_CRASH, e, "인터넷에 연결되어 있나요?");
			}
		}
		return false;
	},
	unInstall : function(update) {
		if (this.isExists() || this.code == CODE) {
			try {
				var file = ScriptManager.getScriptFile(this.filename);
				if (file.delete()) {
					if (this.dataFiles.length > 0 && !update) {
						this.unInstallData();
					}

					ScriptManager.setEnabled(file, false);
					if (this.code != CODE) {
						scriptVersion.remove(this.code);
						saveData();
					}
					return true;
				}
			} catch (e) {
				showPopupWindow(WINDOW_CRASH, e, "\"삭제가 안되다니...\"");
			}
		}
		return false;
	},
	installData : function(dialog) {
		for (var i in this.dataFiles) {
			var fileData = this.dataFiles[i];
			var count = (parseInt(i, 10) + 1) + "/" + this.dataFiles.length;
			var file = new java.io.File(resPath, fileData['filepath']);
			if (!file.exists() || file.length() != fileData['length']) {
				file.getParentFile().mkdirs();

				runOnUiThread(function() {
					dialog.setMessage("잠시만 기다려 주세요. " + count + "\n\n" + fileData['filepath']);
				});
				var url = new java.net.URL(decodeURIComponent(DATA_URL) + fileData['filepath']);
				fileDownload(url, file.getAbsolutePath(), dialog);
			}
		}
	},
	unInstallData : function() {
		for (var i in this.dataFiles) {
			var fileData = this.dataFiles[i];
			var file = new java.io.File(resPath, fileData['filepath']);
			file.delete();
		}
	},
	update : function(dialog) {
		return this.unInstall(true) && this.install(dialog);
	}
};

function Tab(type, text, enabled, tabButtonLayout, tabLayout) {
	this.button = Button(tabButtonLayout, text, 15, [WRAP_CONTENT, WRAP_CONTENT, 1], NO_COLOR, false, Gravity.CENTER,
		function(v) {
			tabManager(type);
		}
	);
	this.type = type; this.tabLayout = tabLayout;
	this.setEnabled(!enabled);
	if (enabled) {
		this.show();
	}
}
Tab.prototype = {
	show : function() {
		this.tabLayout.removeAllViews();
		switch (this.type) {
			case TAB_HOME:
				var text = 
				   "환영합니다!"
				+ "\nScriptManager는 제조일자의 스크립트들을 관리해주는 유용하고 편리한 스크립트입니다. (저에게 특히 더)"
				+ "\n버그, 오류, 하고싶은 말, 건의, 추가사항 등을 \"About\" 탭에서 \"Bug report\"로 하실 수 있습니다."
				+ "\n"
				+ "\n처음이시면 \"News\" 탭을 눌러 보세요."
				+ "\n- 자주 묻는 질문들"
				+ "\n  Q. 최신 버전은 어디서 받나요?"
				+ "\n  A. 인터넷만 연결되어 있고, 업데이트에 문제가 없다면 자동으로 받아집니다."
				+ "\n"
				+ "\n  Q. 모르고 BlockLauncher 설정에서 스크립트를 지워버렸어요!"
				+ "\n  A. 스크립트 관리에서 ScriptManager를 제외한 나머지 스크립트들을 모두 지우고, "
				+ "\"games/com.mojang/minecraftpe\" 폴더에서 \"ksymc_scriptmanager.json\" 파일을 수동으로 지워주세요.";
				TextView(this.tabLayout, text, 20, [MATCH_PARENT, WRAP_CONTENT, 0], getColor(255, WHITE), false, Gravity.LEFT);
				break;
			case TAB_NEWS:
				var webView = new android.webkit.WebView(context);
				var settings = webView.getSettings()
				settings.setJavaScriptEnabled(true);
				settings.setDefaultTextEncodingName("utf-8");
				webView.loadData(newsHTML, "text/html; charset=UTF-8", null);
				this.tabLayout.addView(webView);
				break;
			case TAB_DOWNLOAD:
				var map = null;
				if (offlineMode) {
					for (var code in scriptVersion.map) {
						var data = scriptVersion.map[code];
						var script = new Script(code, data['name'], data['version'], data['version_code'], null, data['file_name'], null, []);
						addOfflineScriptButton(this.tabLayout, script);
					}
				} else {
					for (var code in scriptList.map) {
						if (code == CODE) continue;
						var script = scriptList.map[code];
						addScriptButton(this.tabLayout, script);
					}
				}
				if (this.tabLayout.getChildCount() == 0) {
					var text = "설치된 스크립트가 없습니다!";
					TextView(this.tabLayout, text, 20, [MATCH_PARENT, MATCH_PARENT, 0], getColor(255, WHITE), false, Gravity.CENTER);
				}
				break;
			case TAB_OPTONS:
				CheckBox(this.tabLayout, "월드 들어갈때 버튼 숨기기", hiddenButton, [MATCH_PARENT, WRAP_CONTENT, 0],
					function(buttonView, isChecked) {
						hiddenButton = isChecked;
						saveData();
					}
				);
				break;
			case TAB_ABOUT:
				var text =
				   "버전 : " + VERSION
				+ "\n도와주신 분들 : 하티브님, hm님, ZeroRay님"
				+ "\n"
				+ "\nMade in Korea";
				TextView(this.tabLayout, text, 20, [MATCH_PARENT, MATCH_PARENT, 1], getColor(255, WHITE), false, Gravity.LEFT);
				Button(this.tabLayout, "Bug report", 17, [WRAP_CONTENT, WRAP_CONTENT, 0], getColor(255, BUTTON_COLOR), true, Gravity.CENTER,
					function(v) {
						showSendCrashWindow(null);
					}
				);
				break;
		}
	},
	setEnabled : function(enable) {
		this.button.setEnabled(enable);
		if (enable) {
			this.button.setTextColor(getColor(255, WHITE));
			this.button.setBackgroundDrawable(ColorDrawable(getColor(50, WHITE)));
		} else {
			this.button.setTextColor(getColor(255, BLACK));
			this.button.setBackgroundDrawable(ColorDrawable(getColor(100, WHITE)));
		}
	}
};

function init() {
	/* OPTIONS */
	hiddenButton = false;

	initialized = false;
	offlineMode = false;
	scriptVersion = new Map();
	scriptList = new Map();

	new java.io.File(resPath).mkdirs();
	if (new java.io.File(savePath).exists()) {
		try {
			var data = getStringFromFile(savePath);
			var dataObject = new org.json.JSONObject(data);
			var versionArray = dataObject.getJSONArray("version");
			for (var i = 0; i < versionArray.length(); i++) {
				var versionObject = versionArray.getJSONObject(i);
				var code = versionObject.getInt("code");
				scriptVersion.put(code, {
					"name" : versionObject.getString("name"),
					"version" : versionObject.getString("version"),
					"file_name" : versionObject.getString("file_name"),
					"version_code" : versionObject.getInt("version_code")
				});
			}
			var optionObject = dataObject.getJSONObject("options");
			hiddenButton = optionObject.getBoolean("hidden_button");
		} catch (e) {
			showPopupWindow(WINDOW_CRASH, e, "저장된 데이터 로딩중 에러입니다.");
			return;
		}
	}

	runOnUiThread(function() {
		var dialog = ProgressDialog("데이터 확인중 ...", false, STYLE_HORIZONTAL);
		runOnNewThread(function() {
			try {
				newsHTML = getStringFromURL(new java.net.URL("https://gist.github.com/KsyMC/7543740/raw/NEWS"));
				var jsonString = getStringFromURL(new java.net.URL("https://gist.github.com/KsyMC/7543740/raw/SCRIPT"));

				var mainArray = new org.json.JSONArray(jsonString);
				for (var code = 0; code < mainArray.length(); code++) {
					var scriptInfo = mainArray.getJSONObject(code);

					var changelog = [];
					var logArray = scriptInfo.getJSONArray("changelog");
					for (var i = 0; i < logArray.length(); i++) {
						changelog.push(logArray.getString(i));
					}
					var dataFiles = [];
					var fileArray = scriptInfo.getJSONArray("data_file");
					for (var i = 0; i < fileArray.length(); i++) {
						var fileData = fileArray.getJSONObject(i);
						dataFiles.push({
							"filepath" : fileData.getString("filepath"),
							"length" : fileData.getLong("length")
						});
					}
					var script = new Script(
						code,
						scriptInfo.getString("name"),
						scriptInfo.getString("version"),
						scriptInfo.getInt("version_code"),
						changelog,
						scriptInfo.getString("file_name"),
						scriptInfo.getString("desc"),
						dataFiles
					);
					scriptList.put(code, script);
				}
				dataCheck(dialog);

				runOnUiThread(function() {
					dialog.setMessage("업데이트 중 ...");
				});
				versionCheck(dialog);
			} catch (e) {
				offlineMode = true;
				showPopupWindow(WINDOW_ALERT, "Offline mode", "오프라인으로 계속 작업하실 수 있습니다.");
				showPopupWindow(WINDOW_CRASH, e, "인터넷이 연결되었는지 확인해 주세요.");
			}
			initialized = true;
		});
	});

	btnWindow = createWindow(WINDOW_BUTTON);
	mainWindow = createWindow(WINDOW_MAIN);
	showPopupWindow(WINDOW_BUTTON);
}
init();

function showScriptInfoDialog(script) {
	var versionData = scriptVersion.get(script.code);
	var version, state;
	if (script.isExists()) {
		version = versionData['version'] + " (설치됨)";
		if (script.isOldVersion()) {
			state = "업데이트가 필요합니다.";
		} else {
			state = "최신 버전입니다.";
		}
	} else {
		version = script.version;
		state = "설치되지 않음";
	}

	showPopupWindow(WINDOW_SCRIPT, script.name,
	   "버전 : " + version
	+ "\n상태 : " + state
	+ "\n설명 : " + script.desc,
	script.isExists(), script.isOldVersion(), script);
}

function showPopupWindow(type) {
	var args = Array.prototype.slice.call(arguments);
	runOnUiThread(function() {
		var gravity, window, leftMargin = 0;
		switch (type) {
			case WINDOW_BUTTON:
				if (btnWindow.isShowing()) btnWindow.dismiss();
				window = btnWindow;
				gravity = Gravity.LEFT | Gravity.TOP;
				leftMargin = 200;
				break;
			case WINDOW_MAIN:
				if (mainWindow.isShowing()) mainWindow.dismiss();
				window = mainWindow;
				gravity = Gravity.CENTER | Gravity.TOP;
				break;
			case WINDOW_CRASH:
				if (typeof(crashWindow) !== 'undefined' && crashWindow.isShowing()) crashWindow.dismiss();
				crashWindow = createWindow(WINDOW_CRASH, args);
				window = crashWindow;
				gravity = Gravity.CENTER;
				break;
			case WINDOW_SCRIPT:
				if (typeof(scriptWindow) !== 'undefined' && scriptWindow.isShowing()) scriptWindow.dismiss();
				scriptWindow = createWindow(WINDOW_SCRIPT, args);
				window = scriptWindow;
				gravity = Gravity.CENTER;
				break;
			case WINDOW_ALERT:
				if (typeof(alertWindow) !== 'undefined' && alertWindow.isShowing()) alertWindow.dismiss();
				alertWindow = createWindow(WINDOW_ALERT, args);
				window = alertWindow;
				gravity = Gravity.CENTER;
				break;
			case WINDOW_INPUT:
				if (typeof(inputWindow) !== 'undefined' && inputWindow.isShowing()) inputWindow.dismiss();
				inputWindow = createWindow(WINDOW_INPUT, args);
				window = inputWindow;
				gravity = Gravity.CENTER;
				break;
		}
		window.showAtLocation(context.getWindow().getDecorView(), gravity, leftMargin, 0);
	});
}

function showSendCrashWindow(e) {
	showPopupWindow(WINDOW_INPUT, "Error description", "간략하게 오류 내용을 입력해 주세요.", "Done",
		function(v, message) {
			if (message == "") {
				showPopupWindow(WINDOW_ALERT, "Error", "오류 내용을 입력해 주세요.")
				return;
			}
			sendCrash(e, message);
			inputWindow.dismiss();
		}
	);
}

function createWindow(type) {
	var args = arguments[1];
	var width = -2, height = -2, focusable = false;
	var mainLayout = LinearLayout(null, HORIZONTAL, [MATCH_PARENT, MATCH_PARENT, 1], getColor(80, WHITE));
	Corner(mainLayout, [20, 20, 20, 20, 20, 20, 20, 20]);
	mainLayout.setPadding(5, 5, 5, 5);

	switch (type) {
		case WINDOW_BUTTON:
			Button(mainLayout, "KSYMC", 15, [MATCH_PARENT, MATCH_PARENT, 0], getColor(80, BLACK), true, Gravity.CENTER,
				function(v) {
					if (showingWindowCount() > 1) return;
					if (initialized) {
						btnWindow.dismiss();
						showPopupWindow(WINDOW_MAIN);
					} else {
						showPopupWindow(WINDOW_ALERT, "기다려 주세요", "정보 로딩중 입니다. 다시 시도해 주세요.");
					}
				}
			);
			break;
		case WINDOW_MAIN:
			width = context.getScreenWidth() / 1.5;

			var layout = LinearLayout(mainLayout, VERTICAL, [MATCH_PARENT, MATCH_PARENT, 1], NO_COLOR);
			addLayoutTitle(layout, "KsyMC ScriptManager V" + VERSION, type,
				function(v) {
					showPopupWindow(WINDOW_BUTTON);
					mainWindow.dismiss();
				}
			);

			var tabScrollView = ScrollView(null, NO_COLOR, [MATCH_PARENT, MATCH_PARENT, 1]);
			var tabLayout = LinearLayout(tabScrollView, VERTICAL, [MATCH_PARENT, MATCH_PARENT, 0], getColor(255, BASE_COLOR));
			Corner(tabLayout, [0, 0, 0, 0, 20, 20, 20, 20]);
			tabLayout.setPadding(10, 10, 10, 10);
			var tabButtonLayout = LinearLayout(layout, HORIZONTAL, [MATCH_PARENT, WRAP_CONTENT, 0], getColor(255, BASE_COLOR));

			homeTab = new Tab(TAB_HOME, "Home", true, tabButtonLayout, tabLayout);
			newsTab = new Tab(TAB_NEWS, "News", false, tabButtonLayout, tabLayout);
			downTab = new Tab(TAB_DOWNLOAD, "Download", false, tabButtonLayout, tabLayout);
			optionTab = new Tab(TAB_OPTONS, "Options", false, tabButtonLayout, tabLayout);
			aboutTab = new Tab(TAB_ABOUT, "About", false, tabButtonLayout, tabLayout);

			layout.addView(tabScrollView);
			break;
		case WINDOW_CRASH:
			width = context.getScreenWidth() / 1.7; focusable = true;

			var layout = LinearLayout(mainLayout, VERTICAL, [MATCH_PARENT, MATCH_PARENT, 1], getColor(255, BASE_COLOR));
			Corner(layout, [20, 20, 20, 20, 20, 20, 20, 20]);
			addLayoutTitle(layout, "[Crash]\n\nKsyMC ScriptManager", type,
				function(v) {
					crashWindow.dismiss();
				}
			);
			var textLayout = LinearLayout(layout, VERTICAL, [MATCH_PARENT, MATCH_PARENT, 1], NO_COLOR);
			textLayout.setPadding(10, 0, 10, 0);
			var text =
			   "알 수 없는 오류가 발생했습니다."
			+ "\n" + args[2]
			+ "\n이 오류를 수정하기 위해 \"Send\" 버튼을 눌러 디바이스 모델, 안드로이드 버전, 오류 정보를 전송해 주세요.";
			TextView(textLayout, text, 20, [MATCH_PARENT, MATCH_PARENT, 0], getColor(255, WHITE), false, Gravity.LEFT);
			var buttonLayout = LinearLayout(layout, VERTICAL, [MATCH_PARENT, WRAP_CONTENT, 0], NO_COLOR);
			Corner(buttonLayout, [0, 0, 0, 0, 20, 20, 20, 20]);
			buttonLayout.setPadding(10, 5, 10, 10);
			Button(buttonLayout, "Send", 17, [MATCH_PARENT, WRAP_CONTENT, 0], getColor(255, BUTTON_COLOR), true, Gravity.CENTER,
				function(v) {
					showSendCrashWindow(args[1]);
					crashWindow.dismiss();
				}
			);
			break;
		case WINDOW_SCRIPT:
			width = context.getScreenWidth() / 1.2; focusable = true;

			var layout = LinearLayout(mainLayout, VERTICAL, [MATCH_PARENT, MATCH_PARENT, 1], getColor(255, BASE_COLOR));
			Corner(layout, [20, 20, 20, 20, 20, 20, 20, 20]);
			addLayoutTitle(layout, "[Script]\n\n" + args[1], type,
				function(v) {
					scriptWindow.dismiss();
				}
			);
			var textScrollView = ScrollView(layout, NO_COLOR, [MATCH_PARENT, MATCH_PARENT, 1]);
			var textLayout = LinearLayout(textScrollView, VERTICAL, [MATCH_PARENT, MATCH_PARENT, 0], NO_COLOR);
			textLayout.setPadding(10, 10, 10, 0);

			var text =
			   "이 ScriptManager로 적용된 스크립트들은 Blocklauncher 설정에서 직접 적용/삭제 하지 말아주세요."
			+ "\n\n"
			+ args[2]
			+ "\n\n새로운 기능"
			+ "\n" + args[5].changelog[args[5].versionCode];
			TextView(textLayout, text, 20, [MATCH_PARENT, WRAP_CONTENT, 0], getColor(255, WHITE), false, Gravity.LEFT);

			var buttonLayout = LinearLayout(layout, HORIZONTAL, [MATCH_PARENT, WRAP_CONTENT, 0], NO_COLOR);
			Corner(buttonLayout, [0, 0, 0, 0, 20, 20, 20, 20]);
			buttonLayout.setPadding(10, 10, 10, 10);

			var text = args[3] ? "UnInstall" : "Install";
			Button(buttonLayout, text, 17, [MATCH_PARENT, MATCH_PARENT, 1], getColor(255, BUTTON_COLOR), true, Gravity.CENTER,
				function(v) {
					scriptWindow.dismiss();
					var dialog = ProgressDialog("설치 또는 제거가 완료될 때까지 기다려주세요!", false, STYLE_HORIZONTAL);
					dialog.show();
					runOnNewThread(function() {
						var result;
						if (args[3]) {
							result = args[5].unInstall(false);
						} else {
							result = args[5].install(dialog);
						}
						runOnUiThread(function() {
							if (result) Toast("완료 되었습니다.").show();
							else Toast("실패하였습니다.").show();
							tabManager(TAB_DOWNLOAD);
							dialog.dismiss();
						});
					});
				}
			);
			if (args[4]) {
				Button(buttonLayout, "Update", 17, [MATCH_PARENT, MATCH_PARENT, 1], getColor(255, BUTTON_COLOR), true, Gravity.CENTER,
					function(v) {
						showPopupWindow(WINDOW_ALERT, "Update - " + args[5].name, "업데이트 하시겠습니까?", "Update",
							function(v) {
								scriptWindow.dismiss();
								alertWindow.dismiss();
								var dialog = ProgressDialog("업데이트가 완료될 때까지 기다려주세요!", false, STYLE_HORIZONTAL);
								dialog.show();
								runOnNewThread(function() {
									var result = args[5].update(dialog);
									runOnUiThread(function() {
										if (result) Toast("업데이트를 완료하였습니다.").show();
										else Toast("업데이트에 실패하였습니다.").show();
										tabManager(TAB_DOWNLOAD);
										dialog.dismiss();
									});
								});
							}
						);
					}
				);
			}
			break;
		case WINDOW_ALERT:
			width = context.getScreenWidth() / 1.7; focusable = true;

			var layout = LinearLayout(mainLayout, VERTICAL, [MATCH_PARENT, MATCH_PARENT, 1], getColor(255, BASE_COLOR));
			Corner(layout, [20, 20, 20, 20, 20, 20, 20, 20]);
			addLayoutTitle(layout, "[Alert]\n\n" + args[1], type,
				function(v) {
					alertWindow.dismiss();
				}
			);
			var textLayout = LinearLayout(layout, VERTICAL, [MATCH_PARENT, MATCH_PARENT, 1], NO_COLOR);
			textLayout.setPadding(10, 0, 10, 0);
			TextView(textLayout, args[2], 20, [MATCH_PARENT, MATCH_PARENT, 0], getColor(255, WHITE), false, Gravity.CENTER);

			if (args[3] !== undefined) {
				var buttonLayout = LinearLayout(layout, VERTICAL, [MATCH_PARENT, WRAP_CONTENT, 0], NO_COLOR);
				Corner(buttonLayout, [0, 0, 0, 0, 20, 20, 20, 20]);
				buttonLayout.setPadding(10, 10, 10, 10);
				Button(buttonLayout, args[3], 17, [MATCH_PARENT, WRAP_CONTENT, 0], getColor(255, BUTTON_COLOR), false, Gravity.CENTER,
					function(v) {
						args[4](v);
					}
				);
			}
			break;
		case WINDOW_INPUT:
			width = context.getScreenWidth() / 1.7; focusable = true;

			var layout = LinearLayout(mainLayout, VERTICAL, [MATCH_PARENT, MATCH_PARENT, 1], getColor(255, BASE_COLOR));
			Corner(layout, [20, 20, 20, 20, 20, 20, 20, 20]);
			addLayoutTitle(layout, "[Input]\n\n" + args[1], type,
				function(v) {
					inputWindow.dismiss();
				}
			);
			var textLayout = LinearLayout(layout, VERTICAL, [MATCH_PARENT, MATCH_PARENT, 1], NO_COLOR);
			textLayout.setPadding(10, 0, 10, 0);
			TextView(textLayout, args[2], 20, [MATCH_PARENT, MATCH_PARENT, 0], getColor(255, WHITE), false, Gravity.CENTER);

			var inputText = EditText(layout, "없음",  "", [MATCH_PARENT, WRAP_CONTENT, 0]);
			var buttonLayout = LinearLayout(layout, VERTICAL, [MATCH_PARENT, WRAP_CONTENT, 0], NO_COLOR);
			Corner(buttonLayout, [0, 0, 0, 0, 20, 20, 20, 20]);
			buttonLayout.setPadding(10, 10, 10, 10);
			Button(buttonLayout, args[3], 17, [MATCH_PARENT, WRAP_CONTENT, 0], getColor(255, BUTTON_COLOR), true, Gravity.CENTER,
				function(v) {
					args[4](v, inputText.getText().toString());
				}
			);
			break;
	} 
	return popupWindow = new android.widget.PopupWindow(mainLayout, width, height, focusable);
}

function addLayoutTitle(layout, title, type, exitListener) {
	var titleLayout = LinearLayout(layout, HORIZONTAL, [MATCH_PARENT, WRAP_CONTENT, 0], getColor(255, TITLE_COLOR));
	Corner(titleLayout, [20, 20, 20, 20, 0, 0, 0, 0]);
	var logo = ImageView(titleLayout, "ksymc.png", 70, 70, ScaleType.FIT_CENTER, [WRAP_CONTENT, MATCH_PARENT, 0]);
	if (logo !== null) logo.setPadding(30, 5, 5, 5);
	TextView(titleLayout, title, 18, [MATCH_PARENT, MATCH_PARENT, 1], getColor(255, WHITE), true, Gravity.CENTER);
	Button(titleLayout, "X", 23, [WRAP_CONTENT, WRAP_CONTENT, 0], NO_COLOR, true, Gravity.CENTER,
		function(v) {
			exitListener(v);
		}
	);
	titleLayout.setOnTouchListener(new android.view.View.OnTouchListener({
		orgX: 0, orgY: 0, offsetX: 0, offsetY: 0,
		onTouch: function(v, event) {
			switch (event.getAction()) {
				case android.view.MotionEvent.ACTION_DOWN:
					orgX = parseInt(event.getX(), 10);
					orgY = parseInt(event.getY(), 10);
					break;
				case android.view.MotionEvent.ACTION_MOVE:
					offsetX = parseInt(event.getRawX() - orgX, 10);
					offsetY = parseInt(event.getRawY() - orgY, 10);
					getWindow(type).update(offsetX - 100, offsetY - 100, -1, -1, true);
					break;
			}
			return true;
		}
	}));
}

function addScriptButton(layout, script) {
	var state, color;
	if (script.isExists()) {
		if (script.isOldVersion()) {
			state = "업데이트 필요";
			color = getColor(255, BUTTON_COLOR);
		} else {
			state = "설치됨";
			color = getColor(150, BUTTON_COLOR);
		}
	} else {
		state = "설치 안됨";
		color = getColor(80, BUTTON_COLOR);
	}

	var text = script.name + " V" + script.version + " - " + state;
	Button(layout, text, 20, [MATCH_PARENT, WRAP_CONTENT, 0], color, false, Gravity.LEFT,
		function(v) {
			showScriptInfoDialog(script);
		}
	);
}

function addOfflineScriptButton(layout, script) {
	var text = script.name + " V" + script.version + " - " + "설치됨";
	Button(layout, text, 20, [MATCH_PARENT, WRAP_CONTENT, 0], getColor(200, BUTTON_COLOR), false, Gravity.LEFT,
		function(v) {
			showPopupWindow(WINDOW_ALERT, "Delete Script", "삭제 하시겠습니까?", "Yes",
				function(v) {
					runOnNewThread(function() {
						var result = script.unInstall(false);
						runOnUiThread(function() {
							if (result) Toast("삭제 하였습니다.").show();
							else Toast("삭제 하지 못했습니다.").show();
							alertWindow.dismiss();
							tabManager(TAB_DOWNLOAD);
						});
					});
				}
			);
		}
	);
}

function sendCrash(e, message) {
	runOnNewThread(function() {
		var code = 0;
		try {
			var data = "Model : " + android.os.Build.MODEL
			+ "\nAndroid : " + android.os.Build.VERSION.RELEASE
			+ "\nDesc : " + (message == "" ? "없음." : message)
			+ (e !== null ? ("\nMessage :" + e.message) : "")
			+ "\nStack :"
			+ "\n" + (e === null ? "        NULL" : e.stack);

			var crashURI = encodeURI(decodeURIComponent(CRASH_URL) + data);
			var client = new org.apache.http.impl.client.DefaultHttpClient();
			var response = client.execute(new org.apache.http.client.methods.HttpPost(crashURI));
			code = response.getStatusLine().getStatusCode();
			if (code == 200) {
				runOnUiThread(function() {
					Toast("성공적으로 전송하였습니다.").show();
				});
			}
			return;
		} catch(e) {}

		runOnUiThread(function() {
			Toast("전송하지 못하였습니다."
			+ (code == 0 ? "" : ("\nResponse Code : " + code))).show();
		});
	});
}

function tabManager(type) {
	homeTab.setEnabled(true);
	newsTab.setEnabled(true);
	downTab.setEnabled(true);
	optionTab.setEnabled(true);
	aboutTab.setEnabled(true);

	switch (type) {
		case TAB_HOME:
			homeTab.show();
			homeTab.setEnabled(false);
			break;
		case TAB_NEWS:
			newsTab.show();
			newsTab.setEnabled(false);
			break;
		case TAB_DOWNLOAD:
			downTab.show();
			downTab.setEnabled(false);
			break;
		case TAB_OPTONS:
			optionTab.show();
			optionTab.setEnabled(false);
			break;
		case TAB_ABOUT:
			aboutTab.show();
			aboutTab.setEnabled(false);
			break;
	}
}

function getWindow(type) {
	switch (type) {
		case WINDOW_BUTTON:
			return btnWindow;
		case WINDOW_MAIN:
			return mainWindow;
		case WINDOW_CRASH:
			return crashWindow;
		case WINDOW_ALERT:
			return alertWindow;
		case WINDOW_SCRIPT:
			return scriptWindow;
		case WINDOW_INPUT:
			return inputWindow;
	}
}

function getStringFromURL(url) {
	var conn = url.openConnection();
	var br = new java.io.BufferedReader(new java.io.InputStreamReader(conn.getInputStream()));
	var buffer = new java.lang.StringBuffer();
	var line;
	while ((line = br.readLine()) != null) {
		buffer.append(line);
		buffer.append("\n");
	}
	br.close();
	return buffer.toString();
}

function getStringFromFile(path) {
	var bfr = new java.io.BufferedReader(new java.io.FileReader(path));
	var buffer = new java.lang.StringBuffer();
	var line;
	while ((line = bfr.readLine()) != null) {
		buffer.append(line);
	}
	bfr.close();
	return buffer.toString();
}

function fileDownload(url, outputPath, dialog) {
	var conn = url.openConnection();
	conn.connect();
	var length = conn.getContentLength();
	var bis = new java.io.BufferedInputStream(url.openStream());
	var fos = new java.io.FileOutputStream(outputPath);

	var data = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
	var total = 0, count;
	while ((count = bis.read(data)) != -1) {
		total += count;
		dialog.setProgress((total * 100) / length);
		fos.write(data, 0, count);
	}
	fos.flush();
	fos.close();
	bis.close();
}

function showingWindowCount() {
	var count = 0;
	if (typeof(btnWindow) !== 'undefined')
		if (btnWindow.isShowing()) count++;
	if (typeof(mainWindow) !== 'undefined')
		if (mainWindow.isShowing()) count++;
	if (typeof(crashWindow) !== 'undefined')
		if (crashWindow.isShowing()) count++;
	if (typeof(scriptWindow) !== 'undefined')
		if (scriptWindow.isShowing()) count++;
	if (typeof(alertWindow) !== 'undefined')
		if (alertWindow.isShowing()) count++;
	if (typeof(inputWindow) !== 'undefined')
		if (inputWindow.isShowing()) count++;
	return count;
}

function saveData() {
	try {
		var jsonStringer = new org.json.JSONStringer();
		jsonStringer.object()
			.key("version")
			.array();
				for (var code in scriptVersion.map) {
					var versionData = scriptVersion.map[code];
					jsonStringer.object()
					.key("code").value(parseInt(code, 10))
					.key("name").value(versionData['name'])
					.key("version").value(versionData['version'])
					.key("file_name").value(versionData['file_name'])
					.key("version_code").value(parseInt(versionData['version_code'], 10))
					.endObject();
				}
			jsonStringer.endArray()
			.key("options")
			.object()
				.key("hidden_button").value(hiddenButton)
			.endObject()
		.endObject();

		var bfw = new java.io.BufferedWriter(new java.io.FileWriter(savePath));
		bfw.write(jsonStringer.toString());
		bfw.flush();
		bfw.close();
	} catch (e) {}
}

function dataCheck(dialog) {
	runOnUiThread(function() {
		dialog.show();
	});

	scriptList.get(CODE).installData(dialog);
	runOnUiThread(function() {
		Toast("데이터 체크 완료.").show();
		dialog.dismiss();
	});
}

function versionCheck(dialog) {
	function update(v) {
		runOnUiThread(function() {
			dialog.show();
		});

		btnWindow.dismiss();
		alertWindow.dismiss();
		runOnNewThread(function() {
			var result = script.update(dialog);
			runOnUiThread(function() {
				if (result) Toast("업데이트를 완료하였습니다.").show();
				else Toast("업데이트에 실패하였습니다.").show();
				dialog.dismiss();
			});

			java.lang.Thread.sleep(2000);
			context.finish();//java.lang.System.exit(0);
		});
	}

	var script = scriptList.get(CODE);
	if (script.versionCode > VERSION_CODE) {
		var text =
		   "ScriptManager를 업데이트 해야 합니다!"
		+ "\n- " + script.version + "의 새로운 기능 -"
		+ "\n" + script.changelog[script.versionCode]
		+ "\n"
		+ "\n업데이트 하시겠습니까? 완료후 재실행 해주세요.";
		showPopupWindow(WINDOW_ALERT, "Update - ScriptManager", text, "Update", update);
	}
}

function newLevel() {
	if (hiddenButton) {
		runOnUiThread(function() {
			if (btnWindow !== undefined) {
				btnWindow.dismiss();
			}
			if (mainWindow !== undefined) {
				mainWindow.dismiss();
			}
		});
	}
}

function leaveGame() {
	if (hiddenButton) {
		if (btnWindow !== undefined) {
			showPopupWindow(WINDOW_BUTTON);
		}
	}
}

/* ANDROID */
function TextView(layout, text, size, params, color, bold, gravity) {
	var textView = new android.widget.TextView(context);
	textView.setText(text);
	textView.setTextSize(size);
	textView.setLayoutParams(LayoutParams(params[0], params[1], params[2]));
	textView.setTextColor(color);
	Typeface(textView, bold);
	textView.setGravity(gravity);
	textView.setTextColor(color);
	if (layout !== null) layout.addView(textView);
	return textView;
}

function Button(layout, text, size, params, bgcolor, bold, gravity, listener) {
	var button = new android.widget.Button(context);
	button.setText(text);
	button.setTextSize(size);
    button.setLayoutParams(LayoutParams(params[0], params[1], params[2]));
	button.setBackgroundDrawable(ColorDrawable(bgcolor));
	Typeface(button, bold);
	button.setGravity(gravity);
	button.setOnClickListener(new android.view.View.OnClickListener({
		onClick : function(v) {
			listener(v);
		}
	}));
	Corner(button, [10, 10, 10, 10, 10, 10, 10, 10]);
	if (layout !== null) layout.addView(button);
	return button;
}

function CheckBox(layout, text, checked, params, listener) {
	var checkBox = new android.widget.CheckBox(context);
	checkBox.setText(text);
	checkBox.setChecked(checked);
	checkBox.setLayoutParams(LayoutParams(params[0], params[1], params[2]));
	checkBox.setOnCheckedChangeListener(new android.widget.CompoundButton.OnCheckedChangeListener({
		onCheckedChanged : function(buttonView, isChecked) {
			listener(buttonView, isChecked);
		}
	}));
	Typeface(checkBox, false);
	if (layout !== null) layout.addView(checkBox);
	return checkBox;
}

function LinearLayout(layout, orientation, params, bgcolor) {
	var linearLayout = new android.widget.LinearLayout(context);
	linearLayout.setOrientation(orientation);
	linearLayout.setLayoutParams(LayoutParams(params[0], params[1], params[2]));
	linearLayout.setBackgroundDrawable(ColorDrawable(bgcolor));
	if (layout !== null) layout.addView(linearLayout);
	return linearLayout;
}

function ScrollView(layout, bgcolor, params) {
	var scrollView = new android.widget.ScrollView(context);
	scrollView.setBackgroundDrawable(ColorDrawable(bgcolor));
	scrollView.setLayoutParams(LayoutParams(params[0], params[1], params[2]));
	if (layout !== null) layout.addView(scrollView);
	return scrollView;
}

function EditText(layout, hint, text, params) {
	var editText = new android.widget.EditText(context);
	editText.setHint(hint);
	editText.setText(text);
	editText.setLayoutParams(LayoutParams(params[0], params[1], params[2]));
	Typeface(editText, false);
	if (layout !== null) layout.addView(editText);
	return editText;
}

function ImageView(layout, filename, width, height, scaleType, params) {
	var bitmap = android.graphics.BitmapFactory.decodeFile(resPath + "images/" + filename);
	if (bitmap !== null) {
		var bitmap = android.graphics.Bitmap.createScaledBitmap(bitmap, width, height, false);
		var imageView = new android.widget.ImageView(context);
		imageView.setImageBitmap(bitmap);
		imageView.setScaleType(scaleType);
		imageView.setLayoutParams(LayoutParams(params[0], params[1], params[2]));
		if (layout !== null) layout.addView(imageView);
		return imageView;
	}
	return null;
}

function ProgressDialog(message, cancelable, style) {
	var progressDialog = new android.app.ProgressDialog(context);
	progressDialog.setTitle("KsyMC ScriptManager");
	progressDialog.setMessage(message);
	progressDialog.setCancelable(cancelable);
	progressDialog.setProgressStyle(style);
	return progressDialog;
}

function Typeface(view, bold) {
	try {
		var filename = "SourceHanSans-Light.otf";
		if (bold) {
			filename = "SourceHanSans-Normal.otf";
		} 
		view.setTypeface(android.graphics.Typeface.createFromFile(resPath + "fonts/" + filename));
	} catch (e) {
		runOnUiThread(function() {
			Toast("데이터 설치를 완료 할때까지 기다려 주세요.").show();
		});
	}
}

function Corner(view, radii) {
	var r = java.lang.reflect.Array.newInstance(java.lang.Float.TYPE, radii.length);
	for (var i = 0; i < radii.length; i++) {
		r[i] = radii[i];
	}
	var color = view.getBackground().getColor();
	var pd = new android.graphics.drawable.PaintDrawable(color);
	pd.setCornerRadii(r);
	view.setBackgroundDrawable(pd);
}

function getColor(alpha, type) {
	switch (type) {
		case NO_COLOR:
			return Color(0, 0, 0, 0);
		case BLACK:
			return Color(alpha, 0, 0, 0);
		case WHITE:
			return Color(alpha, 255, 255, 255);
		case RED:
			return Color(alpha, 255, 0, 0);
		case BASE_COLOR:
			return Color(alpha, 58, 83, 155);
		case TITLE_COLOR:
			return Color(alpha, 52, 152, 219);
		case BUTTON_COLOR:
			return Color(alpha, 25, 181, 254);
	}
}

function Color(a, r, g, b) {return android.graphics.Color.argb(a, r, g, b);}
function ColorDrawable(color) {return new android.graphics.drawable.ColorDrawable(color);}
function LayoutParams(width, height, weight) {return new android.widget.LinearLayout.LayoutParams(width, height, weight);}
function Toast(message) {return android.widget.Toast.makeText(context, message + "", android.widget.Toast.LENGTH_LONG);}
function runOnUiThread(func) {context.runOnUiThread(new java.lang.Runnable({run: function() {func();}}));}
function runOnNewThread(func) {new java.lang.Thread(new java.lang.Runnable({run: function() {func();}})).start();}