(function () {
  const OPTIONS = {
    lineColor: "#c0c0c0",
    bgColor: "#ffffff",
  };

  window.Background = function Background(canvas, cellCount) {
    const
      ctx = canvas.getContext("2d"),
      width = canvas.offsetWidth,
      height = canvas.offsetHeight;

    for (let i = 0; i < cellCount + 1; i++) {
      ctx.moveTo(i * width/cellCount, 0);
      ctx.lineTo(i * width/cellCount, height);

      ctx.moveTo(0, i * height/cellCount);
      ctx.lineTo(width, i * height/cellCount);
    }

    ctx.strokeStyle = OPTIONS.lineColor;
    ctx.stroke();
  }
})();
