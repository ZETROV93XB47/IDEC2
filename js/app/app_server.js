//! Server

var app_server_class = ws_server_class.extend(
{
	constructor: function()
	{
		
	},
	
	//! Synchro
	
	synchronize_data: function(event, check_events)
	{
		var params = { token: ws_engine.get_user_token(), device : ws_engine.get_device_id(), event: event[WS_OBJECT_PROPERTY_SERVER_ID], check_events: check_events, last_index: event.get_last_index() };
		
		return this.api('synchronize_data', params, ws_engine.get_server_url());
	},
	
	synchronize_all_data: function(params)
	{
		params.token = ws_engine.get_user_token();
		
		return ws_server.api('synchro', params);
	},
	
	download_file: function(params)
	{
		params.token = ws_engine.get_user_token();
		params.device = ws_engine.get_device_id();
		
		return this.api('get_file', params, ws_engine.get_server_url());
	},
	
	//! Idee
	
	depose_idee: function(idee)
	{
		var params = { token: ws_engine.get_user_token(), device : ws_engine.get_device_id(), idee: idee};
		
		return this.api('depose_idee', params);
	},
	
	send_identification_email: function(email)
	{
		var params = {email: email};
		
		return this.api('send_identification_email', params);
	},

	wait_for_identification: function()
	{
		var params = {};
		
		return this.api('wait_for_identification', params);
	},

	set_local_ids: function(data)
	{
		debugger
		var self = this;
		var server_ids = {};
		var _data = data;
		var local_ids;
		
		if (data.chantier_id)
		{
			server_ids[OP2A_DOCUMENT_PROPERTY_CHANTIER_ID] = { server: ws_engine.get_server_id(), entity: OP2A_DATAMODEL_ENTITY_CHANTIERS, id: data[OP2A_DOCUMENT_PROPERTY_CHANTIER_ID]};
			if (data.materiel_id) server_ids[OP2A_DOCUMENT_PROPERTY_MATERIEL_ID] = { server: ws_engine.get_server_id(), entity: OP2A_DATAMODEL_ENTITY_MATERIELS, id: data[OP2A_DOCUMENT_PROPERTY_MATERIEL_ID]};
			if (data.operation_id) server_ids[OP2A_DOCUMENT_PROPERTY_OPERATION_ID] = { server: ws_engine.get_server_id(), entity: OP2A_DATAMODEL_ENTITY_OPERATIONS, id: data[OP2A_DOCUMENT_PROPERTY_OPERATION_ID]};
			
			return ws_synchronizer.get_locals_ids(server_ids).then(function(ids)
			{
				if (ids.chantier_id) _data.chantier_id = ids.chantier_id;
				if (ids.materiel_id) _data.materiel_id = ids.materiel_id;
				if (ids.operation_id) _data.operation_id = ids.operation_id;
				
				return _data;
			});
		}
		else
		{
			return Promise.resolve(_data);
		}
	},
});

var ws_server = new app_server_class();