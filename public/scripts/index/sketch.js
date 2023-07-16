let header = function (root) {
    let layers;

    root.setup = function () {
        root.createCanvas(window.innerWidth - 150, 300);
        root.describe("a light gray to black wavy vertical gradient background")
        layers = layerStack(root, root.color("#403f4c"), root.color("#1b2432"), 5, 4, 2, 0, 30, root.width, 200);
    }

    starbursts = [];

    root.draw = function () {
        root.background(root.color("#121420"));

        for (let layer of layers) {
            layer.show();
        }

        if (root.mouseIsPressed) {
            starbursts.push(new starburst(root, root.mouseX, root.mouseY));
        }

        for (let s of starbursts) {
            s.show();
        }
    }
}
let headerSketch = new p5(header, 'wave-header');

let planet = function (root) {
    let layers;

    root.setup = function () {
        root.createCanvas(600, 300, root.WEBGL);
        root.describe("a spinning sphere with white wireframe lines on a red to white wavy horizontal gradient background")
        layers = layerStack(root, root.color("#f2e4e3"), root.color("#9c4b46"), 5, 1.5, 1, -root.height / 2, (40 - root.width) / 2, root.height, 400);
    }

    let a = 0;
    root.draw = function () {
        root.background(0, 0);

        root.push();
        root.rotate(root.PI / 2);
        for (let layer of layers) {
            layer.show();
        }
        root.pop();

        root.push();
        root.translate(100, 270, 150);
        root.rotateY(a);
        root.rotateZ(root.HALF_PI * 1.1);
        root.stroke(root.color("#f2e4e3"));
        root.ambientLight(255);
        root.ambientMaterial(root.color("#121420"));
        root.sphere(250);
        root.pop();

        a += 0.007;
    }
}
let planetSketch = new p5(planet, 'planet');