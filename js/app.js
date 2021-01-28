// Dom7
var $$ = Dom7;
var app_is_inited = false;
var db_is_inited = true;

var app = new Framework7(
{
	init: true,
	inited: false,
    root: '#app', // App root element
    id: 'com.addona.idec_mobile', // App bundle ID
    name: IDEC_APP_NAME, // App name
	theme: 'auto', // Automatic theme detection
	
    // App root methods
    methods:
    {
		authentification_form_out: function()
		{
			authentification(event, true);
		},

		load_connect_mode: async function()
		{
			console.trace('on est dans load_connect_mode()');
			$('.toolbar').css('display', 'block');
			debugger
			$('.content_deconnect_mode').css('display', 'none');
			$('.content_connect_mode').css('display', 'block');
			$('.synchro').css('display', 'block');
		},

		load_deconnect_mode: function()
		{
			console.trace('on est dans load_deconnect_mode()');
			return new Promise(function(resolve, reject)
			{
				$('.synchro').css('display', 'none');
				$('.toolbar').css('display', 'none');

				$('.content_deconnect_mode').css('display', 'block');
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
				
				return Promise.resolve();
            })
            .then(function()
            {
				app_is_inited = true;
            })
            .then(function()
            {
				if(init_db ){
					return ws_database.reset();
				} 
				else{
					return Promise.resolve();
				}
            })
            .then(function()
            {
				console.log(connected ? 'on est conncter' : 'pas connecter');
				if (connected) {
					debugger
					return app.methods.load_connect_mode();
				}

				else{
					debugger
					app.methods.load_deconnect_mode();
				} 
            })
            .catch(function(error)
            {
				app.methods.load_deconnect_mode();
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

async function is_connected()
{
	const count = await	ws_database.servers.count();
	return count>0;
}

// Tab views

var homeView = app.views.create('#view-home', { url: '/home/' });

// Listener
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("resume", onResume, false);

function onDeviceReady()
{
	return ws_engine.on_ready();

	nfc.addTagDiscoveredListener(function(nfcEvent) {
		nfc.connect('android.nfc.tech.IsoDep', 500).then(
			() => console.log('connected to', nfc.bytesToHexString(nfcEvent.tag.id)),
			(error) => console.log('connection failed', error)
		);
	});
}

function XonDeviceReady()
{
    app.receivedEvent('deviceready');

    // Read NDEF formatted NFC Tags
    nfc.addNdefListener (
        function (nfcEvent) {
            var tag = nfcEvent.tag,
                ndefMessage = tag.ndefMessage;

            // dump the raw json of the message
            // note: real code will need to decode
            // the payload from each record
            alert(JSON.stringify(ndefMessage));

            // assuming the first record in the message has
            // a payload that can be converted to a string.
            alert(nfc.bytesToString(ndefMessage[0].payload).substring(3));
        },
        function () { // success callback
            alert("Waiting for NDEF tag");
        },
        function (error) { // error callback
            alert("Error adding NDEF listener " + JSON.stringify(error));
        }
    );
}
	
function onResume() 
{
	ws_engine.on_resume();
}

function load_home()
{
    app_inited().then(function ()
    {
		return Promise.resolve(true);
    });
}

function waitting_autorisation()
{
	ws_server.wait_for_identification().then(async function(result)
	{
		if (typeof result == 'string') throw result;
		if (result.success)
		{
			if (result.autorisation)
			{
				app.dialog.close();

				app.dialog.preloader("Connexion au serveur...");

				await self.connect_with_device_id();

				app.dialog.close();

				ws_storage.set_value(IDEC_STORAGE_KEY_MODE_DECO, true);
			}
			else
			{
				setTimeout(function()
				{
					console.log('waitting ...');
					waitting_autorisation();
				}, 3000);
			}
		}
		else
		{
			setTimeout(function()
			{
				console.log('waitting ...');
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
	});
}

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
			return self.apply_connection_data(result, IDEC_STORAGE_KEY_MODE_CO);
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


function apply_connection_data(result, mode)
{
	var startTime;
	var elapsedTime;

	ws_storage.set_value(IDEC_STORAGE_KEY_FAMILLES, JSON.stringify(result.familles));
	startTime = new Date().getTime();
	elapsedTime = 0;
	app.dialog.close();			

	if (result == undefined) throw 'Erreur de connexion, données vides.';
	if (typeof result == 'string') throw result; //.substring(0,100)
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
			
			if (mode == IDEC_STORAGE_KEY_MODE_CO) return app.methods.load_connect_mode().then(function()
			{
				self.load_home();
				homeView.router.back();
				
				return Promise.resolve('Chargement terminé !');
			});
			else return app.methods.load_deconnect_mode().then(function()
			{
				return Promise.resolve('Chargement terminé !');
			});
		});
	}
	else
	{
		return Promise.resolve('Data undefined !');
	}
}

async function connect_with_device_id()
{
	try
	{
		let result = await ws_server.connect_with_device_id();
		debugger
		let respence = await apply_connection_data(result, IDEC_STORAGE_KEY_MODE_DECO);
			
		app.dialog.alert(respence);
	}
	catch(error)
	{
		debugger;
		
		app.dialog.close();

		if (error == " (undefined)") error = "Impossible de se connecter.";

		if (ws_defines.debug) console.log(error);
		
		app.dialog.alert(error);
	}
}

async function connect_with_url(url, token, data)
{
	try
	{
		const result = await ws_user.connect(url, token, data);

		let respence = await this.apply_connection_data(result, IDEC_STORAGE_KEY_MODE_CO);
			
		app.dialog.alert(respence);
	}
	catch(error)
	{
		debugger;
		
		app.dialog.close();

		if (error == " (undefined)") error = "Impossible de se connecter.";

		if (ws_defines.debug) console.log(error);
		
		app.dialog.alert(error);
	}
}

function authentification(event, connect_with_old_qrcode)
{
	console.log('authentification');
	debugger
	if (!connect_with_old_qrcode) connect_with_old_qrcode = false;

	var connecting = false;

	var connect = function (data)
	{
		var qrcode = JSON.parse(data);
		var startTime;
		var elapsedTime;
		
		db_is_inited = false;

		app.dialog.preloader("Connexion au serveur...");
		
		self.connect_with_url(qrcode.url, qrcode.token, qrcode.data);
		
	}

	var qrcode =  ws_storage.get_value('connection_qrcode');
	if (qrcode && connect_with_old_qrcode)
	{
		console.log('recharge');
		return connect(qrcode);
	}
	
	if (connecting) debugger;
	
	if (!connecting)
	{
		console.log('connecting : ' + connecting);
		connecting = true;

		if (app.device.desktop)
		{
			// Jeremy
			var data = '';

			ws_storage.set_value('connection_qrcode', data);
			connect(data);
			connecting = false;
		}
		else cordova.plugins.barcodeScanner.scan(function(data) 
		{
			console.log('cordova.plugins.barcodeScanner.scan start');

			if (!data.cancelled && data.format == "QR_CODE")
			{
				console.log('start/enter');
				ws_storage.set_value('connection_qrcode', data.text);
				console.log(data.text);
				
				connect(data.text);
			}
			
			connecting = false;
		},
		function (error) 
		{
			console.log('error');
			
			app.dialog.alert("Erreur de lecture du QRCode : " + error ? error : 'pas de messgae');
			
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

