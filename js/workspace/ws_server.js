//! ws_server

var ws_server_class = Class.extend(
{
	last_connection : undefined,
	last_connection_time : undefined,
		
	get_data : function(data)
	{
		if (data == undefined) data = {};
		
		data.debug = ws_defines.debug;
		data.dev = ws_defines.DEV_MODE;
		data.test = ws_defines.TEST_MODE;
		data.app_id = ws_defines.get_app_id();
		data.app_version = ws_defines.get_app_version();
		data.app_name = ws_defines.get_app_name();
		data.device_name = ws_engine.get_device_name();
		data.device_uuid = ws_engine.get_device_uuid();
		data.version = ws_engine.get_version();
		
		if (ws_defines.debug) console.log(JSON.stringify(data));

		return data;
	},

	get_form_data : function(form_data)
	{
		form_data.append("debug", ws_defines.debug);
		form_data.append("dev", ws_defines.DEV_MODE);
		form_data.append("test", ws_defines.TEST_MODE);
		form_data.append("app_id", ws_defines.get_app_id());
		form_data.append("app_version", ws_defines.get_app_version());
		form_data.append("app_name", ws_defines.get_app_name());
		form_data.append("device_name", ws_engine.get_device_name());
		form_data.append("device_uuid", ws_engine.get_device_uuid());
		form_data.append("version", ws_engine.get_version());

		return form_data;
	},

	api : function(call, data, server_url) 
	{
		var self = this;
		
		if (ws_defines.debug) console.log(data);

		return new Promise(function(resolve, reject)
		{			
			if (server_url == undefined) server_url = ws_defines.SERVER_API_URL;
			
			if (ws_defines.debug) console.log("server : call " + call);
			if (ws_defines.debug) console.log("URL : " + server_url + "/" + call + "?key=" + ws_defines.API_KEY);
			
			$.post(
			{
			    url: server_url + "/" + call + "?key=" + ws_defines.API_KEY,
			    data: JSON.stringify(self.get_data(data)), 
				async: true,
				
				success: function(result)
				{
					if (ws_defines.debug) console.log("server : call success");
					
					self.last_connection = true;
					self.last_connection_time = Date.now();
						
					try
					{
						resolve(result);
					}
					catch(error)
					{
						if (ws_defines.debug) console.log(JSON.stringify(result));
						if (ws_defines.debug) console.log("JSON parse error : ", error);
						
						debugger;
						reject(error.message);
					}
				}	
			})
		    .fail(function(xhr, status, error)
		    {
				if (ws_defines.debug) console.log("server : fail status = " + status);
				if (ws_defines.debug) console.log("server : fail error = " + error);
				if (ws_defines.debug) console.log("server : xhr = ", JSON.stringify(xhr));
			
				self.last_connection = false;

				reject(error + " (" + xhr.responseText + ")");
			});			
		});
	},
	
	upload : function(call, data) 
	{
		var self = this;
		
		if (ws_defines.debug) console.log(data);

		return new Promise(function(resolve, reject)
		{
			if (ws_defines.debug) console.log("server : call " + call);

			$.post(
			{
			    url: ws_defines.SERVER_API_URL + "/" + call + "?key=" + ws_defines.API_KEY,
			    data: self.get_data(data), 
				contentType : false,
				processData : false,
				async: true,
				
				success: function(result)
				{
					if (ws_defines.debug) console.log("server : call success");
					
					try
					{
						resolve(result);
					}
					catch(error)
					{
						if (ws_defines.debug) console.log(result);
						if (ws_defines.debug) console.log("JSON parse error : ", error);
						
						reject(error.message);
					}
				}	
			})
		    .fail(function(xhr, status, error)
		    {
				if (ws_defines.debug) console.log("server : call error : " + error);
				
				reject(error + " (" + xhr.responseText + ")");
			});			
		});
	},
/*
	upload : function(call, data, server_url) 
	{
		var self = this;
		
		if (ws_defines.debug) console.log(data);
		for (var key of data.entries()) {
	        console.log(key[0] + ', ' + key[1]);
	    }
		return new Promise(function(resolve, reject)
		{
			if (server_url == undefined) server_url = ws_defines.SERVER_API_URL;
			
			if (ws_defines.debug) console.log("server : call " + call);

			$.post(
			{
			    url: server_url + "/" + call + "?key=" + ws_defines.API_KEY,
			    data: self.get_form_data(data), 
				contentType : false,
				processData : false,
				async: true,
				
				success: function(result)
				{
					if (ws_defines.debug) console.log("server : call success");
					
					try
					{
						resolve(JSON.parse(result));
					}
					catch(error)
					{
						if (ws_defines.debug) console.log(result);
						if (ws_defines.debug) console.log("JSON parse error : ", error);
						
						reject(error.message);
					}
				}	
			})
		    .fail(function(xhr, status, error)
		    {
				if (ws_defines.debug) console.log("server : call error : " + error);
				
				reject(error + " (" + xhr.responseText + ")");
			});			
		});
	},
*/
	
	download : function(call, data, server_url)
	{
		var self = this;

		return new Promise(function(resolve, reject)
		{
			if (server_url == undefined) server_url = ws_defines.SERVER_API_URL;
			if (ws_defines.debug) console.log("server : download call " + call);
			
			var data = self.get_data(data);
            debugger
			$.get(server_url + "/" + call + "?key=" + ws_defines.API_KEY, data).done(function(data)
			{
			    if (ws_defines.debug) console.log("server : call success");
				
				resolve(data);
			})
			 .fail(function(xhr, status, error)
		    {
				if (ws_defines.debug) console.log("server : call error : " + error);
				
				reject(error + " (" + xhr.responseText + ")");
			});
			/*
			$.get(server_url + "/" + call + "?key=" + ws_defines.API_KEY, data, function(result)
			{
				if (ws_defines.debug) console.log("server : call success");
				
				resolve(result);		
			})
		    .fail(function(xhr, status, error)
		    {
				if (ws_defines.debug) console.log("server : call error : " + error);
				
				reject(error + " (" + xhr.responseText + ")");
			});	
*/	
		});
	},
/*
	download : function(url)
	{
		var self = this;

		return new Promise(function(resolve, reject)
		{
			if (ws_defines.debug) console.log("server : download call " + url);
			
			$.get(url, function(result)
			{
				if (ws_defines.debug) console.log("server : call success");
				resolve(result);
			})
		    .fail(function(xhr, status, error)
		    {
				if (ws_defines.debug) console.log("server : call error : " + error);
				
				reject(error + " (" + xhr.responseText + ")");
			});
		});
	},
*/
	get : function(url, data) 
	{
		var self = this;
		
		if (ws_defines.debug) console.log(data);

		return new Promise(function(resolve, reject)
		{			
			if (ws_defines.debug) console.log("Get url : " + url);
			
			$.get(
			{
			    url: url,
			    data: JSON.stringify(self.get_data(data)), 
				async: true,
				
				success: function(result)
				{
					if (ws_defines.debug) console.log("server : call success");
						
					try
					{
						resolve(result);
					}
					catch(error)
					{
						if (ws_defines.debug) console.log(JSON.stringify(result));
						if (ws_defines.debug) console.log("JSON parse error : ", error);
						
						debugger;
						reject(error.message);
					}
				}	
			})
		    .fail(function(xhr, status, error)
		    {
				if (ws_defines.debug) console.log("server : fail status = " + status);
				if (ws_defines.debug) console.log("server : fail error = " + error);
				if (ws_defines.debug) console.log("server : xhr = ", JSON.stringify(xhr));

				reject(error + " (" + xhr.responseText + ")");
			});			
		});
	},

	post : function(url, data) 
	{
		var self = this;
		
		if (ws_defines.debug) console.log(data);

		return new Promise(function(resolve, reject)
		{			
			if (ws_defines.debug) console.log("Get url : " + url);
			
			$.post(
			{
			    url: url,
			    data: JSON.stringify(self.get_data(data)), 
				async: true,
				
				success: function(result)
				{
					if (ws_defines.debug) console.log("server : call success");
						
					try
					{
						resolve(result);
					}
					catch(error)
					{
						if (ws_defines.debug) console.log(JSON.stringify(result));
						if (ws_defines.debug) console.log("JSON parse error : ", error);
						
						debugger;
						reject(error.message);
					}
				}	
			})
		    .fail(function(xhr, status, error)
		    {
				if (ws_defines.debug) console.log("server : fail status = " + status);
				if (ws_defines.debug) console.log("server : fail error = " + error);
				if (ws_defines.debug) console.log("server : xhr = ", JSON.stringify(xhr));

				reject(error + " (" + xhr.responseText + ")");
			});			
		});
	},
	
	test : function(url)
	{
		return this.api('connection_test', {}, url);
	},

	update_params : function()
	{
		var self = this;
		
		return new Promise(function(resolve, reject)
		{
			self.api('params').then(function(params)
			{
				if (params.defines != undefined)
				{
					Object.assign(ws_defines, params.defines);			
				}
							
				resolve(params);	
			})
			.catch(function(error)
			{
				if (ws_defines.debug) console.log(error);
				reject(error);
			});
		});
	},
	
	connect : function(url, token, data)
	{
		var device = {};
		
		device[WS_DEVICE_INFO_TYPE] = ws_platform.get_device_type();
		device[WS_DEVICE_INFO_CATEGORY] = ws_platform.get_device_category();
		device[WS_DEVICE_INFO_SYSTEM] = ws_platform.get_system();
		device[WS_DEVICE_INFO_BROWSER] = ws_platform.get_browser();

		return this.api('connect', { code: token, data: data, device: device }, url);
	},
	
	login : function(url, login, password)
	{
		var device = {};
		
		device[WS_DEVICE_INFO_TYPE] = ws_platform.get_device_type();
		device[WS_DEVICE_INFO_CATEGORY] = ws_platform.get_device_category();
		device[WS_DEVICE_INFO_SYSTEM] = ws_platform.get_system();
		device[WS_DEVICE_INFO_BROWSER] = ws_platform.get_browser();

		return this.api('login', { login: login, password: password, device: device }, url);		
	},
	
	change_password : function(token, password)
	{
		var self = this;
		
		return new Promise(function(resolve, reject)
		{
			self.api('password', { token: token, password: password }).then(function(result)
			{
				if (result.success)
				{
					resolve(result);	
				}
				else
				{
					reject(result.error);
				}
			})
			.catch(function(error)
			{
				if (ws_defines.debug) console.log(error);
				reject(error);
			});
		});
	},
	
	get_connection_state : function()
	{
		if (this.last_connection && this.last_connection_time < Date.now() - 10000)
		{
			this.last_connection = false;
			
			return WS_SERVER_CONNECTION_STATE_BAD_CONNECTION;
		}
		
		return this.last_connection ? WS_SERVER_CONNECTION_STATE_GOOD_CONNECTION : WS_SERVER_CONNECTION_STATE_NO_CONNECTION;
	},
	
	synchro : function(token)
	{
		return self.api('synchro', { token: token });
	},
	
	//! Files
	
	has_file: function(server_id)
	{
		ws_database.files.get('server_id = ?', [server_id]).then(function(result)
		{
			return result.status;
		});
	},
	
	get_file: function(server_id, local_id, entitiy, linked_to, type)
	{
		var entitie_infos = ws_datamodel.get_entity_infos(entitiy);
		
		if (server_id) 
		{
			return ws_server.prepare_download(server_id);
		}
		else if (local_id)
		{
			entitie_infos.db.get_server_id(local_id).then(function(result)
			{
				server_id = result.id;
				return ws_server.prepare_download(server_id);
			});
		}
		else if (linked_to.length > 0)
		{
			// !!!!! a traiter
			entitie_infos.db.find_linked_to(linked_to.property, linked_to.value,'type = ?', [type]).then(function(result)
			{
				server_id = result[0].server_id;
				return ws_server.prepare_download(server_id);
			});
		}
		else
		{
			alert("404");
		}
		
	},
	
	get_files: async function(update)
	{
		app.dialog.preloader("Télechargement en cours...");
		
		try
		{
			for (var i = 0; i<update.length; i++)
			{
				if (update[i].entity == "files" && update[i].server_id && update[i].action != "delete")
				{
					var file = await ws_server.get_file(update[i].server_id);
					debugger
					if (typeof file == "string") throw file;
					if (file.success)
					{
						var resource_binary = btoa(file.data);
						await op2a_documents.set_file_path(update[i].server_id, update[i].data.name, "application/pdf", resource_binary, update[i].data.chantier_id, update[i].data.metier, update[i].data.materiel_id, update[i].data.operation_id);
					}
					else
					{
						app.dialog.alert(file.error);
					}
				}
			}
		}
		catch (error)
		{
			app.dialog.close();
			if (ws_defines.debug)
			{
				console.log(error);
				app.dialog.alert(error);
			}
			return Promise.resolve(false);
		}
		
		app.dialog.close();
		return Promise.resolve(true);
	},
	
	prepare_download: function(server_id)
	{
		var param = {};
		
		param.server_id = server_id;
		param.base64 = WS_VALUE_DOWNLOAD_BASE64;
		
		return ws_server.download_file(param);
	}
});
