let getMousePos = function (event) {
    let rect = c.canvas.getBoundingClientRect();
    return new Point(Math.round((event.clientX - rect.left) / c.scale), Math.round((event.clientY - rect.top) / c.scale));
};

let snappedToGrid = function (pos) {
    return new Point(Math.round((pos.x - 25) / 50) * 50, Math.round((pos.y - 25) / 50) * 50)
};

let pointInRect = function (pos, x, y, w, h) {
    let valid = true;
    if (!(x <= pos.x && pos.x <= x + w)) valid = false;
    if (!(y <= pos.y && pos.y <= y + h)) valid = false;
    return valid;
};

// returns true iff the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
// Dan Fox
let intersects = function (a,b,c,d,p,q,r,s) {
    let det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
        return false;
    }
    else {
        lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
        gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
};

let mousedown = false;
let targetedObject = null;
let drawableCollection = c.get("map").get("drawable");
let playerObject = c.get("map").get("player"); 
let targetObject = c.get("map").get("target");
let barrierObjects = c.get("map").get("barriers");
let gridObject = c.get('grid');
let menuObject = c.get("menu");
let animateButton = menuObject.get('btn_animate');
let drawButton = menuObject.get('btn_draw');
let eraseButton = menuObject.get('btn_erase');


c.canvas.onmousedown = function (event) {
    let mousePos = getMousePos(event);
    mousedown = true;

    //Select player
    if (pointInRect(mousePos, playerObject.pos.x, playerObject.pos.y, 50, 50) && !targetedObject) {
        targetedObject = "player";
    }

    //Select target
    if (pointInRect(mousePos, targetObject.pos.x, targetObject.pos.y, 50, 50) && !targetedObject) {
        targetedObject = "target";
    }

    //Create barrier and select grid
    if (pointInRect(mousePos, 0, 0, 1600, 780) && !targetedObject) {
        targetedObject = "grid";
        barrierObjects.add(barrier("halfbarrier", snappedToGrid(mousePos), snappedToGrid(mousePos)));
        c.render();
    }

    //Menu operations
    if (pointInRect(mousePos, 0, 800, 1600, 100)) {
        for (let object of menuObject.objects) {
            if (/btn/.test(object.id)) {
                if (pointInRect(mousePos, menuObject.pos.x + object.pos.x, menuObject.pos.y + object.pos.y, 50, 50)) {
                    targetedObject = object.id;
                    object.addAttr('mousedown');
                    object.get('background').colorize('#bbb');
                    c.render();
                }
            }
        }
    }

    //Debugging
    console.log(targetedObject);
};

c.canvas.onmousemove = function (event) {
    let mousePos = getMousePos(event);

    //Draggables
    if (mousedown) {
        switch (targetedObject) {

            //Move player
            case "player":
                playerObject.pos = mousePos;
                playerObject.pos.add(new Point(-25, -25));
                c.render();
                break;

            //Move target
            case "target":
                targetObject.pos = mousePos;
                targetObject.pos.add(new Point(-25, -25));
                c.render();
                break;

            //Barrier operations
            case "grid":
                let barrierObject = barrierObjects.get("halfbarrier");
                if (!pointInRect(mousePos, barrierObject.get("p2").pos.x + 25, barrierObject.get("p2").pos.y + 25, 50, 50)) {
                    barrierObject.get("p2").pos = snappedToGrid(mousePos).add(new Point(25, 25));
                    barrierObject.get("line").pos2 = snappedToGrid(mousePos).add(new Point(25, 25));
                    c.render();
                }
                break;
        }
    }

    //Menu operations
    if (pointInRect(mousePos, 0, 800, 1600, 100)) {
        for (let object of menuObject.objects) {
            if (/btn/.test(object.id)) {
                if (pointInRect(mousePos, menuObject.pos.x + object.pos.x, menuObject.pos.y + object.pos.y, 50, 50)) {
                    if (!object.hasAttr('mousedown') && !object.hasAttr('active')) {
                        object.get('background').colorize('#d7d7d7');
                    }
                }
                else {
                    if (!object.hasAttr('active')) {
                        object.get('background').colorize(null);
                    }
                    object.removeAttr('mousedown');
                }
                c.render();
            }
        }
    }
};

