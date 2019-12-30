//! Page

var ws_form = Class.extend(
{
	constructor: function(object, page, form_id, data, load, save)
	{
		var self = this;
		
		this.page = page;
		this.form_id = form_id;
		this.form = object.get_element(form_id);
		//this.form = $$("#" + form_id);
		this.data = data;		
		
		// Load
		
		if (load == undefined)
		{
			var method = this.form.attr("ws_load_data");
			
			if (method != undefined && method.length > 0)
			{
				load = object[method];
			}
			else load = function(object, page, form, data)
			{
				app.form.fillFromData(form, data);
				
				return Promise.resolve();
			};
		}
		
		// Save
		
		if (save == undefined)
		{
			var method = this.form.attr("ws_save_data");
			
			if (method != undefined && method.length > 0)
			{
				save = object[method];
			}
			else save = function(object, page, form)
			{
				return Promise.resolve(app.form.convertToData(form));
			};
		}

		// Run
		
		load(object, page, form_id, data).then(function()
		{	
			// Submit
			
			var button = $(form).find(".submit");
			
			if (button) button.click(function()
			{
				self.form.submit();
				//$("#" + form_id).submit();
			});
		
			//$("#" + form_id).submit(function(event)
			self.form.submit(function(event)
			{
				event.preventDefault();
	
				save(object, page, form_id).then(function(data)
				{
				})
				.catch(function(error)
				{
					alert("Error : " + error);
				});
			});
		});
	},
	
	clear: function()
	{
		var data = app.form.convertToData(form);
		
		if (data != undefined)
		{
			Object.keys(data).forEach(function(key, index)
			{
				if (typeof data[key] == 'string')
				{
					data[key] = '';
				}
				else if (typeof data[key] == 'number')
				{
					data[key] = 0;
				}
				else if (Array.isArray(data[key]))
				{
					data[key] = [];
				}
		 	});
		 	
			app.form.fillFromData(form, data);
		}
	}
});