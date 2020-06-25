// Dom7
var $$ = Dom7;
var app_is_inited = false;
var db_is_inited = true;

var app = new Framework7(
{
	init: true,
	inited: false,
    root: '#app', // App root element
    id: 'com.addona.osiri_rex', // App bundle ID
    name: 'OSIRI REX', // App name
    theme: 'auto', // Automatic theme detection
	
    // App root data
    data: function ()
    {
        return {
			user: {
				firstName: 'John',
				lastName: 'Doe',
			},
			// Demo products for Catalog section
			products: [
				{
				id: '1',
				title: 'Apple iPhone 8',
				description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.'
				},
				{
				id: '2',
				title: 'Apple iPhone 8 Plus',
				description: 'Velit odit autem modi saepe ratione totam minus, aperiam, labore quia provident temporibus quasi est ut aliquid blanditiis beatae suscipit odio vel! Nostrum porro sunt sint eveniet maiores, dolorem itaque!'
				},
				{
				id: '3',
				title: 'Apple iPhone X',
				description: 'Expedita sequi perferendis quod illum pariatur aliquam, alias laboriosam! Vero blanditiis placeat, mollitia necessitatibus reprehenderit. Labore dolores amet quos, accusamus earum asperiores officiis assumenda optio architecto quia neque, quae eum.'
				},
			]
        };
    },
    // App root methods
    methods:
    {
        helloWorld: function ()
        {
        	app.dialog.alert('Hello World!');
		},

		authentification_form_out: function()
		{
			authentification();
		},

		setBarsStyle: function (barsStyle)
		{
			var self = this;
			globalBarsStyle = barsStyle;
			self.$setState({
				barsStyle: globalBarsStyle,
			});
			globalCustomProperties = self.generateStylesheet();
			stylesheet.innerHTML = globalCustomProperties;
			self.$setState({
				customProperties: globalCustomProperties,
			});
		},

		load_deconnect_mode: function()
		{
			return new Promise(function(resolve, reject)
			{
				$('.toolbar').css('display', 'block');
				$('.views').find('a[href="#view-my-actions"]').attr('href', '#');
				$('.views').find('a[href="#view-home"] span').text('Accueil');
				$('.content_deconnect_mode').css('display', 'block');

				$('.content_connect_mode').css('display', 'none');
				$('.content_every_one_mode').css('display', 'none');
				$('.synchro').css('display', 'none');
				
				return resolve();
			});
		},

		load_connect_mode: function()
		{
			return new Promise(function(resolve, reject)
			{
				$('.toolbar').css('display', 'block');
				$('.views').find('a[href="#view-my-actions"]').attr('href', '#view-my-actions');
				$('.views').find('a[href="#view-home"] span').text("Tableau de bord");
				$('.content_deconnect_mode').css('display', 'none');
				$('.content_every_one_mode').css('display', 'none');

				$('.content_connect_mode').css('display', 'block');
				$('.synchro').css('display', 'block');

				return resolve();
			});
		},

		load_every_one_mode: function()
		{
			return new Promise(function(resolve, reject)
			{
				$('.synchro').css('display', 'none');
				$('.toolbar').css('display', 'none');

				$('.content_every_one_mode').css('display', 'block');
				$('.content_deconnect_mode').css('display', 'none');
				$('.content_connect_mode').css('display', 'none');

				return resolve();
			});
		}
    },
    // App routes
    routes: routes,

    // Input settings
    input: 
    {
        scrollIntoViewOnFocus: Framework7.device.cordova && !Framework7.device.electron,
        scrollIntoViewCentered: Framework7.device.cordova && !Framework7.device.electron,
    },

    // Cordova Statusbar settings
    statusbar:
    {
        iosOverlaysWebView: true,
        androidOverlaysWebView: false,
	},
	
    on :
    {
        init: function ()
        {
            var init_db = false;
            var connected = false;

			console.log("app/on init");
			
            // app.methods.setBarsStyle('fill');
            ws_filesystem.open().then(function()
            {
            	return ws_database.open();
            })
            .then(function()
            {
            	return ws_engine.init();
            })
            .then(function()
            {
            	return is_connected();
            })
            .then(function(result)
            {
				connected = result;
				
				// return connected ? ws_server.update_params() : Promise.resolve();
				return Promise.resolve();
            })
            .then(function()
            {
            	app_is_inited = true;
            })
            .then(function()
            {
            	return init_db ? ws_database.reset() : Promise.resolve();
            })
            .then(function()
            {
				//ws_synchronizer.synchro_db_with_server();
				// return connected ? Promise.resolve() : app.popup.open('#popup_connection', true);
				
				// return connected ? app.methods.load_connect_mode() : app.methods.load_deconnect_mode();
				
				return  connected ? app.methods.load_connect_mode() : ( (ws_storage.get_value(OSIRI_STORAGE_KEY_MODE_DECO) == "true") ? app.methods.load_deconnect_mode() : app.methods.load_every_one_mode());
            })
            .catch(function(error)
            {
				app.methods.load_every_one_mode()
				if (ws_defines.debug) console.log(error);
				app.dialog.alert(error);
            });
        }
    }
});

