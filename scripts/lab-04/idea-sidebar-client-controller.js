function ideaSidebarCtrl($location, $scope, $rootScope, $window) {
    /* widget controller */
    var c = this;

    c.$onInit = function() {
        c.selectedFilter = 'all';
    }

    //Submit an idea button to take users to a new page with record producer
    c.submitIdea = function() {
        // $location.search({
        //     id: 'idea_create',
        //     sys_id: 'df823500dba30f0094407f6bbf961917'
        // });
        $window.location.href = "/ideas?id=idea_create&sys_id=df823500dba30f0094407f6bbf961917";
    };

    //Broadcast event based on filter links. This event is caught in Idea List widget
    c.filterClicked = function(type) {
        console.log('broadcast fired and type is ' + type);
        c.selectedFilter = type;
        $rootScope.$broadcast('filterClicked', type);
    }

}