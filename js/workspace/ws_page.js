//! Page

class ws_page
{
	constructor(id)
	{
		this.id = id;
	}
	
	init(page, event, params)
	{
		var self = this;
		
		this.page = page;
		this.params = params;
		
		app_inited().then(function()
		{
			return self.custom_init(page, event, params);
		})
		.then(function(result)
		{
			if (result)
			{
				$$(page.el).find("[ws_on_click]").each(function()
				{
					var call = self[this.getAttribute("ws_on_click")];
					
					if (this.className.search("segmented") >= 0)
					{
						$$(page.el).find("#" + this.id + " .button").attr("type", "button");

						return self.on_segment_click(page, "#" + this.id, call, self);
					}
					else
					{						
						return self.on_click(page, "#" + this.id, call, self);
					}
				});
				
				$$(page.el).find("[ws_on_switch]").each(function()
				{
					self.set_toggle_switch_icon(page, this.id, this.getAttribute("ws_value"), this.getAttribute("ws_icon_on"), this.getAttribute("ws_icon_off"), function(container, value)
					{
						var call = container.getAttribute("ws_on_switch");
						
						return self[call](self, page, container, value);
					});
				});
			}
		});
	}
	
	custom_init(page, event, params)
	{
		return Promise.resolve(true);
	}
	
	reinit(page, event, params)
	{
		var self = this;
			
		this.page = page;
		this.params = params;

		app_inited().then(function()
		{
			return self.custom_reinit(page, event, params);
		})
		.then(function(result)
		{
		});
	}
	
	custom_reinit(page, event, params)
	{
		return Promise.resolve(true);
	}
	
	beforein(page, event, params)
	{
		var self = this;
			
		this.page = page;
		this.params = params;

		app_inited().then(function()
		{
			return self.custom_beforein(page, event, params);

		})
		.then(function(result)
		{
			if (result)
			{
				$$(page.el).find("[ws_on_click]").each(function()
				{
					var call = self[this.getAttribute("ws_on_click")];
					
					if (this.className.search("segmented") >= 0)
					{
						$$(page.el).find("#" + this.id + " .button").attr("type", "button");

						return self.on_segment_click(page, "#" + this.id, call, self);
					}
					else
					{						
						return self.on_click(page, "#" + this.id, call, self);
					}
				});
				
				$$(page.el).find("[ws_on_switch]").each(function()
				{
					self.set_toggle_switch_icon(page, this.id, this.getAttribute("ws_value"), this.getAttribute("ws_icon_on"), this.getAttribute("ws_icon_off"), function(container, value)
					{
						var call = container.getAttribute("ws_on_switch");
						
						return self[call](self, page, container, value);
					});
				});
			}

		});
	}
	
	custom_beforein(page, event, params)
	{
		return Promise.resolve(true);
	}
	
	afterin(page, event, params)
	{
		var self = this;
			
		this.page = page;
		this.params = params;

		app_inited().then(function()
		{
			return self.custom_afterin(page, event, params);
		})
		.then(function(result)
		{
		});
	}
	
	custom_afterin(page, event, params)
	{
		return Promise.resolve(true);
	}
	
	beforeout(page, event, params)
	{
		var self = this;
			
		this.page = page;
		this.params = params;

		app_inited().then(function()
		{
			return self.custom_beforeout(page, event, params);
		})
		.then(function(result)
		{
		});
	}
	
	custom_beforeout(page, event, params)
	{
		return Promise.resolve(true);
	}
	
	afterout(page, event, params)
	{
		var self = this;
			
		this.page = page;
		this.params = params;

		app_inited().then(function()
		{
			return self.custom_afterout(page, event, params);
		})
		.then(function(result)
		{
		});
	}
	
	custom_afterout(page, event, params)
	{
		return Promise.resolve(true);
	}
		
	tabshow(page, event)
	{
		var self = this;
			
		app_inited().then(function()
		{
			return self.custom_tabshow(page, event);
		})
		.then(function(result)
		{
		});
	}
	
	custom_tabshow(page, event)
	{
		return Promise.resolve(true);
	}

	//! Page
	
	set_title(title)
	{
		$$('.navbar .title').html(title);
	}

	//! Content
	
	get_element(id)
	{
		return $$(this.page.el).find("#" + id);
	}

	get_element_with_class(aclass)
	{
		return $$(this.page.el).find("." + aclass);
	}

	get_element_with_selector(selector)
	{
		return $$(this.page.el).find(selector);
	}
	
