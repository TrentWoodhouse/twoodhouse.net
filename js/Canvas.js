class Object {
	constructor(id, attr, pos) {
		this.id = id;
		this.attr = attr;
		this.pos = pos;
	}

	hasAttr(attr) {
		return new RegExp('\\b' + attr.trim() + '\\b', 'i').test(this.attr)
	}

	addAttr(attr) {
		if (this.attr) {
			if (!this.hasAttr(attr)) {
				this.attr += ' ' + attr.trim();
				return true;
			}
			return false;
		}
		else {
			this.attr = attr.trim();
		}
	}

	removeAttr(attr) {
		if (this.hasAttr(attr)) {
			this.attr = this.attr.replace(new RegExp('\\s*\\b' + attr.trim() + '\\b', 'i'));
			return true;
		}
		return false;
	}
}

class Collection extends Object{
	constructor(id, attr, pos = new Point()) {
		super(id, attr, pos);
		this.type = 'collection';
		this.objects = [];
	}

	add(object) {
		this.objects.push(object);
	}

	remove(id) {
		for(let [i, object] of this.objects.entries()) {
			if (object.id === id) {
				this.object.splice(i, 1);
			}
		}
	}

	get(id) {
		for (const object of this.objects) {
			if (object.id === id) {
				return object;
			}
		}
	}

	clone() {
		let ret = new Collection(this.id, this.attr, this.pos.clone());
		for (const object of this.objects) {
			ret.add(object.clone());
		}
		return ret;
	}
}

class Canvas extends Collection{
	constructor(canvasElement, width = 1600, height = 900) {
		super('root', null, null);
		this.canvas = canvasElement;
		this.ctx = canvasElement.getContext('2d');
		this.width = width;
		this.height = height;
		this.scale = canvasElement.width / width;

		this.resize();
	}

	resize() {
		this.canvas.width = this.canvas.parentElement.offsetWidth;
		this.canvas.height = this.canvas.width * this.height / this.width;
		this.scale = this.canvas.width / this.width;
		this.render();
	}

	render() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for(let object of this.objects) {
			this.draw(object);
		}
	}
	
	draw(object, offset = new Point()) {
		//Sets default x and y positions of where to start drawing
		let x = (offset.x + object.pos.x) * this.scale;
		let y = (offset.y + object.pos.y) * this.scale;

		switch (object.type) {
			case 'collection':
				for(let subObject of object.objects) {
					this.draw(subObject, offset.clone().add(object.pos));
				}
				break;
			case 'rectangle':
				if (object.color) {
					this.ctx.fillStyle = object.color;
					this.ctx.fillRect(x, y, object.w * this.scale, object.h * this.scale);
				}
				break;
			case 'circle':
				if (object.color) {
					this.ctx.beginPath();
					this.ctx.arc(x, y, object.r * this.scale, 0, 2 * Math.PI, false);
					this.ctx.fillStyle = object.color;
					this.ctx.fill();
				}
				break;
			case 'polygon':
				if (object.color) {
					this.ctx.beginPath();
					this.ctx.fillStyle = object.color;
					this.ctx.moveTo(x, y);
					for (let pos of object.positions) {
						this.ctx.lineTo((pos.x + offset.x) * this.scale, (pos.y + offset.y) * this.scale);
					}
					this.ctx.closePath();
					this.ctx.fill();
				}
				break;
			case 'line':
				if (object.color) {
					this.ctx.beginPath();
					this.ctx.strokeStyle = object.color;
					this.ctx.lineWidth = object.thickness * this.scale;
					this.ctx.moveTo(x, y);
					this.ctx.lineTo((object.pos2.x + offset.x) * this.scale, (object.pos2.y + offset.y) * this.scale);
					this.ctx.stroke();
				}
				break;
			case 'text':
				if (object.color) {
					this.ctx.fillStyle = object.color;
					this.ctx.font = object.size * this.scale + "px " + object.font;
					this.ctx.fillText(object.text, x, y);
				}
				break;
			default:
				console.log("ERROR: No object of object type \"" + object.type + "\" exists");
		}
	}
}

class Point {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	add(point) {
		this.x += point.x;
		this.y += point.y;
		return this;
	}

	clone() {
		return new Point(this.x, this.y);
	}
}

class Rectangle extends Object {
	constructor(id, attr, pos, w, h, color = '#000000') {
		super(id, attr, pos);
		this.type = 'rectangle';
		this.w = w;
		this.h = h;
		this.color = color;
	}

	clone() {
		return new Rectangle(this.id, this.attr, this.pos.clone(), this.w, this.h, this.color);
	}
}

class Circle extends Object {
	constructor(id, attr, pos, r, color = '#000000') {
		super(id, attr, pos);
		this.type = 'circle';
		this.r = r;
		this.color = color;
	}

	clone() {
		return new Rectangle(this.id, this.attr, this.pos.clone(), this.r, this.color);
	}
}

class Polygon extends Object {
	constructor(id, attr, positions, color = '#000000') {
		super(id, attr, positions[0]);
		this.type = 'polygon';
		this.positions = positions;
		this.color = color;
	}

	clone() {
		let positionsArr = [];
		for (let pos of this.positions) {
			positionsArr.push(pos.clone());
		}
		return new Polygon(this.id, this.attr, positionsArr, this.color);
	}
}

class Line extends Object {
	constructor(id, attr, pos1, pos2, thickness = 5, color = '#000000') {
		super(id, attr, pos1);
		this.type = 'line';
		this.pos2 = pos2;
		this.thickness = thickness;
		this.color = color;
	}

	clone() {
		return new Line(this.id, this.attr, this.pos.clone(), this.pos2.clone(), this.thickness, this.color);
	}
}

class TextObj extends Object {
	constructor(id, attr, pos, text, size, font = 'Calibri', color = '#000000') {
		super(id, attr, pos);
		this.type = 'text';
		this.text = text;
		this.size = size;
		this.font = font;
		this.color = color;
	}

	clone() {
		return new TextObj(this.id, this.attr, this.pos.clone(), this.text, this.size, this.font, this.color);
	}
}

