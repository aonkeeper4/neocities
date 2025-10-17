const genderMatrix = (p) => {
  const flags = {
    trans: {
      colors: [
        p.color("#5bcefa"),
        p.color("#f5a9b8"),
        p.color("#ffffff"),
        p.color("#f5a9b8"),
        p.color("#5bcefa"),
      ],
      chance: 0.3,
    },
    nonbinary: {
      colors: [
        p.color("#fcf434"),
        p.color("#FFFFFF"),
        p.color("#9c59d1"),
        p.color("#2c2c2c"),
      ],
      chance: 0.3,
    },
    genderfluid: {
      colors: [
        p.color("#FF76A4"),
        p.color("#FFFFFF"),
        p.color("#C011D7"),
        p.color("#404040"),
        p.color("#2F3CBE"),
      ],
      chance: 0.1,
    },
    bisexual: {
      colors: [
        p.color("#d60270"),
        p.color("#d60270"),
        p.color("#9b4f96"),
        p.color("#0038a8"),
        p.color("#0038a8"),
      ],
      chance: 0.3,
    },
  };

  const columns = [];

  p.setup = () => {
    const globalSize = 24;

    p.colorMode(p.RGB);
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.describe(
      "a pride flag in the style of the falling glitching character effect from the matrix"
    );

    p.textSize(globalSize);

    const colors = chooseFlag(flags);
    for (let x = 0; x < p.width; x += globalSize) {
      columns.push(new CharColumn(x, globalSize, colors));
    }
  };

  p.draw = () => {
    p.background(0);

    for (const c of columns) {
      c.update();
      c.show();
    }
  };

  class Char {
    constructor(col, x, y, size) {
      p.colorMode(p.RGB);

      this.x = x;
      this.y = y;
      this.size = size;

      this.col = col;
      this.hue = p.hue(this.col);
      this.sat = p.saturation(this.col);
      this.light = p.lightness(this.col);

      this.pulse = 0;

      this.speed = p.floor(p.random(1, 5));
      this.t = 0;

      this.updateChar();
    }

    updateChar() {
      this.c = String.fromCharCode(p.floor(p.random(12353, 12438)));
    }

    update() {
      if (this.t % this.speed < 1) {
        this.updateChar();
      }
      this.t++;

      if (this.pulse > 0) {
        this.pulse *= 0.9;
      }
    }

    show() {
      p.colorMode(p.HSL);

      const pulsed = p.color(this.hue, this.sat, this.light * this.pulse);
      p.stroke(pulsed);
      p.fill(pulsed);

      p.textSize(this.size);
      p.text(this.c, this.x, this.y);
    }
  }

  class CharColumn {
    constructor(x, w, cols) {
      this.pulsePos = 0;
      this.pulseLength = 0;
      this.pulseValue = 0;
      this.pulseT = 0;

      this.charHeight = (w * 5) / 4;

      this.x = x;
      this.y = this.charHeight / 6;
      this.w = w;
      this.h = p.height + this.charHeight;

      this.numChars = p.ceil(this.h / this.charHeight);
      this.chars = [];

      this.cols = cols;

      this.updatePulseSpeed = p.floor(p.random(1, 5));
      this.newPulseSpeed = p.floor(p.random(50, 200));
      this.updateT = 0;

      for (let i = 0; i < this.numChars; i++) {
        const y = this.y + this.charHeight * i;
        const col_idx = clamp(
          p.floor((y * this.cols.length) / p.height),
          0,
          this.cols.length - 1
        );

        this.chars[i] = new Char(this.cols[col_idx], this.x, y, this.w);
      }
    }

    update() {
      if (this.updateT % this.newPulseSpeed < 1) {
        const len = p.floor(
          p.random(this.chars.length * 0.5, this.chars.length * 0.8)
        );
        this.startPulse(len);
      }

      if (this.updateT % this.updatePulseSpeed < 1) {
        this.updatePulse();
      }

      for (const c of this.chars) {
        c.update();
      }

      this.updateT++;
    }

    startPulse(pulseLength) {
      const start = p.floor(p.random(this.chars.length));

      this.pulsePos = start;
      this.pulseLength = pulseLength;
      this.pulseValue = 1;
      this.pulseT = 0;
    }

    updatePulse() {
      if (this.pulseValue <= 0.05) {
        return;
      }

      if (this.pulseT >= this.pulseLength) {
        this.pulseValue *= 0.4;
      }

      this.chars[this.pulsePos].pulse = this.pulseValue;
      this.pulsePos++;
      this.pulsePos %= this.chars.length;

      this.pulseT++;
    }

    show() {
      for (const c of this.chars) {
        c.show();
      }
    }
  }

  const clamp = (val, low, high) => p.max(low, p.min(val, high));

  const chooseFlag = (flags) => {
    const colors = [],
      cumWeights = [];

    let sum = 0;
    for (const flagName in flags) {
      const flag = flags[flagName];

      colors.push(flag.colors);
      cumWeights.push((sum += flag.chance));
    }

    const val = p.random();
    for (const i in cumWeights) {
      if (val <= cumWeights[i]) {
        return colors[i];
      }
    }
  };
};

const genderMatrixSketch = new p5(genderMatrix, "genderMatrix");
