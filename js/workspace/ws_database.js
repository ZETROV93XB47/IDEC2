//! WS Database

class ws_database_class
{
	get_name()
	{
		return '';
	}
	
	get_description()
	{
		return '';
	}
	
	get_size()
	{
		return 49 * 1024 * 1024;
	}
	
	get_version()
	{
		return 1.0;
	}

	get_tables()
	{
		return ws_datamodel.get_tables();
	}
	
	get_table_entity(table)
	{
		return ws_datamodel.get_table_entity(table);
	}
	
	get_table_name(table)
	{
		var entity = ws_datamodel.get_table_entity(table);
		var infos = ws_datamodel.get_entity_infos(entity);
		
		return infos.table;
	}
	
	is_data_table(name)
	{
		return true;
	}
	
	get_table_with_name(name)
	{
		return null;
	}
	
	get_table_with_entity(entity)
	{
		return this.get_table_with_name(ws_datamodel.get_entity_table(entity));
	}
	
	get_structure()
	{
		var tables = this.get_tables();
		var result = [];
		
		if (tables != undefined) for (var i = 0; i < tables.length; i++)
		{
			result.push({ name: this.get_table_name(tables[i]), columns: ws_datamodel.get_datatable_columns(tables[i]) });
		}
		
		return result;
	}
	
	on_ready()
	{
		return Promise.resolve();
	}
	
	prepare()
	{
		return false ? this.clear() : Promise.resolve();
	}
	
	open()
	{
		var self = this;
		
		return new Promise(function(resolve, reject)
		{	
			self.tables = self.get_structure();
			self.db = window.openDatabase(self.get_name(), self.get_version(), self.get_description(), self.get_size());
	
			self.prepare().then(function()
			{
				return self.check();
			})
			.then(function()
			{
				self.on_ready();

				resolve();
			})
			.catch(function(error)
			{
				if (ws_defines.debug) console.log(error);
				reject(error);
			});
		});
	}
	
	check()
	{
		var queries = [];

		this.tables.forEach(function(table)
		{
			var columns = [];
	
			table.columns.forEach(function(column)
			{
				columns.push(column.name + ' ' + column.type);
			});
			
			queries.push('CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')');
		});
		
		return this.batch(queries);
	}

	clear()
	{
		var queries = [];
		
		this.tables.forEach(function(table)
		{
			queries.push('DROP TABLE IF EXISTS ' + table.name);
		});

		return this.batch(queries);
	}

	clear_data()
	{
		var self = this;
		var queries = [];
		
		this.tables.forEach(function(table)
		{
			if (self.is_data_table(table.name)) queries.push('DROP TABLE IF EXISTS ' + table.name);
		});

		return this.batch(queries);
	}

	clear_server_data(server_id)
	{
		var self = this;
		var queries = [];
		
		this.tables.forEach(function(table)
		{
			if (self.is_data_table(table.name)) queries.push('DELETE FROM ' + table.name + ' WHERE ' + WS_OBJECT_PROPERTY_SERVER + " = '" + server_id + "'");
		});

		return this.batch(queries);
	}
	
	reset()
	{
		var self = this;
		
		return self.clear().then(function()
		{
			return self.check();
		})
		.then(function()
		{
			return self.on_ready();
		});
	}
	
	delete_all_entity_links(entity, id)
	{
		var entities = ws_datamodel.get_entities();
		var tables = [];
		var promises = [];
		
		for (var e = 0; e < entities.length; e++)
		{
			var structure = ws_datamodel.get_entity_structure(entities[e]);
			var entity_info = ws_datamodel.get_entity_infos(entities[e]);
			
			for (var p = 0; p < structure.length; p++)
			{
				var property = structure[p];
				
				if (property.type == WS_OBJECT_PROPERTY_TYPE_LINK && property.entity == entity)
				{
					promises.push(entity_info.db.delete_linked_to(property.id, id));
				}
			}
		}
		
		return Promise.all(promises);
	}

	batch(queries)
	{	
		var self = this;
		
		return new Promise(function(resolve, reject)
		{
			console.log("database batch :");
			console.log(queries);

			self.db.transaction(function(transaction)
			{
				queries.forEach(function(query)
				{
					transaction.executeSql(query);
				}); 
			},
		    function(error)
		    {
			    if (ws_defines.DEV_MODE) debugger;
				console.log("database batch error " + error.message);
				
				reject(error.message);
			},
			function(transaction, result)
			{
				resolve();
			});
		});
	}

