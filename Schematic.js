//
// 무단 배포 금지
// ksy4362@naver.com
//

/*
 * JNBT License
 * 
 * Copyright (c) 2010 Graham Edgecombe
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 *     * Redistributions of source code must retain the above copyright notice,
 *       this list of conditions and the following disclaimer.
 *       
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *       
 *     * Neither the name of the JNBT team nor the names of its
 *       contributors may be used to endorse or promote products derived from
 *       this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE. 
 */

 /*
 * JNBT 코드
 * By KsyMC
 */
 
var NBTConstants = {
	CHARSET: java.nio.charset.Charset.forName("UTF-8"),
	TYPE_END: 0,
	TYPE_BYTE: 1,
	TYPE_SHORT: 2,
	TYPE_INT: 3,
	TYPE_LONG: 4,
	TYPE_FLOAT: 5,
	TYPE_DOUBLE: 6,
	TYPE_BYTE_ARRAY: 7,
	TYPE_STRING: 8,
	TYPE_LIST: 9,
	TYPE_COMPOUND: 10,
};

var NBTUtils = {
	getTypeName: function(type) {
		switch(type) {
		case NBTConstants.TYPE_END:
			return "TAG_End";
		case NBTConstants.TYPE_BYTE:
			return "TAG_Byte";
		case NBTConstants.TYPE_SHORT:
			return "TAG_Short";
		case NBTConstants.TYPE_INT:
			return "TAG_Int";
		case NBTConstants.TYPE_LONG:
			return "TAG_Long";
		case NBTConstants.TYPE_FLOAT:
			return "TAG_Float";
		case NBTConstants.TYPE_DOUBLE:
			return "TAG_Double";
		case NBTConstants.TYPE_BYTE_ARRAY:
			return "TAG_Byte_Array";
		case NBTConstants.TYPE_STRING:
			return "TAG_String";
		case NBTConstants.TYPE_LIST:
			return "TAG_List";
		case NBTConstants.TYPE_COMPOUND:
			return "TAG_Compound";
		default:
			throw new java.lang.IllegalArgumentException("Invalid tag type (" + type + ").");
		}
	}
};

function ByteArrayTag(name, value) {
	this.typeNBT = NBTConstants.TYPE_BYTE_ARRAY;
	this.name = new java.lang.String(name);
	this.value = value;
}

ByteArrayTag.prototype = {
	getTypeNBT: function() {
		return this.typeNBT;
	},
	getName: function() {
		return this.name;
    },
	getValue: function() {
		return this.value;
	}
};

function ByteTag(name, value) {
	this.typeNBT = NBTConstants.TYPE_BYTE;
	this.name = new java.lang.String(name);
	this.value = new java.lang.Byte(value);
}

ByteTag.prototype = {
	getTypeNBT: function() {
		return this.typeNBT;
	},
	getName: function() {
		return this.name;
    },
	getValue: function() {
		return this.value;
	}
};

function CompoundTag(name, value) {
	this.typeNBT = NBTConstants.TYPE_COMPOUND;
	this.name = new java.lang.String(name);
	this.value = value;
}

CompoundTag.prototype = {
	getTypeNBT: function() {
		return this.typeNBT;
	},
	getName: function() {
		return this.name;
    },
	getValue: function() {
		return this.value;
	}
};

function DoubleTag(name, value) {
	this.typeNBT = NBTConstants.TYPE_DOUBLE;
	this.name = new java.lang.String(name);
	this.value = new java.lang.Double(value);
}

DoubleTag.prototype = {
	getTypeNBT: function() {
		return this.typeNBT;
	},
	getName: function() {
		return this.name;
    },
	getValue: function() {
		return this.value;
	}
};

function EndTag() {
	this.typeNBT = NBTConstants.TYPE_END;
	this.name = new java.lang.String("");
}

EndTag.prototype = {
	getTypeNBT: function() {
		return this.typeNBT;
	},
	getName: function() {
		return this.name;
    },
	getValue: function() {
		return null;
	}
};

