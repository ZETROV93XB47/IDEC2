//! WS Synchronizer

var ws_synchronizer_class = Class.extend(
{
	start_delay : 5000,
	wakeup_delay : 2000,
	next_delay : 5000,
	
	synchro_enabled: true,
	synchronizing : true,
	timer : undefined,
	
	map : undefined,
	reverse_map : undefined,
	
	constructor : function()
	{
	},
	
	start : function(delay)
	{
		if (delay == undefined) delay = this.start_delay;
		
		console.log("synchronizer : start (" + delay + ")"); 
		
		if (self.timer == undefined)
		{
			//this.set_timer(delay);
		}
	},

	stop : function()
	{
		console.log("synchronizer : stop"); 
		
		if (this.timer != undefined)
		{
			clearTimeout(this.timer);
			this.timer = undefined;
			
			return true;
		}
		
		return false;
	},

	wakeup : function(delay, force)
	{
		console.log("synchronizer : wakeup (" + delay + ")"); 
		
		if (delay == undefined) delay = this.wakeup_delay;
		if (force == true) this.synchronizing = false;
		
		if (this.timer != undefined)
		{
			clearTimeout(this.timer);
			this.timer = undefined;
		}
		
		this.set_timer(delay);
	},

	sync_is_on : function()
	{
		return this.timer != undefined;
	},
	
	sync : function()
	{
		console.log("synchronizer : now"); 
		
		var sync = this.timer != undefined;
		
		if (sync) clearTimeout(this.timer);
		this.timer = undefined;
		
		try
		{	
			this.synchronize();
		}
		catch(error)
		{
			if (ws_defines.debug) console.log(error);
		}
		
		if (sync) this.wakeup();
	},

	set_timer : function(delay)
	{
		var self = this;
		
		console.log("synchronizer : set_timer "+ delay); 
		
		if (delay == undefined) delay = this.start_delay;
		
		if (this.timer == undefined)
		{
			this.timer = setTimeout(function()
			{
				console.log("synchronizer : timer fired"); 
				
				self.timer = undefined;
				
				self.synchronize();
			},
			delay);
		}
	},

	synchronize : function()
	{
		var self = this;
		
		console.log("synchronizer : synchronize"); 
		
		if (!this.synchronizing)
		{
			self.synchronizing = true;

			self.custom_synchronize().then(function()
			{
				return self.synchronize_next_photo();
			})
/*
			.then(function()
			{
				console.log("synchronizer : synchronize_next_photo done"); 

				return ws_database.photos.count('(status IS "' + ws_defines.PHOTO_STATUS_NEW + '") OR (status IS "' + ws_defines.PHOTO_STATUS_ERROR + '")');
			})
			.then(function(number)
			{
				console.log("synchronizer : photo count : " + number); 
				
				self.synchronizing = false;
				
				if (number > 0) self.set_timer(self.next_delay);
			})
*/
			.then(function()
			{
				console.log("synchronizer : synchronization done"); 
		
				self.synchronizing = false;
				
				if (self.next_delay != undefined) self.set_timer(self.next_delay);
			})
			.catch(function(error)
			{
				if (ws_defines.debug) console.log("synchronizer : synchronization error : " + error);
				
				self.synchronizing = false;
				
				if (self.next_delay != undefined) self.set_timer(self.next_delay);
			});
		}
	},

	synchronize_next_photo : function()
	{
		return Promise.resolve();
	},

	custom_synchronize : function()
	{
		return Promise.resolve(); 
	},
	
	is_synchronizing : function()
	{
		return this.synchronizing;
	},
	
	logout : function()
	{
		var self = this;
		
		console.log("synchronizer : logout"); 
		
		return new Promise(function(resolve, reject)
		{
			resolve();
		});
	},
	
	//! Data synchronization
	
	get_synchronization_infos : function()
	{
		var entities = ws_datamodel.get_entities();
		var infos = [];
		
		if (entities != undefined) for (var i = 0; i < entities.length; i++)
		{
			var info = ws_datamodel.get_entity_infos(entities[i]);
		
			if (info.synch)
			{
				info.entity = entities[i];
				infos.push(info);
			}
		}
		
		return infos;
	},
	
	get_synchronization_map : function(server)
	{
		var self = this;
		var map = {};

		return this.get_synchronization_infos().then(function(infos)
		{
			var promises = [];
			
			if (infos) for (var i = 0; i < infos.length; i++)
			{
				var properties = [WS_OBJECT_PROPERTY_ID, WS_OBJECT_PROPERTY_SERVER, WS_OBJECT_PROPERTY_SERVER_ID, WS_OBJECT_PROPERTY_SYNC_TIMESTAMP,  WS_OBJECT_PROPERTY_SYNC_STATUS];
				var table = ws_database.get_table_with_entity(infos[i].table);
				
				promises.push(table.find_with_server(server, infos[i].filter, undefined, properties).then(function(records)
				{
					map[infos[i].entity] = records;
				}));
			}
			
			Promise.all(promises).then(function()
			{
				// OK
			})
			.catch(function(erreur)
			{
				if (ws_defines.debug) console.log(error);
			});
		});
	},
	
	synchronize_data : function()
	{
		return Promise.resolve()
		
		return ws_database.synchro_event.all().then(function(result)
		{
			var param = {};
			return this.api('synchronize_data', param, ws_engine.get_server_url());
		});
	},

	//! Data import
	
	import_all_data : function(server_id, data)
	{
		var self = this;
		var infos = self.get_synchronization_infos();
		var startTime;
		var elapsedTime;
		
		this.map = {};
		this.reverse_map = {};
		//if ( data == undefined) data = {};
		
		var process_next_key = function (index)
		{
			if (index == undefined) index = 0;
			
			if (index < infos.length)
			{
				startTime = new Date().getTime();
				elapsedTime = 0;
				var entity = infos[index].synch_key;

				return self.import_key_data(entity, data[entity]).then(function(result)
				{
					elapsedTime = new Date().getTime() - startTime;
					// app.dialog.alert("Temps de chargement des "+ infos[index].synch_key +" : "  + elapsedTime + " ms");
					console.log("Temps de chargement des "+ infos[index].synch_key +" : "  + elapsedTime + " ms");
					return process_next_key(index + 1);
				});
			}

			return Promise.resolve();
		}
		
		return ws_database.clear_server_data(server_id).then(function()
		{		
			return process_next_key();
		});
	},
			
	import_key_data : function(key, data)
	{
		// var promises = [];
		var self = this;
		var data = data;
		var server = ws_engine.get_server_id();
		var ids = data != undefined ? Object.keys(data) : [];
		var data_len = ids.length;
		var entity = key;
		
		if (data) return this.import_data_item(key, data).then(function(data)
		{
			return ws_database.get_table_with_entity(entity).insert_on_mass(data).then(function(result)
			{
				if (result.insertId) var last_id = result.insertId;
				else var last_id = result[result.length-1].insertId;
				
				var index = last_id - data_len;

				for (var i = 0; i<data_len; i++)
				{
					self.set_map_local_id(server, key, ids[i], index + 1);
					index++;
				}
			})
		});
		return Promise.resolve();
	},

	import_data_item : function(key, id, data)
	{
		console.log("Import data : " + key + ", id : " + id);
		
		return Promise.resolve();
	},

	reload_all_data : function(server_id)
	{
		var self = this;

		return ws_database.clear_server_data(server_id).then(function()
		{
			return ws_server.synchro(ws_storage.get_value(WS_STORAGE_KEY_USER_TOKEN));
		})
		.then(function(result)
		{	
			self.map = result.map;
			data = result.data;
			
			return self.import_all_data(server_id, data);
		});
	},

	//! Map
	
	set_map_local_id : function(server, entity, server_id, local_id)
	{
		if (server == undefined) server = 0;
		
		if (this.map == undefined) this.map = {};
		if (this.map[server] == undefined) this.map[server] = {};
		if (this.map[server][entity] == undefined) this.map[server][entity] = {};

		this.map[server][entity][server_id] = local_id;
		
		if (this.reverse_map == undefined) this.reverse_map = {};
		if (this.reverse_map[server] == undefined) this.reverse_map[server] = {};
		if (this.reverse_map[server][entity] == undefined) this.reverse_map[server][entity] = {};
		
		this.reverse_map[server][entity][local_id] = server_id;
		
		return Promise.resolve(local_id);
	},
	
	get_local_id : function(server, entity, server_id)
	{
		var self = this;

		if (server == undefined) server = 0;
		
		if (server_id == undefined)
		{
			return Promise.resolve(undefined);
		}
		else if (this.map != undefined && this.map[server] != undefined && this.map[server][entity] != undefined && this.map[server][entity][server_id] != undefined)
		{
			return Promise.resolve(this.map[server][entity][server_id]);
		}
		else return ws_database.get_table_with_entity(entity).get_local_id(server, server_id).then(function(id)
		{
			return self.set_map_local_id(server, entity, server_id, id);
		})
		.then(function(id)
		{			
			return id;
		});
	},
	
	get_locals_ids : function(server_ids) // server_ids = {property => { server, entity , id }}
	{
		var self = this;
		var promises = [];
		var result = {};
		var properties = Object.keys(server_ids);
		
		for (var i = 0; i < properties.length; i++) promises.push(new Promise(function(resolve, reject)
		{
			var property = properties[i];
			var item = server_ids[property];
			
			if (item.id == 0)
			{
				resolve(result[property] = 0);
			}
			else self.get_local_id(item.server, item.entity, item.id).then(function(id)
			{
				resolve(result[property] = id);
			})
			.catch(function(error)
			{
				reject(error);
				if (ws_defines.debug) console.log(error);
			});
		}));

		return Promise.all(promises).then(function()
		{	
			return result;
		});
	},
	
	get_server_id : function(server, entity, local_id)
	{
		var self = this;

		if (server == undefined) server = 0;
		
		if (local_id == undefined)
		{
			return Promise.resolve(undefined);
		}
		else if (this.reverse_map != undefined && this.reverse_map[server] != undefined && this.reverse_map[server][entity] != undefined && this.reverse_map[server][entity][local_id] != undefined)
		{
			return Promise.resolve(this.reverse_map[server][entity][local_id]);
		}
		else return ws_database.get_table_with_entity(entity).get_server_id(local_id).then(function(id)
		{
			if (self.reverse_map == undefined) self.reverse_map = {};
			if (self.reverse_map[server] == undefined) self.reverse_map[server] = {};
			if (self.reverse_map[server][entity] == undefined) self.reverse_map[server][entity] = {};
		
			self.reverse_map[server][entity][local_id] = id.id;
			
			return id.id;
		});
	},
	
	//! Database synchro
	
	getData : function(properties, values)
	{
		var data = {};
		
		for(var i = 0; i<properties.length; i++)
		{
			data[properties[i]] = values[i];
		}
		
		return data;
	},

	synchro_db_add : function(table, properties, values, entity, result, synchronizing)
	{
		if ( entity == undefined ) entity = ws_datamodel.get_table_entity(table);
		var entity_infos = ws_datamodel.get_entity_infos(entity);
		
		if ( entity_infos != undefined ) if (entity_infos.synch)
		{
			if (db_is_inited && synchronizing)
			{
				var data = ws_synchronizer.getData(properties, values);
				
				var synchro_properties = [
					WS_SYNC_PROPERTY_SERVER,
					WS_SYNC_PROPERTY_SERVER_ID,
					WS_SYNC_PROPERTY_APP_ID,
					WS_SYNC_PROPERTY_ENTITY,
					WS_SYNC_PROPERTY_ACTION,
					WS_SYNC_PROPERTY_TYPE,
					WS_SYNC_PROPERTY_DATA,
				];
				
				var synchro_values = [
					ws_engine.get_server_id(),
					null, // probleme
					result.insertId.toString(),
					entity,
					WS_SYNC_ACTION_ADD,
					WS_SYNC_TYPE_OBJECT,
					JSON.stringify(data)
				];
				
				ws_database.synchro_event.add(synchro_properties, synchro_values);
			}
		}
		
		return result.insertId;
	},
	
	synchro_db_modify : function(table, ids, properties, values, entity, result, synchronizing)
	{
		if (entity == undefined) entity = ws_datamodel.get_table_entity(table);

		var entity_infos = ws_datamodel.get_entity_infos(entity);		
		var data = ws_synchronizer.getData(properties, values);
				
		if (entity_infos != undefined) if (entity_infos.synch)
		{
			if (db_is_inited && synchronizing)
			{
				var synchro_properties = [
					WS_SYNC_PROPERTY_SERVER,
					WS_SYNC_PROPERTY_SERVER_ID,
					WS_SYNC_PROPERTY_APP_ID,
					WS_SYNC_PROPERTY_ENTITY,
					WS_SYNC_PROPERTY_ACTION,
					WS_SYNC_PROPERTY_TYPE,
					WS_SYNC_PROPERTY_DATA,
				];
				
				var synchro_values = [
					ws_engine.get_server_id(),
					ids[0].server_id ? ids[0].server_id.toString() : 'null',
					ids[0].id.toString(),
					entity,
					WS_SYNC_ACTION_MODIFY,
					WS_SYNC_TYPE_OBJECT,
					JSON.stringify(data)
				];
				
				ws_database.synchro_event.add(synchro_properties, synchro_values);
			}
		}
		
		return result;
	},
	
	synchro_db_delete : function(table, ids, entity, result, synchronizing)
	{
		if (entity == undefined) entity = ws_datamodel.get_table_entity(table);
		var entity_infos = ws_datamodel.get_entity_infos(entity);
		
		if (entity_infos != undefined && entity_infos.synch)
		{
			if (db_is_inited && synchronizing)
			{
				var promises = [];
				
				function func(server_id, local_id)
				{
					var condition = "server_id = ? AND action = ?";
					var binding = server_id;
					
					if (server_id == undefined)
					{
						server_id = 'null';
						condition = "app_id = ? AND action = ?"; 
						binding = local_id;
					}
					
					ws_database.synchro_event.delete(condition, [binding.toString(), 'modify']).then(function()
					{
						return ws_database.synchro_event.find(condition, [binding.toString(), 'add']);
					})
					.then(function(found)
					{
						if (found.length > 0)
						{
							return ws_database.synchro_event.delete_with_id(found[0].id);
						}
						else
						{
							var synchro_properties = [
								WS_SYNC_PROPERTY_SERVER,
								WS_SYNC_PROPERTY_SERVER_ID,
								WS_SYNC_PROPERTY_APP_ID,
								WS_SYNC_PROPERTY_ENTITY,
								WS_SYNC_PROPERTY_ACTION,
								WS_SYNC_PROPERTY_TYPE,
								WS_SYNC_PROPERTY_DATA,
							];
							
							var synchro_values = [
								ws_engine.get_server_id(),
								server_id.toString(),
								local_id.toString(),
								entity,
								WS_SYNC_ACTION_DELETE,
								WS_SYNC_TYPE_OBJECT,
								null
							];
							
							return ws_database.synchro_event.add(synchro_properties, synchro_values);
						}
					});
				}
				
				for (var i = 0; i < ids.length; i++)
				{
					promises.push(func(ids[i].server_id, ids[i].id));
				}
				
				return Promise.all(promises);
			}
		}
		
		return result;
	},
	
	get_local_map: function()
	{
		var map = {};
		var entities = ws_datamodel.get_entities();
		var entities_sync = [];
		var index = 0;
		
		return new Promise(function(resolve, reject)
		{
			for (var i = 0; i < entities.length; i++)
			{
				var entities_infos = ws_datamodel.get_entity_infos(entities[i]);
				
				if (entities_infos.synch)
				{
					entities_sync.push(entities_infos.synch_key);
					if (entities_infos.filter) var condition = entities_infos.filter;
					else var condition = undefined;
					entities_infos.db.all([WS_OBJECT_PROPERTY_SERVER_ID, WS_OBJECT_PROPERTY_SYNC_TIMESTAMP], condition).then(function(result)
					{
						var db_lignes = {};
						for(var j = 0; j < result.length; j++)
						{
							if (result[j][WS_OBJECT_PROPERTY_SERVER_ID] == null) continue;
							db_lignes[result[j][WS_OBJECT_PROPERTY_SERVER_ID]] = result[j];
						}
						map[entities_sync[index]] = db_lignes;
						index++;
					});
				}
			}
			resolve(map);
		})
		.catch(function(error)
		{
			if (ws_defines.debug) console.log(error);
		});
	},
	
	get_updates: function()
	{
		return ws_database.synchro_event.all();
	},
	
	
	synchro_db_with_server: function()
	{
		var self = this;
		self.startTime;
		self.elapsedTime;
		
		var map;
		var update = [];
		var params = {};
		
		return self.get_local_map().then(function(map_from_db)
		{
			map = map_from_db;
			
			return self.get_updates()
		})
		.then(function(update_from_db)
		{

			if (update_from_db.length > 0) for(var i = 0; i<update_from_db.length; i++)
			{
				update_from_db[i].data = (update_from_db[i].action != "delete") ? JSON.parse(update_from_db[i].data) : [];
				update.push(update_from_db[i]);
			}
			
			params.map = map;
			params.updates = update;
			debugger
			self.startTime = new Date().getTime();
			self.elapsedTime = 0;
			return ws_server.synchronize_all_data(params);
		})
		.then(function(status)
		{
			self.elapsedTime = new Date().getTime() - self.startTime;
			console.log("Temps réponse de serveur (synchronisation) : " + self.elapsedTime + " ms");
			debugger;
			
			self.startTime;
			self.elapsedTime;
			if (status.success) 
			{
				self.startTime = new Date().getTime();
				self.elapsedTime = 0;
				if (status.updates) return self.apply_synchro_update(status.updates).then(function(result)
				{
					if (update != undefined) return ws_database.synchro_event.delete_all();
				})
				.then(function()
				{
					return ws_server.get_files(status.updates);
				})
				.then(function()
				{
					self.elapsedTime = new Date().getTime() - self.startTime;
					console.log("Temps de chargement (synchronisation) : " + self.elapsedTime + " ms");
					return Promise.resolve(true);
				})
				.catch(function(error)
				{
					if (ws_defines.debug) console.log(error);
				});
				return Promise.resolve(true);
			}
			else if( typeof status == "string")
			{
				throw status;
			}
			else
			{
				app.dialog.close();
				app.dialog.alert("Synchronisation non terminée !");
				return Promise.resolve(false);
			}
		})
		.catch(function(error)
		{
			if (ws_defines.debug) console.error(error);
		});
	},
	
	apply_synchro_update: function(updates)
	{
		var self = this;
		var index = 0;
		
		function add(data, entitie_infos)
		{
			return ws_server.set_local_ids(data).then(function(data)
			{
				var properties = Object.keys(data);
				var values = Object.values(data);
				
				for (var i = 0; i < values.length; i++)
				{
					if (typeof values[i] == "object")
					{
						values[i] = JSON.stringify(values[i]);
					}
				}
				
				return entitie_infos.db.add_with_server(ws_engine.get_server_id(), properties, values);
			})
			.catch(function(error)
			{
				if (ws_defines.debug) console.log(error);
			});
		}
		
		function added(update, entitie_infos)
		{
			return entitie_infos.db.set_with_id(update.app_id, [WS_OBJECT_PROPERTY_SERVER_ID, WS_OBJECT_PROPERTY_SYNC_TIMESTAMP],[update.server_id, update.timestamp]);
		}
		
		function modify(update, entitie_infos)
		{
			return ws_server.set_local_ids(update.data).then(function(data)
			{
				var properties = Object.keys(data);
				var values = Object.values(data);
				
				for (var i = 0; i<values.length; i++)
				{
					if (typeof values[i] == "object")
					{
						values[i] = JSON.stringify(values[i]);
					}
				}
				
				return entitie_infos.db.set_with_server_id(ws_engine.get_server_id(), update.server_id, properties, values);
			})
			.catch(function(error)
			{
				if (ws_defines.debug) console.log(error);
			});
		}
		
		function remove(update, entitie_infos)
		{
			return entitie_infos.db.delete_with_server_id(ws_engine.get_server_id(), update.server_id);
		}
		
		
		function apply(update)
		{
			if (update)
			{
				ws_synchronizer.synchronizing = false;
				
				var entitie_infos = ws_datamodel.get_entity_infos(update.entity);
				
				if (update.action == WS_SYNC_ACTION_ADD)
				{
					return add(update.data, entitie_infos).then(function()
					{
						index++;
						return apply(updates[index]);
					});
				}
				else if (update.action == WS_SYNC_ACTION_ADDED)
				{
					return added(update, entitie_infos).then(function()
					{
						index++;
						return apply(updates[index]);
					});
				}
				else if (update.action == WS_SYNC_ACTION_MODIFY)
				{
					return modify(update, entitie_infos).then(function()
					{
						index++;
						return apply(updates[index]);
					});
				}
				else if (update.action == WS_SYNC_ACTION_DELETE)
				{
					self.if_apply_update(update ,entitie_infos).then(function(if_apply)
					{
						if(if_apply)
						{
							return remove(update, entitie_infos).then(function()
							{
								index++;
								return apply(updates[index]);
							});
						}
						else
						{
							index++;
							return apply(updates[index]);
						}
					});
				}
				else
				{
					index++;
					console.log("Action de synchronisation inconnue : " + update.action + ")");
					return apply(updates[index]);
				}
			}
			
			return Promise.resolve();
		}

		if (updates != 'no_changes')
		{
			return apply(updates[index]);
		}
		
		return Promise.resolve();
	},
	
	//! Convert
	
	convert_str : function(str)
	{
		return typeof str == 'string' ? str : '';
	},
	
	convert_date : function(str)
	{
		return str;
	},
	
	convert_time : function(str)
	{
		return str;
	}
});
	