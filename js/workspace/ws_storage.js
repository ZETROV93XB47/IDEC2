var ws_storage = new function()
{
	this.device_id = undefined;
	this.user_infos = undefined;
	this.admin_code = undefined;
	this.support_code = undefined;
	this.user_mode = undefined;

	//! Methods
	
	this.get_value = function(property, default_value, prefix)
	{
		if (prefix == undefined ) prefix = ws_engine.get_local_storage_prefix();
		
		var value = localStorage.getItem(prefix + property);
		
		if (ws_defines.debug) console.log("Storage get value for " + property + " : " + (value != undefined ? value : default_value));
		
		return value == undefined || value == null ? default_value : value;
	}	
	
	this.get_int_value = function(property, default_value, prefix)
	{
		if (prefix == undefined ) prefix = ws_engine.get_local_storage_prefix();
		
		var value = localStorage.getItem(prefix + property);
		
		if (ws_defines.debug) console.log("Storage get value for " + property + " : " + (value != undefined ? value : default_value));
		
		return value == undefined || value == null ? default_value : parseInt(value);
	}	
	
	this.set_value = function(property, value, prefix)
	{
		if (prefix == undefined ) prefix = ws_engine.get_local_storage_prefix();
		
		if (ws_defines.debug) console.log("Storage set value for " + property + " : " + value);
		
		if (value != undefined)
		{
			localStorage.setItem(prefix + property, value);
		}
		else
		{
			localStorage.removeItem(prefix + ws_defines.ASSISTANCE);
		}
	}
	
	this.has_value = function(property, prefix)
	{
		if (prefix == undefined ) prefix = ws_engine.get_local_storage_prefix();
		
		if (ws_defines.debug) console.log("Storage has value " + property + " : " + (localStorage.getItem(ws_engine.get_local_storage_prefix() + property) != undefined ? "Y" : "N"));
		
		return localStorage.getItem(prefix + property) != undefined;
	}
	
	this.clear_value = function(property, prefix)
	{
		if (prefix == undefined ) prefix = ws_engine.get_local_storage_prefix();
		
		if (ws_defines.debug) console.log("Storage clear value " + property);
		
		localStorage.removeItem(prefix + property);
	}
	
	//! UUID
	
	this.get_device_uuid = function()
	{
		if (app.device.desktop)
		{
			if (this.has_value(WS_STORAGE_KEY_DEVICE_UUID)) return this.get_value(WS_STORAGE_KEY_DEVICE_UUID);
		
			var uuid = "";
			var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
		
			for (var i = 0; i < 16; i++) uuid += possible.charAt(Math.floor(Math.random() * possible.length));	
		
			this.set_value(WS_STORAGE_KEY_DEVICE_UUID, uuid);
		
			return uuid;
		}
		
		return device.uuid;
	}
	
	//! Device id
	
	this.get_device_id = function()
	{
		if (this.device_id == undefined)
		{
			this.device_id = this.get_value(WS_STORAGE_KEY_DEVICE_ID);
		}
		
		return this.device_id;
	}
	
	this.set_device_id = function(device_id)
	{
		this.device_id = device_id;
		
		this.set_value(WS_STORAGE_KEY_DEVICE_ID, device_id);
	}
	
	//Admin code
	
	this.get_admin_code = function()
	{
		if (this.admin_code == undefined)
		{
			this.admin_code = this.get_value(WS_STORAGE_KEY_ADMIN_CODE, undefined, WS_LOCAL_STORAGE_PREFIX);
		}
		
		return this.admin_code;
	}
	
	this.set_admin_code = function(admin_code)
	{
		this.admin_code = admin_code;
		
		this.set_value(WS_STORAGE_KEY_ADMIN_CODE, admin_code, WS_LOCAL_STORAGE_PREFIX);
	}
	
	//Support code
	
	this.get_support_code = function()
	{
		if (this.support_code == undefined)
		{
			this.support_code = this.get_value(WS_STORAGE_KEY_SUPPORT_CODE, undefined, WS_LOCAL_STORAGE_PREFIX);
		}
		
		return this.support_code;
	}
	
	this.set_support_code = function(support_code)
	{
		this.support_code = support_code;
		
		this.set_value(WS_STORAGE_KEY_SUPPORT_CODE, support_code, WS_LOCAL_STORAGE_PREFIX);
	}
	
	//Use mode
	
	this.get_user_mode = function()
	{
		if (this.user_mode == undefined)
		{
			this.user_mode = this.get_value(WS_STORAGE_KEY_USER_MODE, undefined, WS_LOCAL_STORAGE_PREFIX);
		}
		
		return this.user_mode;
	}
	
	this.set_user_mode = function(user_mode)
	{
		this.user_mode = user_mode;
		
		this.set_value(WS_STORAGE_KEY_USER_MODE, user_mode, WS_LOCAL_STORAGE_PREFIX);
	}
	
	//! User token
	
	this.get_token = function()
	{
		if (this.token == undefined)
		{
			this.token = this.get_value(WS_STORAGE_KEY_USER_TOKEN);
		}
		
		return this.token;
	}
	
	this.set_token = function(token)
	{
		this.token = token;
		
		this.set_value(WS_STORAGE_KEY_USER_TOKEN, token);
	}
	
	//! User infos
	
	this.set_user_infos = function(user_infos)
	{		
		this.user_infos = user_infos;
		
		return ws_filesystem.write_file(undefined, WS_FILES_USER_INFOS_FILE_NAME, JSON.stringify(user_infos));
	}
	
	this.get_user_infos = function()
	{
		var self = this;
		
		return new Promise(function(resolve, reject) 
		{
			if (self.user_infos != undefined)
			{
				resolve(self.user_infos);
				return;
			}

			ws_filesystem.get_file(undefined, WS_FILES_USER_INFOS_FILE_NAME).then(function(file)
			{
				return ws_filesystem.read_file(file);
			})
			.then(function(user_infos)
			{
				self.user_infos = JSON.parse(user_infos);
				
				resolve(self.user_infos);
			})
			.catch(function(error)
			{
				if (ws_defines.debug) console.log(error);
				reject(error);
			});
		});
	}
	
	// Reset
	
	this.reset = function()
	{
		var self = this;
		
		return new Promise(function(resolve, reject) 
		{
			var uuid = self.get_value(WS_STORAGE_KEY_DEVICE_UUID);
				
			localStorage.clear();
			
			if (uuid != undefined) self.set_value(WS_STORAGE_KEY_DEVICE_UUID, uuid);
			
			resolve();
		});
	}
}