function FloatTag(name, value) {
	this.typeNBT = NBTConstants.TYPE_FLOAT;
	this.name = new java.lang.String(name);
	this.value = new java.lang.Float(value);
}

FloatTag.prototype = {
	getTypeNBT: function() {
		return this.typeNBT;
	},
	getName: function() {
		return this.name;
    },
	getValue: function() {
		return this.value;
	}
};

function IntTag(name, value) {
	this.typeNBT = NBTConstants.TYPE_INT;
	this.name = new java.lang.String(name);
	this.value = new java.lang.Integer(value);
}

IntTag.prototype = {
	getTypeNBT: function() {
		return this.typeNBT;
	},
	getName: function() {
		return this.name;
    },
	getValue: function() {
		return this.value;
	}
};

function ListTag(name, type, value) {
	this.typeNBT = NBTConstants.TYPE_LIST;
	this.name = new java.lang.String(name);
	this.type = type;
	this.value = value;
}

ListTag.prototype = {
	getTypeNBT: function() {
		return this.typeNBT;
	},
	getName: function() {
		return this.name;
    },
	getType: function() {
		return this.type;
	},
	getValue: function() {
		return this.value;
	}
};

function LongTag(name, value) {
	this.typeNBT = NBTConstants.TYPE_LONG;
	this.name = new java.lang.String(name);
	this.value = new java.lang.Long(value);
}

LongTag.prototype = {
	getTypeNBT: function() {
		return this.typeNBT;
	},
	getName: function() {
		return this.name;
    },
	getValue: function() {
		return this.value;
	}
};

function ShortTag(name, value) {
	this.typeNBT = NBTConstants.TYPE_SHORT;
	this.name = new java.lang.String(name);
	this.value = new java.lang.Short(value);
}

ShortTag.prototype = {
	getTypeNBT: function() {
		return this.typeNBT;
	},
	getName: function() {
		return this.name;
    },
	getValue: function() {
		return this.value;
	}
};

function StringTag(name, value) {
	this.typeNBT = NBTConstants.TYPE_STRING;
	this.name = new java.lang.String(name);
	this.value = new java.lang.String(value);
}

StringTag.prototype = {
	getTypeNBT: function() {
		return this.typeNBT;
	},
	getName: function() {
		return this.name;
    },
	getValue: function() {
		return this.value;
	}
};

function NBTInputStream(is) {
	this.is = new java.io.DataInputStream(java.util.zip.GZIPInputStream(is));
}

NBTInputStream.prototype = {
	readTag: function() {
		this.readTag(0);
	},
	readTag: function(depth) {
		var type = this.is.readByte() & 0xFF;

		var name;
		if(type != NBTConstants.TYPE_END) {
			var nameLength = this.is.readShort() & 0xFFFF;
			var nameBytes = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, nameLength);
			this.is.readFully(nameBytes);
			name = new java.lang.String(nameBytes, NBTConstants.CHARSET);
		} else {
			name = "";
		}
		
		return this.readTagPayload(type, name, depth);
	},
	close: function() {
		this.is.close();
	},
	readTagPayload: function(type, name, depth) {
		switch(type) {
		case NBTConstants.TYPE_END:
			if(depth == 0) {
				throw new java.io.IOException("TAG_End found without a TAG_Compound/TAG_List tag preceding it.");
			} else {
				return new EndTag();
			}
		case NBTConstants.TYPE_BYTE:
			return new ByteTag(name, this.is.readByte());
		case NBTConstants.TYPE_SHORT:
			return new ShortTag(name, this.is.readShort());
		case NBTConstants.TYPE_INT:
			return new IntTag(name, this.is.readInt());
		case NBTConstants.TYPE_LONG:
			return new LongTag(name, this.is.readLong());
		case NBTConstants.TYPE_FLOAT:
			return new FloatTag(name, this.is.readFloat());
		case NBTConstants.TYPE_DOUBLE:
			return new DoubleTag(name, this.is.readDouble());
		case NBTConstants.TYPE_BYTE_ARRAY:
			var length = this.is.readInt();
			var bytes = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, length);
			this.is.readFully(bytes);
			return new ByteArrayTag(name, bytes);
		case NBTConstants.TYPE_STRING:
			var length = this.is.readShort();
			var bytes = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, length);
			this.is.readFully(bytes);
			return new StringTag(name, new java.lang.String(bytes, NBTConstants.CHARSET));
		case NBTConstants.TYPE_LIST:
			var childType = this.is.readByte();
			var length = this.is.readInt();

			var tagList = [];
			for(var i = 0; i < length; i++) {
				var tag = this.readTagPayload(childType, "", depth + 1);
				if(tag instanceof EndTag) {
					throw new java.io.IOException("TAG_End not permitted in a list.");
				}
				tagList.push(tag);
			}
			
			return new ListTag(name, childType, tagList);
		case NBTConstants.TYPE_COMPOUND:
			var tagMap = {};
			while(true) {
				var tag = this.readTag(depth + 1);
				if(tag instanceof EndTag) {
					break;
				} else {
					tagMap[tag.getName()] = tag;
				}
			}
			
			return new CompoundTag(name, tagMap);
		default:
			throw new java.io.IOException("Invalid tag type: " + type + ".");
		}
	}
}

