$(function(){
  var container = $('container');
  var contents = $('contents');

  contents.width($(window).width() * 0.8);
   $(window).resize(function(){
    contents.width($(window).width() * 0.8 );
  });
    
$('right').click(function(){ 
  var active = $("container").find(".active");
  if (active.is(':last-child')) {
      $("container").find(".active").removeClass('active');
      $("slide[data-slide-index='0']").addClass('active');
  } else {
      container.addClass('moveR');
      container.removeClass('moveL');
      active.removeClass('active');
      active.next().addClass('active');
  }
});

$('left').click(function(){ 
var active = $("container").find(".active");
if (active.is(':first-child')) {
    $("container").find(".active").removeClass('active');
    $("slide[data-slide-index='3']").addClass('active');
} else {
    container.addClass('moveL');
    container.removeClass('moveR');
    active.removeClass('active');
    active.prev().addClass('active');
}
});

   $(document).keydown(function(e) {
    if (e.keyCode === 37) {
        moveLeft();
    }
  });

$(document).keydown(function(e) {
    if (e.keyCode === 39) {
        moveRight();
    }
  });
  
  $('subcontainer').children('slide').each(function () {
     $('indicators').append('<dot></dot>');
  });
  $('indicators').find(':first-child').addClass('active');
 
  $('dot').click(function(){
    var active = $("container").find(".active");
    var y = $("container").find(".active").index();
    var x = $(this).index();
    
    active.removeClass('active');
    $(this).addClass('active');
    $('slide').eq(x).addClass('active');
    if(x < y){
      container.addClass('moveL');
      container.removeClass('moveR');
    }
    if(x > y){
      container.addClass('moveR');
      container.removeClass('moveL');
    }
  });

  var slides = $('.slide');
  var totalSlides = slides.length;
  var currentSlide = 0;

  function nextSlide() {
      slides.removeClass('active');
      slides.eq(currentSlide).addClass('active');
      currentSlide = (currentSlide + 1) % totalSlides;
  }
});