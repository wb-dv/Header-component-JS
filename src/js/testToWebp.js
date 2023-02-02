export function isWebp() {
  function testWebP(callback) {
    let webP = new Image();
    webP.src =
      "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
    };
  }
  testWebP(function (support) {
    let className = support === true ? "webp" : "no-webp";
    document.documentElement.classList.add(className);
  });
}

/*document.addEventListener("DOMContentLoaded", function () {
  testWebP(document.html);
});

//Другой способ добавить проверку на вебпи, если первый не будет работать то пробуем юзать этот
export function testWebP(elem) {
  const webP = new Image();
  webP.src =
    "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  webP.onload = webP.onerror = function () {
    webP.height === 2
      ? elem.classList.add("webp")
      : elem.classList.add("no-webp");
  };
}*/
