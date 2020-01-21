var ws_user = new function()
{
	this.server_id = undefined;
	this.id = undefined;
	this.nom = '';
	this.prenom = '';
	this.telephone = '';
	this.email = '';
	this.rattache_a = '';	
	
	//! Login
	
	this.connect = function(url, token, data)
	{
		var startTime = new Date().getTime();
		var elapsedTime = 0;
		
		return ws_server.connect(url, token, data).then(function(result)
		{
			if (result.success === false) throw result.error;
			
			return ws_engine.connect_to_server(url, result);
		})
		.then(function(result)
		{
			elapsedTime = new Date().getTime() - startTime;

			console.log("Temps réponse de serveur: "+elapsedTime+  " ms");
			return result;
		});
	};
	
	this.login = function(login, password)
	{
		return ws_server.login(login, password).then(function(result)
		{
			return ws_engine.connect_to_server(url, result);
		});
	};
	
	this.logout = function()
	{
		ws_storage.clear_value(WS_STORAGE_KEY_USER_TOKEN);

		// return ws_engine.reset().then(function()
		// {
			return ws_synchronizer.logout();
		// });
	};
	
	this.change_password = function(password)
	{
		var self = this;
		
		return new Promise(function(resolve, reject)
		{
			ws_server.change_password(self.get_token(), password).then(function(result)
			{
				resolve(self);
			})
			.catch(function(error)
			{
				if (ws_defines.debug) console.log(error);
				reject(error);
			})
		});
	};

	this.set_user_infos = function(user_infos)
	{
		this.name = user_infos[WS_USER_INFOS_KEY_NAME];
		this.email = user_infos[WS_USER_INFOS_KEY_EMAIL];
	}
	
	this.is_connected = function()
	{
		return ws_storage.is_connected();
	};
	
	//! Token
	
	this.set_token = function(token)
	{
		ws_storage.set_token(token);
	};
	
	this.get_token = function()
	{
		return ws_storage.get_token();
	};
}
