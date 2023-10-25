let gendermatrix = function (root) {
    let columns = [];

    root.setup = function () {
        let globalSize = 24;
        root.colorMode(root.RGB);
        root.createCanvas(root.windowWidth, root.windowHeight);
        root.describe("a genderfluid flag in the style of the falling glitching character effect from the matrix")
        root.textSize(globalSize);
        for (let x = 0; x < root.width; x += globalSize) {
            columns.push(new charColumn(x, globalSize, [root.color("#FF76A4"), root.color("#FFFFFF"), root.color("#C011D7"), root.color("#404040"), root.color("#2F3CBE")]))
        }
    }

    root.draw = function () {
        root.background(0);
        for (let c of columns) {
            c.update();
            c.show();
        }
    }

    function charWrapper(col, x, y, size) {
        this.updateChar = function () {
            this.c = String.fromCharCode(root.floor(root.random(12353, 12438)));
        };

        this.update = function () {
            if (this.t % this.speed < 1) {
                this.updateChar();
            }
            this.t++;
            if (this.pulse > 0) {
                this.pulse *= 0.9;
            }
        };

        this.show = function () {
            root.colorMode(root.HSL);
            let pulsed = root.color(this.hue, this.sat, this.light * this.pulse);
            root.stroke(pulsed);
            root.fill(pulsed);
            root.textSize(this.size);
            root.text(this.c, this.x, this.y);
        };

        root.colorMode(root.RGB);
        this.x = x;
        this.y = y;
        this.size = size;
        this.col = col;
        this.hue = root.hue(this.col);
        this.sat = root.saturation(this.col);
        this.light = root.lightness(this.col);
        this.pulse = 0;
        this.c = this.updateChar();
        this.speed = root.floor(root.random(1, 5));
        this.t = 0;
    }

    function charColumn(x, w, cols) {
        this.update = function () {
            if (this.updateT % this.newPulseSpeed < 1) {
                let len = root.floor(root.random(this.chars.length * 1 / 2, this.chars.length * 5 / 6));
                this.startPulse(len);
            }
            if (this.updateT % this.updatePulseSpeed < 1) {
                this.updatePulse();
            }
            for (let c of this.chars) {
                c.update();
            }
            this.updateT++;
        }

        this.show = function () {
            for (let c of this.chars) {
                c.show();
            }
        }

        this.pulsePos = 0;
        this.pulseLength = 0;
        this.pulseValue = 0;
        this.pulseT = 0;
        this.startPulse = function (pulseLength) {
            let start = root.floor(root.random(this.chars.length));
            this.pulsePos = start;
            this.pulseLength = pulseLength;
            this.pulseValue = 1;
            this.pulseT = 0;
        }

        this.updatePulse = function () {
            if (this.pulseValue <= 0.05) { return; }
            if (this.pulseT >= this.pulseLength) {
                this.pulseValue *= 0.4;
            }
            this.chars[this.pulsePos].pulse = this.pulseValue;
            this.pulsePos++;
            this.pulsePos %= this.chars.length;
            this.pulseT++;
        }

        this.charHeight = (w * 5 / 3);
        this.x = x;
        this.y = 0;
        this.w = w;
        this.h = root.height + this.charHeight;
        this.numChars = root.floor(this.h / this.charHeight);
        this.chars = [];
        this.cols = cols;
        this.updatePulseSpeed = root.floor(root.random(1, 5));
        this.newPulseSpeed = root.floor(root.random(100, 300));
        this.updateT = 0;

        for (let i = 0; i < this.numChars; i++) {
            let y = this.y + this.charHeight * i;
            let col_idx = clamp(root.floor(y * this.cols.length / root.height), 0, this.cols.length - 1);
            this.chars[i] = new charWrapper(this.cols[col_idx], this.x, y, this.w);
        }

    }

    function clamp(val, low, hi) {
        return root.max(low, root.min(val, hi));
    }
}
let gendermatrixSketch = new p5(gendermatrix, 'gendermatrix');