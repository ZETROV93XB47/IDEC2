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
		// import_data_item : function(key, id, data)
		// {
		// 	switch (key)
		// 	{
		// 		case OP2A_SYNCHRO_DATA_KEY_CONTACTS :
		// 			return this.import_contact(id, data);
	
		// 		case OSIRI_SYNCHRO_DATA_KEY_FILES :		
		// 			return this.import_chantier(id, data);
	
		// 		case OSIRI_SYNCHRO_DATA_KEY_CHANTIERS :		
		// 			return this.import_chantier(id, data);
					
		// 		case OSIRI_SYNCHRO_DATA_KEY_PROJETS :
		// 			return this.import_projet(id, data);
	
		// 		case OSIRI_SYNCHRO_DATA_KEY_REXS :
		// 			return this.import_rex(id, data);
					
		// 	}
			
		// 	return Promise.resolve();
		// },
		
		import_file : function(id, file)
		{
			var self = this;
			var server_id = ws_engine.get_server_id();
			var server_ids = {};
			var local_ids;
			
			server_ids[OP2A_DOCUMENT_PROPERTY_CHANTIER_ID] = {server: server_id, entity: OP2A_DATAMODEL_ENTITY_CHANTIERS, id: document[OP2A_DOCUMENT_PROPERTY_CHANTIER_ID]};
			server_ids[OP2A_DOCUMENT_PROPERTY_MATERIEL_ID] = {server: server_id, entity: OP2A_DATAMODEL_ENTITY_MATERIELS, id: document[OP2A_DOCUMENT_PROPERTY_MATERIEL_ID]};
			server_ids[OP2A_DOCUMENT_PROPERTY_OPERATION_ID] = {server: server_id, entity: OP2A_DATAMODEL_ENTITY_OPERATIONS, id: document[OP2A_DOCUMENT_PROPERTY_OPERATION_ID]};
			
			return self.get_locals_ids(server_ids).then(function(ids)
			{
				local_ids = ids;
	
				return ws_database.files.find_with_server(server_id, WS_OBJECT_PROPERTY_SERVER_ID + ' = ?', [file[WS_FILE_PROPERTY_SERVER_ID]]);
			})
			.then(function(result)
			{
				var properties = [
					WS_FILE_PROPERTY_SERVER_ID,
					WS_FILE_PROPERTY_PROPERTY_SYNC_TIMESTAMP,
					WS_FILE_PROPERTY_NAME,
					WS_FILE_PROPERTY_TYPE,
					WS_FILE_PROPERTY_STATUS,
					WS_FILE_PROPERTY_HAS_FILE,
					WS_FILE_PROPERTY_PHOTO_EDITED,
					WS_FILE_PROPERTY_PHOTO_TRANSFORMATION,
					WS_FILE_PROPERTY_RATTACHE_A,
							
					OP2A_FILE_PROPERTY_CHANTIER_ID,
					OP2A_FILE_PROPERTY_METIER_REF,
					OP2A_FILE_PROPERTY_MATERIEL_ID,
					OP2A_FILE_PROPERTY_OPERATION_ID,
					OP2A_FILE_PROPERTY_FORMULAIRE_ID,
					OP2A_FILE_PROPERTY_COMMENT,
				];
		
				var values = [
					file[WS_FILE_PROPERTY_SERVER_ID] ? file[WS_FILE_PROPERTY_SERVER_ID].toString() : 'null',
					file[WS_FILE_PROPERTY_PROPERTY_SYNC_TIMESTAMP] ? file[WS_FILE_PROPERTY_PROPERTY_SYNC_TIMESTAMP] : '',
					file[WS_FILE_PROPERTY_NAME],
					file[WS_FILE_PROPERTY_TYPE],
					file[WS_FILE_PROPERTY_STATUS],
					file[WS_FILE_PROPERTY_HAS_FILE],
					
					file[WS_FILE_PROPERTY_PHOTO_EDITED],
					JSON.stringify(file[WS_FILE_PROPERTY_PHOTO_TRANSFORMATION]),
					file[WS_FILE_PROPERTY_RATTACHE_A],
							
					local_ids[OP2A_FILE_PROPERTY_CHANTIER_ID],
					file[OP2A_FILE_PROPERTY_METIER_REF],
					local_ids[OP2A_FILE_PROPERTY_MATERIEL_ID],
					local_ids[OP2A_FILE_PROPERTY_OPERATION_ID],
					file[OP2A_FILE_PROPERTY_FORMULAIRE_ID],
					file[OP2A_FILE_PROPERTY_COMMENT],
				];
		
				return ws_database.files.add_with_server(server_id, properties, values);
			});
		},
		
		import_contact : function(entity, id, contact)
		{
			var self = this;
			var server_id = ws_engine.get_server_id();
			var server_ids = {};
			var local_ids;
	
			server_ids[OP2A_CONTACT_PROPERTY_RATTACHE_A] = {server: server_id, entity: entity, id: contact[OP2A_CONTACT_PROPERTY_RATTACHE_A]};
			
			return self.get_locals_ids(server_ids).then(function(ids)
			{
				local_ids = ids;
	
				return ws_database.contacts.find_with_server(server_id, WS_OBJECT_PROPERTY_SERVER_ID + ' = ?', [contact[OP2A_CONTACT_PROPERTY_SERVER_ID]]);
			})
			.then(function(result)
			{
				var properties = [
					OP2A_CONTACT_PROPERTY_SERVER_ID,
					OP2A_CONTACT_PROPERTY_SYNC_TIMESTAMP,
					OP2A_CONTACT_PROPERTY_CATEGORIE,
					OP2A_CONTACT_PROPERTY_TYPE,
					OP2A_CONTACT_PROPERTY_COMPANY,
					OP2A_CONTACT_PROPERTY_LASTNAME,
					OP2A_CONTACT_PROPERTY_FIRSTNAME,
					OP2A_CONTACT_PROPERTY_ABREVIATION,
					OP2A_CONTACT_PROPERTY_IDENTIFIANT,
					OP2A_CONTACT_PROPERTY_EMAIL,
					OP2A_CONTACT_PROPERTY_PHONE_NUMBER,
					OP2A_CONTACT_PROPERTY_VERIFICATEUR,
					OP2A_CONTACT_PROPERTY_RATTACHE_A
				];
		
				var values = [
					contact[OP2A_CONTACT_PROPERTY_SERVER_ID],
					contact[OP2A_CONTACT_PROPERTY_SYNC_TIMESTAMP],
					contact[OP2A_CONTACT_PROPERTY_CATEGORIE],
					contact[OP2A_CONTACT_PROPERTY_TYPE],
					self.convert_str(contact[OP2A_CONTACT_PROPERTY_COMPANY]),
					self.convert_str(contact[OP2A_CONTACT_PROPERTY_LASTNAME]),
					self.convert_str(contact[OP2A_CONTACT_PROPERTY_FIRSTNAME]),
					self.convert_str(contact[OP2A_CONTACT_PROPERTY_ABREVIATION]),
					self.convert_str(contact[OP2A_CONTACT_PROPERTY_IDENTIFIANT]),
					self.convert_str(contact[OP2A_CONTACT_PROPERTY_EMAIL]),
					self.convert_str(contact[OP2A_CONTACT_PROPERTY_PHONE_NUMBER]),
					contact[OP2A_CONTACT_PROPERTY_VERIFICATEUR],
					local_ids[OP2A_CONTACT_PROPERTY_RATTACHE_A],
				];
	
				return result.length > 0 ? result[0][WS_OBJECT_PROPERTY_ID] : ws_database.contacts.add_with_server(server_id, properties, values);
			})
			.then(function(id)
			{
				return self.set_map_local_id(server_id, entity, contact[OP2A_CONTACT_PROPERTY_SERVER_ID], id);
			});
		},
	
		import_chantier : function(id, chantier)
		{
			var self = this;
			var server_id = ws_engine.get_server_id();
			var server_ids = {};
			var local_ids;
	
			return self.get_locals_ids(server_ids).then(function(ids)
			{
				local_ids = ids;
	
				return ws_database.chantiers.find_with_server(server_id, WS_OBJECT_PROPERTY_SERVER_ID + ' = ?', [chantier[OP2A_CHANTIER_PROPERTY_SERVER_ID]]);
			})
			.then(function(result)
			{
				var properties = [
					OSIRI_CHANTIER_PROPERTY_SERVER_ID,
					OSIRI_CHANTIER_PROPERTY_SYNC_TIMESTAMP,
					OSIRI_CHANTIER_PROPERTY_NOM,
					OSIRI_CHANTIER_PROPERTY_CI,
					OSIRI_CHANTIER_PROPERTY_ADRESSE,
					OSIRI_CHANTIER_PROPERTY_VILLE,
					OSIRI_CHANTIER_PROPERTY_CONTACTS,
				];
		
				var values = [
					chantier[OSIRI_CHANTIER_PROPERTY_SERVER_ID],
					chantier[OSIRI_CHANTIER_PROPERTY_SYNC_TIMESTAMP],
					self.convert_str(chantier[OSIRI_CHANTIER_PROPERTY_NOM]),
					self.convert_str(chantier[OSIRI_CHANTIER_PROPERTY_CI]),
					self.convert_str(chantier[OSIRI_CHANTIER_PROPERTY_ADRESSE]),
					self.convert_str(chantier[OSIRI_CHANTIER_PROPERTY_VILLE]),
					JSON.stringify(chantier[OSIRI_CHANTIER_PROPERTY_CONTACTS]),
				];
	
				return result.length > 0 ? result[0][WS_OBJECT_PROPERTY_ID] : ws_database.chantiers.add_with_server(server_id, properties, values);
			})
			.then(function(id)
			{
				return self.set_map_local_id(server_id, OP2A_DATAMODEL_ENTITY_CHANTIERS, chantier[OP2A_CHANTIER_PROPERTY_SERVER_ID], id);
			});
		},
	
		import_projet : function(id, projet)
		{
			var self = this;
			var server_id = ws_engine.get_server_id();
			var server_ids = {};
			var local_ids;
	
			return self.get_locals_ids(server_ids).then(function(ids)
			{
				local_ids = ids;
	
				return ws_database.projets.find_with_server(server_id, WS_OBJECT_PROPERTY_SERVER_ID + ' = ?', [projet[OSIRI_CHANTIER_PROPERTY_SERVER_ID]]);
			})
			.then(function(result)
			{
				var properties = [
					OSIRI_PROJET_PROPERTY_SERVER_ID,
					OSIRI_PROJET_PROPERTY_SYNC_TIMESTAMP,
					OSIRI_PROJET_PROPERTY_NOM,
					OSIRI_PROJET_PROPERTY_NUM,
					OSIRI_PROJET_PROPERTY_PHASE,
					OSIRI_PROJET_PROPERTY_PHOTO,
				];
		
				var values = [
					projet[OSIRI_PROJET_PROPERTY_SERVER_ID],
					projet[OSIRI_PROJET_PROPERTY_SYNC_TIMESTAMP],
					self.convert_str(projet[OSIRI_PROJET_PROPERTY_NOM]),
					self.convert_str(projet[OSIRI_PROJET_PROPERTY_NUM]),
					self.convert_str(projet[OSIRI_PROJET_PROPERTY_PHASE]),
					self.convert_str(projet[OSIRI_PROJET_PROPERTY_PHOTO]),
				];
	
				return result.length > 0 ? result[0][WS_OBJECT_PROPERTY_ID] : ws_database.projets.add_with_server(server_id, properties, values);
			})
			.then(function(id)
			{
				return self.set_map_local_id(server_id, OSIRI_DATAMODEL_ENTITY_CHANTIERS, projet[OSIRI_CHANTIER_PROPERTY_SERVER_ID], id);
			});
		},
	
		import_rex : function(id, rex)
		{
			var self = this;
			var server_id = ws_engine.get_server_id();
			var server_ids = {};
			var local_ids;
	
			server_ids[OSIRI_REX_PROPERTY_CHANTIER_ID] = {server: server_id, entity: OSIRI_DATAMODEL_ENTITY_CHANTIERS, id: rex[OSIRI_REX_PROPERTY_CHANTIER_ID]};
			server_ids[OSIRI_REX_PROPERTY_PROJET_ID] = {server: server_id, entity: OSIRI_DATAMODEL_ENTITY_PROJETS, id: rex[OSIRI_REX_PROPERTY_PROJET_ID]};
			
			return self.get_locals_ids(server_ids).then(function(ids)
			{
				local_ids = ids;
	
				return ws_database.rexs.find_with_server(server_id, WS_OBJECT_PROPERTY_SERVER_ID + ' = ?', [rex[OSIRI_CHANTIER_PROPERTY_SERVER_ID]]);
			})
			.then(function(result)
			{
				var properties = [
					OSIRI_REX_PROPERTY_SERVER_ID,
					OSIRI_REX_PROPERTY_SYNC_TIMESTAMP,
					OSIRI_REX_PROPERTY_CHANTIER_ID,
					OSIRI_REX_PROPERTY_PROJET_ID,
					OSIRI_REX_PROPERTY_VERSION,
					OSIRI_REX_PROPERTY_DATE_DEBUT,
					OSIRI_REX_PROPERTY_DATE_FIN,
					OSIRI_REX_PROPERTY_DATE,
					OSIRI_REX_PROPERTY_PHOTOS,
					OSIRI_REX_PROPERTY_COMMENT,
					OSIRI_REX_PROPERTY_ETAT,
				];
		
				var values = [
					rex[OSIRI_PROJET_PROPERTY_SERVER_ID],
					rex[OSIRI_PROJET_PROPERTY_SYNC_TIMESTAMP],
					local_ids[OSIRI_REX_PROPERTY_CHANTIER_ID],
					local_ids[OSIRI_REX_PROPERTY_PROJET_ID],
					self.convert_str(rex[OSIRI_REX_PROPERTY_VERSION]),
					ws_tools.get_date_as_string(rex[OSIRI_REX_PROPERTY_DATE_DEBUT]),
					ws_tools.get_date_as_string(rex[OSIRI_REX_PROPERTY_DATE_FIN]),
					ws_tools.get_date_as_string(rex[OSIRI_REX_PROPERTY_DATE]),
					self.convert_str(rex[OSIRI_REX_PROPERTY_PHOTOS]),
					self.convert_str(rex[OSIRI_REX_PROPERTY_COMMENT]),
					self.convert_str(rex[OSIRI_REX_PROPERTY_ETAT]),
				];
	
				return result.length > 0 ? result[0][WS_OBJECT_PROPERTY_ID] : ws_database.rexs.add_with_server(server_id, properties, values);
			})
			.then(function(id)
			{
				return self.set_map_local_id(server_id, OSIRI_DATAMODEL_ENTITY_REXS, rex[OSIRI_REX_PROPERTY_SERVER_ID], id);
			});
		},
	
	
	});
	
	var ws_synchronizer = new app_synchronizer_class();