/*
    Grid based on a 1600x900 resolution
 */

let canvas = document.getElementById("canvas");
let c = new Canvas(canvas);
window.onresize = function() {
    c.resize();
};


/*
    Will consist of a 32x18 grid
*/
let coord = function (x, y) {
    return new Point(x * 50, y * 50);
};

let grid = function () {
    let ret = new Collection("grid");
    for (let i = 0; i <= 32; i++) {
        ret.add(new Line(null, null, coord(i, 0), coord(i, 18), 6, '#eee'));
    }
    for (let j = 0; j <= 18; j++) {
        ret.add(new Line(null, null, coord(0, j), coord(32, j), 6, '#eee'));
    }
    return ret;
};

let barrier = function (id, pos1, pos2, color) {
    let ret = new Collection(id);
    pos1.add(new Point(25, 25));
    pos2.add(new Point(25, 25));

    ret.add(new Circle("p1", null, pos1, 3, color));
    ret.add(new Circle("p2", null, pos2, 3, color));
    ret.add(new Line("line", null, pos1, pos2, 6, color));
    return ret;
};

let roundedRectangle = function (id, attr, pos, w, h, r, color) {
    let ret = new Collection(id, attr, pos);
    if (r > w / 2) r = w / 2;
    if (r > h / 2) r = h / 2;
    let p1 = new Point(r, r);
    let p2 = new Point(w - r, r);
    let p3 = new Point(w - r, h - r);
    let p4 = new Point(r, h - r);
    ret.add(new Circle(null, null, p1, r, color));
    ret.add(new Circle(null, null, p2, r, color));
    ret.add(new Circle(null, null, p3, r, color));
    ret.add(new Circle(null, null, p4, r, color));
    ret.add(new Rectangle(null, null, new Point(p1.x, p1.y - r), w - (2 * r), h, color));
    ret.add(new Rectangle(null, null, new Point(p1.x - r, p1.y), w, h - (2 * r), color));
    return ret;
};

let target = function (pos) {
    let ret = new Collection("target", null, pos);
    ret.add(new Circle(null, null, new Point(25, 25), 20, '#c00'));
    ret.add(new Circle(null, null, new Point(25, 25), 15, '#fff'));
    ret.add(new Line(null, null, new Point(25, 0), new Point(25, 50), 5, '#c00'));
    ret.add(new Line(null, null, new Point(0, 25), new Point(50, 25), 5, '#c00'));
    return ret;
};

let player = function (pos) {
    let ret = new Collection("player", null, pos);
    ret.add(new Circle(null, null, new Point(25, 25), 20, '#9e5b00'));
    ret.add(new Circle(null, null, new Point(25, 25), 15, '#f98a00'));
    return ret;
};

let btn_ = function (pos) {
    let ret = new Collection("btn_", null, pos);
    ret.add(roundedRectangle("background", null, new Point(0, 0), 50, 50, 6, null));
    ret.add(new Circle(null, null, new Point(25, 25), 15));
    return ret;
};

let btn_path = function (pos) {
    let ret = new Collection("btn_path", null, pos);
    ret.add(roundedRectangle("background", null, new Point(0, 0), 50, 50, 6, null));
    ret.add(new Line(null, null, new Point(10, 40), new Point(40, 10), 3));
    ret.add(new Circle(null, null, new Point(10, 40), 6, '#f98a00'));
    ret.add(new Circle(null, null, new Point(40, 10), 6, '#c00'));
    return ret;
};

let btn_grid = function (pos) {
    let ret = new Collection("btn_grid", null, pos);
    ret.add(roundedRectangle("background", null, new Point(0, 0), 50, 50, 6, null));
    ret.add(new Line(null, null, new Point(10, 10), new Point(40, 10), 4, "#000"));
    ret.add(new Line(null, null, new Point(40, 10), new Point(40, 40), 4, "#000"));
    ret.add(new Line(null, null, new Point(40, 40), new Point(10, 40), 4, "#000"));
    ret.add(new Line(null, null, new Point(10, 40), new Point(10, 10), 4, "#000"));
    ret.add(new Line(null, null, new Point(25, 10), new Point(25, 40), 4, "#000"));
    ret.add(new Line(null, null, new Point(10, 25), new Point(40, 25), 4, "#000"));
    return ret;
};

let btn_stop = function (pos) {
    let ret = new Collection("btn_stop", null, pos);
    ret.add(roundedRectangle("background", null, new Point(0, 0), 50, 50, 6, null));
    ret.add(new Rectangle("stop", null, new Point(10, 10), 30, 30, '#d00'));
    return ret;
};

