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
			this.actions = undefined;
			this.rexs = undefined;
			this.nouvelle_idees = undefined;
			this.last_events = undefined;
			this.phase_changes = undefined;
			this.interlocuteurs_etude = undefined;
			this.interlocuteurs_rex = undefined;
			
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

			this.actions_class = ws_datatable.extend(
			{
				constructor: function(db)
				{
					this._super(db, OSIRI_DATABASE_TABLE_ACTIONS);
				},
			});
			
			this.rexs_class = ws_datatable.extend(
			{
				constructor: function(db)
				{
					this._super(db, OSIRI_DATABASE_TABLE_REXS);
				},
			});

			this.nouvelle_idees_class = ws_datatable.extend(
			{
				constructor: function(db)
				{
					this._super(db, OSIRI_DATABASE_TABLE_NOUVELLE_IDEES);
				},
			});
			
			this.last_events_class = ws_datatable.extend(
			{
				constructor: function(db)
				{
					this._super(db, OSIRI_DATABASE_TABLE_LAST_EVENTS);
				},
			});

			this.phase_changes_class = ws_datatable.extend(
			{
				constructor: function(db)
				{
					this._super(db, OSIRI_DATABASE_TABLE_PHASE_CHANGES);
				},
			});

			this.interlocuteurs_etude_class = ws_datatable.extend(
			{
				constructor: function(db)
				{
					this._super(db, OSIRI_DATABASE_TABLE_INTERLOCUTEURS_ETUDE);
				},
			});
			
			this.interlocuteurs_rex_class = ws_datatable.extend(
			{
				constructor: function(db)
				{
					this._super(db, OSIRI_DATABASE_TABLE_INTERLOCUTEURS_REX);
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
	
				case OSIRI_DATABASE_TABLE_ACTIONS :
					return this.actions;
	
				case OSIRI_DATABASE_TABLE_REXS :
					return this.rexs;

				case OSIRI_DATABASE_TABLE_NOUVELLE_IDEES :
					return this.nouvelle_idees;

				case OSIRI_DATABASE_TABLE_LAST_EVENTS :
					return this.last_events;

				case OSIRI_DATABASE_TABLE_PHASE_CHANGES :
					return this.phase_changes;

				case OSIRI_DATABASE_TABLE_INTERLOCUTEURS_ETUDE :
					return this.interlocuteurs_etude;

				case OSIRI_DATABASE_TABLE_INTERLOCUTEURS_REX :
					return this.interlocuteurs_rex;
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
				self.actions = new self.actions_class(self);
				self.rexs = new self.rexs_class(self);
				self.nouvelle_idees = new self.nouvelle_idees_class(self);
				self.last_events = new self.last_events_class(self);
				self.phase_changes = new self.phase_changes_class(self);
				self.interlocuteurs_etude = new self.interlocuteurs_etude_class(self);
				self.interlocuteurs_rex = new self.interlocuteurs_rex_class(self);
				
				resolve();
			});
		},
	});
	
	var ws_database = new app_database_class();