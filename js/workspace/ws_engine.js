//! WS Engine

var ws_engine_class = Class.extend(
{
	current_server : undefined,
	pages : undefined,
	listeners : undefined,
	
	init : function()
	{
		var self = this;		
		var server_id = ws_storage.get_value(WS_STORAGE_KEY_CURRENT_SERVER_ID);
			
		return self.custom_init(server_id).then(function(server_id)
		{
			return server_id != undefined ? self.select_server_with_id(server_id) : Promise.resolve();
		});
	},

	custom_init : function(server_id)
	{
		return Promise.resolve(server_id);
	},
	
	get_version : function()
	{
		return '1.0.0';
	},

	is_pwa : function()
	{
		return false;
	},
		
	get_local_storage_prefix : function()
	{
		return 'ws_';
	},

	get_device_name : function()
	{
		return ws_platform.get_device_name();
	},

	get_device_uuid : function()
	{
		return ws_storage.get_device_uuid();
	},
	
	get_user_mode : function()
	{
		return ws_storage.get_user_mode();
	},
	
	set_user_mode : function(user_mode)
	{
		return ws_storage.set_user_mode(user_mode);
	},
	
	get_admin_code : function()
	{
		return ws_storage.get_admin_code();
	},
	
	get_support_code : function()
	{
		return ws_storage.get_support_code();
	},

	get_device_id : function()
	{
		return this.is_multi_servers() ? this.current_server[WS_SERVER_PROPERTY_DEVICE_ID] : ws_storage.get_device_id();
	},

	has_connection : function()
	{
		return this.is_multi_servers() ? this.current_server != undefined : ws_storage.get_token() != undefined;
	},

	has_server : function()
	{
		return this.is_multi_servers() ? this.current_server != undefined : true;
	},
	
	get_server_url : function()
	{
		return this.current_server != undefined ? this.current_server[WS_SERVER_PROPERTY_URL] : ws_storage.get_value(WS_STORAGE_KEY_SERVER_URL);
	},
	
	//! App
	
	on_ready : function()
	{
        document.addEventListener("backbutton", ws_engine.on_backKeyDown, false);
	},
	
	on_resume : function()
	{
	},

    on_backKeyDown : function()
    {
        debugger
        //homeView.router.back();
        page.view.router.back();
	},
	
	//! Multiserver
		
	is_multi_servers : function()
	{
		return false;
	},
	
	get_server_id : function()
	{
		return this.current_server != undefined ? this.current_server[WS_OBJECT_PROPERTY_ID] : undefined;
	},
	
	connect_to_server : function(url, result)
	{
		var self = this;

		if (self.is_multi_servers())
		{
			return ws_database.servers.find('url IS ?', [url]).then(function(servers)
			{
				if (servers != undefined && servers.length > 0)
				{
					return self.update_server(servers[0][WS_SERVER_PROPERTY_ID], result);
				}
				else
				{
					return self.add_server(url, result);
				}
			})
			.then(function(server)
			{
				return self.select_server(server);
			})
			.then(function(server)
			{
				ws_storage.set_device_id(result.device_id);
				ws_storage.set_user_infos(result.user);
				ws_storage.set_value(WS_STORAGE_KEY_SERVER_URL, url);
				ws_user.set_token(result.token);
				ws_storage.set_user_mode(result.user_mode);
				ws_storage.set_admin_code(result.admin_code);
				ws_storage.set_support_code(result.support_code);
				
				return result;
			});
		}
		else
		{
			ws_storage.set_device_id(result.device_id);
			ws_storage.set_user_infos(result.user);
			ws_storage.set_value(WS_STORAGE_KEY_SERVER_URL, url);
			ws_user.set_token(result.token);
			ws_storage.set_user_mode(result.user_mode);
			ws_storage.set_admin_code(result.admin_code);
			ws_storage.set_support_code(result.support_code);

			return Promise.resolve();
		}
	},
	
	add_server : function(url, result)
	{
		return ws_database.servers.add([WS_SERVER_PROPERTY_URL, WS_SERVER_PROPERTY_TOKEN, WS_SERVER_PROPERTY_DEVICE_ID], [url, result.token, result.device_id]).then(function(id)
		{
			return ws_database.servers.get_with_id(id);
		});
	},
	
	update_server : function(id, result)
	{
		return ws_database.servers.set_with_id(id, [WS_SERVER_PROPERTY_TOKEN, WS_SERVER_PROPERTY_DEVICE_ID], [result.token, result.device_id]).then(function(result)
		{
			return ws_database.servers.get_with_id(id);
		});
	},
	
	select_server_with_id : function(server_id)
	{
		var self = this;

		return ws_database.servers.get_with_id(server_id).then(function(server)
		{
			if (server != null) return self.select_server(server);
		});
	},
	
	select_server : function(server)
	{
		this.current_server = server;
				
		ws_storage.set_value(WS_STORAGE_KEY_CURRENT_SERVER_ID, server.id);

		return this.server_selected(server);
	},
	
	server_selected : function(server)
	{
		return Promise.resolve(server);
	},
	
	clear_current_server : function()
	{
		this.current_server = undefined;
	},
	
	//! User

	get_user_token: function()
	{
		return this.is_multi_servers() ? this.current_server[WS_SERVER_PROPERTY_TOKEN] : ws_user.get_token();
	},
	
	//! Reset

	reset: function()
	{
		ws_synchronizer.stop();
				
		return this.custom_reset().then(function()
		{
			return ws_database.reset();
		})
		.then(function()
		{
			return ws_storage.reset();
		});
	},

	custom_reset: function()
	{
		return Promise.resolve();
	},
	
	//! Pages
	
	register_page: function (id, page)
	{
		if (this.pages == undefined) this.pages = {};
		
		this.pages[id] = new page(id);
	},
	
	get_page: function (id)
	{
		return this.pages != undefined ? this.pages[id] : undefined;
	},
	
	//! Events
	
	add_listener: function(event, object_id, object, call)
	{
		if (this.listeners == undefined) this.listeners = [];
		
		for (var i = 0; i < this.listeners.length; i++)
		{
			var listener = this.listeners[i];
			
			if (listener.event == event && listener.object_id == object_id && listener.call == call)
			{
				this.listeners[i].count += 1;
				return;
			}
		}
		
		this.listeners.push({event: event, object_id: object_id, object: object, call: call, count: 1});
	},
	
	remove_listener: function(event, object_id, object, call)
	{
		if (this.listeners != undefined) for (var i = 0; i < this.listeners.length; i++)
		{
			var listener = this.listeners[i];
			
			if (listener.event == event && listener.object_id == object_id && listener.call == call)
			{
				this.listeners[i].count -= 1;
				
				if (this.listeners[i].count == 0)
				{
					this.listeners.slice(i, 1);
				}
				return;
			}
		}
	},
	
	broadcast_event: function(event, data)
	{
		if (this.listeners != undefined) for (var i = 0; i < this.listeners.length; i++)
		{
			var listener = this.listeners[i];
			
			if (listener.event == event)
			{
				listener.call(listener.object, data);
			}
		}
	},
	
	//! Synchronisation
	
	get_ids: function(data)
	{
		var list_ids = [];
		
		for (var i = 0; i < data.length; i++)
		{
			var ids = {};
			
			ids.id = data[i].id;
			ids.server_id = data[i].server_id;
			
			list_ids.push(ids);
		}
		
		return list_ids;
	},	
});