	query(query, bindings)
	{		 
		var self = this;
		
		return new Promise(function(resolve, reject)
		{
			//console.log("database query " + query + (bindings != undefined ? " with bindings :" : " without bindings"));			
			//if (bindings != undefined) console.log(bindings);
			
			bindings = typeof(bindings) !== 'undefined' ? bindings : [];
	
			self.db.transaction(function(transaction)
			{
				transaction.executeSql(query, bindings, function(transaction, result)
				{
					resolve(result);
				},
				function(transaction, error)
				{
					if (ws_defines.DEV_MODE) debugger;
					console.log("database::query error : " + error.message);
								
					reject(error.message);
				});
			});
		});
	}

	fetchAll(result)
	{
		return new Promise(function(resolve, reject)
		{
			var output = [];
	
			for (var i = 0; i < result.rows.length; i++)
			{
				output.push(result.rows.item(i));
			}
	
			resolve(output);
		});
	}

	fetch(result)
	{
		return new Promise(function(resolve, reject)
		{
			resolve(result.rows != null && result.rows.length > 0 ? result.rows.item(0) : null);
		});
	}
}

//! Datatable

class ws_datatable
{
	constructor(db, table)
	{
		this.db = db;
		this.table = table;
		this.filler = "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,";
	}
	
	count(condition, binding)
	{
		var self = this;

		return self.db.query('SELECT COUNT(*) FROM ' + self.table + (condition != undefined ? ' WHERE ' + condition : ''), binding).then(function(result)
		{
			return self.db.fetch(result);
		})
		.then(function(result)
		{
			return result['COUNT(*)'];
		});
	}
	
	sum(property, condition, binding)
	{
		var self = this;

		return self.db.query('SELECT SUM(' + property + ') FROM ' + self.table + (condition != undefined ? ' WHERE ' + condition : ''), binding).then(function(result)
		{
			return self.db.fetch(result);
		})
		.then(function(result)
		{
			return result['SUM(' + property + ')'];
		});
	}
	
	exists(condition, binding)
	{
		var self = this;

		return self.db.query('SELECT COUNT(*) FROM ' + self.table + (condition != undefined ? ' WHERE ' + condition : ''), binding).then(function(result)
		{
			return self.db.fetch(result);
		})
		.then(function(result)
		{
			return result['COUNT(*)'] > 0;
		});
	}

	all(properties, extra)
	{
		var self = this;
		var what = properties != undefined ? properties.join(',') : '*';
		var query = 'SELECT ' + what + ' FROM ' + this.table;
		
		if (extra != undefined) query = query + ' ' + extra;
		
		return self.db.query(query).then(function(result)
		{
			return self.db.fetchAll(result);
		});
	}

	find(condition, binding, properties, extra)
	{
		var self = this;
		var what = properties != undefined ? properties.join(',') : '*';
		var query = 'SELECT ' + what + ' FROM ' + this.table;
		
		if (condition != undefined) query = query + ' WHERE ' + condition;
		if (extra != undefined) query = query + ' ' + extra;
		
		return self.db.query(query, binding).then(function(result)
		{
			return self.db.fetchAll(result);
		});
	}
	
	search(value, properties)
	{
		var self = this;
		var condition = [];
		var binding = [];
		
		if (properties != undefined) for (var i = 0; i < properties.length; i++)
		{
			condition.push('(' + properties[i] + ' LIKE ?)');
			binding.push('%' + value + '%');
		}
		
		return self.find(condition.join(' OR '), binding);
	}
	
	add(properties, values, entity)
	{
		var self = this;
		var synchronizing = ws_synchronizer.synchronizing;
					
		return self.db.query('INSERT INTO ' + self.table + ' (' + properties.join(',') + ') VALUES (' + self.filler.substr(0, (2 * properties.length) - 1) + ')', values).then(function(result)
		{
			return ws_synchronizer.synchro_db_add(self.table, properties, values, entity, result, synchronizing);
		})
		.catch(function(error)
		{
			if (ws_defines.debug) console.log(error);
			throw error;
		});
	}