c.canvas.onmouseup = function (event) {
    let mousePos = getMousePos(event);

    //Set barrier
    if (targetedObject === "grid") {
        barrierObjects.get("halfbarrier").id = "barrier" + barrierObjects.objects.length;
        barrierObjects.remove("halfbarrier");
    }

    //Menu operations
    for (let object of menuObject.objects) {
        if (/btn/.test(object.id)) {
            if (pointInRect(mousePos, menuObject.pos.x + object.pos.x, menuObject.pos.y + object.pos.y, 50, 50)) {
                if (object.hasAttr('mousedown')) {
                    object.removeAttr('mousedown');
                    switch(object.id) {
                        case 'btn_path':
                            if (object.hasAttr('active')) {
                                object.removeAttr('active');
                                object.get('background').colorize('#d7d7d7');
                            }
                            else {
                                object.addAttr('active');
                                object.get('background').colorize('#c4c4c4');
                            }
                            break;
                        case 'btn_grid':
                            if (object.hasAttr('active')) {
                                object.removeAttr('active');
                                object.get('background').colorize('#d7d7d7');
                                gridObject.colorize(null);
                            }
                            else {
                                object.addAttr('active');
                                object.get('background').colorize('#c4c4c4');
                                gridObject.colorize('#eee');
                            }
                            break;
                        case 'btn_animate':
                            object.addAttr('active');
                            object.get('background').colorize('#c4c4c4');
                            break;
                        case 'btn_stop':
                            object.get('background').colorize('#d7d7d7');
                            animateButton = menuObject.get('btn_animate');
                            animateButton.removeAttr('active');
                            animateButton.get('background').colorize(null);
                            break;
                        case 'btn_speed':
                            object.get('background').colorize('#d7d7d7');
                            let num = object.attr;
                            num = (num % 3) + 1;
                            object.setAttr(num.toString());
                            object.get('1').colorize(null);
                            object.get('2').colorize(null);
                            object.get('3').colorize(null);
                            object.get(num.toString()).colorize('#000');
                            break;
                        case 'btn_draw':
                            object.get('background').colorize('#c4c4c4');
                            object.addAttr('active');
                            eraseButton.removeAttr('active');
                            eraseButton.get('background').colorize(null);
                            break;
                        case 'btn_erase':
                            object.get('background').colorize('#c4c4c4');
                            object.addAttr('active');
                            drawButton.removeAttr('active');
                            drawButton.get('background').colorize(null);
                            break;
                        case 'btn_clear':
                            object.get('background').colorize('#d7d7d7');
                            drawButton = menuObject.get('btn_draw');
                            eraseButton = menuObject.get('btn_erase');
                            drawButton.addAttr('active');
                            drawButton.get('background').colorize('#c4c4c4');
                            eraseButton.removeAttr('active');
                            eraseButton.get('background').colorize(null);
                            break;
                        case 'btn_raycast_lines':
                            if (object.hasAttr('active')) {
                                object.removeAttr('active');
                                object.get('background').colorize('#d7d7d7');
                            }
                            else {
                                object.addAttr('active');
                                object.get('background').colorize('#c4c4c4');
                            }
                            break;
                        case 'btn_raycast_room':
                            if (object.hasAttr('active')) {
                                object.removeAttr('active');
                                object.get('background').colorize('#d7d7d7');
                            }
                            else {
                                object.addAttr('active');
                                object.get('background').colorize('#c4c4c4');
                            }
                            break;
                    }
                }
                c.render();
            }
            else if (object.hasAttr('mousedown')) {

            }
        }
    }


    targetedObject = null;
    mousedown = false;
};


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









