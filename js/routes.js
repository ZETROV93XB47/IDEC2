var routes = [
    { path: '/', url: './index.html', },
    { path: '/about/', url: './pages/about.html', },

    { path: '/submit_idea_tab/', url: './pages/submit_idea_tab.html' },
    { path: '/submit_idea_tab/:id', url: './pages/submit_idea_tab.html' },
    { path: '/nouvelle_idee_list/', url: './pages/nouvelle_idee_list.html' },

    { path: '/my_actions_tab/', url: './pages/my_actions_tab.html' },
    { path: '/formulaire_action/', url: './pages/formulaire_action.html' },
    { path: '/formulaire_action/:action_id/:chantier_id/:projet_id', url: './pages/formulaire_action.html' },

    { path: '/innovations_tab/', url: './pages/innovations_tab.html' },
    { path: '/innovations_familles/', url: './pages/innovations_familles.html' },
    
    { path: '/projects_list/', url: './pages/projects_list.html' },
    { path: '/projects_list/:phase', url: './pages/projects_list.html' },
    { path: '/projects_list/:phase/:famille', url: './pages/projects_list.html' },
    { path: '/project/', url: './pages/project.html' },
    { path: '/project/:id', url: './pages/project.html' },

    { path: '/admin/:type', name: 'admin', url: './pages/admin.html' },
    
    { path: '/photo_edit/', url: './pages/photo_edit.html',},

    { path: '/preference/', url: './pages/preference.html',},

    { path: '/signature/', url: './pages/signature.html',},

    { path: '/database_content/', url: './pages/database_content.html',},
    { path: '/device_infos/', url: './pages/device_infos.html',},
    { path: '/settings/', url: './pages/settings.html',},
    {
      path: '/dynamic-route/blog/:blogId/post/:postId/',
      componentUrl: './pages/dynamic-route.html',
    },
    {
      path: '/request-and-load/user/:userId/',
      async: function (routeTo, routeFrom, resolve, reject) {
        // Router instance
        var router = this;

        // App instance
        var app = router.app;

        // Show Preloader
        app.preloader.show();

        // User ID from request
        var userId = routeTo.params.userId;

        // Simulate Ajax Request
        setTimeout(function () {
          // We got user data from request
          var user = {
            firstName: 'Yahya',
            lastName: 'SAMADI',
            about: 'Hello, i am creator of Framework7! Hope you like it!',
            links: [
              {
                title: 'Framework7 Website',
                url: 'http://framework7.io',
              },
              {
                title: 'Framework7 Forum',
                url: 'http://forum.framework7.io',
              },
            ]
          };
          // Hide Preloader
          app.preloader.hide();

          // Resolve route to load page
          resolve(
            {
              componentUrl: './pages/request-and-load.html',
            },
            {
              context: {
                user: user,
              }
            }
          );
        }, 1000);
      },
    },
    // Default route (404 page). MUST BE THE LAST
    {
      path: '(.*)',
      url: './pages/404.html',
    },
];
