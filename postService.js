'use strict';

angular.module('postMethods', [])
.constant('_', window._)
.service('postService', postService);

function postService($http, _, $mdDialog) {
  var vm = this;
  
  vm.getPostsList = function() {
    return $http.get('https://jsonplaceholder.typicode.com/posts');
  }
  
  vm.submitPost = function(data) {
    console.log(data);
    return $http.post('https://jsonplaceholder.typicode.com/posts', data);
  }
  
  vm.getUsersList = function() {
    return $http.get('https://jsonplaceholder.typicode.com/users');
  }
  
  // method for combining user and post data into one array
  vm.combineUserPostData = function(usersArray, postsArray){
    var newUserArray = _.keyBy(usersArray, 'id');
    var newUserPostsArray = _.forEach(postsArray, function(value, key){
      value.userName = newUserArray[value.userId].name;
      value.userEmail = newUserArray[value.userId].email;
    })
    return newUserPostsArray;
  }
  
  vm.showPrompt = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    $mdDialog.show({
      controller: DialogController,
      controllerAs: '$ctrl',
      templateUrl: 'submitPostDialog.html',
      parent: angular.element(document.body),
      targetEvent: ev
    })
  }
}
