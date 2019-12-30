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
	
	set_content_full:function()
	{
		var chantier_ids = op2a_chantiers.get_chantiers_favoris_ids();
		
		return op2a_chantiers.set_new_content(chantier_ids, OP2A_CHANTIER_CONTENT_FILES);
	},
	
	set_content_light:function()
	{
		var chantier_ids = op2a_chantiers.get_chantiers_favoris_ids();
		
		return op2a_chantiers.set_new_content(chantier_ids, OP2A_CHANTIER_CONTENT_MATERIEL);
	},
	
	synchronize_all_data: function(params)
	{
		params.token = ws_engine.get_user_token();
		params["op2a_" + OP2A_STORAGE_KEY_CHANTIERS_FAVORIS] = op2a_chantiers.get_chantiers_favoris_ids();
		params["op2a_" + OP2A_STORAGE_KEY_MATERIELS_FAVORIS] = op2a_chantiers.get_materiels_favoris_ids();
		params["op2a_" + OP2A_STORAGE_KEY_PERIMETRE] = op2a_chantiers.get_perimetre();
		
		return ws_server.api('synchro', params);
	},
	
	download_file: function(params)
	{
		params.token = ws_engine.get_user_token();
		params.device = ws_engine.get_device_id();
		
		//return this.download('get_file', params, ws_engine.get_server_url());
		return this.api('get_file', params, ws_engine.get_server_url());
		//return this.download('get_document_file');
	},
	
    //! Evaluation prestations
	
	send_eval_prest: function(eval_prest)
	{
		var self = this;
        var params = { token: ws_engine.get_user_token(), device : ws_engine.get_device_id()};
        
		return ws_synchronizer.get_server_id(ws_engine.get_server_id(), OP2A_DATAMODEL_ENTITY_CHANTIERS, eval_prest.chantier_id).then(function(chantier_id)
		{
            eval_prest.chantier_id = chantier_id;
            
			return ws_synchronizer.get_server_id(ws_engine.get_server_id(), OP2A_DATAMODEL_ENTITY_MATERIELS, eval_prest.materiel_id);
        })
		.then(function(materiel_id)
        {
            eval_prest.materiel_id = materiel_id;
            params.evaluation_prestation = eval_prest;
            
			return self.api('send_evaluation_prestaraire', params, ws_engine.get_server_url());
		});
	},
    
	//! Constat QSE
	
	send_constat_qse: function(constat_qse)
	{
		var self = this;
        var params = { token: ws_engine.get_user_token(), device : ws_engine.get_device_id() };
		
		return ws_synchronizer.get_server_id(ws_engine.get_server_id(), OP2A_DATAMODEL_ENTITY_CHANTIERS, constat_qse.chantier).then(function(chantier_id)
		{
            constat_qse.chantier_id = chantier_id;
            params.constat_qse = constat_qse;

			return self.api('send_constat_qse', params, ws_engine.get_server_url());
		});
	},
	
	//! VAM
	
	get_vam: function(metier, materiel_id, type, operation_id, force_unlock)
	{
		var params = { token: ws_engine.get_user_token(), device : ws_engine.get_device_id(), metier: metier, materiel_id: materiel_id, type: type, operation_id: operation_id, lock: 1 };
        
		if (force_unlock) params.force_unlock = 1;
        
		return this.api('get_vam', params, ws_engine.get_server_url());
	},
	
	send_vam: function(metier, materiel_id, type, operation_id, values)
	{
		var params = { token: ws_engine.get_user_token(), device : ws_engine.get_device_id(), metier: metier, materiel_id: materiel_id, type: type, operation_id: operation_id, values: values, lock: 0};
		debugger
		return this.api('send_vam', params, ws_engine.get_server_url());
	},
	
	set_local_ids: function(data)
	{
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