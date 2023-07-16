let header = function (root) {
    let layers;

    root.setup = function () {
        root.createCanvas(window.innerWidth - 150, 200);
        root.describe("a light gray to black wavy vertical gradient background")
        layers = layerStack(root, root.color("#403f4c"), root.color("#1b2432"), 5, 4, 2, 0, 20, root.width, 150);
    }

    root.draw = function () {
        root.background(root.color("#121420"));

        for (let layer of layers) {
            layer.show();
        }
    }
}
let headerSketch = new p5(header, 'wave-header');