import "./jquery.slim.js";

// 寫個自訂 method 這樣能讓方格內的拼圖互換位置
jQuery.fn.swapWith = function (to) {
  return this.each(function () {
    const copy_to = $(to).clone(true);
    const copy_from = $(this).clone(true);
    $(to).replaceWith(copy_from);
    $(this).replaceWith(copy_to);
  });
};

// 拖曳圖片時送出 data，這樣 puzzle-zone 監聽到 drop 時用 getData 就能收到資料
$("img").on("dragstart", function (e) {
  e.originalEvent.dataTransfer.setData("data", e.target.dataset.puzzle);
});

// 拖曳圖片鬆開滑鼠左鍵所觸發的事件
$("img").on("dragend", function (e) {
  const self = $(this);
  const parentClass = self.parent().prop("class");
  // 如果沒移進方格的話，拼圖可以隨便移動
  if (parentClass === "all-puzzle") {
    const x = e.clientX - e.target.offsetWidth / 2;
    const y = e.clientY - e.target.offsetHeight / 2;
    self.css({
      top: y,
      left: x,
    });
  }
  // 如果移進方格，拼圖的 style 刪掉
  if (parentClass === "puzzle-zone") {
    self.removeAttr("style");
  }
});

function startGame() {
  return $("img").each(function () {
    const self = $(this);
    const randomWidth = (window.outerWidth - 400) * Math.random();
    const randomHeight = (window.outerHeight - 400) * Math.random();
    self.attr("draggable", true);
    // 如果在方格裡把它移出來，放到 all-puzzle 的 div
    if (self.parent().hasClass("puzzle-zone")) {
      self.appendTo($(".all-puzzle"));
    }
    // 隨機打亂順序
    self.css({
      top: randomHeight,
      left: randomWidth,
    });
  });
}

startGame();
// 點擊隨機排序按鈕來打亂拼圖
$(".random-btn").click(startGame);

// 點擊再玩一次按鈕把動畫移除和觸發 startGame()
$(".description-btn").click(function() {
  startGame();
  $(".puzzle-table").removeClass("shinning");
  $(".puzzle").removeClass("puzzle-move");
  $(".description").removeClass("description-move");
  $(".random-btn").removeClass("none");
});

// 在 table 綁 drop 事件就不用在每個 td 都寫
$(".puzzle").on("drop", function (e) {
  const zone = $(e.target);
  // 取得拖曳圖片時送出 data
  const data = e.originalEvent.dataTransfer.getData("data");
  const puzzle = $(`img[data-puzzle="${data}"]`);
  let fillZone = 0;
  zone.removeClass("hover");
  puzzle.removeAttr("style");
  // 如果方格是空的，這時的 e.target 是指向 div 的 puzzle-zone， 就塞拼圖進去
  if (zone.data("zone")) {
    zone.append(puzzle);
  } else {
    // 如果方格內有拚圖就互換拼圖
    puzzle.swapWith(zone);
  }
  // 檢查 puzzle-zone 的拼圖是不是都有拚對
  $(".puzzle-zone").each(function () {
    const dataZone = $(this).data("zone");
    const dataPuzzle = $(this).children().data("puzzle");
    if (dataZone === dataPuzzle) {
      fillZone += 1;
    }
    // 如果全都拚對了，就結束遊戲
    if (fillZone === 9) {
      $("img").attr("draggable", false);
      $(".puzzle-table").addClass("shinning");
      $(".puzzle").addClass("puzzle-move"); //先移 puzzle
      $(".description")
        .delay(1500)
        .queue(function () {
          // 後移 description
          $(this).addClass("description-move").dequeue();
        });
      $(".random-btn").addClass("none");
    }
  });
});

// 不加這個的話 drop 事件不會被觸發的
$(".puzzle").on("dragover", function (e) {
  e.preventDefault();
});

$(".puzzle").on("dragenter", function (e) {
  const zone = $(e.target);
  // 如果是滑到空格的話， zone.data("zone") 會抓到數字
  if (zone.data("zone")) {
    zone.addClass("hover");
  }
});

$(".puzzle").on("dragleave", function (e) {
  const zone = $(e.target);
  // 如果是離開空格的話， zone.data("zone") 會抓到數字
  if (zone.data("zone")) {
    zone.removeClass("hover");
  }
});