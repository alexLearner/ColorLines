"use strict";

(function () {

  const bg = document.getElementById("CL_background");
  const canvas = document.getElementById("CL_scene");

  Background(bg, 9);

  const scene = new Scene(canvas);

  scene.init();
})();