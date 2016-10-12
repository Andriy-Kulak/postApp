'use strict';

angular.module('postApp', ['postMethods', 'ngComponentRouter', 'ngMaterial', 'ngMessages'])
.value('$routerRootComponent', 'list')
.component('list', {
    templateUrl: 'postList.html',
    controller: postsController,
    controllerAs: '$ctrl',
    bindToController: true,
    bindings: {
      postUserList: '<'
    },

}
);

function postsController(postService, $mdDialog){
  var vm = this;
  vm.posts = []; // post data
  vm.users = []; // user data
  vm.postsUserList = []; // post & user data to be displayed in UI
  vm.getPosts = function() {
  postService.getPostsList()
  .then(function (result) {
      vm.posts = result.data;
      // below will load post data to ui while user data is
      // being retrieved
      vm.postsUserList = result.data;
      
      postService.getUsersList()
      .then(function (result) {
        vm.users = result.data;
        vm.postsUserList = postService.combineUserPostData(vm.users, vm.posts);
    }, function (error) {
        console.log(error);
    });
  }, function (error) {
      console.log(error);
  });
  }
  vm.getPosts();
  
  vm.trigerModal = function(ev){
    return postService.showPrompt(ev);
  }
  
  vm.watchCount = getWatchCount();
}

function DialogController(postService, $scope, $mdDialog) {
  var vm = this;

  vm.submitForm = function(data){
    console.log("Dialog Controller",data);
     postService.submitPost(data).then(function (result) {
        console.log("Successful Submit");
      }, function (error) {
        console.log(error);
      }
      );
    $mdDialog.hide();
  }
  
   vm.cancel = function() {
      $mdDialog.cancel();
    };

}



// I return the count of watchers on the current page.
function getWatchCount() {

	// Keep track of the total number of watch bindings on the page.
	var total = 0;

	// There are cases in which two different ng-scope markers will actually be referencing
	// the same scope, such as with transclusion into an existing scope (ie, cloning a node
	// and then linking it with an existing scope, not a new one). As such, we need to make
	// sure that we don't double-count scopes.
	var scopeIds = {};

	// AngularJS denotes new scopes in the HTML markup by appending the classes "ng-scope"
	// and "ng-isolate-scope" to appropriate elements. As such, rather than attempting to 
	// navigate the hierarchical Scope tree, we can simply query the DOM for the individual
	// scopes. Then, we can pluck the watcher-count from each scope.
	// --
	// NOTE: Ordinarily, it would be a HUGE SIN for an AngularJS service to access the DOM 
	// (Document Object Model). But, in this case, we're not really building a true AngularJS 
	// service, so we can break the rules a bit.
	angular.forEach( 
		document.querySelectorAll( ".ng-scope , .ng-isolate-scope" ), 
		countWatchersInNode
	);

	return( total );



	// I count the $watchers in to the scopes (regular and isolate) associated with the given
	// element node, and add the count to the running total.
function countWatchersInNode( node ) {

		// Get the current, wrapped element.
		var element = angular.element( node );

		// It seems that in earlier versions of AngularJS, the separation between the regular
		// scope and the isolate scope where not as strong. The element was flagged as having
		// an isolate scope (using the ng-isolate-scope class); but, there was no .isolateScope()
		// method before AngularJS 1.2. As such, in earlier versions of AngularJS, we have to 
		// fall back to using the .scope() method for both regular and isolate scopes.
		if ( element.hasClass( "ng-isolate-scope" ) && element.isolateScope ) {

			countWatchersInScope( element.isolateScope() );

		}

		// This class denotes a non-isolate scope in later versions of AngularJS; but, 
		// possibly an isolate-scope in earlier versions of AngularJS (1.0.8).
		if ( element.hasClass( "ng-scope" ) ) {

			countWatchersInScope( element.scope() );

		}

	}


	// I count the $$watchers in the given scope and add the count to the running total.
	function countWatchersInScope( scope ) {

		// Make sure we're not double-counting this scope.
		if ( scopeIds.hasOwnProperty( scope.$id ) ) {
			
			return;

		}

		scopeIds[ scope.$id ] = true;

		// The $$watchers value starts out as NULL until the first watcher is bound. As such,
		// the $$watchers collection may not exist yet on this scope.
		if ( scope.$$watchers ) {

			total += scope.$$watchers.length;

		}

	}

}

