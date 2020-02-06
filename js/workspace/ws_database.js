//! WS Database

var ws_database_class = Class.extend(
{
	get_name: function()
	{
		return '';
	},
	
	get_description: function()
	{
		return '';
	},
	
	get_size: function()
	{
		return 49 * 1024 * 1024;
	},
	
	get_version: function()
	{
		return 1.0;
	},

	get_tables: function()
	{
		return ws_datamodel.get_tables();
	},
	
	get_table_entity: function(table)
	{
		return ws_datamodel.get_table_entity(table);
	},
	
	get_table_name: function(table)
	{
		var entity = ws_datamodel.get_table_entity(table);
		var infos = ws_datamodel.get_entity_infos(entity);
		
		return infos.table;
	},
	
	is_data_table: function(name)
	{
		return true;
	},
	
	get_table_with_name: function(name)
	{
		return null;
	},
	
	get_table_with_entity: function(entity)
	{
		return this.get_table_with_name(ws_datamodel.get_entity_table(entity));
	},
	
	get_structure: function()
	{
		var tables = this.get_tables();
		var result = [];
		
		if (tables != undefined) for (var i = 0; i < tables.length; i++)
		{
			result.push({ name: this.get_table_name(tables[i]), columns: ws_datamodel.get_datatable_columns(tables[i]) });
		}
		
		return result;
	},
	
	on_ready: function()
	{
		return Promise.resolve();
	},
	
	prepare: function()
	{
		return false ? this.clear() : Promise.resolve();
	},
	
	open: function()
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
	},
	
	check: function()
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
	},

	clear: function()
	{
		var queries = [];
		
		this.tables.forEach(function(table)
		{
			queries.push('DROP TABLE IF EXISTS ' + table.name);
		});

		return this.batch(queries);
	},

	clear_data: function()
	{
		var self = this;
		var queries = [];
		
		this.tables.forEach(function(table)
		{
			if (self.is_data_table(table.name)) queries.push('DROP TABLE IF EXISTS ' + table.name);
		});

		return this.batch(queries);
	},

	clear_server_data: function(server_id)
	{
		var self = this;
		var queries = [];
		
		this.tables.forEach(function(table)
		{
			if (self.is_data_table(table.name)) queries.push('DELETE FROM ' + table.name + ' WHERE ' + WS_OBJECT_PROPERTY_SERVER + " = '" + server_id + "'");
		});

		return this.batch(queries);
	},
	
	reset: function()
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
	},
	
	delete_all_entity_links: function(entity, id)
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
	},

	batch: function(queries)
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
	},

	query: function(query, bindings)
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
	},

	fetchAll: function(result)
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
	},

	fetch: function(result)
	{
		return new Promise(function(resolve, reject)
		{
			resolve(result.rows != null && result.rows.length > 0 ? result.rows.item(0) : null);
		});
	}
});

//! Datatable

