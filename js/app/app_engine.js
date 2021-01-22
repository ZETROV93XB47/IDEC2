//! Engine

class app_engine_class extends ws_engine_class
{
	constructor()
	{
		super();
	}
	
	//! Init
	
	custom_init(server_id)
	{
		return Promise.resolve(server_id);
	}

	//! Get/Set
	
	get_app_name()
	{
		return IDEC_APP_NAME;
	}

	get_version()
	{
		return IDEC_APP_VERSION;
	}

	//! Server
	
	is_multi_servers()
	{
		return IDEC_APP_MULTI_SERVERS;
	}

	//! Storage
	
	get_local_storage_prefix()
	{
		return IDEC_MOBILE_LOCAL_STORAGE_PREFIX;
	}
	
	//! Reset
		
	custom_reset()
	{
		this.event_id = undefined;
		this.event = undefined;
		
		return Promise.resolve();
	}
}

var ws_engine = new app_engine_class();