	get_jquery_element(id)
	{
		return $(this.page.el).find("#" + id);
	}

	get_jquery_element_with_class(aclass)
	{
		return $(this.page.el).find("." + aclass);
	}

	get_jquery_element_with_selector(selector)
	{
		return $(this.page.el).find(selector);
	}

	//! Template
	
	compile_template(page, template_id)
	{
		return app_inited().then(function ()
		{
			var template = $$(page.el).find("#" + template_id).html();
			
			return Template7.compile(template);			
		});	
	}

	apply_template(page, template_id, content_id, data)
	{
		return app_inited().then(function ()
		{
			var template = $$(page.el).find("#" + template_id).html();
			var compiled_template = Template7.compile(template);			
			var html = compiled_template(data);
			
			$$(page.el).find("#" + content_id).html(html);
			
			return data;
		});	
	}
	
	//! Tag
	
	get_tag_value(id)
	{
		var element = $$("#" + id);
		
		return $$(this.page.el).find("#" + id).attr("ws_value");
	}
	
	set_tag_value(id, value)
	{
		$$(this.page.el).find("#" + id).attr("ws_value", value);
		
		return value;
	}
	
	switch_tag_value(id)
	{
		var value = this.get_tag_value(id);
		
		return this.set_tag_value(id, value ? 0 : 1);
	}
	
	get_tag_object_id(id)
	{
		return $$(this.page.el).find("#" + id).attr("ws_id");
	}
	
	get_tag_object_server_id(id)
	{
		return $$(this.page.el).find("#" + id).attr("ws_server_id");
	}
	
	//! Interface
	
	set_toggle_switch_icon(page, container_id, value, icon_on, icon_off, on_change)
	{
		var self = this;
		var container = $$(page.el).find("#" + container_id);
		var value = parseInt(this.get_tag_value(container_id));

		container.html('<i class="' + (value ? icon_on : icon_off ) + '">');
		
		container.on('click', function()
		{
			if (parseInt(self.get_tag_value(container_id)))
			{
				if (on_change == undefined || on_change(this, 0))
				{
					self.set_tag_value(container_id, 0);
					container.html('<i class="' + icon_off + '">');
				}
			}
			else
			{
				if (on_change == undefined || on_change(this, 1))
				{
					self.set_tag_value(container_id, 1);
					container.html('<i class="' + icon_on + '">');
				}
			}
		});
	}
	
	set_segment_value(page, segment_id, value)
	{
		var buttons = $$(page.el).find("#" + segment_id + " .button");

		buttons.removeClass("button-active");
		buttons.filter(function(index, el) { return $$(this).attr('ws_value') == value; }).addClass("button-active");
	}
	
	get_segment_value(page, segment_id)
	{
		var button = $$(page.el).find("#" + segment_id + " .button.button-active");

		return button ? button.attr('ws_value') : undefined;
	}
	
	set_smart_select_value(page, smart_select_id, value)
	{
		var select = $$(page.el).find("#" + smart_select_id + " select");
		var text = $$(page.el).find("#" + smart_select_id + " .item-after");

		select.val(value);
		text.html(select.find("option[value='" + value + "']").html());
	}
	
	set_date_input(page, input_id)
	{
		app.calendar.create({ inputEl: "#" + input_id + " input", dateFormat: 'dd/mm/yy' });
	}

	//! Events
	
	on_event(page, selector, event, call, self)
	{
		if (self == undefined) self = this;
		
		$$(page.el).find(selector).on(event, function (event)
		{
			call(self, page, selector, event);
		});
	}
	
	on_click(page, selector, call, self)
	{
		if (self == undefined) self = this;
		
		$$(page.el).find(selector).click(function(event)
		{
			call(self, page, selector, event);
		});
	}
	
	on_segment_click(page, selector, call, self)
	{
		if (self == undefined) self = this;
		
		var buttons = $$(page.el).find(selector + " .button");
		var value = $$(page.el).find(selector).attr("ws_value");
		
		if (value != undefined && value.length > 0)
		{
			buttons.removeClass("button-active");
			buttons.filter(function(index, el) { return $$(this).attr('ws_value') == value; }).addClass("button-active");
		}

		$$(page.el).find(selector + " .button").on('click', function(event)
		{
			var value = $$(this).attr("ws_value");
			
			buttons.removeClass("button-active");
			$$(this).addClass("button-active");
			
			call(self, page, selector, this, event);
		});
	}
	
	//! Forms
	
	install_form(page, form, data)
	{
		return new ws_form(this, page, form, data);
	}
}
