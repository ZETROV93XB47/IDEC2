//! Server

class app_server_class extends ws_server_class
{
	constructor()
	{
		super();
	}
	
	get_result_data(params)
	{
		var data = [];
		data['nfc_etiquette'] = params;
		return this.api(data);
	}

	//! Synchro
	
	synchronize_data(event, check_events)
	{
		var params = { token: ws_engine.get_user_token(), device : ws_engine.get_device_id(), event: event[WS_OBJECT_PROPERTY_SERVER_ID], check_events: check_events, last_index: event.get_last_index() };
		
		return this.api('synchronize_data', params, ws_engine.get_server_url());
	}
	
	synchronize_all_data(params)
	{
		params.token = ws_engine.get_user_token();
		
		return ws_server.api('synchro', params);
	}
	
	download_file(params)
	{
		params.token = ws_engine.get_user_token();
		params.device = ws_engine.get_device_id();
		
		return this.api('get_file', params, ws_engine.get_server_url());
	}
	
	authentification(data)
	{
		var params = {data: data};
		
		return Promise.resolve({'success' : true });
		return this.api('authentification', params);
	}

	set_local_ids(data)
	{
		var server_id = ws_engine.get_server_id();
		var self = this;
		var server_ids = {};
		var _data = data;
		var local_ids;
		
		if (data.chantier_id)
		{
			// if (data[PROPERTY_COLLABORATEUR]) server_ids[PROPERTY_COLLABORATEUR] = {server: server_id, entity: IDEC_DATAMODEL_ENTITY_COLLABORATEURS, id: data[PROPERTY_COLLABORATEUR]};

			return ws_synchronizer.get_locals_ids(server_ids).then(function(ids)
			{
				// if (ids[PROPERTY_COLLABORATEUR]) _data[PROPERTY_COLLABORATEUR] = ids[PROPERTY_COLLABORATEUR];
				
				return _data;
			});
		}
		else
		{
			return Promise.resolve(_data);
		}
	}
}

var ws_server = new app_server_class();