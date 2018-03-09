function IdeaSidebarCtrl($location, $scope, $rootScope, $window) {

    /* widget controller */
    var c = this;

    c.$onInit = function() {
        c.selectedFilter = 'all';
    };

    // Will be called by the "Submit an Idea" button to take users
    // to the page that shows the submit idea record producer.
    c.submitIdea = function() {

        var PageName = 'idea_create';
        var RpId = 'df823500dba30f0094407f6bbf961917';

        // $location.search({
        //     id: ideaPage,
        //     sys_id: ideaRpId
        // });
        
        $window.location.href = '/ideas?id=' + PageName + '&sys_id=' + RpId;
    };

    // Will be called by the filter links in the sidebar. It will broadcast
    // an event which will be caught in the Idea List widget.
    c.applyFilter = function(type) {
        c.selectedFilter = type;
        $rootScope.$broadcast('ideaPortal.applyFilter', type);
        console.log('broadcast fired and type is ' + type);
    };

}