function NBTOutputStream(os) {
	this.os = new java.io.DataOutputStream(java.util.zip.GZIPOutputStream(os));
}

NBTOutputStream.prototype = {
	writeTag: function(tag) {
		var type = tag.getTypeNBT();
		var name = tag.getName();
		var nameBytes = name.getBytes(NBTConstants.CHARSET);
		
		this.os.writeByte(new java.lang.Byte(type));
		this.os.writeShort(nameBytes.length);
		this.os.write(nameBytes);
		
		if(type == NBTConstants.TYPE_END) {
			throw new java.io.IOException("Named TAG_End not permitted.");
		}
		
		this.writeTagPayload(tag);
    },
	writeTagPayload: function(tag) {
		var type = tag.getTypeNBT();
		switch(type) {
		case NBTConstants.TYPE_END:
			this.writeEndTagPayload(tag);
			break;
		case NBTConstants.TYPE_BYTE:
			this.writeByteTagPayload(tag);
			break;
		case NBTConstants.TYPE_SHORT:
			this.writeShortTagPayload(tag);
			break;
		case NBTConstants.TYPE_INT:
			this.writeIntTagPayload(tag);
			break;
		case NBTConstants.TYPE_LONG:
			this.writeLongTagPayload(tag);
			break;
		case NBTConstants.TYPE_FLOAT:
			this.writeFloatTagPayload(tag);
			break;
		case NBTConstants.TYPE_DOUBLE:
			this.writeDoubleTagPayload(tag);
			break;
		case NBTConstants.TYPE_BYTE_ARRAY:
			this.writeByteArrayTagPayload(tag);
			break;
		case NBTConstants.TYPE_STRING:
			this.writeStringTagPayload(tag);
			break;
		case NBTConstants.TYPE_LIST:
			this.writeListTagPayload(tag);
			break;
		case NBTConstants.TYPE_COMPOUND:
			this.writeCompoundTagPayload(tag);
			break;
		default:
			throw new java.io.IOException("Invalid tag type: " + type + ".");
		}
	},
	writeByteTagPayload: function(tag) {
		this.os.writeByte(tag.getValue());
	},
	writeByteArrayTagPayload: function(tag) {
		var bytes = tag.getValue();
		this.os.writeInt(bytes.length);
		this.os.write(bytes);
	},
	writeCompoundTagPayload: function(tag) {
		var childTag = tag.getValue();
		for(var i in childTag) {
			this.writeTag(childTag[i]);
		}
		this.os.writeByte(new java.lang.Byte(0)); // end tag - better way?
	},
	writeListTagPayload: function(tag) {
		var type = tag.getType();
		var tags = tag.getValue();
		var size = tags.length;
		
		this.os.writeByte(new java.lang.Byte(type));
		this.os.writeInt(size);
		for(var i in tags) {
			this.writeTagPayload(tags[i]);
		}
	},
	writeStringTagPayload: function(tag) {
		var bytes = tag.getValue().getBytes(NBTConstants.CHARSET);
		this.os.writeShort(bytes.length);
		this.os.write(bytes);
	},
	writeDoubleTagPayload: function(tag) {
		this.os.writeDouble(tag.getValue());
	},
	writeFloatTagPayload: function(tag) {
		this.os.writeFloat(tag.getValue());
	},
	writeLongTagPayload: function(tag) {
		this.os.writeLong(tag.getValue());
	},
	writeIntTagPayload: function(tag) {
		this.os.writeInt(tag.getValue());
	},
	writeShortTagPayload: function(tag) {
		this.os.writeShort(tag.getValue());
	},
	writeEndTagPayload: function(tag) {
		/* empty */
	},
	close: function() {
		this.os.close();
	}
};