	add_array(properties, values)
	{
		var promises = [];
		
		for (var i = 0; i < values.length; i++)
		{
			var promise = this.add(properties, values[i]);
			promises.push(promise);
		}
	
		return Promise.all(promises);
	}

	add_object(object)
	{
		return this.add(Object.keys(object), Object.values(object));
	}

	insert_on_mass(data)
	{
		var ids = Object.keys(data);
		var ids_lenght = ids.length;
		var pack = 40;
		var pack = Math.trunc(800/Object.keys(data[ids[0]]).length);  // 27*40

		if (ids_lenght<pack) return this.insert_in_mass(data, 0, ids_lenght);
		var lenght = Math.trunc(ids_lenght/pack);
		lenght = (ids_lenght%pack != 0) ? lenght + 1 : lenght;
		var promise = [];

		var count = 0;

		for (var i = 0;i<lenght;i++)
		{
			var begin = count;
			if (i == lenght-1) pack = ids_lenght - count; // -1
			promise.push(this.insert_in_mass(data, begin, pack + begin));
			count += pack;
		}

		return Promise.all(promise);
	}

	insert_in_mass(data, index, length)
	{		 
		var self = this;

		var ids = Object.keys(data);
		var ids_lenght = length;
		for (var i = index; i < ids_lenght; i++)
		{
			data[ids[i]][WS_OBJECT_PROPERTY_SERVER] = ws_engine.get_server_id();
		}
		var properties = Object.keys(data[ids[0]]);
		var properties_length = properties.length;
		var bindings = [];

		for (var i = index; i < ids_lenght; i++)
		{
			for (var j = 0; j < properties_length; j ++)
			{
				var type_of = typeof data[ids[i]][properties[j]];

				if (type_of == "boolean")
				{
					data[ids[i]][properties[j]] = data[ids[i]][properties[j]] ? 1 : 0;
				}
				else if (type_of == "undefined")
				{
					data[ids[i]][properties[j]] = null;
				}
				else if (data[ids[i]][properties[j]] == null)
				{
					
				}
				else if (type_of == "object")
				{
					data[ids[i]][properties[j]] = JSON.stringify(data[ids[i]][properties[j]]);
				}

				bindings.push(data[ids[i]][properties[j]]);
			}
		}

		var binding_row = '('+self.filler.substr(0, (2 * properties_length) - 1)+'),';
		var binding_rows = binding_row.repeat(ids_lenght-index);
		binding_rows = binding_rows.substr(0, binding_rows.length-1);
		
		return self.db.query('INSERT INTO ' + self.table + ' (' + properties.join(',') + ') VALUES '+ binding_rows, bindings).catch(function(error)
		{
			if (ws_defines.debug) console.log(error);
			throw error;
		});
	}


	replace(properties, values, entity)
	{
		var self = this;
		var synchronizing = ws_synchronizer.synchronizing;
					
		return self.db.query('REPLACE INTO ' + self.table + ' (' + properties.join(',') + ') VALUES (' + self.filler.substr(0, (2 * properties.length) - 1) + ')', values).then(function(result)
		{
			var ids = ws_engine.get_ids(result);
			
			return ws_synchronizer.synchro_db_modify(this.table, ids, properties, values, entity, result, synchronizing);
		})
		.catch(function(error)
		{
			if (ws_defines.debug) console.log(error);
			throw error;
		});
	}

	replace_object(object)
	{
		return this.replace(Object.keys(object), Object.values(object));
	}

	get(condition, binding, properties, extra)
	{
		var self = this;
		var what = properties != undefined ? properties.join(',') : '*';
		var query = 'SELECT ' + what + ' FROM ' + this.table;
		
		if (condition != undefined) query = query + ' WHERE ' + condition;
		if (extra != undefined) query = query + ' ' + extra;
		
		return self.db.query(query, binding).then(function(result)
		{
			return self.db.fetch(result);
		});
	}

	set(condition, binding, properties, values, entity)
	{
		var self = this;
		var synchronizing = ws_synchronizer.synchronizing;
		
		if (binding != undefined) values = values.concat(binding);
		
		return self.find(condition, binding).then(function(result)
		{
			var ids = ws_engine.get_ids(result);
			
			return self.db.query('UPDATE ' + self.table + ' SET ' + properties.join(' = ?, ') + ' = ?' + (condition != undefined ? ' WHERE ' + condition : ''), values).then(function(result)
			{
				return ws_synchronizer.synchro_db_modify(self.table, ids, properties, values, entity, result, synchronizing);
			});
		});
	}