let btn_animate = function (pos) {
    let ret = new Collection("btn_animate", null, pos);
    ret.add(roundedRectangle("background", null, new Point(0, 0), 50, 50, 6, null));
    ret.add(new Polygon("play", null, [new Point(10, 10), new Point(10, 40), new Point(40, 25)], '#0d0'));
    return ret;
};

let btn_speed = function (pos) {
    let ret = new Collection("btn_speed", null, pos);
    ret.add(roundedRectangle("background", null, new Point(0, 0), 50, 50, 6, null));
    ret.add(new TextObj('x1', null, new Point(10, 35), 'x1', 30, 'Consolas', '#000'));
    ret.add(new TextObj('x2', null, new Point(10, 35), 'x2', 30, 'Consolas', null));
    ret.add(new TextObj('x3', null, new Point(10, 35), 'x3', 30, 'Consolas', null));
    return ret;
};

let btn_draw = function (pos) {
    let ret = new Collection("btn_draw", null, pos);
    ret.add(roundedRectangle("background", null, new Point(0, 0), 50, 50, 6, null));
    ret.add(new Circle(null, null, new Point(25, 25), 15));
    return ret;
};

let btn_erase = function (pos) {
    let ret = new Collection("btn_draw", null, pos);
    ret.add(roundedRectangle("background", null, new Point(0, 0), 50, 50, 6, null));
    ret.add(new Circle(null, null, new Point(25, 25), 15));
    return ret;
};

let btn_clear = function (pos) {
    let ret = new Collection("btn_draw", null, pos);
    ret.add(roundedRectangle("background", null, new Point(0, 0), 50, 50, 6, null));
    ret.add(new Circle(null, null, new Point(25, 25), 15));
    return ret;
};

let btn_raycast_lines = function (pos) {
    let ret = new Collection("btn_raycast_lines", null, pos);
    ret.add(roundedRectangle("background", null, new Point(0, 0), 50, 50, 6, null));
    ret.add(new Line(null, null, new Point(25, 10), new Point(25, 40), 3));
    ret.add(new Line(null, null, new Point(10, 25), new Point(40, 25), 3));
    ret.add(new Line(null, null, new Point(12, 12), new Point(38, 38), 3));
    ret.add(new Line(null, null, new Point(12, 38), new Point(38, 12), 3));
    return ret;
};

let btn_raycast_room = function (pos) {
    let ret = new Collection("btn_draw", null, pos);
    ret.add(roundedRectangle("background", null, new Point(0, 0), 50, 50, 6, null));
    ret.add(new Circle(null, null, new Point(25, 25), 15));
    return ret;
};

let item_divider = function (pos) {
    return new Line("divider", null, new Point(pos.x + 25, pos.y - 10), new Point(pos.x + 25, pos.y + 60), 3, "#bbb");
};

// Basic UI
c.add(grid());
c.add(new Line("border", null, new Point(0, 0), new Point(1600, 0), 50, "#ccc"));
c.add(new Line("border", null, new Point(1600, 0), new Point(1600, 800), 50, "#ccc"));
c.add(new Line("border", null, new Point(1600, 800), new Point(0, 800), 50, "#ccc"));
c.add(new Line("border", null, new Point(0, 800), new Point(0, 0), 50, "#ccc"));


//Menu
let menu = new Collection("menu", null, new Point(0, 800));
menu.add(new Rectangle("menubar", null, new Point(0, 0), 1600, 100, "#efefef"));
menu.add(new Line("border", null, new Point(0, 0), new Point(1600, 0), 5, "#bbb"));
menu.add(new Rectangle("border", null, new Point(1000, 10), 590, 80, "#ccc"));
menu.add(new Rectangle("textbox", null, new Point(1003, 13), 584, 74, "#fff"));
menu.add(btn_path(new Point(25, 25)));
menu.add(btn_grid(new Point(75, 25)));
menu.add(item_divider(new Point(125, 25)));
menu.add(btn_stop(new Point(175, 25)));
menu.add(btn_animate(new Point(225, 25)));
menu.add(btn_speed(new Point(275, 25)));
menu.add(item_divider(new Point(325, 25)));
menu.add(btn_draw(new Point(375, 25)));
menu.add(btn_erase(new Point(425, 25)));
menu.add(btn_clear(new Point(475, 25)));
menu.add(item_divider(new Point(525, 25)));
menu.add(btn_raycast_lines(new Point(575, 25)));
menu.add(btn_raycast_room(new Point(625, 25)));
c.add(menu);

// Map
let map = new Collection("map");
let barriers = new Collection("barriers");
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

c.add(map);
c.render();
console.log(c);