/*
 * ModPE 코드
 * By KsyMC
 */

const VERSION = 6;
const VERSON_NAME = "2.0.1 BETA";

var delay = 50;
var selections = {};
var schematic = null;
var copyBlocks = null;
var filePath = android.os.Environment.getExternalStorageDirectory().getAbsolutePath() + "/Schematic/";

const time = 1 * 20;
var timer = time;

function modTick() {
	if (timer >= time) {
		var fx = selections['FirstX'], fy = selections['FirstY'], fz = selections['FirstZ'];
		var sx = selections['SecondX'], sy = selections['SecondY'], sz = selections['SecondZ'];
		var px = Math.floor(getPlayerX()), py = Math.floor(getPlayerY() - 1), pz = Math.floor(getPlayerZ());

		if (fx !== undefined && fy !== undefined && fz !== undefined
		&& sx !== undefined && sy !== undefined && sz !== undefined) {
			new java.lang.Thread(new java.lang.Runnable({run: function() {
				for(var y = Math.min(fy, sy); y <= Math.max(fy, sy); y++) {
				for(var x = Math.min(fx, sx); x <= Math.max(fx, sx); x++) {
				for(var z = Math.min(fz, sz); z <= Math.max(fz, sz); z++) {
					if (parseInt(px - x) <= 20 && parseInt(py - y) <= 20 && parseInt(pz - z) <= 20) {
						if ((((x == fx || x == sx || z == fz || z == sz) && (y == fy || y == sy))
						|| (x == fx && z == sz) || (x == sx && z == fz)
						|| (x == fx && z == fz) || (x == sx && z == sz))
						&& getTile(x, y, z) == 0) {
							Level.addParticle(ParticleType.redstone, x + .5, y + .5, z + .5, 0, 0, 0, 2);
						}
					}
				}}}
			}})).start();
		}
		timer = 0;
	} else {
		timer++;
	}
}

function useItem(x, y, z, i, b, s, id, bd) {
	if (i == 267) {
		selections['FirstX'] = x;
		selections['FirstY'] = y;
		selections['FirstZ'] = z;

		clientMessage("First selection :\n  X " + x + ", Y " + y + ", Z " + z);
	}
}

function destroyBlock(x, y, z, side) {
	if (getCarriedItem() == 267) {
		selections['SecondX'] = x;
		selections['SecondY'] = y;
		selections['SecondZ'] = z;

		clientMessage("Second selection :\n  X " + x + ", Y " + y + ", Z " + z);
		preventDefault();
	}
}

function newLevel() {
	var file = new java.io.File(filePath);
	if (!file.exists()) {
		file.mkdirs();
	}
	clientMessage("# Schematic " + VERSON_NAME + "\n# By KsyMC\n# ksy4362@naver.com");
	clientMessage("[Schematic] Checking for updates ...");
	checkUpdate();
}

