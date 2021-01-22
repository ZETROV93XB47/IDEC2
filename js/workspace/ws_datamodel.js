//! WS Datamodel

class ws_datamodel_class
{
	//! Entities
	
	get_entities()
	{
		return [];
	}
	
	get_entity_infos(entity)
	{
		return null;
	}
	
	get_entity_table(entity)
	{
		var infos = this.get_entity_infos(entity);
		
		return infos ? infos.table : undefined;
	}
	
	get_entity_condition(entity, condition)
	{
		var infos = this.get_entity_infos(entity);
		
		if (condition != undefined && infos.filter != undefined)
		{
			return "(" + infos.filter + ") AND (" + condition + ")";
		}
		else if (condition != undefined)
		{
			return condition;
		}
		
		return infos.filter;
	}
	
	//! Tables
	
	get_table_infos(table)
	{
		return [];
	}

	get_tables_entities()
	{
		if (this.table_entities == undefined)
		{
			var entities = this.get_entities();
			var result = {};
			
			if (entities != undefined) for (var i = 0; i < entities.length; i++)
			{
				var infos = this.get_entity_infos(entities[i]);
				
				if (infos) result[infos.table] = entities[i];
			}
			
			this.table_entities = result;
		}
		
		return this.table_entities;
	}
	
	get_tables()
	{
		var tables = this.get_tables_entities();
		
		return tables ? Object.keys(tables) : [];
	}
	
	get_table_entity(table)
	{
		var tables = this.get_tables_entities();
		
		return tables ? tables[table] : undefined;
	}

	//! Datatables
	
	get_datatable_columns(table)
	{
		var entity = this.get_table_entity(table);
		var structure = this.get_entity_structure(entity);
		var properties = [];

		if (structure != undefined) for (var i = 0; i < structure.length; i++)
		{
			var type = undefined;
			
			switch (structure[i].type)
			{
				case WS_OBJECT_PROPERTY_TYPE_UNIQUE_ID :
					type = 'integer primary key';
					break;
					
				case WS_OBJECT_PROPERTY_TYPE_ID :
					type = 'integer';
					break;
					
				case WS_OBJECT_PROPERTY_TYPE_STRING :
				case WS_OBJECT_PROPERTY_TYPE_DATE :
				case WS_OBJECT_PROPERTY_TYPE_TIME :
				case WS_OBJECT_PROPERTY_TYPE_DATETIME :
				case WS_OBJECT_PROPERTY_TYPE_JSON :
					type = 'text';
					break;
					
				case WS_OBJECT_PROPERTY_TYPE_INTEGER :
					type = 'integer';
					break;
					
				case WS_OBJECT_PROPERTY_TYPE_BOOLEAN :
					type = 'integer';
					break;
					
				case WS_OBJECT_PROPERTY_TYPE_REAL :
					type = 'real';
					break;
					
				case WS_OBJECT_PROPERTY_TYPE_LINK :
					type = 'integer';
					break;
			}
			
			if (type != undefined)
			{	
				properties.push({name: structure[i].id, type: type});
			}
		}
		
		return properties;
	}
}