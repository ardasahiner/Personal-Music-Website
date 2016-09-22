angular.module('mainController', [])

.controller('mainController', function($window, $scope) {

  var vm = this;
  vm.lastEndTime = 0

  vm.updateOnSpace =  function() {
    if(vm.playingList[vm.activeAudioIndex]) {
      vm.aud_pause(vm.activeAudioIndex);
    } else {
      vm.aud_play(vm.activeAudioIndex);
    }
  }

  vm.updateSliderLeft = function(ct, d, e, index) {

    var current = Date.now() / 1000;

    //assume nothing shorter than 2 secs
    if (e && (current - vm.lastEndTime > 2)) {

      vm.lastEndTime = current;
      vm.audioList[index].pause();
      vm.playingList[index] = false;
      vm.pausedList[index] = true;
      document.getElementById('tracktime' + index).innerHTML = Math.floor((vm.durationList[index]));
      $scope.sliderLeft[index] = 0;
      $scope.$apply();

      if (vm.activeAudioIndex > 0) {
        vm.activeAudioIndex -= 1;
        vm.activeAudio = vm.audioList[vm.activeAudioIndex];
        vm.aud_play(vm.activeAudioIndex);
      } else {

        vm.activeAudioIndex = vm.audioList.length - 1;
        vm.activeAudio = vm.audioList[vm.activeAudioIndex];
      }
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

  vm.startUp = function(numSongs) {

    vm.audioList = [];
    vm.loadedList = [];
    vm.playingList = [];
    vm.pausedList = [];
    vm.durationList = [];
    vm.timeRemainingList = [];
    $scope.sliderLeft = [];

    for (var i = 0; i < numSongs; i++) {
      vm.audioList[i] = document.getElementById("audio" + i);
      vm.loadedList[i] = false;
      vm.playingList[i] = false;
      vm.pausedList[i] = true;
      vm.durationList[i] = 0;
      vm.timeRemainingList[i] = 0;
      $scope.sliderLeft[i] = 0;
    }

    vm.activeAudioIndex = numSongs - 1;
    vm.activeAudio = vm.audioList[vm.activeAudioIndex]; // default to last
  }

  vm.startUp(6);
  vm.getDuration();
});
