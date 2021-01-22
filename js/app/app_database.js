class servers_class extends ws_datatable
{
	constructor(db)
	{
		super(db, WS_DATABASE_TABLE_SERVERS);
	}
}

class synchro_event_class extends ws_datatable
{
	constructor(db)
	{
		super(db, WS_DATABASE_TABLE_SYNCHRO);
	}
}

class files_class extends ws_datatable
{
	constructor(db)
	{
		super(db, WS_DATABASE_TABLE_FILES);
	}
}

class notes_class extends ws_datatable
{
	constructor(db)
	{
		super(db, WS_DATABASE_TABLE_NOTES);
	}
}

//! Database

class app_database_class extends ws_database_class
{
	servers = null;
	synchro_event = null;
	files = null;
	notes = null;

	constructor()
	{
		super();
	}

	get_name()
	{
		return app.name ?? 'IDEC Mobile';
	}

	get_description()
	{
		return 'Application mobile pour Application mobile pour l\'entrprise DIGITAL NOMADE';
	}

	get_size()
	{
		return 49 * 1024 * 1024;
	}

	get_version()
	{
		return 1.0;
	}

	get_table_with_name(name)
	{
		switch(name)
		{
			case WS_DATABASE_TABLE_SERVERS :
				return this.servers;
			
			case WS_DATABASE_TABLE_SYNCHRO :
				return this.synchro_event;
				
			case WS_DATABASE_TABLE_FILES :
				return this.files;
				
			case WS_DATABASE_TABLE_NOTES :
				return this.notes;
		}
		
		return null;
	}

	is_data_table(name)
	{
		return name != WS_DATABASE_TABLE_SERVERS;
	}
	
	on_ready()
	{
		this.servers = new servers_class(this);
		this.synchro_event = new synchro_event_class(this);
		this.files = new files_class(this);
		this.notes = new notes_class(this);

		return Promise.resolve();
	}
}
	
var ws_database = new app_database_class();