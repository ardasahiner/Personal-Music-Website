function eventFire(el, etype){
  console.log('yah');
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

function moveSlider(ct, d, e, index) {
  angular.element('body').controller().updateSliderLeft(ct, d, e, index);
}

window.onkeydown = function(e) {
    if(e.keyCode == 32 || e.keyCode == 39 || e.keyCode == 37) {
        e.preventDefault();
        return false;
    }
};

var rightArrow = false;
$(function() {
  $(document).keyup(function(evt) {
    if (evt.keyCode == 39) {
      rightArrow = false;
      angular.element('body').controller().updateOnRight();
    }
  }).keydown(function(evt) {
    if (evt.keyCode == 39) {
      rightArrow = true;
    }
  });
});


var leftArrow = false;
$(function() {
  $(document).keyup(function(evt) {
    if (evt.keyCode == 37) {
      leftArrow = false;
      angular.element('body').controller().updateOnLeft();
    }
  }).keydown(function(evt) {
    if (evt.keyCode == 37) {
      leftArrow = true;
    }
  });
});


var space = false;
$(function() {
  $(document).keyup(function(evt) {
    if (evt.keyCode == 32) {
      space = false;
      angular.element('body').controller().updateOnSpace();
    }
  }).keydown(function(evt) {
    if (evt.keyCode == 32) {
      space = true;
    }
  });
});
