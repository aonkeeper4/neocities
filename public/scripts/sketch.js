// colors: #403f4c, #2c2b3c, #1b2432, #121420, #b76d68, #f2e4e3

function spaceLayer(root, x, y, w, h, rot, col, waves, scale, speed, samples) {
    this.off = 0;

    this.minAmplitude = 0;
    this.maxAmplitude = 1 / waves;

    this.minFrequency = 0.5;
    this.maxFrequency = 5;

    this.minRate = 0.005 * speed;
    this.maxRate = 0.02 * speed;

    this.wavePropertiesTop = [];
    for (let i = 0; i < waves; i++) {
        let amp = root.random(this.minAmplitude, this.maxAmplitude);
        let freq = root.random(this.minFrequency, this.maxFrequency);
        let phs = root.random(0, root.TWO_PI);
        let rate = root.random(this.minRate, this.maxRate);
        this.wavePropertiesTop[i] = [amp, freq, phs, rate];
    }

    this.waveTop = function (t) {
        let res = 0;
        for (let props of this.wavePropertiesTop) {
            let amp = props[0];
            let freq = props[1];
            let phs = props[2];
            let rate = props[3];
            res += amp * root.sin(freq * (t + phs) + this.off * rate);
        }

        return res;
    }

    this.wavePropertiesBottom = [];
    for (let i = 0; i < waves; i++) {
        let amp = root.random(this.minAmplitude, this.maxAmplitude);
        let freq = root.random(this.minFrequency, this.maxFrequency);
        let phs = root.random(0, root.TWO_PI);
        let rate = root.random(this.minRate, this.maxRate);
        this.wavePropertiesBottom[i] = [amp, freq, phs, rate];
    }

    this.waveBottom = function (t) {
        let res = 0;
        for (let props of this.wavePropertiesBottom) {
            let amp = props[0];
            let freq = props[1];
            let phs = props[2];
            let rate = props[3];
            res += amp * root.sin(freq * (t + phs) + this.off * rate);
        }

        return res;
    }

    this.show = function () {
        stepSize = w / samples;

        root.push();
        root.translate(x, y);
        root.rotate(rot);

        root.fill(col);
        root.noStroke();

        root.beginShape();
        // top
        for (let i = 0; i <= samples; i++) {
            root.vertex(i * stepSize, (h / 2) * this.waveTop(scale * i / samples) - (h / 2));
        }
        // bottom (reverse order so shape is drawn correctly)
        for (let i = samples; i >= 0; i--) {
            root.vertex(i * stepSize, (h / 2) * this.waveBottom(scale * i / samples) + (h / 2));
        }
        root.endShape(root.CLOSE);

        root.pop();

        this.off += 1;
    }
}

function layerStack(root, startCol, endCol, numLayers, scale, speed, x, y, w, h) {
    let waves = 10;
    let samples = 30;
    let overScaleFactor = 0.5;

    let allColors = [];
    for (let i = 0; i < numLayers; i++) {
        allColors.push(root.lerpColor(startCol, endCol, i / (numLayers - 1)));
    }

    let layers = [];
    for (let i = 0; i < numLayers; i++) {
        layers.push(new spaceLayer(root, x, y + i * h / (numLayers - 1), w, h * (1 + overScaleFactor) / (numLayers - 1), 0, allColors[i], waves, scale, speed, samples));
    }

    return layers;
}

function starburst(root, x, y) {
    this.x = x;
    this.y = y;
    this.t = 0;
    this.rot = root.random(0, root.TWO_PI);
    this.startsize = root.random(5, 20);
    this.size = this.startsize;
    this.lifetime = root.random(30, 90);

    // direction calculation (particles boosted away from mouse direction)
    let negMouseVector = p5.Vector.normalize(p5.Vector.sub(root.createVector(root.pmouseX, root.pmouseY), root.createVector(root.mouseX, root.mouseY)));
    this.dir = p5.Vector.add(p5.Vector.random2D(), negMouseVector);

    this.speed = root.random(3, 7);
    this.col = root.color("#f2e4e3");

    this.show = function () {
        if (this.size <= 0) {
            return;
        }

        // draw star
        root.push();
        root.noStroke();
        root.fill(this.col);
        root.translate(this.x, this.y);
        root.rotate(this.rot);
        root.scale(this.size / 5);
        root.beginShape();
        root.vertex(0, 5);
        root.vertex(2, 2);
        root.vertex(5, 0);
        root.vertex(2, -2);
        root.vertex(0, -5);
        root.vertex(-2, -2);
        root.vertex(-5, 0);
        root.vertex(-2, 2);
        root.endShape(root.CLOSE);
        root.pop();

        this.x += this.dir.x * this.speed;
        this.y += this.dir.y * this.speed;
        this.rot += 2 * root.PI / this.lifetime;
        this.size = (1 - (this.t / this.lifetime) * (this.t / this.lifetime)) * this.startsize;
        this.t += 1;
        this.col.setAlpha(255 * (1 - this.t / this.lifetime));
    }
}

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