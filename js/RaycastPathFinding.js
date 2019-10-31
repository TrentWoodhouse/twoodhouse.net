//------------------------------------------------Model---------------------------------------------------------------//
//The whole canvas with all objects
let environment = function (ctx) {
    return {
        'context': ctx,
        'objects': [],
        'add': function (object) {
            this.objects.push(object);
        },
        'remove': function (id) {
            this.objects.forEach(function (object, i) {
                if (object.id === id) {
                    this.objects.splice(i, 1);
                }
            }, this);
        },
        'get': function (id) {
            for (const object of this.objects) {
                if (object.id === id) {
                    return object;
                }
            }
        }
    }
};

let vector = function (x, y) {
    return {
        'x': x,
        'y': y,
        'setVector': function (v) {
            this.x = v.x;
            this.y = v.y;
        },
        'addVector': function (v) {
            this.x += v.x;
            this.y += v.y;
        },
        'clone': function () {
            return vector(this.x, this.y);
        }
    }
};

//A collection of shapes
let pattern = function (id, attr, pos) {
    return {
        'type': 'pattern',
        'id': id,
        'attr': attr,
        'shapes': [],
        'pos': pos,
        'add': function (shape) {
            this.shapes.push(shape);
        },
        'remove': function (id) {
            this.shapes.forEach(function (shape, i) {
                if (shape.id === id) {
                    this.shape.splice(i, 1);
                }
            }, this);
        },
        'get': function (id) {
            for (const shape of this.shapes) {
                if (shape.id === id) {
                    return shape;
                }
            }
        },
        'clone': function () {
            let ret = pattern(this.id, this.pos.clone());
            for (const shape of this.shapes) {
                ret.add(shape.clone());
            }
            return ret;
        },
        'attrFunctions': attrFunctions()
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
        'pos': vector(pos.x, pos.y + size),
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
            }
            else {
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

//------------------------------------------------View---------------------------------------------------------------//
let render = function (environment) {
    environment.context.clearRect(0, 0, c.width, c.height);
    environment.objects.forEach(function (object) {
        draw(object, vector(0, 0), environment.context);
    });
};

let draw = function (object, offset, context) {
    let x = 0;
    let y = 0;

    if (object.type !== "line" && object.type !== "poly") {
        x = offset.x + object.pos.x;
        y = offset.y + object.pos.y;
    }


    switch (object.type) {
        case 'pattern':
            object.shapes.forEach(function (object) {
                draw(object, vector(x, y), context);
            });
            break;
        case 'rectangle':
            if (object.color) {
                context.fillStyle = object.color;
                context.fillRect(x * ratio, y * ratio,
                    object.w * ratio, object.h * ratio);
            }
            break;
        case 'circle':
            if (object.color) {
                context.beginPath();
                context.arc(x * ratio, y * ratio,
                    object.r * ratio, 0, 2 * Math.PI, false);
                context.fillStyle = object.color;
                context.fill();
            }
            break;
        case 'poly':
            if (object.color) {
                context.beginPath();
                context.fillStyle = object.color;
                context.moveTo((object.positions[0].x + offset.x) * ratio, (object.positions[0].y + offset.y) * ratio);
                for (let pos of object.positions) {
                    context.lineTo((pos.x + offset.x) * ratio, (pos.y + offset.y) * ratio);
                }
                context.closePath();
                context.fill();
            }
            break;
        case 'line':
            if (object.color) {
                context.beginPath();
                context.strokeStyle = object.color;
                context.lineWidth = object.thickness * ratio;
                context.moveTo((object.pos1.x + offset.x) * ratio, (object.pos1.y + offset.y) * ratio);
                context.lineTo((object.pos2.x + offset.x) * ratio, (object.pos2.y + offset.y) * ratio);
                context.stroke();
            }
            break;
        case 'text':
            if (object.color) {
                context.fillStyle = object.color;
                context.font = object.size * ratio + "px " + object.font;
                context.fillText(object.text, x * ratio, y * ratio);
            }
            break;
    }
};


//------------------------------------------------Controller----------------------------------------------------------//
/*
    Grid based on a 1600x900 resolution
 */

const $canvas = $("#canvas");
//Rounding allows graphics to be crisp
let W = Math.floor($canvas.parent().width() / 16) * 16;
let H = W * 9 / 16;
let ratio = W / 1600;

$(window).resize(function () {
    W = Math.floor($canvas.parent().width() / 16) * 16;
    H = W * 9 / 16;
    c.width = W;
    c.height = H;
    ratio = W / 1600;
    render(e);
});

let c = document.getElementById("canvas");
let ctx = c.getContext("2d");

c.width = W;
c.height = H;

/*
    Setup
 */

let e = environment(ctx);

/*
    Will consist of a 32x18 grid
 */
let coord = function (x, y) {
    return vector(x * 50, y * 50);
};

let grid = function () {
    let ret = pattern("grid", null, vector(0, 0));
    for (let i = 0; i <= 32; i++) {
        ret.add(line(null, null, coord(i, 0), coord(i, 18), 6, '#eee'));
    }
    for (let j = 0; j <= 18; j++) {
        ret.add(line(null, null, coord(0, j), coord(32, j), 6, '#eee'));
    }
    return ret;
};

let barrier = function (id, pos1, pos2, color = "#000") {
    let ret = pattern(id, null, vector(0, 0));
    pos1.addVector(vector(25, 25));
    pos2.addVector(vector(25, 25));
    ret.add(circle("p1", null, 3, pos1, color));
    ret.add(circle("p2", null, 3, pos2, color));
    ret.add(line("line", null, pos1, pos2, 6, color));
    return ret;
};

let roundedRec = function (id, attr, w, h, r, pos, color) {
    let ret = pattern(id, attr, pos);
    if (r > w / 2) r = w / 2;
    if (r > h / 2) r = h / 2;
    let p1 = vector(r, r);
    let p2 = vector(w - r, r);
    let p3 = vector(w - r, h - r);
    let p4 = vector(r, h - r);
    ret.add(circle(null, null, r, p1, color));
    ret.add(circle(null, null, r, p2, color));
    ret.add(circle(null, null, r, p3, color));
    ret.add(circle(null, null, r, p4, color));
    ret.add(rectangle(null, null, w - (2 * r), h, vector(p1.x, p1.y - r), color));
    ret.add(rectangle(null, null, w, h - (2 * r), vector(p1.x - r, p1.y), color));
    return ret;
};

let target = function (pos) {
    let ret = pattern("target", null, pos);
    ret.add(circle(null, null, 20, vector(25, 25), '#c00'));
    ret.add(circle(null, null, 15, vector(25, 25), '#fff'));
    ret.add(line(null, null, vector(25, 0), vector(25, 50), 5, '#c00'));
    ret.add(line(null, null, vector(0, 25), vector(50, 25), 5, '#c00'));
    return ret;
};

let player = function (pos) {
    let ret = pattern("player", null, pos);
    ret.add(circle(null, null, 20, vector(25, 25), '#9e5b00'));
    ret.add(circle(null, null, 15, vector(25, 25), '#f98a00'));
    return ret;
};

let btn_ = function (pos) {
    let ret = pattern("btn_", null, pos);
    ret.add(roundedRec("background", null, 50, 50, 6, vector(0, 0), null));
    ret.add(circle(null, null, 15, vector(25, 25)));
    return ret;
};

let btn_path = function (pos) {
    let ret = pattern("btn_path", null, pos);
    ret.add(roundedRec("background", null, 50, 50, 6, vector(0, 0), null));
    ret.add(line(null, null, vector(10, 40), vector(40, 10), 3, '#000'));
    ret.add(circle(null, null, 6, vector(10, 40), '#f98a00'));
    ret.add(circle(null, null, 6, vector(40, 10), '#c00'));
    return ret;
};

let btn_grid = function (pos) {
    let ret = pattern("btn_grid", null, pos);
    ret.add(roundedRec("background", null, 50, 50, 6, vector(0, 0), null));
    ret.add(line(null, null, vector(10, 10), vector(40, 10), 4, "#000"));
    ret.add(line(null, null, vector(40, 10), vector(40, 40), 4, "#000"));
    ret.add(line(null, null, vector(40, 40), vector(10, 40), 4, "#000"));
    ret.add(line(null, null, vector(10, 40), vector(10, 10), 4, "#000"));
    ret.add(line(null, null, vector(25, 10), vector(25, 40), 4, "#000"));
    ret.add(line(null, null, vector(10, 25), vector(40, 25), 4, "#000"));
    return ret;
};

let btn_stop = function (pos) {
    let ret = pattern("btn_stop", null, pos);
    ret.add(roundedRec("background", null, 50, 50, 6, vector(0, 0), null));
    ret.add(rectangle("stop", null, 30, 30, vector(10, 10), '#d00'));
    return ret;
};

let btn_animate = function (pos) {
    let ret = pattern("btn_animate", null, pos);
    ret.add(roundedRec("background", null, 50, 50, 6, vector(0, 0), null));
    ret.add(poly("play", null, [vector(10, 10), vector(10, 40), vector(40, 25)], '#0d0'));
    return ret;
};

let btn_speed = function (pos) {
    let ret = pattern("btn_speed", null, pos);
    ret.add(roundedRec("background", null, 50, 50, 6, vector(0, 0), null));
    ret.add(text("x1", null, vector(10, 5), "x1", 30, "Consolas", "#000"));
    ret.add(text("x2", null, vector(10, 5), "x2", 30, "Consolas", null));
    ret.add(text("x3", null, vector(10, 5), "x3", 30, "Consolas", null));
    return ret;
};

let btn_draw = function (pos) {
    let ret = pattern("btn_draw", null, pos);
    ret.add(roundedRec("background", null, 50, 50, 6, vector(0, 0), null));
    ret.add(circle(null, null, 15, vector(25, 25)));
    return ret;
};

let btn_erase = function (pos) {
    let ret = pattern("btn_erase", null, pos);
    ret.add(roundedRec("background", null, 50, 50, 6, vector(0, 0), null));
    ret.add(circle(null, null, 15, vector(25, 25)));
    return ret;
};

let btn_clear = function (pos) {
    let ret = pattern("btn_clear", null, pos);
    ret.add(roundedRec("background", null, 50, 50, 6, vector(0, 0), null));
    ret.add(circle(null, null, 15, vector(25, 25)));
    return ret;
};

let btn_raycast_lines = function (pos) {
    let ret = pattern("btn_raycast_lines", null, pos);
    ret.add(roundedRec("background", null, 50, 50, 6, vector(0, 0), null));
    ret.add(line(null, null, vector(25, 10), vector(25, 40), 3));
    ret.add(line(null, null, vector(10, 25), vector(40, 25), 3));
    ret.add(line(null, null, vector(12, 12), vector(38, 38), 3));
    ret.add(line(null, null, vector(12, 38), vector(38, 12), 3));
    return ret;
};

let btn_raycast_room = function (pos) {
    let ret = pattern("btn_raycast_room", null, pos);
    ret.add(roundedRec("background", null, 50, 50, 6, vector(0, 0), null));
    ret.add(circle(null, null, 15, vector(25, 25)));
    return ret;
};

let item_divider = function (pos) {
    return line("border", null, vector(pos.x + 25, pos.y - 10), vector(pos.x + 25, pos.y + 60), 3, "#bbb");
};

// Basic UI
e.add(grid());
e.add(line("border", null, vector(0, 0), vector(1600, 0), 50, "#ccc"));
e.add(line("border", null, vector(1600, 0), vector(1600, 800), 50, "#ccc"));
e.add(line("border", null, vector(1600, 800), vector(0, 800), 50, "#ccc"));
e.add(line("border", null, vector(0, 800), vector(0, 0), 50, "#ccc"));


//Menu
let menu = pattern("menu", null, vector(0, 800));
menu.add(rectangle("menubar", null, 1600, 100, vector(0, 0), "#efefef"));
menu.add(line("border", null, vector(0, 0), vector(1600, 0), 5, "#bbb"));
menu.add(rectangle("border", null, 590, 80, vector(1000, 10), "#ccc"));
menu.add(rectangle("textbox", null, 584, 74, vector(1003, 13), "#fff"));
menu.add(btn_path(vector(25, 25)));
menu.add(btn_grid(vector(75, 25)));
menu.add(item_divider(vector(125, 25)));
menu.add(btn_stop(vector(175, 25)));
menu.add(btn_animate(vector(225, 25)));
menu.add(btn_speed(vector(275, 25)));
menu.add(item_divider(vector(325, 25)));
menu.add(btn_draw(vector(375, 25)));
menu.add(btn_erase(vector(425, 25)));
menu.add(btn_clear(vector(475, 25)));
menu.add(item_divider(vector(525, 25)));
menu.add(btn_raycast_lines(vector(575, 25)));
menu.add(btn_raycast_room(vector(625, 25)));
e.add(menu);

// Map
let map = pattern("map", null, vector(0, 0));
let barriers = pattern("barriers", null, vector(0, 0));
barriers.add(barrier("immbarrier", coord(0, 0), coord(31, 0)));
barriers.add(barrier("immbarrier", coord(0, 15), coord(31, 15)));
barriers.add(barrier("immbarrier", coord(0, 0), coord(0, 15)));
barriers.add(barrier("immbarrier", coord(31, 0), coord(31, 15)));

// Walls
map.add(barriers);

// Target
map.add(target(coord(1, 1)));

// Player
map.add(player(coord(30, 14)));

e.add(map);
render(e);
console.log(e);


// Mouse functions
let getMousePos = function (event) {
    let rect = c.getBoundingClientRect();
    return vector(Math.round((event.clientX - rect.left) / ratio), Math.round((event.clientY - rect.top) / ratio));
};

let snappedToGrid = function (pos) {
    return vector(Math.round((pos.x - 25) / 50) * 50, Math.round((pos.y - 25) / 50) * 50)
};

let pointInRect = function (pos, x, y, w, h) {
    let valid = true;
    if (!(x <= pos.x && pos.x <= x + w)) valid = false;
    if (!(y <= pos.y && pos.y <= y + h)) valid = false;
    return valid;
};

let hasAttr = function (object, attr) {
    let reg = new RegExp('(?<=^\w+.+)\b' + attr + '\b');
    return reg.test(object.id);
};

let addAttr = function (object, attr) {
    if (!hasAttr(object, attr)) {
        object.id += " " + attr;
    }
};

let remAttr = function (object, attr) {
    let reg = new RegExp('(?<=^\w+.+)\s\b' + attr + '\b');
    if (hasAttr(object, attr)) {
        object.id.replace(reg, "");
    }
};

let mousedown = false;
let targetedObject = null;
let playerObject = e.get("map").get("player");
let targetObject = e.get("map").get("target");
let barrierObjects = e.get("map").get("barriers");
let menuObject = e.get("menu");

$canvas.on('mousedown', function (event) {
    let mousePos = getMousePos(event);
    mousedown = true;

    if (pointInRect(mousePos, playerObject.pos.x, playerObject.pos.y, 50, 50) && !targetedObject) {
        targetedObject = "player";
    }
    if (pointInRect(mousePos, targetObject.pos.x, targetObject.pos.y, 50, 50) && !targetedObject) {
        targetedObject = "target";
    }
    if (pointInRect(mousePos, 0, 0, 1600, 780) && !targetedObject) {
        targetedObject = "grid";
        barrierObjects.add(barrier("halfbarrier", snappedToGrid(mousePos), snappedToGrid(mousePos)));
        render(e);
    }

    console.log(targetedObject);
});

$canvas.on('mousemove', function (event) {
    let mousePos = getMousePos(event);
    if (mousedown) {
        switch (targetedObject) {
            case "player":
                playerObject.pos = mousePos;
                playerObject.pos.addVector(vector(-25, -25));
                render(e);
                break;
            case "target":
                targetObject.pos = mousePos;
                targetObject.pos.addVector(vector(-25, -25));
                render(e);
                break;
            case "grid":
                let barrierObject = barrierObjects.get("halfbarrier");
                if (!pointInRect(mousePos, barrierObject.get("p2").pos.x + 25, barrierObject.get("p2").pos.y + 25, 50, 50)) {
                    barrierObject.get("p2").pos = snappedToGrid(mousePos);
                    barrierObject.get("line").pos2 = snappedToGrid(mousePos);
                    barrierObject.get("p2").pos.addVector(vector(25, 25));
                    barrierObject.get("line").pos2.addVector(vector(25, 25));
                    render(e);
                }
                break;
        }
    }
    if (pointInRect(mousePos, 0, 800, 1600, 100)) {
        for (let shape of menuObject.shapes) {
            if (/btn/.test(shape.id)) {
                if (pointInRect(mousePos, menuObject.pos.x + shape.pos.x, menuObject.pos.y + shape.pos.y, 50, 50)) {
                    for (let subShape of shape.get("background").shapes) {
                        subShape.color = "#ccc";
                    }
                    render(e);
                }
            }
        }
    }
});

$canvas.on('mouseup', function (event) {
    if (targetedObject === "grid") {
        barrierObjects.get("halfbarrier").id = "barrier" + barrierObjects.shapes.length;
        barrierObjects.remove("halfbarrier");
    }
    targetedObject = null;
    mousedown = false;
});

console.log(e.get('map').attrFunctions.addAttr('big sexy map'), e);


// Union Jack
// let e = environment(ctx);
// e.add(rectangle(1600, 900, vector(0,0), "#0300a0"));
// e.add(line(vector(0,0), vector(1600,900),200,"#fff"));
// e.add(line(vector(0,900), vector(1600,0),200,"#fff"));
// e.add(line(vector(-32,32), vector(800,500),66,"#c00"));
// e.add(line(vector(800,400), vector(1600,-50),66,"#c00"));
// e.add(line(vector(800,400), vector(1632,868),66,"#c00"));
// e.add(line(vector(0,950), vector(800,500),66,"#c00"));
// e.add(line(vector(0,450),vector(1600,450),290,'#fff'));
// e.add(line(vector(800,0), vector(800,900), 290, '#fff'));
// e.add(line(vector(0,450),vector(1600,450),145,'#c00'));
// e.add(line(vector(800,0), vector(800,900), 145, '#c00'));
// e.render();