function app_inited()
{
	return new Promise(function(resolve, reject)
	{
		if (app_is_inited)
		{
			resolve();
		}
		else setTimeout(function()
		{
			app_inited().then(function()
			{
				resolve();
			});
		}, 2000);
	});
}

function is_connected()
{
	return new Promise(function(resolve, reject)
	{
		ws_database.servers.count().then(function(count)
		{
			resolve(count > 0);
		});
	});
}

// Tab views
var homeView = app.views.create('#view-home', { url: '/' });
var submitIdeaView = app.views.create('#view-submit-idea', { url: '/submit_idea_tab/' });
var myActionsView = app.views.create('#view-my-actions', { url: '/my_actions_tab/' });
var innovationsView = app.views.create('#view-innovations', { url: '/innovations_tab/' });

document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("resume", onResume, false);

function onDeviceReady()
{
	ws_engine.on_ready();
}
	
function onResume() 
{
	ws_engine.on_resume();
}

function load_home()
{
	var self = this;
	var data = [];
	
    app_inited().then(function ()
    {
		var rex_action_template = $$('#osiri_rex_action_template').html();
		var revu_template = $$('#osiri_revu_template').html();
		
		var mes_projets_template = $$('#osiri_mes_projets_template').html();
		var mes_actions_template = $$('#osiri_mes_actions_template').html();
		var phase_change_template = $$('#osiri_phase_change_template').html();
		var last_event_template = $$('#osiri_last_event_template').html();
		
		// osiri_rexs.get_template_data().then(function(rex_actions_data)
		// {
		// 	data.rex_actions = rex_actions_data;
		// 	// $('#osiri_rex_todo').text(rex_actions_data.length + " REX à réaliser");

		// 	if (typeof rex_action_template == 'string') var rex_action_compiled_template = Template7.compile(rex_action_template);
		// 	$$('#osiri_rex_actions_content').html(rex_action_compiled_template(data));

		// 	return osiri_actions.get_revu_template_data();
		// })
		// .then(function(revus_data)
		// {
		// 	data.revus = revus_data;
		// 	// $('#osiri_revu_todo').text(revus_data.length + " revue à organiser");

		// 	if (typeof revu_template == 'string') var revu_compiled_template = Template7.compile(revu_template);
		// 	$$('#osiri_revu_content').html(revu_compiled_template(data));

		// 	return osiri_projects.get_phase_change_template_data();
		// })
		osiri_projects.get_mes_projets_template_data().then(function(mes_projets_data)
		{
			data.mes_projets = mes_projets_data;
			// $('#osiri_rex_todo').text(rex_actions_data.length + " REX à réaliser");

			if (typeof mes_projets_template == 'string') var mes_projets_compiled_template = Template7.compile(mes_projets_template);
			$$('#osiri_mes_projets_content').html(mes_projets_compiled_template(data));

			return osiri_actions.get_revu_template_data();
		})
		.then(function(mes_actions_data)
		{
			data.mes_actions = mes_actions_data;
			// $('#osiri_revu_todo').text(revus_data.length + " revue à organiser");

			if (typeof mes_actions_template == 'string') var mes_actions_compiled_template = Template7.compile(mes_actions_template);
			$$('#osiri_mes_actions_content').html(mes_actions_compiled_template(data));

			return osiri_projects.get_phase_change_template_data();
		})
		.then(function(phase_change_data)
		{
			data.phase_changes = phase_change_data;
			// $('#osiri_phase_change_todo').text(phase_change_data.length + " changement de phase");

			if (typeof phase_change_template == 'string') var phase_change_compiled_template = Template7.compile(phase_change_template);
			$$('#osiri_phase_change_content').html(phase_change_compiled_template(data));

			return osiri_projects.get_last_event_template_data();
		})
		.then(function(last_event_data)
		{
			data.last_events = last_event_data;
			// $('#osiri_last_event_todo').text(last_event_data.length + " dernier événement");

			if (typeof last_event_template == 'string') var last_event_compiled_template = Template7.compile(last_event_template);
			$$('#osiri_last_event_content').html(last_event_compiled_template(data));
		})
    });
}