function procCmd(str) {
	var args = str.split(" ");
	var cmd = args.shift();

	if (cmd == "sche") {
		switch (args[0]) {
		case "import":
			if (args[1] === undefined) {
				clientMessage("# /sche\n  import <filename>.schematic");
				break;
			}
			import_schematic(args.slice(1).join(" "));
			break;
		case "export":
			if (args[1] === undefined) {
				clientMessage("# /sche\n  export <filename>.schematic");
				break;
			}
			if (copyBlocks === null) {
				clientMessage("Please copy the block.\n  ＃ \"/schematic copy\"");
				break;
			}
			export_schematic(args.slice(1).join(" "));
			break;
		case "copy":
			var fx = selections['FirstX'];
			var fy = selections['FirstY'];
			var fz = selections['FirstZ'];
			var sx = selections['SecondX'];
			var sy = selections['SecondY'];
			var sz = selections['SecondZ'];

			if (fx === undefined || fy === undefined || fz === undefined
			|| sx === undefined || sy === undefined || sz === undefined) {
				clientMessage("Please select first.");
				break;
			}
			copy(fx, fy, fz, sx, sy, sz);
			break;
		case "paste":
			if (schematic === null) {
				clientMessage("Please import before pasting.\n  ＃ \"/sche import <filename>.schematic\"");
				break;
			}
			var playerX = Math.floor(getPlayerX());
			var playerY = Math.floor(getPlayerY() - 1);
			var playerZ = Math.floor(getPlayerZ());
			paste(playerX, playerY, playerZ);
			break;
		case "delay":
			if (args[1] === undefined) {
				clientMessage("Delay : " + delay + "ms");
				break;
			}
			delay = args.pop();
			clientMessage("Done.");
			break;
		case "filelist":
			var names = new java.io.File(filePath).list();
			clientMessage("List : \n  " + java.util.Arrays.toString(names).replaceAll(".schematic", ""));
			break;
		case "help":
		default:
			clientMessage("#/sche\n  # [help | delay | import | export | copy | paste | filelist]");
			break;
		}
	}
}

function import_schematic(filename) {
	try {
		var file = new java.io.File(filePath, filename + ".schematic");
		var nis = new NBTInputStream(new java.io.FileInputStream(file));

		var tagMap = nis.readTag().getValue();

		var materials = tagMap["Materials"].getValue();
		if (materials == "Alpha" || materials == "Pocket") {
			schematic = {
				'Width' : tagMap['Width'].getValue(),
				'Height' : tagMap['Height'].getValue(),
				'Length' : tagMap['Length'].getValue(),
				'Blocks' : tagMap['Blocks'].getValue(),
				'Data' : tagMap['Data'].getValue(),
				'Entities' : tagMap['Entities'].getValue(),
				'TileEntities' : tagMap['TileEntities'].getValue()
			};
		} else {
			clientMessage("Not supported.");
		}

		nis.close();
		clientMessage("Done.");
	} catch (err) {
		clientMessage("File does not exist or corrupted files.\n  # " + err);
	}
}