// Mouse functions
// let getMousePos = function (event) {
//     let rect = c.getBoundingClientRect();
//     return new Point(Math.round((event.clientX - rect.left) / ratio), Math.round((event.clientY - rect.top) / ratio));
// };
//
// let snappedToGrid = function (pos) {
//     return new Point(Math.round((pos.x - 25) / 50) * 50, Math.round((pos.y - 25) / 50) * 50)
// };
//
// let pointInRect = function (pos, x, y, w, h) {
//     let valid = true;
//     if (!(x <= pos.x && pos.x <= x + w)) valid = false;
//     if (!(y <= pos.y && pos.y <= y + h)) valid = false;
//     return valid;
// };
//
// let mousedown = false;
// let targetedObject = null;
// let playerObject = c.get("map").get("player");
// let targetObject = c.get("map").get("target");
// let barrierObjects = c.get("map").get("barriers");
// let menuObject = c.get("menu");
//
// $canvas.on('mousedown', function (event) {
//     let mousePos = getMousePos(event);
//     mousedown = true;
//
//     if (pointInRect(mousePos, playerObject.pos.x, playerObject.pos.y, 50, 50) && !targetedObject) {
//         targetedObject = "player";
//     }
//     if (pointInRect(mousePos, targetObject.pos.x, targetObject.pos.y, 50, 50) && !targetedObject) {
//         targetedObject = "target";
//     }
//     if (pointInRect(mousePos, 0, 0, 1600, 780) && !targetedObject) {
//         targetedObject = "grid";
//         barrierObjects.add(barrier("halfbarrier", snappedToGrid(mousePos), snappedToGrid(mousePos)));
//         render(e);
//     }
//
//     consolc.log(targetedObject);
// });
//
// $canvas.on('mousemove', function (event) {
//     let mousePos = getMousePos(event);
//     if (mousedown) {
//         switch (targetedObject) {
//             case "player":
//                 playerObject.pos = mousePos;
//                 playerObject.pos.addnew Point(new Point(-25, -25));
//                 render(e);
//                 break;
//             case "target":
//                 targetObject.pos = mousePos;
//                 targetObject.pos.addnew Point(new Point(-25, -25));
//                 render(e);
//                 break;
//             case "grid":
//                 let barrierObject = barrierObjects.get("halfbarrier");
//                 if (!pointInRect(mousePos, barrierObject.get("p2").pos.x + 25, barrierObject.get("p2").pos.y + 25, 50, 50)) {
//                     barrierObject.get("p2").pos = snappedToGrid(mousePos);
//                     barrierObject.get("line").pos2 = snappedToGrid(mousePos);
//                     barrierObject.get("p2").pos.addnew Point(new Point(25, 25));
//                     barrierObject.get("line").pos2.addnew Point(new Point(25, 25));
//                     render(e);
//                 }
//                 break;
//         }
//     }
//     if (pointInRect(mousePos, 0, 800, 1600, 100)) {
//         for (let shape of menuObject.shapes) {
//             if (/btn/.test(shapc.id)) {
//                 if (pointInRect(mousePos, menuObject.pos.x + shapc.pos.x, menuObject.pos.y + shapc.pos.y, 50, 50)) {
//                     for (let subShape of shapc.get("background").shapes) {
//                         subShapc.color = "#ccc";
//                     }
//                     render(e);
//                 }
//             }
//         }
//     }
// });
//
// $canvas.on('mouseup', function (event) {
//     if (targetedObject === "grid") {
//         barrierObjects.get("halfbarrier").id = "barrier" + barrierObjects.shapes.length;
//         barrierObjects.remove("halfbarrier");
//     }
//     targetedObject = null;
//     mousedown = false;
// });
//
// console.log(c.get('map').attrFunctions.addAttr('big sexy map'), e);


//Union Jack
// let c = new Canvas(document.getElementById('canvas'));
// c.add(new Rectangle(null, null, new Point(0,0), 1600, 900, "#0300a0"));
// c.add(new Line(null, null, new Point(0,0), new Point(1600,900),200,"#fff"));
// c.add(new Line(null, null, new Point(0,900), new Point(1600,0),200,"#fff"));
// c.add(new Line(null, null, new Point(-32,32), new Point(800,500),66,"#c00"));
// c.add(new Line(null, null, new Point(800,400), new Point(1600,-50),66,"#c00"));
// c.add(new Line(null, null, new Point(800,400), new Point(1632,868),66,"#c00"));
// c.add(new Line(null, null, new Point(0,950), new Point(800,500),66,"#c00"));
// c.add(new Line(null, null, new Point(0,450),new Point(1600,450),290,'#fff'));
// c.add(new Line(null, null, new Point(800,0), new Point(800,900), 290, '#fff'));
// c.add(new Line(null, null, new Point(0,450),new Point(1600,450),145,'#c00'));
// c.add(new Line(null, null, new Point(800,0), new Point(800,900), 145, '#c00'));
// console.log(c);
// c.render();









