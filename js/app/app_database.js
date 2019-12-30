//! Database

var app_database_class = ws_database_class.extend(
	{
		constructor: function()
		{
			this.servers = undefined;
			this.synchro_event = undefined;
			this.files = undefined;
			this.notes = undefined;
			
			this.collaborateurs = undefined;
			this.chantiers = undefined;
			this.projets = undefined;
			this.rexs = undefined;
			
			this.servers_class = ws_datatable.extend(
			{
				constructor: function(db)
				{
					this._super(db, WS_DATABASE_TABLE_SERVERS);
				},
			});
			
			this.synchro_event_class = ws_datatable.extend(
			{
				constructor: function(db)
				{
					this._super(db, WS_DATABASE_TABLE_SYNCHRO);
				},
			});
			
			this.files_class = ws_datatable.extend(
			{
				constructor: function(db)
				{
					this._super(db, WS_DATABASE_TABLE_FILES);
				},
			});
			
			this.notes_class = ws_datatable.extend(
			{
				constructor: function(db)
				{
					this._super(db, WS_DATABASE_TABLE_NOTES);
				},
			});
			
			this.collaborateurs_class = ws_datatable.extend(
			{
				constructor: function(db)
				{
					this._super(db, OSIRI_DATABASE_TABLE_COLLABORATEURS);
				},
			});
			
			this.chantiers_class = ws_datatable.extend(
			{
				constructor: function(db)
				{
					this._super(db, OSIRI_DATABASE_TABLE_CHANTIERS);
				},
			});
		
			this.projets_class = ws_datatable.extend(
			{
				constructor: function(db)
				{
					this._super(db, OSIRI_DATABASE_TABLE_PROJETS);
				},
			});
			
			this.rexs_class = ws_datatable.extend(
			{
				constructor: function(db)
				{
					this._super(db, OSIRI_DATABASE_TABLE_REXS);
				},
			});
			
		},
		
		get_name: function()
		{
			return 'OSIRI REX';
		},
		
		get_description: function()
		{
			return 'OSIRI REX mobile';
		},
		
		get_size: function()
		{
			return 49 * 1024 * 1024;
		},
		
		get_version: function()
		{
			return 1.0;
		},
	
		get_table_with_name: function(name)
		{
			switch (name)
			{
				case WS_DATABASE_TABLE_SERVERS :
					return this.servers;
				
				case WS_DATABASE_TABLE_SYNCHRO :
					return this.synchro_event;
					
				case WS_DATABASE_TABLE_FILES :
					return this.files;
					
				case WS_DATABASE_TABLE_NOTES :
					return this.notes;
					
				case OSIRI_DATABASE_TABLE_COLLABORATEURS :
					return this.collaborateurs;
					
				case OSIRI_DATABASE_TABLE_CHANTIERS :
					return this.chantiers;
	
				case OSIRI_DATABASE_TABLE_PROJETS :
					return this.projets;
	
				case OSIRI_DATABASE_TABLE_REXS :
					return this.rexs;
			}
			
			return null;
		},
		
		is_data_table: function(name)
		{
			return name != WS_DATABASE_TABLE_SERVERS;
		},
		
		on_ready: function()
		{
			var self = this;
			
			return new Promise(function(resolve, reject)
			{
				self.servers = new self.servers_class(self);
				self.synchro_event = new self.synchro_event_class(self);
				self.files = new self.files_class(self);
				self.notes = new self.notes_class(self);
				
				self.collaborateurs = new self.collaborateurs_class(self);
				self.chantiers = new self.chantiers_class(self);
				self.projets = new self.projets_class(self);
				self.rexs = new self.rexs_class(self);
				
				resolve();
			});
		},
	});
	
	var ws_database = new app_database_class();