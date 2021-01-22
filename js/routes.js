var routes = [
    { path: '/', url: './index.html', },
    { path: '/about/', url: './pages/about.html'},

    { path: '/home/', url: './pages/home.html', },
    
    { path: '/scanned_info/', url: './pages/scanned_info.html'},
    { path: '/scanned_info/:id', url: './pages/scanned_info.html'},
    
    { path: '/pdf/', url: './pages/pdf.html' },
    { path: '/pdf/:id', url: './pages/pdf.html'},
    { path: '/pdf/:id/:type', url: './pages/pdf.html'},
    
    { path: '/admin/:type', name: 'admin', url: './pages/admin.html' },

    { path: '/preference/', url: './pages/preference.html'},
    
    //{path: '/nfc_Authentification', url: '.pages/nfc_Authentification.html'},

    { path: '/signature/', url: './pages/signature.html'},

    { path: '/database_content/', url: './pages/database_content.html'},
    { path: '/device_infos/', url: './pages/device_infos.html'},
    { path: '/settings/', url: './pages/settings.html'},
    // Default route (404 page). MUST BE THE LAST
    {
      path: '(.*)',
      url: './pages/404.html',
    },
];
