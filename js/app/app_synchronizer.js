//! App Synchronizer

class app_synchronizer_class extends ws_synchronizer_class
	{
		constructor()
		{
			super();
			this.start_delay = 10000;
			this.wakeup_delay = 2000;
			this.next_delay = 10000;
			this.synchronizing = true;
		}
		
		import_data_item(key, data)
		{
			var self = this;
			var data = data;
			var ids = data != undefined ? Object.keys(data) : [];
			var promises = [];

			function replace_server_id(self, item)
			{
				var server_id = ws_engine.get_server_id();
				var server_ids = {};

				// if (item[PROPERTY_COLLABORATEUR]) server_ids[PROPERTY_COLLABORATEUR] = {server: server_id, entity: IDEC_DATAMODEL_ENTITY_COLLABORATEURS, id: item[PROPERTY_COLLABORATEUR]};
				
				return self.get_locals_ids(server_ids).then(function(ids)
				{
					var properties = Object.keys(ids);
					
					for (var i = 0;i<properties.length; i++)
					{
						data[item.server_id][properties[i]] = ids[properties[i]];
					}
				});
			}

			for (var i = 0; i < ids.length; i++)
			{
				promises.push(replace_server_id(self, data[ids[i]]));
			}

			return Promise.all(promises).then(function(result)
			{
				return data;
			});
		}
	}
	
	var ws_synchronizer = new app_synchronizer_class();