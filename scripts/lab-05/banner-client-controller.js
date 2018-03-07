function ideaListCtrl($http, $scope, glideUserSession, spUtil) {
    /* widget controller */
    var c = this;

    c.$onInit = function() {
        c.getIdeas('all');
    }

    //glideUserSession provider OOTB used to get current users details for ex: sys_id, fullname
    glideUserSession.loadCurrentUser().then(function(user) {
        c.currentUsedID = user.userID;
    });

    //Record watcher to keep lookout for votes
    spUtil.recordWatch($scope, "x_snc_idea_portal_idea_votes", "", function(name, data) {
        console.log('Inside record watcher ' + name);
        var ideaSysid = '';
        var voteValue = name.data.record.voted.value === 'true';
        if (name.data.operation == 'update') {
            $http.get('/api/now/table/x_snc_idea_portal_idea_votes?sysparm_query=sys_id=' + name.data.sys_id, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-UserToken': window.g_ck
                }
            }).then(function(response) {
                ideaSysid = response.data.result[0].idea.value;
                c.adjustVotes(ideaSysid, voteValue);
            });
        } else {
            ideaSysid = name.data.record.idea.value;
            c.adjustVotes(ideaSysid, voteValue);
        }

    });

    //Method to capture idea votes. makes a REST call
    c.vote = function(idea) {
        if (idea.openedBySysid != c.currentUsedID) {
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

    //Method to get ideas, takes type parameter. Type defines the filter on ideas. type can be 'my' = my ideas, 'all' = all ideas, 'myvotes' = get only ideas i have voted for
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

    //Using moment js that comes OOTB in Service portal to convert date time to user friendly time ago
    function getCreatedTimeAgo(ideas) {
        for (var index = 0; index < ideas.length; index++) {
            ideas[index].createdOnDate = moment(ideas[index].createdOnDate).fromNow();
        }
        return ideas;
    }


    //Event caught based on filter selected in sidebar
    $scope.$on('filterClicked', function(event, data) {
        console.log('event caught type is ' + data);
        c.getIdeas(data);
    });
}