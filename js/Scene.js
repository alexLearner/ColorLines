(function () {
  const SCENE_COLORS = ["red", "orange", "blue", "pink", "green", "purple", "black"];
  const SCENE_DEFAULT_OPTIONS = {
    ANIMATION_MOVE_TIME: 80,
    COLORS_COUNT: SCENE_COLORS.length,

    BALL_COUNT_INIT: 5,
    BALL_COUNT_AFTER_INIT: 3,
    BALL_COUNT_FOR_DELETE: 5,
    CELL_COUNT: 9,
    SCORE_ELEMENT: document.getElementById('score'),
    WIDTH: 600
  };

  window.Scene = function Scene(canvas, options = SCENE_DEFAULT_OPTIONS) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.options = options;

    this._selectedBall = null;
    this._isAnimate = false;
    this.score = 0;
    this.cellSize = options.WIDTH / options.CELL_COUNT;

    this._MATRIX = this.getEmptySet();
  };

  Scene.prototype.init = function () {
    this.draw(Ball);

    this.canvas.addEventListener(
      "click",
      event => this.clickOnBall(event)
    )
  };

  Scene.prototype.reinit = function () {
    this.clear();
    requestAnimationFrame(() => this.init());
  };

  Scene.prototype.draw = function (BallInstance, count = this.options.BALL_COUNT_INIT) {
    const randomSet = this.createRandomSet(count);

    for (let i = 0; i < count; i++) {
      const
        color = SCENE_COLORS[Random.random(0, this.options.COLORS_COUNT)],
        x = randomSet[i].x,
        y = randomSet[i].y,
        ball = new BallInstance(
          this.ctx,
          { color: color }
        ),
        position = this.getCellPosition(x, y);

      ball.draw(position.x, position.y);

      this.addCellToSet(x, y, ball);
    }
  };

  Scene.prototype.clear = function () {
    this.ctx.clearRect(0, 0, this.options.WIDTH, this.options.WIDTH);
    this.setScore(0);
    this.canvas.removeEventListener("click", this.clickOnBall);

    this._MATRIX.forEach(
      row => row.forEach(item => item && item.ball.remove())
    );

    this._MATRIX = this.getEmptySet();
    this.removeSelectedBall();
  };

  Scene.prototype.update = function () {
    const
      elementCount = this.getElementCount(),
      { CELL_COUNT, BALL_COUNT_AFTER_INIT, ANIMATION_MOVE_TIME } = this.options,
      maxCellCount = CELL_COUNT * CELL_COUNT,
      checkLines = this.checkLines();

    if (checkLines) {
      setTimeout(() => this.removeLine(checkLines), ANIMATION_MOVE_TIME);
    } else {
      let drawCount = BALL_COUNT_AFTER_INIT;

      if (elementCount > maxCellCount - BALL_COUNT_AFTER_INIT) {
        drawCount = maxCellCount - elementCount
      }

      this.draw(Ball, drawCount);

      let newCheckLines = this.checkLines();
      if (newCheckLines) {
        setTimeout(() => this.removeLine(newCheckLines), ANIMATION_MOVE_TIME);
      }

      this.checkGameOver();
    }
  };

  Scene.prototype.move = function (Ball, cellX, cellY) {
    const
      { ANIMATION_MOVE_TIME } = this.options,
      prevPosition = Ball.getPosition(),
      prevXY = this.getCellXY(prevPosition.x, prevPosition.y),
      matrix = this.getMatrix();


    const { px, py } = pathFinder({
      matrix,
      startX: prevXY.x,
      startY: prevXY.y,
      endX: cellX,
      endY: cellY,
    });

    if (!(px && px.length)) return;

    this.addCellToSet(cellX, cellY, Ball);
    this.removeCellfromSet(prevXY.x, prevXY.y);
    this._isAnimate = true;

    // TODO: CREATE SET TIMEOUT WITH requestAnimationFrame
    px.forEach((x, index) =>
      setTimeout(() => {
        const pos = this.getCellPosition(px[index], py[index]);

        Ball.move(pos.x, pos.y);

        if (index === px.length - 1) {
          setTimeout(
            () => {
              this._isAnimate = false;
              this.removeSelectedBall();
              this.update();
            },
            ANIMATION_MOVE_TIME
          );
        }
      }, ANIMATION_MOVE_TIME * index)
    )
  };

  Scene.prototype.checkGameOver = function () {
    const
      elementCount = this.getElementCount(),
      { CELL_COUNT } = this.options,
      maxCellCount = CELL_COUNT * CELL_COUNT;

    if (elementCount === maxCellCount) {
      if (confirm("Game over. Try again?")) {
        this.reinit();
      }

      return true;
    }
  };

  Scene.prototype.getElementCount = function () {
    let index = 0;

    this.getMatrix().forEach(row =>
      row.forEach(item => {
        if (item) {
          index++;
        }
      })
    );

    return index;
  };

  Scene.prototype.getMatrix = function () {
    return this._MATRIX;
  };

  Scene.prototype.checkLines = function () {
    return matchInMatrix(this.getMatrix(), 5, "color");
  };

  Scene.prototype.removeLine = function (object) {
    let
      isOrientByX = object.isOrientByX,
      cellX = object.cellX,
      cellY = object.cellY,
      sumIndex = object.sumIndex;

    this.setScore(sumIndex + 1);

    while (sumIndex !== -1) {
      this.getCellFromSet(cellX, cellY).ball.remove();
      this.removeCellfromSet(cellX, cellY);

      if (isOrientByX) {
        cellX--
      } else {
        cellY--
      }

      sumIndex--;
    }
  };

  Scene.prototype.setScore = function (score) {
    this.score = this.score + score;
    this.options.SCORE_ELEMENT.innerText = this.score;
  };

  Scene.prototype.clickOnBall = function (event) {
    const
      { left, top } = this.canvas.getBoundingClientRect(),
      x = event.clientX - left,
      y = event.clientY - top,
      { x: cellX, y: cellY } = this.getCellXY(x, y),
      currentBall = this.getCellFromSet(cellX, cellY),
      selectedBall = this.getSelectedBall();

    if (!this._isAnimate) {
      if (currentBall) {
        this.setSelectedBall(currentBall.ball);
      } else if (selectedBall) {
        this.move(selectedBall, cellX, cellY);
      }
    }
  };

  Scene.prototype.setSelectedBall = function (Ball) {
    if (this._selectedBall) {
      this._selectedBall.cancelPulse();
    }

    this._selectedBall = Ball;
    Ball.pulse();
  };

  Scene.prototype.getSelectedBall = function () {
    return this._selectedBall;
  };

  Scene.prototype.removeSelectedBall = function () {
    this._selectedBall && this._selectedBall.cancelPulse();
    this._selectedBall = null;
  };

  Scene.prototype.getEmptySet = function () {
    let arr = [];
    for (let i = 0; i < this.options.CELL_COUNT; i++) {
      arr[i] = [];

      for (let x = 0; x < this.options.CELL_COUNT; x++) {
        arr[i][x] = undefined;
      }
    }

    return arr;
  };

  Scene.prototype.addCellToSet = function (x, y, ball) {
    this._MATRIX[y][x] = { ball: ball, x: x, y: y, color: ball.getColor() };
  };

  Scene.prototype.removeCellfromSet = function (x, y) {
    this._MATRIX[y][x] = undefined;
  };

  Scene.prototype.isCellInSet = function (x, y) {
    return !!this._MATRIX[y][x];
  };

  Scene.prototype.getCellFromSet = function (x, y) {
    if ( this.isCellInSet(x, y) ) {
      return this._MATRIX[y][x];
    }
  };

  Scene.prototype.getCellXY = function (x, y) {
    return {
      x: Math.floor(x / this.cellSize),
      y: Math.floor(y / this.cellSize)
    }
  };

  Scene.prototype.getCellPosition = function (cellX, cellY) {
    return {
      x: (cellX + 1/2) * this.cellSize,
      y: (cellY + 1/2) * this.cellSize
    }
  };

  Scene.prototype.createRandomSet = function (count) {
    const
      tempSet = new Set(),
      arr = [];

    while ( arr.length < count ) {
      const
        x = Random.random(0, this.options.CELL_COUNT),
        y = Random.random(0, this.options.CELL_COUNT),
        keyXY = x + "_" + y;

      if ( !this.isCellInSet(x, y) && !tempSet.has(keyXY) ) {
        arr.push({ x: x, y: y });

        tempSet.add(keyXY);
      }
    }

    return arr;
  };
})();

