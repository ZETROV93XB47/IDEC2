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
	
	connect_with_device_id: function()
	{
		var params = {};
		debugger
		return this.api('connect_with_device_id', params);
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

	send_to_pilote : function()
	{
		var params = {};
		
		return this.api('notify_rex_materiel_non_recu', params);
	},
	
	send_rex : function(rex, phase_chantier, date)
	{
		var params = { token: ws_engine.get_user_token(), device : ws_engine.get_device_id(), rex: rex, phase_chantier_id :phase_chantier , date: date };
		
		return this.api('send_rex', params);
	},

	set_local_ids: function(data)
	{
		var server_id = ws_engine.get_server_id();
		var self = this;
		var server_ids = {};
		var _data = data;
		var local_ids;
		
		if (data.chantier_id)
		{
			if (data[OSIRI_ACTION_PROPERTY_CHANTIER]) server_ids[OSIRI_ACTION_PROPERTY_CHANTIER] = {server: server_id, entity: OSIRI_DATAMODEL_ENTITY_CHANTIERS, id: data[OSIRI_ACTION_PROPERTY_CHANTIER]};
			if (data[OSIRI_ACTION_PROPERTY_PROJET]) server_ids[OSIRI_ACTION_PROPERTY_PROJET] = {server: server_id, entity: OSIRI_DATAMODEL_ENTITY_PROJETS, id: data[OSIRI_ACTION_PROPERTY_PROJET]};
			if (data[OSIRI_PROJET_PROPERTY_PILOTE]) server_ids[OSIRI_PROJET_PROPERTY_PILOTE] = {server: server_id, entity: OSIRI_DATAMODEL_ENTITY_COLLABORATEURS, id: data[OSIRI_PROJET_PROPERTY_PILOTE]};
			if (data[OSIRI_PROJET_PROPERTY_REFERENT_PRODUIT]) server_ids[OSIRI_PROJET_PROPERTY_REFERENT_PRODUIT] = {server: server_id, entity: OSIRI_DATAMODEL_ENTITY_COLLABORATEURS, id: data[OSIRI_PROJET_PROPERTY_REFERENT_PRODUIT]};
			if (data[OSIRI_PROJET_PROPERTY_REDACTEUR]) server_ids[OSIRI_PROJET_PROPERTY_REDACTEUR] = {server: server_id, entity: OSIRI_DATAMODEL_ENTITY_COLLABORATEURS, id: data[OSIRI_PROJET_PROPERTY_REDACTEUR]};
			if (data[OSIRI_PHASE_CHANTIER_PROPERTY_REX]) server_ids[OSIRI_PHASE_CHANTIER_PROPERTY_REX] = {server: server_id, entity: OSIRI_DATAMODEL_ENTITY_REXS, id: data[OSIRI_PHASE_CHANTIER_PROPERTY_REX]};
			if (data[OSIRI_REX_PROPERTY_INTERLOCUTEUR_REX]) server_ids[OSIRI_REX_PROPERTY_INTERLOCUTEUR_REX] = {server: server_id, entity: OSIRI_DATAMODEL_ENTITY_COLLABORATEURS, id: data[OSIRI_REX_PROPERTY_INTERLOCUTEUR_REX]};
			if (data[OSIRI_ACTION_PROPERTY_PHASE_CHANTIER]) server_ids[OSIRI_ACTION_PROPERTY_PHASE_CHANTIER] = {server: server_id, entity: OSIRI_DATAMODEL_ENTITY_PHASE_CHANTIERS, id: data[OSIRI_ACTION_PROPERTY_PHASE_CHANTIER]};
			// if (data[OSIRI_ACTION_PROPERTY_COLLABORATEUR]) server_ids[OSIRI_ACTION_PROPERTY_COLLABORATEUR] = {server: server_id, entity: OSIRI_DATAMODEL_ENTITY_COLLABORATEURS, id: data[OSIRI_ACTION_PROPERTY_COLLABORATEUR]};

			return ws_synchronizer.get_locals_ids(server_ids).then(function(ids)
			{
				if (ids[OSIRI_ACTION_PROPERTY_CHANTIER]) _data[OSIRI_ACTION_PROPERTY_CHANTIER] = ids[OSIRI_ACTION_PROPERTY_CHANTIER];
				if (ids[OSIRI_ACTION_PROPERTY_PROJET]) _data[OSIRI_ACTION_PROPERTY_PROJET] = ids[OSIRI_ACTION_PROPERTY_PROJET];
				if (ids[OSIRI_PROJET_PROPERTY_PILOTE]) _data[OSIRI_PROJET_PROPERTY_PILOTE] = ids[OSIRI_PROJET_PROPERTY_PILOTE];
				if (ids[OSIRI_PROJET_PROPERTY_REFERENT_PRODUIT]) _data[OSIRI_PROJET_PROPERTY_REFERENT_PRODUIT] = ids[OSIRI_PROJET_PROPERTY_REFERENT_PRODUIT];
				if (ids[OSIRI_PROJET_PROPERTY_REDACTEUR]) _data[OSIRI_PROJET_PROPERTY_REDACTEUR] = ids[OSIRI_PROJET_PROPERTY_REDACTEUR];
				if (ids[OSIRI_PHASE_CHANTIER_PROPERTY_REX]) _data[OSIRI_PHASE_CHANTIER_PROPERTY_REX] = ids[OSIRI_PHASE_CHANTIER_PROPERTY_REX];
				if (ids[OSIRI_REX_PROPERTY_INTERLOCUTEUR_REX]) _data[OSIRI_REX_PROPERTY_INTERLOCUTEUR_REX] = ids[OSIRI_REX_PROPERTY_INTERLOCUTEUR_REX];
				if (ids[OSIRI_ACTION_PROPERTY_PHASE_CHANTIER]) _data[OSIRI_ACTION_PROPERTY_PHASE_CHANTIER] = ids[OSIRI_ACTION_PROPERTY_PHASE_CHANTIER];
				// if (ids[OSIRI_ACTION_PROPERTY_COLLABORATEUR]) _data[OSIRI_ACTION_PROPERTY_COLLABORATEUR] = ids[OSIRI_ACTION_PROPERTY_COLLABORATEUR];
				
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