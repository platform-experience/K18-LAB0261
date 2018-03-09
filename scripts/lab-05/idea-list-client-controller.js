function ideaListCtrl($http, $scope, glideUserSession, spUtil) {

    /* widget controller */
    var c = this;

    var votesTable = 'x_snc_idea_portal_vote';
    var votesTableAPI = '/api/now/table/' + votesTable;

    c.$onInit = function() {
        c.getIdeas('all');
    }

    // glideUserSession is an out-of-box service that's part of Service Portal
    // which can be used to get the current users details. For example, it can
    // get their Sys ID or full name.
    glideUserSession.loadCurrentUser().then(function(user) {
        c.currentUserId = user.userID;
    });

    // Keep a lookout for new votes using Record Watcher
    spUtil.recordWatch($scope, votesTable, '', function(name, data) {

        console.log('Inside Record Watcher: ' + name);

        var ideaSysId = '';
        var voteValue = name.data.record.voted.value === 'true';

        if (name.data.operation == 'update') {

            $http.get(
                votesTableAPI + '?sysparm_query=sys_id=' + name.data.sys_id,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-UserToken': window.g_ck
                    }
                }).then(function(response) {
                    ideaSysid = response.data.result[0].idea.value;
                    c.adjustVotes(ideaSysId, voteValue);
            });
        } else {
            ideaSysId = name.data.record.idea.value;
            c.adjustVotes(ideaSysId, voteValue);
        }

    });

    //Method to capture idea votes. makes a REST call
    c.vote = function(idea) {
        if (idea.openedBySysId != c.currentUserId) {
            $http.get('/api/x_snc_idea_portal/ideas/voteidea?idea=' + idea.sys_id, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-UserToken': window.g_ck
                }
            }).then(function(response) {
                idea.iVoted = !idea.iVoted;
            });
        }
    };

    //Method to adjust the vote count associated with each Idea Obj
    c.adjustVotes = function(ideaSysid, iVoted) {
        for (var index = 0; index < c.ideas.length; index++) {
            if (c.ideas[index].sys_id == ideaSysid) {
                if (iVoted)
                    ++c.ideas[index].voteCount;
                else
                    --c.ideas[index].voteCount;
            }
        }
    };

    //Method to get ideas, takes type parameter. Type defines the filter on ideas. 
	  // type can be 'my' = my ideas, 'all' = all ideas, 'myvotes' = get only ideas i have voted for
    c.getIdeas = function(type) {
        $http.get('/api/x_snc_idea_portal/ideas/getideas?type=' + type, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-UserToken': window.g_ck
            }
        }).then(function(response) {
            console.log(response);
            c.ideas = response.data.result;
            //c.ideas = getCreatedTimeAgo(response.data.result);
            console.log(c.ideas);
        });
    }

    // Using Moment.js to convert the created on date to timeago format
    function getCreatedTimeAgo(ideas) {

        for (var index = 0; index < ideas.length; index++) {

            var date = ideas[index].createdOnDate;
            ideas[index].createdOnDate = moment(date).fromNow();
        }

        return ideas;
    }


    // Event caught based on filter selected in the Idea Sidebar widget
    $scope.$on('ideaPortal.applyFilter', function(event, data) {

        console.log('Event caught type is: ' + data);
        
        c.getIdeas(data);
    });
}