angular.module('mainController', [])

.controller('mainController', function($window, $scope) {

  var vm = this;
  vm.audioList = [document.getElementById("audio0"), document.getElementById("audio1"), document.getElementById("audio2"), document.getElementById("audio3")];
  vm.loadedList = [false, false, false, false];
  vm.playingList = [false, false, false, false];
  vm.pausedList = [true, true, true, true];
  vm.durationList = [0, 0, 0, 0];
  vm.timeRemainingList = [0, 0, 0, 0];
  vm.activeAudio = document.getElementById("audio3"); // default to last
  vm.activeAudioIndex = vm.audioList.length - 1; // default to last
  $scope.sliderLeft = [0, 0, 0, 0];


  vm.updateOnSpace =  function() {

    if(vm.playingList[vm.activeAudioIndex]) {

      vm.aud_pause(vm.activeAudioIndex);
    } else {

      vm.aud_play(vm.activeAudioIndex);
    }

  }

  vm.updateSliderLeft = function(ct, d, e, index) {

    if (e) {

      vm.audioList[index].pause();
      vm.playingList[index] = false;
      vm.pausedList[index] = true;
      document.getElementById('tracktime' + index).innerHTML = Math.floor((vm.durationList[index]));
      $scope.sliderLeft[index] = 0;
      $scope.$apply();

    } else {

      var element = document.getElementById('sliderBox' + index);
      var style = window.getComputedStyle(element);
      var width = style.getPropertyValue('width');
      var widthInt = width.substring(0, width.length - 2);
      $scope.sliderLeft[index] = (ct / d) * widthInt;
      $scope.$apply();
    }
  };

  $scope.addOnClick = function(event, index) {
      $scope.sliderLeft[index] = event.offsetX;

      var element = document.getElementById('sliderBox' + index);
      var style = window.getComputedStyle(element);
      var width = style.getPropertyValue('width');
      var widthInt = width.substring(0, width.length - 2);

      vm.audioList[index].currentTime = (event.offsetX / widthInt) * vm.durationList[index];
      vm.timeRemainingList[index] = Math.floor(vm.audioList[index].duration - vm.audioList[index].currentTime);

      // vm.activeAudio = vm.audioList[index];
      // vm.activeAudioIndex = index;
  };

  vm.aud_play = function(index) {
    if (!vm.playingList[index]) {

      if (vm.activeAudio != null && vm.activeAudioIndex !== index) {

        vm.aud_pause(vm.activeAudioIndex);
      }

      vm.activeAudio = vm.audioList[index];
      vm.activeAudioIndex = index;
      vm.audioList[index].play();
      vm.playingList[index] = true;
      vm.pausedList[index] = false;
    }
  };

  vm.aud_pause = function(index) {
    if (!vm.pausedList[index]) {
      vm.audioList[index].pause();
      vm.playingList[index] = false;
      vm.pausedList[index] = true;
    }
  };

  vm.getDuration = function() {
    for (var i = 0; i < vm.audioList.length; i ++ ) {
      vm.durationList[i] = vm.audioList[i].duration;
      vm.timeRemainingList[i] = Math.floor(vm.audioList[i].duration - vm.audioList[i].currentTime);
    }
    for (var i = 0; i < vm.audioList.length; i ++ ) {
      if (isNaN(vm.durationList[i])) {
        $window.location.reload();
      } else {
        vm.loadedList[i] = true;
      }
    }
  }

  vm.getDuration();
  return vm;
});