	set_object(condition, binding, object)
	{
		return this.set(condition, binding, Object.keys(object), Object.values(object));
	}
	
	delete(condition, binding, entity)
	{
		var self = this;
		var synchronizing = ws_synchronizer.synchronizing;
		
		return self.find(condition, binding).then(function(result)
		{
			var ids = ws_engine.get_ids(result);
			
			return self.db.query('DELETE FROM ' + self.table + (condition != undefined ? ' WHERE ' + condition : ''), binding).then(function(result)
			{
				if (ids.length > 0) return ws_synchronizer.synchro_db_delete(self.table, ids, entity, result, synchronizing);
			});
		})
	}

	delete_all()
	{
		return this.delete();
	}

	truncate()
	{
		return this.delete_all();		
	}

	drop()
	{
		return this.db.query('DROP TABLE IF EXISTS ?', [this.table]);
	}

	//! Entity based tables

	count_entity(condition, binding)
	{
		return this.count(ws_datamodel.get_entity_condition(entity, condition), binding);
	}
	
	all_entity(properties, extra)
	{
		return this.find(ws_datamodel.get_entity_condition(entity), properties, extra);
	}
	
	find_entity(entity, condition, binding, properties, extra)
	{
		return this.find(ws_datamodel.get_entity_condition(entity, condition), binding, properties, extra);
	}
	
	delete_entity(entity, condition, binding)
	{
		return this.delete(ws_datamodel.get_entity_condition(entity, condition), binding);
	}

	delete_all_entity(entity)
	{
		return this.delete(ws_datamodel.get_entity_condition(entity));
	}
	
	delete_all_entity_links(entity, id)
	{
		var entities = ws_datamodel.get_entities();
		var tables = [];
		var promises = [];
		
		for (var e = 0; e < entities.length; e++)
		{
			var structure = ws_datamodel.get_entity_structure(entities[e]);
			
			for (var p = 0; p < structure.length; p++)
			{
				var property = structure[p];
				
				if (property.type == WS_OBJECT_PROPERTY_TYPE_LINK && property.entity == entity)
				{
					promises.push(this.delete_linked_to(property.id, id));
				}
			}
		}
		
		return Promise.all(promises);
	}
	
	//! ID based tables

	exists_with_id(id)
	{
		return this.exists('id = ?', [id]);
	}

	get_with_id(id)
	{
		return this.get('id = ?', [id]);
	}

	set_with_id(id, properties, values)
	{
		return this.set('id = ?', [id], properties, values);
	}

	set_object_with_id(id, object)
	{
		return this.set_object('id = ?', [id], object);
	}

	delete_with_id(id)
	{
		return this.delete('id = ?', [id]);
	}

	//! Server ID based tables

	get_with_server_id(server_id, id)
	{
		return this.get(WS_OBJECT_PROPERTY_SERVER + ' = ? AND ' + WS_OBJECT_PROPERTY_SERVER_ID + ' = ?', [server_id, id]);
	}

	set_with_server_id(server_id, id, properties, values)
	{
		return this.set(WS_OBJECT_PROPERTY_SERVER + ' = ? AND ' + WS_OBJECT_PROPERTY_SERVER_ID + ' = ?', [server_id, id], properties, values);
	}

	set_object_with_server_id(server_id, id, object)
	{
		return this.set_object(WS_OBJECT_PROPERTY_SERVER + ' = ? AND ' + WS_OBJECT_PROPERTY_SERVER_ID + ' = ?', [server_id, id], object);
	}

	delete_with_server_id(server_id, id)
	{
		return this.delete(WS_OBJECT_PROPERTY_SERVER + ' = ? AND ' + WS_OBJECT_PROPERTY_SERVER_ID + ' = ?', [server_id, id]);
	}
	
	get_local_id(server_id, id)
	{
		var self = this;
		
		return this.get(WS_OBJECT_PROPERTY_SERVER + ' = ? AND ' + WS_OBJECT_PROPERTY_SERVER_ID + ' = ?', [server_id, id]).then(function(data)
		{
			if (data == undefined) console.log("ws_database / get_local_id failed : server_id = " + server_id + ", table = " + self.table + ", id = " + id);
			
			return data != undefined ? data[WS_OBJECT_PROPERTY_ID] : null;
		});
	}
	