var ws_datatable = Class.extend(
{
	constructor: function(db, table)
	{
		this.db = db;
		this.table = table;
		this.filler = "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,";
	},
	
	count: function(condition, binding)
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
	},
	
	sum: function(property, condition, binding)
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
	},
	
	exists: function(condition, binding)
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
	},

	all: function(properties, extra)
	{
		var self = this;
		var what = properties != undefined ? properties.join(',') : '*';
		var query = 'SELECT ' + what + ' FROM ' + this.table;
		
		if (extra != undefined) query = query + ' WHERE ' + extra;
		
		return self.db.query(query).then(function(result)
		{
			return self.db.fetchAll(result);
		});
	},

	find: function(condition, binding, properties, extra)
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
	},
	
	search: function(value, properties)
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
	},
	
	add: function(properties, values, entity)
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
	},

	add_array: function(properties, values)
	{
		var promises = [];
		
		for (var i = 0; i < values.length; i++)
		{
			var promise = this.add(properties, values[i]);
			promises.push(promise);
		}
	
		return Promise.all(promises);
	},

	add_object: function(object)
	{
		return this.add(Object.keys(object), Object.values(object));
	},

	insert_on_mass: function(data)
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
	},

	insert_in_mass: function(data, index, length)
	{		 
		var self = this;

		var ids = Object.keys(data);
		var ids_lenght = length;
		var properties = Object.keys(data[ids[0]]);
		var propertie_lenght = properties.length;
		var bindings = [];
		var values = '';

		for (var i = index; i < ids_lenght; i++)
		{
			for (var j = 0;j<propertie_lenght; j ++)
			{
				if (typeof data[ids[i]][properties[j]] == "object")
				{
					data[ids[i]][properties[j]] = JSON.stringify(data[ids[i]][properties[j]]);
				}

				bindings.push(data[ids[i]][properties[j]]);

				if (j == 0) values += '(?,';
				else if (j == propertie_lenght-1) values +='?)';
				else values += '?,';
			}
			if (i < ids_lenght-1 ) values += ',';
		}

		return self.db.query('INSERT INTO ' + self.table + ' (' + properties.join(',') + ') VALUES ' + values, bindings).catch(function(error)
		{
			if (ws_defines.debug) console.log(error);
			throw error;
		});
	},


	replace: function(properties, values, entity)
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
	},

	replace_object: function(object)
	{
		return this.replace(Object.keys(object), Object.values(object));
	},

	get: function(condition, binding, properties, extra)
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
	},

	set: function(condition, binding, properties, values, entity)
	{
		var self = this;
		var synchronizing = ws_synchronizer.synchronizing;
		
		if (binding != undefined) values = values.concat(binding);
		
		return self.find(condition, binding).then(function(result)
		{
			debugger
			var ids = ws_engine.get_ids(result);
			
			return self.db.query('UPDATE ' + self.table + ' SET ' + properties.join(' = ?, ') + ' = ?' + (condition != undefined ? ' WHERE ' + condition : ''), values).then(function(result)
			{
				return ws_synchronizer.synchro_db_modify(self.table, ids, properties, values, entity, result, synchronizing);
			});
		});
	},

	set_object: function(condition, binding, object)
	{
		return this.set(condition, binding, Object.keys(object), Object.values(object));
	},
	
	delete: function(condition, binding, entity)
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
	},

	delete_all: function()
	{
		return this.delete();
	},

	truncate: function()
	{
		return this.delete_all();		
	},

	drop: function()
	{
		return this.db.query('DROP TABLE IF EXISTS ?', [this.table]);
	},

	//! Entity based tables

	count_entity: function(condition, binding)
	{
		return this.count(ws_datamodel.get_entity_condition(entity, condition), binding);
	},
	
	all_entity: function(properties, extra)
	{
		return this.find(ws_datamodel.get_entity_condition(entity), properties, extra);
	},
	
	find_entity: function(entity, condition, binding, properties, extra)
	{
		return this.find(ws_datamodel.get_entity_condition(entity, condition), binding, properties, extra);
	},
	
	delete_entity: function(entity, condition, binding)
	{
		return this.delete(ws_datamodel.get_entity_condition(entity, condition), binding);
	},

	delete_all_entity: function(entity)
	{
		return this.delete(ws_datamodel.get_entity_condition(entity));
	},
	
	delete_all_entity_links: function(entity, id)
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
	},
	
	//! ID based tables

	exists_with_id: function(id)
	{
		return this.exists('id = ?', [id]);
	},

	get_with_id: function(id)
	{
		return this.get('id = ?', [id]);
	},

	set_with_id: function(id, properties, values)
	{
		return this.set('id = ?', [id], properties, values);
	},

	set_object_with_id: function(id, object)
	{
		return this.set_object('id = ?', [id], object);
	},

	delete_with_id: function(id)
	{
		return this.delete('id = ?', [id]);
	},

	//! Server ID based tables

	get_with_server_id: function(server_id, id)
	{
		return this.get(WS_OBJECT_PROPERTY_SERVER + ' = ? AND ' + WS_OBJECT_PROPERTY_SERVER_ID + ' = ?', [server_id, id]);
	},

	set_with_server_id: function(server_id, id, properties, values)
	{
		return this.set(WS_OBJECT_PROPERTY_SERVER + ' = ? AND ' + WS_OBJECT_PROPERTY_SERVER_ID + ' = ?', [server_id, id], properties, values);
	},

	set_object_with_server_id: function(server_id, id, object)
	{
		return this.set_object(WS_OBJECT_PROPERTY_SERVER + ' = ? AND ' + WS_OBJECT_PROPERTY_SERVER_ID + ' = ?', [server_id, id], object);
	},

	delete_with_server_id: function(server_id, id)
	{
		return this.delete(WS_OBJECT_PROPERTY_SERVER + ' = ? AND ' + WS_OBJECT_PROPERTY_SERVER_ID + ' = ?', [server_id, id]);
	},
	
	get_local_id: function(server_id, id)
	{
		var self = this;
		
		return this.get(WS_OBJECT_PROPERTY_SERVER + ' = ? AND ' + WS_OBJECT_PROPERTY_SERVER_ID + ' = ?', [server_id, id]).then(function(data)
		{
			if (data == undefined) console.log("ws_database / get_local_id failed : server_id = " + server_id + ", table = " + self.table + ", id = " + id);
			
			return data != undefined ? data[WS_OBJECT_PROPERTY_ID] : null;
		});
	},
	
	get_server_id: function(id)
	{
		return this.get_with_id(id).then(function(data)
		{
			return { server: data[WS_OBJECT_PROPERTY_SERVER], id: data[WS_OBJECT_PROPERTY_SERVER_ID] };
		});
	},

	//! Link based methods
	
	get_linked_to: function(link, id)
	{
		return this.find(link + ' = ' + id);
	},
	
	count_linked_to: function(link, id, condition, binding)
	{
		return this.count('(' + link + ' = ' + id + ')' + (condition != undefined ? ' AND ' + condition : ''), binding);
	},

	sum_linked_to: function(link, id, property, condition, binding)
	{
		return this.sum(property, '(' + link + ' = ' + id + ')' + (condition != undefined ? ' AND ' + condition : ''), binding);
	},

	all_linked_to: function(link, id, properties, extra)
	{
		return this.find(link + ' = ' + id, undefined, properties, extra);
	},

	find_linked_to: function(link, id, condition, binding, properties, extra)
	{
		return this.find('(' + link + ' = ' + id + ')' + (condition != undefined ? ' AND ' + condition : ''), binding, properties, extra);
	},
	
	delete_linked_to: function(link, id)
	{
		return this.delete(link + ' = ' + id, undefined);
	},

	//! Server based methods
	
	count_with_server: function(server, condition, binding)
	{
		return this.count(WS_OBJECT_PROPERTY_SERVER + ' = ' + server + ' AND ' + condition, binding);
	},

	all_with_server: function(server, properties, extra)
	{
		return this.find(WS_OBJECT_PROPERTY_SERVER + ' = ' + server, undefined, properties, extra);
	},

	find_with_server: function(server, condition, binding, properties, extra)
	{
		return this.find(WS_OBJECT_PROPERTY_SERVER + ' = ' + server + ' AND ' + condition, binding, properties, extra);
	},

	add_with_server: function(server, properties, values)
	{
		properties.push(WS_OBJECT_PROPERTY_SERVER);
		values.push(server);
		
		return this.add(properties, values);
	},

	add_object_with_server: function(server, object)
	{
		object[WS_OBJECT_PROPERTY_SERVER] = server;
		
		return this.add_object(object);
	},

	delete_with_server: function(server)
	{
		return this.delete(WS_OBJECT_PROPERTY_SERVER + ' = ?', [server]);
	},
	
	//! Server and link based methods
	
	count_with_server_and_link: function(server, link, id, condition, binding)
	{
		return this.count(WS_OBJECT_PROPERTY_SERVER + ' = ' + server + ' AND ' + link + ' = ' + id + (condition != undefined ? ' AND ' + condition : ''), binding);
	},

	sum_with_server_and_link: function(server, link, id, property, condition, binding)
	{
		return this.sum(property, WS_OBJECT_PROPERTY_SERVER + ' = ' + server + ' AND ' + link + ' = ' + id + (condition != undefined ? ' AND ' + condition : ''), binding);
	},
	
	all_with_link: function(link, id, properties, extra)
	{
		return this.find(link + ' = ' + id, undefined, properties, extra);
	},

	all_with_server_and_link: function(server, link, id, properties, extra)
	{
		return this.find(WS_OBJECT_PROPERTY_SERVER + ' = ' + server + ' AND ' + link + ' = ' + id, undefined, properties, extra);
	},

	find_with_server_and_link: function(server, link, id, condition, binding, properties, extra)
	{
		return this.find(WS_OBJECT_PROPERTY_SERVER + ' = ' + server + ' AND ' + link + ' = ' + id + ' AND ' + condition, binding, properties, extra);
	},

	add_with_server_and_link: function(server, link, id, properties, values)
	{
		properties.push(WS_OBJECT_PROPERTY_SERVER);
		values.push(server);
		
		properties.push(link);
		values.push(id);

		return this.add(properties, values);
	},

	add_object_with_server_and_link: function(server, link, id, object)
	{
		object[WS_OBJECT_PROPERTY_SERVER] = server;
		object[link] = id;
		
		return this.add_object(object);
	},

	delete_with_server_and_link: function(server, link, id)
	{
		return this.delete(WS_OBJECT_PROPERTY_SERVER + ' = ? AND ' + link + ' = ?', [server, id]);
	},
});
