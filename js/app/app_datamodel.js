//! Datamodel

var app_datamodel_class = ws_datamodel_class.extend(
	{
		//! Tables
		
		get_table_infos: function(table)
		{
			switch (table)
			{
				// case OP2A_DATABASE_TABLE_CONTACTS :
				// 	return {
				// 		synch: true, 
				// 		synch_mode: WS_SYNC_TABLE_MODE_RECORD
				// 	};
			}
		},
		
		//! Entities
		
		get_entities: function()
		{
			return [
				WS_DATAMODEL_ENTITY_SERVERS,
				WS_DATAMODEL_ENTITY_SYNCHRO,
				
				WS_DATAMODEL_ENTITY_FILES,
				WS_DATAMODEL_ENTITY_NOTES,
				
				OSIRI_DATAMODEL_ENTITY_COLLABORATEURS,
				OSIRI_DATAMODEL_ENTITY_PROJETS,
				OSIRI_DATAMODEL_ENTITY_CHANTIERS,
				OSIRI_DATAMODEL_ENTITY_ACTIONS,
				OSIRI_DATAMODEL_ENTITY_REXS,
				OSIRI_DATAMODEL_ENTITY_NOUVELLE_IDEES,
				OSIRI_DATAMODEL_ENTITY_LAST_EVENTS,
				OSIRI_DATAMODEL_ENTITY_PHASE_CHANGES,
				OSIRI_DATAMODEL_ENTITY_INTERLOCUTEURS_ETUDE,
				OSIRI_DATAMODEL_ENTITY_INTERLOCUTEURS_REX,
			];
		},
		
		get_entity_infos: function(entity)
		{
			switch (entity)
			{
				case WS_DATAMODEL_ENTITY_SERVERS :
					return {
						db: ws_database.servers,
						table: WS_DATABASE_TABLE_SERVERS,
					};
				
				case WS_DATAMODEL_ENTITY_SYNCHRO :
					return {
						db: ws_database.synchro_event,
						table: WS_DATABASE_TABLE_SYNCHRO,
					};
				
				case WS_DATAMODEL_ENTITY_FILES :
					return {
						db: ws_database.files,
						table: WS_DATABASE_TABLE_FILES,
						synch: true, 
						synch_key: OSIRI_SYNCHRO_DATA_KEY_FILES,
						synch_mode: WS_SYNC_TABLE_MODE_TABLE
					};
					
				case WS_DATAMODEL_ENTITY_NOTES :
					return {
						db: ws_database.notes,
						table: WS_DATABASE_TABLE_NOTES,
					};

				case OSIRI_DATAMODEL_ENTITY_COLLABORATEURS :
					return {
						db: ws_database.collaborateurs,
						table: OSIRI_DATABASE_TABLE_COLLABORATEURS,
						synch: true, 
						synch_key: OSIRI_SYNCHRO_DATA_KEY_COLLABORATEURS,
						synch_mode: WS_SYNC_TABLE_MODE_RECORD
					};
					
				case OSIRI_DATAMODEL_ENTITY_CHANTIERS :
						return {
							db: ws_database.chantiers,
							table: OSIRI_DATABASE_TABLE_CHANTIERS,
							synch: true, 
							synch_key: OSIRI_SYNCHRO_DATA_KEY_CHANTIERS,
							synch_mode: WS_SYNC_TABLE_MODE_RECORD
						};

				case OSIRI_DATAMODEL_ENTITY_PROJETS :
					return {
						db: ws_database.projects,
						table: OSIRI_DATABASE_TABLE_PROJETS,
						synch: true, 
						synch_key: OSIRI_SYNCHRO_DATA_KEY_PROJETS,
						synch_mode: WS_SYNC_TABLE_MODE_RECORD
					};

				case OSIRI_DATAMODEL_ENTITY_ACTIONS :
					return {
						db: ws_database.actions,
						table: OSIRI_DATABASE_TABLE_ACTIONS,
						synch: true, 
						synch_key: OSIRI_SYNCHRO_DATA_KEY_ACTIONS,
						synch_mode: WS_SYNC_TABLE_MODE_RECORD
					};
	
				case OSIRI_DATAMODEL_ENTITY_REXS :
					return {
						db: ws_database.rexs,
						table: OSIRI_DATABASE_TABLE_REXS,
						synch: false, 
						synch_key: OSIRI_SYNCHRO_DATA_KEY_REXS,
						synch_mode: WS_SYNC_TABLE_MODE_RECORD
					};

				case OSIRI_DATAMODEL_ENTITY_NOUVELLE_IDEES :
					return {
						db: ws_database.nouvelle_idees,
						table: OSIRI_DATABASE_TABLE_NOUVELLE_IDEES,
						synch: true, 
						synch_key: OSIRI_SYNCHRO_DATA_KEY_NOUVELLE_IDEES,
						synch_mode: WS_SYNC_TABLE_MODE_RECORD
					};
					
				case OSIRI_DATAMODEL_ENTITY_LAST_EVENTS :
					return {
						db: ws_database.last_events,
						table: OSIRI_DATABASE_TABLE_LAST_EVENTS,
						synch: true, 
						synch_key: OSIRI_SYNCHRO_DATA_KEY_LAST_EVENTS,
						synch_mode: WS_SYNC_TABLE_MODE_RECORD
					};
					
				case OSIRI_DATAMODEL_ENTITY_PHASE_CHANGES :
					return {
						db: ws_database.phase_changes,
						table: OSIRI_DATABASE_TABLE_PHASE_CHANGES,
						synch: true, 
						synch_key: OSIRI_SYNCHRO_DATA_KEY_PHASE_CHANGES,
						synch_mode: WS_SYNC_TABLE_MODE_RECORD
					};

				case OSIRI_DATAMODEL_ENTITY_INTERLOCUTEURS_ETUDE :
					return {
						db: ws_database.interlocuteurs_etude,
						table: OSIRI_DATABASE_TABLE_INTERLOCUTEURS_ETUDE,
						synch: true, 
						synch_key: OSIRI_SYNCHRO_DATA_KEY_INTERLOCUTEURS_ETUDE,
						synch_mode: WS_SYNC_TABLE_MODE_RECORD
					};
					
			case OSIRI_DATAMODEL_ENTITY_INTERLOCUTEURS_REX :
				return {
					db: ws_database.interlocuteurs_rex,
					table: OSIRI_DATABASE_TABLE_INTERLOCUTEURS_REX,
					synch: true, 
					synch_key: OSIRI_SYNCHRO_DATA_KEY_INTERLOCUTEURS_REX,
					synch_mode: WS_SYNC_TABLE_MODE_RECORD
				};
			}
		},
	
		get_entity_structure: function(entity)
		{
			switch (entity)
			{
				case WS_DATAMODEL_ENTITY_SERVERS :
					return [
						{id: WS_SERVER_PROPERTY_ID, type: WS_OBJECT_PROPERTY_TYPE_UNIQUE_ID},
						{id: WS_SERVER_PROPERTY_URL, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: WS_SERVER_PROPERTY_TOKEN, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: WS_SERVER_PROPERTY_DEVICE_ID, type: WS_OBJECT_PROPERTY_TYPE_ID},
						{id: WS_SERVER_PROPERTY_MAP, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: WS_SERVER_PROPERTY_DATA_MODEL, type: WS_OBJECT_PROPERTY_TYPE_STRING}
				   ];
				
				case WS_DATAMODEL_ENTITY_SYNCHRO:
					return [
						{id: WS_SYNC_PROPERTY_ID, type: WS_OBJECT_PROPERTY_TYPE_UNIQUE_ID},
						{id: WS_SYNC_PROPERTY_SERVER, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: WS_DATAMODEL_ENTITY_SERVERS},
						{id: WS_SYNC_PROPERTY_SERVER_ID, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: WS_SYNC_PROPERTY_APP_ID, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: WS_SYNC_PROPERTY_ENTITY, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: WS_SYNC_PROPERTY_ACTION, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: WS_SYNC_PROPERTY_TYPE, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: WS_SYNC_PROPERTY_DATA, type: WS_OBJECT_PROPERTY_TYPE_STRING},
					];
				
				case WS_DATAMODEL_ENTITY_FILES :
					return [
						{id: WS_FILE_PROPERTY_ID, type: WS_OBJECT_PROPERTY_TYPE_UNIQUE_ID},
						{id: WS_FILE_PROPERTY_SERVER, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: WS_DATAMODEL_ENTITY_SERVERS},
						{id: WS_FILE_PROPERTY_SERVER_ID, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: WS_FILE_PROPERTY_PROPERTY_SYNC_TIMESTAMP, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: WS_FILE_PROPERTY_NAME, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: WS_FILE_PROPERTY_PATH, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: WS_FILE_PROPERTY_DATE, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: WS_FILE_PROPERTY_TYPE, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: WS_FILE_PROPERTY_EXTENSION, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: WS_FILE_PROPERTY_SIZE, type: WS_OBJECT_PROPERTY_TYPE_INTEGER},
						{id: WS_FILE_PROPERTY_STATUS, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: WS_FILE_PROPERTY_RATTACHE_A, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: WS_FILE_PROPERTY_HAS_FILE, type: WS_OBJECT_PROPERTY_TYPE_BOOLEAN},
						
						{id: WS_FILE_PROPERTY_PHOTO_EDITED, type: WS_OBJECT_PROPERTY_TYPE_BOOLEAN},
						{id: WS_FILE_PROPERTY_PHOTO_TRANSFORMATION, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						
						// {id: OP2A_FILE_PROPERTY_CHANTIER_ID, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: OP2A_DATAMODEL_ENTITY_CHANTIERS },
						// {id: OP2A_FILE_PROPERTY_METIER_REF, type: WS_OBJECT_PROPERTY_TYPE_STRING },
						// {id: OP2A_FILE_PROPERTY_MATERIEL_ID, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: OP2A_DATAMODEL_ENTITY_MATERIELS },
						// {id: OP2A_FILE_PROPERTY_OPERATION_ID, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: OP2A_DATAMODEL_ENTITY_OPERATIONS },
						// {id: OP2A_FILE_PROPERTY_FORMULAIRE_ID, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: OP2A_DATAMODEL_ENTITY_FORMULAIRES },
						// {id: OP2A_FILE_PROPERTY_COMMENT, type: WS_OBJECT_PROPERTY_TYPE_STRING },
					];
	
				case WS_DATAMODEL_ENTITY_NOTES :
					return [
						{id: WS_NOTE_PROPERTY_ID, type: WS_OBJECT_PROPERTY_TYPE_UNIQUE_ID},
						{id: WS_NOTE_PROPERTY_SERVER, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: WS_DATAMODEL_ENTITY_SERVERS},
						{id: WS_NOTE_PROPERTY_NAME, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: WS_NOTE_PROPERTY_TEXT, type: WS_OBJECT_PROPERTY_TYPE_STRING},
				   ];

				case OSIRI_DATAMODEL_ENTITY_COLLABORATEURS :
					return [
						{id: OSIRI_COLLABORATEUR_PROPERTY_ID, type: WS_OBJECT_PROPERTY_TYPE_UNIQUE_ID},
						{id: OSIRI_COLLABORATEUR_PROPERTY_SERVER, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: WS_DATAMODEL_ENTITY_SERVERS},
						{id: OSIRI_COLLABORATEUR_PROPERTY_SERVER_ID, type: WS_OBJECT_PROPERTY_TYPE_ID},
						{id: OSIRI_COLLABORATEUR_PROPERTY_SYNC_TIMESTAMP, type: WS_OBJECT_PROPERTY_TYPE_STRING},				
						{id: OSIRI_COLLABORATEUR_PROPERTY_LASTNAME, type: WS_OBJECT_PROPERTY_TYPE_INTEGER},				
						{id: OSIRI_COLLABORATEUR_PROPERTY_FIRSTNAME, type: WS_OBJECT_PROPERTY_TYPE_STRING},				
						{id: OSIRI_COLLABORATEUR_PROPERTY_EMAIL, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_COLLABORATEUR_PROPERTY_PHONE_NUMBER, type: WS_OBJECT_PROPERTY_TYPE_STRING},
					];
					
				case OSIRI_DATAMODEL_ENTITY_CHANTIERS :
					return [
						{id: OSIRI_CHANTIER_PROPERTY_ID, type: WS_OBJECT_PROPERTY_TYPE_UNIQUE_ID},
						{id: OSIRI_CHANTIER_PROPERTY_SERVER, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: WS_DATAMODEL_ENTITY_SERVERS},
						{id: OSIRI_CHANTIER_PROPERTY_SERVER_ID, type: WS_OBJECT_PROPERTY_TYPE_ID},
						{id: OSIRI_CHANTIER_PROPERTY_SYNC_TIMESTAMP, type: WS_OBJECT_PROPERTY_TYPE_STRING},				
						{id: OSIRI_CHANTIER_PROPERTY_NOM, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_CHANTIER_PROPERTY_CI, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_CHANTIER_PROPERTY_RATTACHEMENT, type: WS_OBJECT_PROPERTY_TYPE_STRING},
					];
					
				case OSIRI_DATAMODEL_ENTITY_PROJETS :
					return [
						{id: OSIRI_PROJET_PROPERTY_ID, type: WS_OBJECT_PROPERTY_TYPE_UNIQUE_ID},
						{id: OSIRI_PROJET_PROPERTY_SERVER, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: WS_DATAMODEL_ENTITY_SERVERS},
						{id: OSIRI_PROJET_PROPERTY_SERVER_ID, type: WS_OBJECT_PROPERTY_TYPE_ID},
						{id: OSIRI_PROJET_PROPERTY_SYNC_TIMESTAMP, type: WS_OBJECT_PROPERTY_TYPE_STRING},				
						{id: OSIRI_PROJET_PROPERTY_NOM, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_PROJET_PROPERTY_NUMERO, type: WS_OBJECT_PROPERTY_TYPE_INTEGER},
						{id: OSIRI_PROJET_PROPERTY_PHASE, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_PROJET_PROPERTY_MES_PROJETS, type: WS_OBJECT_PROPERTY_TYPE_BOOLEAN},
						{id: OSIRI_PROJET_PROPERTY_PILOTE, type: WS_OBJECT_PROPERTY_TYPE_INTEGER},
						{id: OSIRI_PROJET_PROPERTY_CARACT_TECH, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_PROJET_PROPERTY_CATEGORIE, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_PROJET_PROPERTY_DATE_DEBUT, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_PROJET_PROPERTY_ETAPE, type: WS_OBJECT_PROPERTY_TYPE_INTEGER},
						{id: OSIRI_PROJET_PROPERTY_FAMILLE, type: WS_OBJECT_PROPERTY_TYPE_INTEGER},
						{id: OSIRI_PROJET_PROPERTY_FONCTIONALITES, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_PROJET_PROPERTY_INTERET_COMPETITIVITE, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_PROJET_PROPERTY_INTERET_COMPETITIVITE_TEXT, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_PROJET_PROPERTY_INTERET_COMPLEMENTAIRES, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_PROJET_PROPERTY_INTERET_COMPLEMENTAIRES_TEXT, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_PROJET_PROPERTY_INTERET_ENVIRENEMENT, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_PROJET_PROPERTY_INTERET_ENVIRENEMENT_TEXT, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_PROJET_PROPERTY_INTERET_ERGONOMIE, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_PROJET_PROPERTY_INTERET_ERGONOMIE_TEXT, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_PROJET_PROPERTY_INTERET_PRODUCTIVITE, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_PROJET_PROPERTY_INTERET_PRODUCTIVITE_TEXT, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_PROJET_PROPERTY_INTERET_SECURITE, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_PROJET_PROPERTY_INTERET_SECURITE_TEXT, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_PROJET_PROPERTY_PRODUIT_EXISTANT, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_PROJET_PROPERTY_PROVENANCE_1, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_PROJET_PROPERTY_PROVENANCE_2, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_PROJET_PROPERTY_PROVENANCE_3, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_PROJET_PROPERTY_REDACTEUR, type: WS_OBJECT_PROPERTY_TYPE_INTEGER},
						{id: OSIRI_PROJET_PROPERTY_REFERENT_PRODUIT, type: WS_OBJECT_PROPERTY_TYPE_INTEGER},
					];
					
				case OSIRI_DATAMODEL_ENTITY_ACTIONS :
					return [
						{id: OSIRI_ACTION_PROPERTY_ID, type: WS_OBJECT_PROPERTY_TYPE_UNIQUE_ID},
						{id: OSIRI_ACTION_PROPERTY_SERVER, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: WS_DATAMODEL_ENTITY_SERVERS},
						{id: OSIRI_ACTION_PROPERTY_SERVER_ID, type: WS_OBJECT_PROPERTY_TYPE_ID},
						{id: OSIRI_ACTION_PROPERTY_SYNC_TIMESTAMP, type: WS_OBJECT_PROPERTY_TYPE_STRING},	
						{id: OSIRI_ACTION_PROPERTY_PROJET, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: OSIRI_DATAMODEL_ENTITY_PROJETS},
						{id: OSIRI_ACTION_PROPERTY_CHANTIER, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: OSIRI_DATAMODEL_ENTITY_CHANTIERS},
						{id: OSIRI_ACTION_PROPERTY_ACTION, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_ACTION_PROPERTY_PHASE, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_ACTION_PROPERTY_REUNION, type: WS_OBJECT_PROPERTY_TYPE_BOOLEAN},
						{id: OSIRI_ACTION_PROPERTY_ETAPE, type: WS_OBJECT_PROPERTY_TYPE_INTEGER},
						{id: OSIRI_ACTION_PROPERTY_DATE, type: WS_OBJECT_PROPERTY_TYPE_DATE},
						{id: OSIRI_ACTION_PROPERTY_DESCRIPTION, type: WS_OBJECT_PROPERTY_TYPE_STRING},
					];

				case OSIRI_DATAMODEL_ENTITY_REXS :
					return [
						{id: OSIRI_REX_PROPERTY_ID, type: WS_OBJECT_PROPERTY_TYPE_UNIQUE_ID},
						{id: OSIRI_REX_PROPERTY_SERVER, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: WS_DATAMODEL_ENTITY_SERVERS},
						{id: OSIRI_REX_PROPERTY_SERVER_ID, type: WS_OBJECT_PROPERTY_TYPE_ID},
						{id: OSIRI_REX_PROPERTY_SYNC_TIMESTAMP, type: WS_OBJECT_PROPERTY_TYPE_STRING},	
						{id: OSIRI_REX_PROPERTY_CHANTIER_ID, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: OSIRI_DATAMODEL_ENTITY_CHANTIERS},
						{id: OSIRI_REX_PROPERTY_PROJET_ID, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: OSIRI_DATAMODEL_ENTITY_PROJETS},
						{id: OSIRI_REX_PROPERTY_VERSION, type: WS_OBJECT_PROPERTY_TYPE_INTEGER},
						{id: OSIRI_REX_PROPERTY_DATE_DEBUT, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_REX_PROPERTY_DATE_FIN, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_REX_PROPERTY_DATE, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_REX_PROPERTY_PHOTOS, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_REX_PROPERTY_COMMENT, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_REX_PROPERTY_ETAT, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_REX_PROPERTY_DATA, type: WS_OBJECT_PROPERTY_TYPE_JSON},
						{id: OSIRI_REX_PROPERTY_MATERIEL_RECEIVED, type: WS_OBJECT_PROPERTY_TYPE_BOOLEAN},
					];

				case OSIRI_DATAMODEL_ENTITY_NOUVELLE_IDEES :
					return [
						{id: OSIRI_NOUVELLE_IDEE_PROPERTY_ID, type: WS_OBJECT_PROPERTY_TYPE_UNIQUE_ID},
						{id: OSIRI_NOUVELLE_IDEE_PROPERTY_SERVER, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: WS_DATAMODEL_ENTITY_SERVERS},
						{id: OSIRI_NOUVELLE_IDEE_PROPERTY_SERVER_ID, type: WS_OBJECT_PROPERTY_TYPE_ID},
						{id: OSIRI_NOUVELLE_IDEE_PROPERTY_SYNC_TIMESTAMP, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_NOUVELLE_IDEE_PROPERTY_NOM, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_NOUVELLE_IDEE_PROPERTY_DATE, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_NOUVELLE_IDEE_PROPERTY_OBJECTIFS, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_NOUVELLE_IDEE_PROPERTY_PHOTO, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_NOUVELLE_IDEE_PROPERTY_DATA, type: WS_OBJECT_PROPERTY_TYPE_JSON},
						{id: OSIRI_NOUVELLE_IDEE_PROPERTY_SENT, type: WS_OBJECT_PROPERTY_TYPE_BOOLEAN},
					];

				case OSIRI_DATAMODEL_ENTITY_LAST_EVENTS :
					return [
						{id: OSIRI_LAST_EVENT_PROPERTY_ID, type: WS_OBJECT_PROPERTY_TYPE_UNIQUE_ID},
						{id: OSIRI_LAST_EVENT_PROPERTY_SERVER, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: WS_DATAMODEL_ENTITY_SERVERS},
						{id: OSIRI_LAST_EVENT_PROPERTY_SERVER_ID, type: WS_OBJECT_PROPERTY_TYPE_ID},
						{id: OSIRI_LAST_EVENT_PROPERTY_SYNC_TIMESTAMP, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_LAST_EVENT_PROPERTY_PROJET, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: OSIRI_DATAMODEL_ENTITY_PROJETS},
						{id: OSIRI_LAST_EVENT_PROPERTY_DATE, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_LAST_EVENT_PROPERTY_EVENT, type: WS_OBJECT_PROPERTY_TYPE_STRING},
					];
					
				case OSIRI_DATAMODEL_ENTITY_PHASE_CHANGES :
					return [
						{id: OSIRI_PHASE_CHANGE_PROPERTY_ID, type: WS_OBJECT_PROPERTY_TYPE_UNIQUE_ID},
						{id: OSIRI_PHASE_CHANGE_PROPERTY_SERVER, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: WS_DATAMODEL_ENTITY_SERVERS},
						{id: OSIRI_PHASE_CHANGE_PROPERTY_SERVER_ID, type: WS_OBJECT_PROPERTY_TYPE_ID},
						{id: OSIRI_PHASE_CHANGE_PROPERTY_SYNC_TIMESTAMP, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_PHASE_CHANGE_PROPERTY_PROJET, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: OSIRI_DATAMODEL_ENTITY_PROJETS},
						{id: OSIRI_PHASE_CHANGE_PROPERTY_DATE, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_PHASE_CHANGE_PROPERTY_DE, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_PHASE_CHANGE_PROPERTY_VERS, type: WS_OBJECT_PROPERTY_TYPE_STRING},
					];
					
				case OSIRI_DATAMODEL_ENTITY_INTERLOCUTEURS_ETUDE :
					return [
						{id: OSIRI_INTERLOCUTEUR_ETUDE_PROPERTY_ID, type: WS_OBJECT_PROPERTY_TYPE_UNIQUE_ID},
						{id: OSIRI_INTERLOCUTEUR_ETUDE_PROPERTY_SERVER, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: WS_DATAMODEL_ENTITY_SERVERS},
						{id: OSIRI_INTERLOCUTEUR_ETUDE_PROPERTY_SERVER_ID, type: WS_OBJECT_PROPERTY_TYPE_ID},
						{id: OSIRI_INTERLOCUTEUR_ETUDE_PROPERTY_SYNC_TIMESTAMP, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_INTERLOCUTEUR_ETUDE_PROPERTY_NAME, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_INTERLOCUTEUR_ETUDE_PROPERTY_PROJET, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: OSIRI_DATAMODEL_ENTITY_PROJETS},
						{id: OSIRI_INTERLOCUTEUR_ETUDE_PROPERTY_METIER, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_INTERLOCUTEUR_ETUDE_PROPERTY_LEADER, type: WS_OBJECT_PROPERTY_TYPE_BOOLEAN},
						{id: OSIRI_INTERLOCUTEUR_ETUDE_PROPERTY_PHASE_ACTIVE, type: WS_OBJECT_PROPERTY_TYPE_STRING},
					];
	
				case OSIRI_DATAMODEL_ENTITY_INTERLOCUTEURS_REX :
					return [
						{id: OSIRI_INTERLOCUTEUR_REX_PROPERTY_ID, type: WS_OBJECT_PROPERTY_TYPE_UNIQUE_ID},
						{id: OSIRI_INTERLOCUTEUR_REX_PROPERTY_SERVER, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: WS_DATAMODEL_ENTITY_SERVERS},
						{id: OSIRI_INTERLOCUTEUR_REX_PROPERTY_SERVER_ID, type: WS_OBJECT_PROPERTY_TYPE_ID},
						{id: OSIRI_INTERLOCUTEUR_REX_PROPERTY_SYNC_TIMESTAMP, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_INTERLOCUTEUR_REX_PROPERTY_NAME, type: WS_OBJECT_PROPERTY_TYPE_STRING},
						{id: OSIRI_INTERLOCUTEUR_REX_PROPERTY_PROJET, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: OSIRI_DATAMODEL_ENTITY_PROJETS},
						{id: OSIRI_INTERLOCUTEUR_REX_PROPERTY_METIER, type: WS_OBJECT_PROPERTY_TYPE_STRING},
					];
			}
		},
	});
	
	var ws_datamodel = new app_datamodel_class();