//! Engine

var app_engine_class = ws_engine_class.extend(
{
	constructor : function()
	{
	},
	
	//! Init
	
	custom_init : function(server_id)
	{
		return Promise.resolve(server_id);
	},

	//! Get/Set
	
	get_app_name : function()
	{
		return 'OSIRI Rex';
	},

	get_version : function()
	{
		return OSIRI_APP_VERSION;
	},

	//! Server
	
	is_multi_servers : function()
	{
		return OSIRI_APP_MULTI_SERVERS;
	},

	//! Storage
	
	get_local_storage_prefix : function()
	{
		return OSIRI_MOBILE_LOCAL_STORAGE_PREFIX;
	},
	
	//! Reset
		
	custom_reset: function()
	{
		this.event_id = undefined;
		this.event = undefined;
		
		return Promise.resolve();
	}
});

var ws_engine = new app_engine_class();