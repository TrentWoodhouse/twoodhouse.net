let Canvas_old = function (canvasElement, width = 1600, height = 900) {
    canvasElement.width = canvasElement.parentElement.offsetWidth;
    canvasElement.height = canvasElement.width * height / width;

    this.canvas = canvasElement;
	this.ctx = canvasElement.getContext('2d');
	this.width = width;
	this.height = height;
	this.scale = canvasElement.width / width;
	this.objects = new Collection('root', null, null);
	this.resize = function () {
		this.canvas.width = this.canvas.parentElement.offsetWidth;
		this.canvas.height = this.canvas.width * this.height / this.width;
		this.scale = this.canvas.width / this.width;
		//this.render(); //TODO Remove
	};
	this.render = function () {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for(let object in this.objects) {
			draw(object, pair(), this.ctx);
		}
	};
	this.draw = function (object, offset, context) {
		let x = 0;
		let y = 0;

		if (object.type !== "line" && object.type !== "poly") {
			x = offset.x + object.pos.x;
			y = offset.y + object.pos.y;
		}

		switch (object.type) {
			case 'pattern':
				object.shapes.forEach(function (object) {
					this.draw(object, pair(x, y), context);
				});
				break;
			case 'rectangle':
				if (object.color) {
					context.fillStyle = object.color;
					context.fillRect(x * this.scale, y * this.scale,
						object.w * this.scale, object.h * this.scale);
				}
				break;
			case 'circle':
				if (object.color) {
					context.beginPath();
					context.arc(x * this.scale, y * this.scale,
						object.r * this.scale, 0, 2 * Math.PI, false);
					context.fillStyle = object.color;
					context.fill();
				}
				break;
			case 'poly':
				if (object.color) {
					context.beginPath();
					context.fillStyle = object.color;
					context.moveTo((object.positions[0].x + offset.x) * this.scale, (object.positions[0].y + offset.y) * this.scale);
					for (let pos of object.positions) {
						context.lineTo((pos.x + offset.x) * this.scale, (pos.y + offset.y) * this.scale);
					}
					context.closePath();
					context.fill();
				}
				break;
			case 'line':
				if (object.color) {
					context.beginPath();
					context.strokeStyle = object.color;
					context.lineWidth = object.thickness * this.scale;
					context.moveTo((object.pos1.x + offset.x) * this.scale, (object.pos1.y + offset.y) * this.scale);
					context.lineTo((object.pos2.x + offset.x) * this.scale, (object.pos2.y + offset.y) * this.scale);
					context.stroke();
				}
				break;
			case 'text':
				if (object.color) {
					context.fillStyle = object.color;
					context.font = object.size * this.scale + "px " + object.font;
					context.fillText(object.text, x * this.scale, y * this.scale);
				}
				break;
			default:
				console.log("ERROR: No object of object type \"" + object.type + "\" exists");
		}
	};
};

let Collection = function (id, attr, pos) {
	this.type = 'collection';
	this.id = id;
	this.attr = attr;
	this.objects = [];
	this.pos = pos;
	this.add = function (shape) {
		this.shapes.push(shape);
	};
	this.remove = function (id) {
		this.shapes.forEach(function (shape, i) {
			if (shape.id === id) {
				this.shape.splice(i, 1);
			}
		}, this);
	};
	this.get = function (id) {
		for (const shape of this.shapes) {
			if (shape.id === id) {
				return shape;
			}
		}
	};
	this.clone = function () {
		let ret = pattern(this.id, this.pos.clone());
		for (const shape of this.shapes) {
			ret.add(shape.clone());
		}
		return ret;
	};
	this.attrFunctions = attrFunctions();
};



let pair = function (x = 0, y = 0) {
	return {
		'x': x,
		'y': y,
		'setPair': function (v) {
			this.x = v.x;
			this.y = v.y;
			return this;
		},
		'addPair': function (v) {
			this.x += v.x;
			this.y += v.y;
			return this;
		},
		'clone': function () {
			return pair(this.x, this.y);
		}
	}
};

let rectangle = function (id, attr, w, h, pos, color = '#000000') {
	return {
		'type': 'rectangle',
		'id': id,
		'attr': attr,
		'w': w,
		'h': h,
		'pos': pos,
		'color': color,
		'clone': function () {
			return rectangle(this.id, this.w, this.h, this.pos.clone(), this.color);
		}
	}
};

let circle = function (id, attr, r, pos, color = '#000000') {
	return {
		'type': 'circle',
		'id': id,
		'attr': attr,
		'r': r,
		'pos': pos,
		'color': color,
		'clone': function () {
			return circle(this.id, this.r, this.pos.clone(), this.color);
		}
	}
};

let poly = function (id, attr, positions, color = '#000000') {
	return {
		'type': 'poly',
		'id': id,
		'attr': attr,
		'positions': positions,
		'color': color,
		'clone': function () {
			let pos_arr = [];
			for (let pos of this.positions) {
				pos_arr.push(pos.clone());
			}
			return poly(this.id, pos_arr, this.color);
		}
	}
};

let line = function (id, attr, pos1, pos2, thickness = 5, color = '#000000') {
	return {
		'type': 'line',
		'id': id,
		'attr': attr,
		'pos1': pos1,
		'pos2': pos2,
		'thickness': thickness,
		'color': color,
		'clone': function () {
			return line(this.id, this.pos1.clone(), this.pos2.clone(), this.thickness, this.color);
		}
	}
};

let text = function (id, attr, pos, text, size, font, color = '#000000') {
	return {
		'type': 'text',
		'id': id,
		'attr': attr,
		'pos': pair(pos.x, pos.y + size),
		'text': text,
		'size': size,
		'font': font,
		'color': color,
		'clone': function () {
			return text(this.id, this.pos.clone(), this.text, this.size, this.font, this.color);
		}
	}
};

let attrFunctions = function () { //TODO Fix this, probably should make into prototypes
	return {
		'hasAttr': function (attr) {
			return new RegExp('\\b' + attr.trim() + '\\b', 'i').test(this.attr)
		},
		'addAttr': function (attr) {
			if (this.attr) {
				if (!this.hasAttr(attr)) {
					this.attr += ' ' + attr.trim();
					return true;
				}
				return false;
			} else {
				this.attr = attr.trim();
			}

		},
		'removeAttr': function (attr) {
			if (this.hasAttr(attr)) {
				this.attr = this.attr.replace(new RegExp('\\s*\\b' + attr.trim() + '\\b', 'i'));
				return true;
			}
			return false;
		},
	};
};








