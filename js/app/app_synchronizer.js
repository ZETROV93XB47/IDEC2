//! App Synchronizer

var app_synchronizer_class = ws_synchronizer_class.extend(
	{
		constructor: function()
		{
			this.start_delay = 10000;
			this.wakeup_delay = 2000;
			this.next_delay = 10000;
			this.synchronizing = true;
		},
		
		import_data_item : function(key, data)
		{
			var self = this;
			var data = data;
			var ids = data != undefined ? Object.keys(data) : [];
			var promises = [];

			function replace_server_id(self, item)
			{
				var server_id = ws_engine.get_server_id();
				var server_ids = {};

				if (item[OSIRI_ACTION_PROPERTY_CHANTIER]) server_ids[OSIRI_ACTION_PROPERTY_CHANTIER] = {server: server_id, entity: OSIRI_DATAMODEL_ENTITY_CHANTIERS, id: item[OSIRI_ACTION_PROPERTY_CHANTIER]};
				if (item[OSIRI_ACTION_PROPERTY_PROJET]) server_ids[OSIRI_ACTION_PROPERTY_PROJET] = {server: server_id, entity: OSIRI_DATAMODEL_ENTITY_PROJETS, id: item[OSIRI_ACTION_PROPERTY_PROJET]};
				if (item[OSIRI_PROJET_PROPERTY_PILOTE]) server_ids[OSIRI_PROJET_PROPERTY_PILOTE] = {server: server_id, entity: OSIRI_DATAMODEL_ENTITY_COLLABORATEURS, id: item[OSIRI_PROJET_PROPERTY_PILOTE]};
				if (item[OSIRI_PROJET_PROPERTY_REFERENT_PRODUIT]) server_ids[OSIRI_PROJET_PROPERTY_REFERENT_PRODUIT] = {server: server_id, entity: OSIRI_DATAMODEL_ENTITY_COLLABORATEURS, id: item[OSIRI_PROJET_PROPERTY_REFERENT_PRODUIT]};
				if (item[OSIRI_PROJET_PROPERTY_REDACTEUR]) server_ids[OSIRI_PROJET_PROPERTY_REDACTEUR] = {server: server_id, entity: OSIRI_DATAMODEL_ENTITY_COLLABORATEURS, id: item[OSIRI_PROJET_PROPERTY_REDACTEUR]};
				if (item[OSIRI_PHASE_CHANTIER_PROPERTY_REX]) server_ids[OSIRI_PHASE_CHANTIER_PROPERTY_REX] = {server: server_id, entity: OSIRI_DATAMODEL_ENTITY_REXS, id: item[OSIRI_PHASE_CHANTIER_PROPERTY_REX]};
				if (item[OSIRI_REX_PROPERTY_INTERLOCUTEUR_REX]) server_ids[OSIRI_REX_PROPERTY_INTERLOCUTEUR_REX] = {server: server_id, entity: OSIRI_DATAMODEL_ENTITY_COLLABORATEURS, id: item[OSIRI_REX_PROPERTY_INTERLOCUTEUR_REX]};
				if (item[OSIRI_ACTION_PROPERTY_PHASE_CHANTIER]) server_ids[OSIRI_ACTION_PROPERTY_PHASE_CHANTIER] = {server: server_id, entity: OSIRI_DATAMODEL_ENTITY_PHASE_CHANTIERS, id: item[OSIRI_ACTION_PROPERTY_PHASE_CHANTIER]};
				// if (item[OSIRI_ACTION_PROPERTY_COLLABORATEUR]) server_ids[OSIRI_ACTION_PROPERTY_COLLABORATEUR] = {server: server_id, entity: OSIRI_DATAMODEL_ENTITY_COLLABORATEURS, id: item[OSIRI_ACTION_PROPERTY_COLLABORATEUR]};
				
				return self.get_locals_ids(server_ids).then(function(ids)
				{
					var properties = Object.keys(ids);
					
					for (var i = 0;i<properties.length; i++)
					{
						data[item.server_id][properties[i]] = ids[properties[i]];
					}
				});
			}

			for (var i = 0; i < ids.length; i++)
			{
				promises.push(replace_server_id(self, data[ids[i]]));
			}

			return Promise.all(promises).then(function(result)
			{
				return data;
			});
		},
	});
	
	var ws_synchronizer = new app_synchronizer_class();