function waitting_autorisation ()
{
	ws_server.wait_for_identification().then(function(result)
	{
		if (typeof result == 'string') throw result;
		if (result.success)
		{
			if (result.autorisation)
			{
				app.dialog.close();
				app.methods.load_deconnect_mode();
				
				ws_storage.set_value(OSIRI_STORAGE_KEY_MODE_DECO, true);
			}
			else
			{
				waitting_autorisation();
				console.log('waitting ...');
			}
		}
		else
		{
			waitting_autorisation();
		}
	})
	.catch(function()
	{
		app.dialog.close();
		if (ws_defines.debug)
		{
			ws_tools.toast('erreur');
			console.log(error);
		}
	});
}

$$('.aaa').on('click', function ()
{
	var href = $(this).attr('href');
	$(".toolbar-inner").removeClass('tab-link-active');
	$(".toolbar-inner").find("a[href='"+ href +"']").addClass('tab-link-active');
	if(href == "#view-submit-idea") $(".tab-link-highlight").css('transform', 'translate3d(100%, 0px, 0px)');
	if(href == "#view-innovations") $(".tab-link-highlight").css('transform', 'translate3d(300%, 0px, 0px)');
});

$$('#send_mail').on('click', function ()
{
	var email = $("#verify_mail").val();

	if (email) ws_server.send_identification_email(email).then(function(result)
	{
		if (typeof result == 'string') throw result;
		if (result.success)
		{
			ws_tools.toast('vous allez recevoir un email avec un lien, merci de cliquer dessus', undefined, 5000);
			app.dialog.preloader("Chargement en cours...");

			setTimeout(function()
			{
				waitting_autorisation();
			}, 3000);
		}
	})
	.catch(function(error)
	{
		
		app.dialog.close();
		if (ws_defines.debug)
		{
			ws_tools.toast('erreur');
			console.log(error);
		}
	})
	else app.dialog.alert('Veuillez vous saissir votre mail !'); 
});

$$('#ws_app_admin_acces').on('click', function ()
{
	var mode = ws_engine.get_user_mode();
	
	if (mode == WS_USER_MODE_USER)
	{
		app.dialog.password("Entrez votre code d'accés", function (password) 
		{
			if (password == ws_engine.get_admin_code())
			{
				ws_engine.set_user_mode(WS_USER_MODE_ADMINISTRATOR);
				homeView.router.navigate("/admin/" + WS_USER_MODE_ADMINISTRATOR);
			}
			else if (password == ws_engine.get_support_code())
			{
				ws_engine.set_user_mode(WS_USER_MODE_ASSISTANCE);
				homeView.router.navigate("/admin/" + WS_USER_MODE_ASSISTANCE);
			}
			else
			{
				app.dialog.alert('Code incorrecte'); 
			}
		});
	}
	else
	{
		homeView.router.navigate("/admin/" + (mode == WS_USER_MODE_ADMINISTRATOR ? WS_USER_MODE_ADMINISTRATOR : WS_USER_MODE_ASSISTANCE));
	}
});