	get_server_id(id)
	{
		return this.get_with_id(id).then(function(data)
		{
			return { server: data[WS_OBJECT_PROPERTY_SERVER], id: data[WS_OBJECT_PROPERTY_SERVER_ID] };
		});
	}

	//! Link based methods
	
	get_linked_to(link, id)
	{
		return this.find(link + ' = ' + id);
	}
	
	count_linked_to(link, id, condition, binding)
	{
		return this.count('(' + link + ' = ' + id + ')' + (condition != undefined ? ' AND ' + condition : ''), binding);
	}

	sum_linked_to(link, id, property, condition, binding)
	{
		return this.sum(property, '(' + link + ' = ' + id + ')' + (condition != undefined ? ' AND ' + condition : ''), binding);
	}

	all_linked_to(link, id, properties, extra)
	{
		return this.find(link + ' = ' + id, undefined, properties, extra);
	}

	find_linked_to(link, id, condition, binding, properties, extra)
	{
		return this.find('(' + link + ' = ' + id + ')' + (condition != undefined ? ' AND ' + condition : ''), binding, properties, extra);
	}
	
	delete_linked_to(link, id)
	{
		return this.delete(link + ' = ' + id, undefined);
	}

	//! Server based methods
	
	count_with_server(server, condition, binding)
	{
		return this.count(WS_OBJECT_PROPERTY_SERVER + ' = ' + server + ' AND ' + condition, binding);
	}

	all_with_server(server, properties, extra)
	{
		return this.find(WS_OBJECT_PROPERTY_SERVER + ' = ' + server, undefined, properties, extra);
	}

	find_with_server(server, condition, binding, properties, extra)
	{
		return this.find(WS_OBJECT_PROPERTY_SERVER + ' = ' + server + ' AND ' + condition, binding, properties, extra);
	}

	add_with_server(server, properties, values)
	{
		properties.push(WS_OBJECT_PROPERTY_SERVER);
		values.push(server);
		
		return this.add(properties, values);
	}

	add_object_with_server(server, object)
	{
		object[WS_OBJECT_PROPERTY_SERVER] = server;
		
		return this.add_object(object);
	}

	delete_with_server(server)
	{
		return this.delete(WS_OBJECT_PROPERTY_SERVER + ' = ?', [server]);
	}
	
	//! Server and link based methods
	
	count_with_server_and_link(server, link, id, condition, binding)
	{
		return this.count(WS_OBJECT_PROPERTY_SERVER + ' = ' + server + ' AND ' + link + ' = ' + id + (condition != undefined ? ' AND ' + condition : ''), binding);
	}

	sum_with_server_and_link(server, link, id, property, condition, binding)
	{
		return this.sum(property, WS_OBJECT_PROPERTY_SERVER + ' = ' + server + ' AND ' + link + ' = ' + id + (condition != undefined ? ' AND ' + condition : ''), binding);
	}
	
	all_with_link(link, id, properties, extra)
	{
		return this.find(link + ' = ' + id, undefined, properties, extra);
	}

	all_with_server_and_link(server, link, id, properties, extra)
	{
		return this.find(WS_OBJECT_PROPERTY_SERVER + ' = ' + server + ' AND ' + link + ' = ' + id, undefined, properties, extra);
	}

	find_with_server_and_link(server, link, id, condition, binding, properties, extra)
	{
		return this.find(WS_OBJECT_PROPERTY_SERVER + ' = ' + server + ' AND ' + link + ' = ' + id + ' AND ' + condition, binding, properties, extra);
	}

	add_with_server_and_link(server, link, id, properties, values)
	{
		properties.push(WS_OBJECT_PROPERTY_SERVER);
		values.push(server);
		
		properties.push(link);
		values.push(id);

		return this.add(properties, values);
	}

	add_object_with_server_and_link(server, link, id, object)
	{
		object[WS_OBJECT_PROPERTY_SERVER] = server;
		object[link] = id;
		
		return this.add_object(object);
	}

	delete_with_server_and_link(server, link, id)
	{
		return this.delete(WS_OBJECT_PROPERTY_SERVER + ' = ? AND ' + link + ' = ?', [server, id]);
	}
}