function export_schematic(filename) {
	new java.lang.Thread(new java.lang.Runnable({run: function() {
		try {
			var width = copyBlocks['EndX'] - copyBlocks['StartX'] + 1;
			var height = copyBlocks['EndY'] - copyBlocks['StartY'] + 1;
			var length = copyBlocks['EndZ'] - copyBlocks['StartZ'] + 1;

			var size = width * height  * length;
			var blocks = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, size);
			var data = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, size);

			for(var y = 0; y < height; y++) {
			for(var z = 0; z < length; z++) {
			for(var x = 0; x < width; x++) {
				blocks[index] = new java.lang.Byte(0);
				data[index] = new java.lang.Byte(0);

				var tx = copyBlocks['StartX'] + x;
				var ty = copyBlocks['StartY'] + y;
				var tz = copyBlocks['StartZ'] + z;

				var id = getTile(tx, ty, tz);
				if (id != 0) {
					var damage = Level.getData(tx, ty, tz);
					var index = y * width * length + z * width + x;
					blocks[index] = new java.lang.Byte(id <= 127 ? id : (id - 256));
					data[index] = new java.lang.Byte(damage);

					clientMessage("Exporting ... " + parseInt((index / size) * 100, 10) + " %"
					+ "\n  # X "  + tx + ", Y " + ty + ", Z " + tz + ", Block : " + id + ":" + damage);
					java.lang.Thread.sleep(delay);
				}
			}}}

			var tagMap = {
				'Materials' : new StringTag("Materials", "Pocket"),
				'Width' : new ShortTag("Width", width),
				'Height' : new ShortTag("Height", height),
				'Length' : new ShortTag("Length", length),
				'Blocks' : new ByteArrayTag("Blocks", blocks),
				'Data' : new ByteArrayTag("Data", data),
				'Entities' : new ListTag("Entities", NBTConstants.TYPE_COMPOUND, []),
				'TileEntities' : new ListTag("TileEntities", NBTConstants.TYPE_COMPOUND, [])
			};

			var file = new java.io.File(filePath, filename + ".schematic");
			var nos = new NBTOutputStream(new java.io.FileOutputStream(file));
			nos.writeTag(new CompoundTag("Schematic", tagMap));
			nos.close();
			clientMessage("Done.");
		} catch (err) {
			clientMessage("Failed to export blocks.\n  # " + err);
		}
	}})).start();
}

function copy(startX, startY, startZ, endX, endY, endZ) {
	copyBlocks = {
		'StartX' : Math.min(startX, endX),
		'EndX' : Math.max(startX, endX),
		'StartY' : Math.min(startY, endY),
		'EndY' : Math.max(startY, endY),
		'StartZ' : Math.min(startZ, endZ),
		'EndZ' : Math.max(startZ, endZ),
	};
	clientMessage("Done.");
}

function paste(startX, startY, startZ) {
	clientMessage("Start!");

	if (schematic !== null) {
		var height = schematic['Height'];
		var width = schematic['Width'];
		var length = schematic['Length'];
		var size = height * width * length;

		new java.lang.Thread(new java.lang.Runnable({run: function() {
			try {
				for(var y = 0; y < height; y++) {
				for(var z = 0; z < length; z++) {
				for(var x = 0; x < width; x++) {
					var index = y * width * length + z * width + x;
					var id = schematic['Blocks'][index] & 0xFF;
					var damage = schematic['Data'][index];
					if (id != 0) {
						var tx = x + startX;
						var ty = y + startY;
						var tz = z + startZ;

						setTile(tx, ty, tz, id, damage);
						clientMessage("Pasting ... " + parseInt((index / size) * 100, 10) + " %"
						+ "\n  # X "  + tx + ", Y " + ty + ", Z " + tz + ", Block : " + id + ":" + damage);
						java.lang.Thread.sleep(delay);
					}
				}}}
			} catch (err) {
				clientMessage("Error : \n  " + err);
			}
			clientMessage("Done.");
		}})).start();
	}
}

function checkUpdate() {
	try {
		var url = new java.net.URL("https://gist.github.com/KsyMC/7543740/raw/VERSION");
		var br = new java.io.BufferedReader(new java.io.InputStreamReader(url.openConnection().getInputStream()));
		var json = br.readLine();
		br.close();

		if (json !== null) {
			var jsonObject = new org.json.JSONObject(json);
			var scheObject = jsonObject.getJSONObject("schematic");
			var version = scheObject.getInt("version");
			if (version > VERSION) {
				var name = scheObject.getString("name");
				var logArray = scheObject.getJSONArray("changelog").getString(version).split("\n");
				clientMessage("  # The new version : " + name + " (" + version + ")");
				for (var i in logArray) {
					clientMessage("  # " + logArray[i]);
				}
				return;
			}
		}
	} catch (e) {
		clientMessage("  # You are not connected to the Internet!");
	}
	clientMessage("  # The latest version.");
}