$$('#popup_connection').on('popup:open', function (e, popup)
{
	$('#connection_qrcode, #connection_btn').off('click', authentification);
	$('#connection_qrcode, #connection_btn').on('click', authentification);

	$$('#connection_login_form').submit(function (e)
	{
		var form = $(this);
		
		e.preventDefault();

		form_submit($(this), event).then(function(data)
		{
			app.dialog.preloader("Chargement en cours...");
			
			return ws_user.login(ws_defines.SERVER_API_URL, data.username, data.password)
		})
		.then(function(result)
		{
			return self.apply_connection_data(result);
		})
		.then(function(result)
		{
			app.dialog.alert(result);
		})
		.catch(function(error)
		{
			app.dialog.close();
			
			app.dialog.alert(error);
		});
	});
	
	$$('#connection_cancel').click(function (e)
	{
		app.popup.close('#popup_connection', true);
	});
});


function apply_connection_data(result)
{
	var startTime;
	var elapsedTime;

	ws_storage.set_value(OSIRI_STORAGE_KEY_FAMILLES, JSON.stringify(result.familles));
	startTime = new Date().getTime();
	elapsedTime = 0;
	app.dialog.close();			

	if (result == undefined) throw 'Erreur de connexion, données vides.';
	if (typeof result == 'string') throw result.substring(0,100);
	if (result.success == false) throw result.error;

	
	app.dialog.preloader("Synchronisation en cours...");

	ws_synchronizer.stop();
	
	if (result.data != undefined)
	{
		return ws_synchronizer.import_all_data(ws_engine.get_server_id(), result.data).then(function()
		{
			elapsedTime = new Date().getTime() - startTime;
			console.log("Temps de chargement : " + elapsedTime + " ms");
			
			db_is_inited = true;
			
			app.dialog.close();
			app.popup.close('#popup_connection', true);

			return app.methods.load_connect_mode().then(function()
			{
				self.load_home();
				homeView.router.back();
				
				return Promise.resolve('Chargement terminer !');
			});
		});
	}
	else
	{
		return Promise.resolve('Data undefined !');
	}
}

function authentification()
{
	var connecting = false;
	var connect = function (data)
	{
		var qrcode = JSON.parse(data);
		var startTime;
		var elapsedTime;
		
		db_is_inited = false;

		app.dialog.preloader("Connexion au serveur...");
		
		ws_user.connect(qrcode.url, qrcode.token, qrcode.data).then(function(result)
		{
			debugger;
			return self.apply_connection_data(result);
		})
		.then(function(result)
		{
			app.dialog.alert(result);
		})
		.catch(function(error)
		{
			debugger;
			
			app.dialog.close();

			if (error == " (undefined)") error = "Impossible de se connecter.";

			if (ws_defines.debug) console.log(error);
			
			app.dialog.alert(error);
		});
	}

	var qrcode =  ws_storage.get_value('connection_qrcode');
	if (qrcode) return connect(qrcode);
	
	if (connecting) debugger;
	
	if (!connecting)
	{
		console.log('connecting : ' + connecting);
		connecting = true;

		if (app.device.desktop)
		{
			var data = '{"url":"https:\/\/osiri2-dev.workspace-solution.com\/api\/osiri_mobile_app","token":"ZnJhbWV3b3JrLmNvbnRhY3RzPCohPT8+MTwqIT0\/PjA8KiE9Pz41Nzc2NmEzNGQyNTgyNy4wMDk3NTI5NTwqIT0\/PiQyeSQxMCRpclVnWXVCMDJMRXJibmRQWFd6LzllUDRKVzkyLndPMWJBa3BBRXkyTEFkNzZ6TUZLaWl0Mg=="}';
			
			ws_storage.set_value('connection_qrcode', data);
			connect(data);
			connecting = false;
		}
		else cordova.plugins.barcodeScanner.scan(function(data) 
		{
			if (!data.cancelled && data.format == "QR_CODE")
			{
				ws_storage.set_value('connection_qrcode', data.text);
				console.log(data.text);
				
				connect(data.text);
			}
			
			connecting = false;
		},
		function (error) 
		{
			if (error) alert("Erreur de lecture du QRCode : " + error);
			
			connecting = false;
		});
	};
}

