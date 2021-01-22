//! Datamodel

class app_datamodel_class extends ws_datamodel_class
{
	//! Tables
	
	get_table_infos(table)
	{
		switch (table)
		{
			// case WS_DATAMODEL_ENTITY_SERVERS :
			// 	return {
			// 		synch: true, 
			// 		synch_mode: WS_SYNC_TABLE_MODE_RECORD
			// 	};
		}
	}
	
	//! Entities
	
	get_entities()
	{
		return [
			WS_DATAMODEL_ENTITY_SERVERS,
			WS_DATAMODEL_ENTITY_SYNCHRO,
			WS_DATAMODEL_ENTITY_FILES,
			WS_DATAMODEL_ENTITY_NOTES,
		];
	}

	get_entity_infos(entity)
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
					synch_key: IDEC_SYNCHRO_DATA_KEY_FILES,
					synch_mode: WS_SYNC_TABLE_MODE_TABLE
				};
				
			case WS_DATAMODEL_ENTITY_NOTES :
				return {
					db: ws_database.notes,
					table: WS_DATABASE_TABLE_NOTES,
				};
		}
	}

	get_entity_structure(entity)
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
				];

			case WS_DATAMODEL_ENTITY_NOTES :
				return [
					{id: WS_NOTE_PROPERTY_ID, type: WS_OBJECT_PROPERTY_TYPE_UNIQUE_ID},
					{id: WS_NOTE_PROPERTY_SERVER, type: WS_OBJECT_PROPERTY_TYPE_LINK, entity: WS_DATAMODEL_ENTITY_SERVERS},
					{id: WS_NOTE_PROPERTY_NAME, type: WS_OBJECT_PROPERTY_TYPE_STRING},
					{id: WS_NOTE_PROPERTY_TEXT, type: WS_OBJECT_PROPERTY_TYPE_STRING},
				];
		}
	}
}

var ws_datamodel = new app_datamodel_class();