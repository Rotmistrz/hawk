const Routes = {
    MATCH: {
        path: '/team/([0-9]+)/match/([0-9]+)',
        callback: function() {
            const currentTeamID = Hawk.Routes.get('team');

            const currentMatchID = Hawk.Routes.get('match');

            AppComponentManagers.Player.loadComponents('/get-players/team/' + currentTeamID + '/match/' + currentMatchID, function() {}, function() {
                $('.layered-box').each(function() {
                    var dropdownContainer = $(this).find('.dropdown-menu');

                    var dropdown = new Hawk.Dropdown(dropdownContainer, {
                        onShow: function(dropdown) {
                            dropdown.container.find('.icon-hamburger').addClass('open').addClass('icon-hamburger--light');
                        },
                        onHide: function(dropdown) {
                            dropdown.container.find('.icon-hamburger').removeClass('open').removeClass('icon-hamburger--light');
                        }
                    });

                    dropdown.run();

                    var current = new Hawk.LayeredBox($(this), {
                        onLoading: function(box) {
                            dropdown.hide();
                        }
                    });

                    current.run();
                });

                AppAjaxRequestsController.refreshDependencies();
            });

            const setsDropdownContainer = $('#sets-dropdown');

            if (setsDropdownContainer.length) {
                const setsDropdown = new Hawk.Dropdown(setsDropdownContainer, {
                    mode: Hawk.DropdownConstants.modes.CHOOSABLE
                });
                setsDropdown.run();
            }


        }
    },

    TEAM: {
        path: '/team/([0-9]+)',
        callback: function() {
            const currentTeamID = Hawk.Routes.get('team');

            console.log(currentTeamID);

            AppComponentManagers.Match.loadComponents('/matches/get/' + currentTeamID, function() {
                AppAjaxRequestsController.refreshDependencies();
                AppPagesManager.refreshDependencies();
            });
        }
    },

    MAIN: {
        path: '/',
        callback: function() {
            AppComponentManagers.Team.loadComponents('/teams/get', function(team) {
                const players = team.get('players');

                for (let i in players) {
                    AppComponents.Player.createFromJSON(players[i]);
                }

                AppAjaxRequestsController.refreshDependencies();
                AppPagesManager.refreshDependencies();
            });
            AppComponentManagers.EnemyTeam.loadComponents('/enemy-teams/get', function() {
                AppAjaxRequestsController.refreshDependencies();
                AppPagesManager.refreshDependencies();
            });
    
        }
    }
};