$$(document).on('page:init', function(e)
{
    console.log('Page init : ' + e.detail.name);

	var page = e.detail;
	
	$(page.el).find("script[ws_script='page']").each(function()
	{
		var html = $(this).html();
		eval(html);
	});
	
	var p = ws_engine.get_page(page.name);
	
	if (p) p.init(page, e, page.route.params);

	
	switch (page.name)
	{
		case 'home' :
		{
			load_home();
			
			$$('#menu_disconnect').on('click', function () 
			{				
				app.dialog.confirm("Voulez-vous vraiment vous déconnecter ?", "Déconnexion", function ()
				{
					ws_user.logout().then(function()
					{
						app.methods.load_every_one_mode()
						app.panel.close();
						app.popup.open('#popup_connection', true)
					});
				});
			});
		
			$(".synchro").on('click', function () 
			{
				app.dialog.preloader("Synchronisation en cours...");
				
				return ws_synchronizer.synchro_db_with_server().then(function(success)
				{
					debugger;
					if (success)
					{
						app.dialog.close();
						app.dialog.alert("Synchronisation terminée !");
						load_home();
					}
				})
				.catch(function(error)
				{
					app.dialog.close();
					if (ws_defines.debug) app.dialog.alert(error);
					console.error(error);
				});
			});
			break;
		}
	}
});

$$(document).on('page:reinit', function(e)
{
	console.log('Page reinit : ' + e.detail.name);
			
	var page = e.detail;
	var p = ws_engine.get_page(page.name);	

	if (p) p.reinit(page, e, page.route.params);
});

$$(document).on('page:beforein', function(e)
{
	console.log('Page beforein : ' + e.detail.name);
			
	var page = e.detail;
	var p = ws_engine.get_page(page.name);	

	if (p) p.beforein(page, e, page.route.params);
});

$$(document).on('page:afterin', function(e)
{
	console.log('Page afterin : ' + e.detail.name);
			
	var page = e.detail;
	var p = ws_engine.get_page(page.name);	

	if (p) p.afterin(page, e, page.route.params);
});

$$(document).on('page:beforeout', function(e)
{
	console.log('Page beforeout : ' + e.detail.name);
			
	var page = e.detail;
	var p = ws_engine.get_page(page.name);	

	if (p) p.beforeout(page, e, page.route.params);
});

$$(document).on('page:afterout', function(e)
{
	console.log('Page afterout : ' + e.detail.name);
			
	var page = e.detail;
	var p = ws_engine.get_page(page.name);	

	if (p) p.afterout(page, e, page.route.params);
});

$$(document).on('tab:show', function(e)
{
	console.log('Tab show : ' + e.target.id);
			
	var view = $$("#" + e.target.id);
	var name = view.find(".page.page-current").attr("data-name");
	var p = ws_engine.get_page(name);	
	
	if (p) p.tabshow($$('.page[data-name="'+name+'"]')[0].f7Page, e);
});

// Login Screen Demo
$$('#my-login-screen .login-button').on('click', function ()
{
    var username = $$('#my-login-screen [name="username"]').val();
    var password = $$('#my-login-screen [name="password"]').val();

    // Close login screen
    app.loginScreen.close('#my-login-screen');

    // Alert username and password
    app.dialog.alert('Username: ' + username + '<br>Password: ' + password);
});

