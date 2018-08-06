(function () {
  const
    DEFAULT_OPTIONS = {
      radius: 24,
      x: 28,
      y: 28,
      color: "green",
    },
    ANIMATION_INCREASE_BY_STEP = 0.01,
    ANIMATION_MAX_SCALE = 1.1;

  window.Ball = function Ball(ctx, options) {
    this.ctx = ctx;
    this.options = { ...DEFAULT_OPTIONS, ...options };
  };

  Ball.prototype.getColor = function () {
    return this.options.color;
  };

  Ball.prototype.draw = function (x = this.options.x, y = this.options.y, scale = 1) {
    const
      ctx = this.ctx,
      {
        color,
        radius,
      } = this.options;

    ctx.beginPath();
    ctx.arc(x, y, radius * scale, 0, Math.PI*2);
    ctx.fillStyle = color;
    ctx.fill();

    if (x !== this.options.x || y !== this.options.y) {
      this.options.x = x;
      this.options.y = y;
    }
  };

  Ball.prototype.getPosition = function () {
    return {
      x: this.options.x,
      y: this.options.y
    }
  };

  Ball.prototype.move = function (x, y) {
    this.clear();
    this.draw(x, y);
  };

  Ball.prototype.pulse = function () {
    let
      scale = 1,
      isScaleUpper = true;

    this.cancelPulse();
    this.isPulse = true;

    const animate = () => {
      scale = scale + (isScaleUpper ? 1 : -1) * ANIMATION_INCREASE_BY_STEP;

      if (scale > ANIMATION_MAX_SCALE) {
        isScaleUpper = false
      }

      if (scale === 1) {
        isScaleUpper = true
      }

      if (this.isPulse) {
        this.clear(scale);
        this.draw(this.options.x, this.options.y, scale);

        this._request = requestAnimationFrame(animate);
      }
    };

    this._request = requestAnimationFrame(animate);
  };

  Ball.prototype.cancelPulse = function () {
    cancelAnimationFrame(this._request);

    this.isPulse = false;
    requestAnimationFrame(() => {
      this.draw();
    });
  };

  Ball.prototype.clear = function (scale = 1.10) {
    const {
      radius,
      x,
      y
    } = this.options;

    this.ctx.clearRect(
      x - radius * scale - 1,
      y - radius * scale - 1,
      radius * scale * 2 + 2,
      radius * scale * 2 + 2
    );
  };

  Ball.prototype.remove = function () {
    cancelAnimationFrame(this._request);

    requestAnimationFrame(() => {
      this.clear();
    })
  };
})();

