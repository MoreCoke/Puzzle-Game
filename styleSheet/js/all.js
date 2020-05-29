import "./jquery.slim.js";

jQuery.fn.swapWith = function(to) {
  return this.each(function() {
    const copy_to = $(to).clone(true);
    const copy_from = $(this).clone(true);
    $(to).replaceWith(copy_from);
    $(this).replaceWith(copy_to);
  })
};

$("img").on("dragstart", function(e) {
  e.originalEvent.dataTransfer.setData("data", e.target.dataset.puzzle);
})

$("img").on("dragend", function (e) {
  const self = $(this);
  const x = e.clientX - e.target.offsetWidth / 2;
  const y = e.clientY - e.target.offsetHeight / 2;
  // self.css({
  //   top: y,
  //   left: x,
  // });
  // console.log('dragend');
});

$(".puzzle-zone").on("drop", function(e) {
  const self = $(this);
  const data = e.originalEvent.dataTransfer.getData("data");
  const puzzle = $(`img[data-puzzle="${data}"]`);
  const children = self.children();
  self.removeClass("hover");
  console.log('draggable',self.attr("data-zone"),data);
  if(children.length === 0) {
    self.append(puzzle);
  } else {
    puzzle.swapWith(children);
  }
});
$(".puzzle-zone").on("dragover", function(e) {
  e.preventDefault();
});
$(".puzzle-zone").on("dragenter", function(e) {
  const self = $(this);
  self.addClass("hover");
});
$(".puzzle-zone").on("dragleave", function(e) {
  const self = $(this);
  self.removeClass("hover");
  // console.log('離開');
})