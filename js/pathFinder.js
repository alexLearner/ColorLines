// https://ru.wikibooks.org/wiki/%D0%A0%D0%B5%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8_%D0%B0%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC%D0%BE%D0%B2/%D0%90%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC_%D0%9B%D0%B8

(function () {
  let gridTest = [
    [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2],
    [-2,-2,-2,-1,-2,-1,-1,-1,-1,-2],
    [-2,-2,-2,-2,-2,-2,-1,-2,-2,-2],
    [-2,-1,-2,-1,-1,-1,-1,-1,-1,-2],
    [-2,-1,-2,-1,-1,-2,-2,-2,-1,-2],
    [-2,-1,-2,-1,-2,-2,-1,-2,-1,-2],
    [-2,-1,-2,-1,-2,-1,-1,-2,-1,-2],
    [-2,-1,-2,-2,-2,-2,-2,-2,-1,-2],
    [-2,-1,-1,-1,-1,-1,-1,-1,-1,-2],
    [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2]
  ];

  const DEFAULT_CONFIG = {
    W: 9,
    H: 9,
    WALL: -1,
    BLANK: -2,
  };

  window.pathFinder = function pathFinder(_config) {
    const config = { ...DEFAULT_CONFIG, ..._config };

    let {
      matrix,
      startX: ax,
      startY: ay,
      endX: bx,
      endY: by,
      W,
      H,
      WALL,
      BLANK,
    } = config;

    // transform incoming matrix
    // all undefined items = BLANK
    // all no empty items = WALL

    grid = matrix.map(row =>
      row.map(item => item ? -1 : -2)
    );

    grid[ay][ax] = BLANK;

    const dx = [1, 0, -1, 0];
    const dy = [0, 1, 0, -1];
    let d, x, y, k;

    let stop;

    if (grid[ay][ax] === WALL || grid[by][bx] === WALL) return false;

    d = 0;
    grid[ay][ax] = 0;

    while ( !stop && grid[by][bx] === BLANK ) {
      stop = true;
      for ( y = 0; y < H; ++y ) {
        for ( x = 0; x < W; ++x ) {
          if ( grid[y][x] === d ) {

            for ( k = 0; k < 4; ++k ) {
              let iy = y + dy[k], ix = x + dx[k];

              if ( iy >= 0 && iy < H && ix >= 0 && ix < W && grid[iy][ix] === BLANK ) {
                stop = false;
                grid[iy][ix] = d + 1;
              }
            }
          }
        }
      }
      d++;
    }

    if (grid[by][bx] === BLANK) return false;

    let px = [], py = [];

    let len = grid[by][bx];
    x = bx;
    y = by;
    d = len;

    while ( d > 0 ) {
      px[d] = x;
      py[d] = y;
      d--;
      for (k = 0; k < 4; ++k)
      {
        let iy =y + dy[k], ix = x + dx[k];
        if ( iy >= 0 && iy < H && ix >= 0 && ix < W && grid[iy][ix] === d)
        {
          x = x + dx[k];
          y = y + dy[k];
          break;
        }
      }
    }
    px[0] = ax;
    py[0] = ay;

    return {grid: grid, px: px, py: py};
  }
})();