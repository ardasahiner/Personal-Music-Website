angular.module('stuff', [])

.controller('stuff', function($window, $scope) {

    var vm = this;
    vm.lastEndTime = 0;
    var count = 0;

    vm.onFirstClick = function() {
      for (index = 0; index < vm.numSongs; index ++) {
        if (index != vm.activeAudioIndex || !vm.playingList[vm.activeAudioIndex]) {
          vm.audioList[index].play();
          vm.audioList[index].pause();
        }
      }
    }

    vm.updateOnRight = function() {
      if (vm.playingList[vm.activeAudioIndex]) {
        vm.aud_pause(vm.activeAudioIndex);
        vm.aud_play((vm.activeAudioIndex + 1) % vm.numSongs);
      } else {
        vm.activeAudioIndex = (vm.activeAudioIndex + 1) % vm.numSongs;
        vm.activeAudio = vm.audioList[vm.activeAudioIndex];
      }

      $scope.$applyAsync();
    }

    vm.updateOnLeft = function() {

      var prevTime = vm.activeAudio.currentTime;
      vm.activeAudio.currentTime = 0;
      var next = (vm.activeAudioIndex - 1 + vm.numSongs) % vm.numSongs;

      if (prevTime < 1) {

        if (vm.playingList[vm.activeAudioIndex]) {
          vm.aud_pause(vm.activeAudioIndex);
          vm.aud_play(next);
        } else {
          vm.activeAudioIndex = next;
          vm.activeAudio = vm.audioList[vm.activeAudioIndex];
        }
      }

      $scope.$applyAsync();
    }


    vm.updateOnSpace =  function() {
      if(vm.playingList[vm.activeAudioIndex]) {
        vm.aud_pause(vm.activeAudioIndex);
      } else {
        vm.aud_play(vm.activeAudioIndex);
      }
    }

    vm.updateSliderLeft = function(ct, d, e, index) {

      //assume nothing shorter than 2 secs
      if (e) {

        vm.audioList[index].pause();
        vm.playingList[index] = false;
        vm.pausedList[index] = true;
        document.getElementById('tracktime' + index).innerHTML = Math.floor((vm.durationList[index]));
        $scope.sliderLeft[index] = 0;
        var current = Date.now() / 1000;
        $scope.$apply();

        if ((current - vm.lastEndTime > 2)){
          vm.lastEndTime = current;

          if (vm.activeAudioIndex < vm.numSongs - 1) {
            vm.activeAudioIndex += 1;
            vm.activeAudio = vm.audioList[vm.activeAudioIndex];
            document.getElementById('play'+vm.activeAudioIndex).click();
          } else {
            vm.activeAudioIndex = 0;
            vm.activeAudio = vm.audioList[vm.activeAudioIndex];
          }
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
    };

    vm.aud_play = function(index) {
      if (!vm.playingList[index]) {
        if (vm.activeAudio !== null && vm.activeAudioIndex !== index) {
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
      for (var i = 0; i < vm.numSongs; i ++ ) {
        if (!vm.loadedList[i] && vm.audioList[i].readyState > 0) {
          vm.durationList[i] = vm.audioList[i].duration;
          vm.timeRemainingList[i] = Math.floor(vm.audioList[i].duration - vm.audioList[i].currentTime);
          vm.loadedList[i] = true;
          $scope.$applyAsync();
        } else if (vm.audioList[i].readyState == 0){
          setTimeout(function(){
            vm.getDuration();
          }, 5000);
        }
      }
    }

    vm.loadSongs = function() {
      try {
        for (var i = 0; i < vm.numSongs; i ++ ) {
          vm.audioList[i] = document.getElementById("audio" + i);
        }
        vm.getDuration();
      } catch(err) {
        setTimeout(function(){
          vm.loadSongs();
        }, 1000);
      }
    }

    vm.startUp = function(numSongs) {
      vm.numSongs = numSongs;
      vm.fileNames = ['howsoft.mp3', 'lb1.mp3', 'redbone.mp3', '12345.mp3', 'futility.mp3', 'stutt.mp3', 'flint.mp3', 'aes.mp3', 'off.mp3'].reverse();
      for (var i = 0; i < numSongs; i++) {

        vm.fileNames[i] = '../mp3_files/' + vm.fileNames[i];
      }
      vm.postDates = ['4.17.17', '6.15.17', '7.8.17', '7.16.17','8.16.17', '8.17.17', '9.29.17', '12.26.17', '2.1.18'].reverse();
      vm.songTitles = ['how soft', 'lb1', 'redbone', '12345', 'futility', 'stutt', 'flint', 'aes', 'off'].reverse();

      vm.loadedList = [];
      vm.playingList = [];
      vm.pausedList = [];
      vm.durationList = [];
      vm.timeRemainingList = [];
      $scope.sliderLeft = [];

      for (var i = 0; i < numSongs; i++) {
        vm.loadedList[i] = false;
        vm.playingList[i] = false;
        vm.pausedList[i] = true;
        vm.durationList[i] = 0;
        vm.timeRemainingList[i] = 0;
        $scope.sliderLeft[i] = 0;
      }

      vm.activeAudioIndex = 0;
      vm.audioList = ['dummy'];
      vm.activeAudio = vm.audioList[vm.activeAudioIndex];
      vm.loadSongs()
    }
    vm.startUp(7);
});
