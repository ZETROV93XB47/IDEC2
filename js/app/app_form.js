function form(page, form, data, errors)
{
	if (data != undefined)
	{		
		$(form).find("input[data-structure]").each(function(e)
		{
			var type = $(this).attr("data-structure");
			var property = $(this).attr("name");
			
			if (data[property] != undefined)
			{
				if (type == "date")
				{
					data[property + "_year"] = data[property].substr(0, 4);
					data[property + "_month"] = data[property].substr(5, 2);
					data[property + "_day"] = data[property].substr(8, 2);
				}
			}
		});
		
		app.form.fillFromData(form, data);
	}
	
	if (errors != undefined)
	{
		$(form).find(".errors").show();
		
		Object.keys(errors).forEach(function (property, index)
		{
			$("form input[name='" + property + "']").parents(".item-inner").find(".item-label span.error").html('(' + errors[property] + ')');
		});
	}
	else
	{
		$(form).find(".errors").hide();
	}
	
	var button = $(form).find(".submit");
	
	if (button) button.click(function()
	{
		$(form).submit();
	});
	
	var button = $$(page.el).find(".fab .submit[data-form='" + $(form).attr('id') + "']");
	
	if (button.length > 0)
	{
		button.click(function()
		{
			$(form).attr("nav-direction", $(this).parent().attr("nav-direction"));
			$(form).attr("nav-route", $(this).parent().attr("nav-route"));
			$(form).submit();
		});
	}
	else
	{
		button = $$(page.el).find(".fab .submit");
		
		if (button.length > 0) button.parent().click(function()
		{
			$(form).attr("nav-direction", $(this).attr("nav-direction"));
			$(form).attr("nav-route", $(this).attr("nav-route"));
			$(form).submit();
		});
	}

	$(form).find('input').on('keyup', function(e)
	{
		var go_to_next_input = false;
		
		var mEvent = e || window.event;
		var mPressed = mEvent.keyCode || mEvent.which;
		
		if (mPressed == 13)
		{
			go_to_next_input = true;
		}	
		else
		{	
			var max_length = $(this).attr("data-max-length");
			
			go_to_next_input = typeof max_length !== typeof undefined && max_length !== false && max_length > 0 && $(this).val().length >= max_length;
		}
		
		if (go_to_next_input)
		{
			var inputs = $(form).find("input");			
			inputs.eq(inputs.index($(this)) + 1).focus();
		}
		
		return true;
	});

	return $(form);
}

function form_submit(form, event)
{
	return new Promise(function(resolve, reject)
	{
		var data = app.form.convertToData(form);
		
		$(form).find("input[data-structure]").each(function(e)
		{
			var type = $(this).attr("data-structure");
			var property = $(this).attr("name");
			
			if (data[property] != undefined)
			{
				if (type == "date")
				{
					data[property] = data[property + "_year"]  + "-" + data[property + "_month"] + "-" + data[property + "_day"];
				}
			}
		});

		resolve(data);
	});
}

function form_clear(form)
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

function form_navigate(form, routes, forward, backward)
{
	var route = mainView.router.currentRoute.path;
	var direction = $(form).attr("nav-direction");
	var nav_route = $(form).attr("nav-route");
	var pos = routes.indexOf(route);
	var new_route = undefined;

	if (nav_route != undefined && nav_route.length > 0)
	{
		new_route = nav_route;
	}
	else if (direction != undefined && direction == "backward")
	{
		if (backward != undefined)
		{
			new_route = backward;
		}
		else if (pos > 0)
		{
			new_route = routes[pos - 1];
		}
	}
	else
	{
		if (forward != undefined)
		{
			new_route = forward;
		}
		else if (pos == -1 && routes.length > 1)
		{
			new_route = routes[1];
		}
		else if (pos < routes.length - 1)
		{
			new_route = routes[pos + 1];
		}
	}
	
	if (new_route != undefined)
	{
		mainView.router.navigate(new_route);
		return new_route;
	}
	
	return null;
}	

function form_camera(page, form, prefix, data)
{
	var button = $$(form).find(prefix + '_btn');
	var image = $$(form).find(prefix + '_img');
	var button_on = $$(form).find(prefix + '_on');
	var input = $$(form).find(prefix + '_data');
	var simu = $$(form).find(prefix + '_simu');
	var property = input.length > 0 ? input.attr('name') : undefined;
	var image_data = input.length > 0 && property != undefined ? data[property] : undefined;

	if (image_data != undefined && image_data.length > 0)
	{			
		button.hide();
		
		if (image.length > 0)
		{
			image.show();
			image.attr('src', "data:image/jpeg;base64," + image_data);
		}
		else if (button_on.length > 0)
		{
			button_on.show();
		}
	}
	else
	{
		button.show();
		
		if (image.length > 0)
		{
			image.hide();
		}
		else if (button_on.length > 0)
		{
			button_on.hide();
		}
	}
		
	$$(form).find(prefix+'_btn' + ',' + prefix+'_img').on('click', function (e)
	{
		if (app.device.desktop)
		{
			var image_data = "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";
			
			button.hide();

			if (simu.length > 0)
			{
				image.attr('src', simu.attr('src'));
				image.show();
			}
			else if (image.length > 0)
			{
				image.attr('src', "data:image/jpeg;base64," + image_data);
				image.show();
			}
			else
			{
				button_on.show();
			}			
		    
		    if (input != undefined) input.val(image_data);
		}
		else
		{				
			navigator.camera.getPicture(function (image_data)
			{
		    	button.hide();
		    	
				if (image.length > 0)
				{
					image.attr('src', "data:image/jpeg;base64," + image_data);
					image.show();
				}
				else if (button_on.length > 0)
				{
					button_on.show();
				}			
			    
			    if (input != undefined) input.val(image_data);
		    },
		    function (message)
		    {
		    	console.log("camera.getPicture Error : " + message);
			    alert('Error : ' + message);
			},
			{
				quality: 50,
				sourceType: Camera.PictureSourceType.CAMERA,
				destinationType: Camera.DestinationType.DATA_URL,
				encodingType: Camera.EncodingType.JPEG,
				mediaType: Camera.MediaType.PICTURE,
				allowEdit : true
			});
		}
	});
}

function form_camera_notarisation(page, form, prefix, data)
{
	var button = $$(form).find(prefix + '_btn');
	var image = $$(form).find(prefix + '_img');
	var button_on = $$(form).find(prefix + '_on');
	var input = $$(form).find(prefix + '_data');
	var simu = $$(form).find(prefix + '_simu');
	var property = input.length > 0 ? input.attr('name') : undefined;
	var image_data = input.length > 0 && property != undefined ? data[property] : undefined;
	
	if (image_data != undefined && image_data.length > 0)
	{
		button.hide();
		
		if (image.length > 0)
		{
			image.show();
			image.attr('src', "data:image/jpeg;base64," + image_data);
		}
		else if (button_on.length > 0)
		{
			button_on.show();
		}
	}
	else
	{
		button.show();
		
		if (image.length > 0)
		{
			image.hide();
		}
		
		if (button_on.length > 0)
		{
			button_on.hide();
		}
	}
		
	$$(form).find(prefix+'_btn' + ',' + prefix+'_img').on('click', function (e)
	{
		current_camera_prefix = prefix;
		mainView.router.navigate('/camera/');
	});
}

function form_ocr(page, map)
{
	var button = $$(page.el).find('#ocr-camera');
	var image = $$(page.el).find('#ocr-image');
	var original = $$(page.el).find('#ocr-original');
	var black_slider = $$(page.el).find('#ocr-black-slider');
	var color_slider = $$(page.el).find('#ocr-color-slider');
	var threshold_slider = $$(page.el).find('#ocr-threshold-slider');
	var threshold = 113;
	
	$$(page.el).find('#ocr-camera, #ocr-image').on('click', function (e)
	{
		if (true || app.device.desktop)
		{
			button.hide();

			image.attr('src', original.attr('src'));
			image.show();
			
			app.range.setValue(threshold_slider, threshold);
		}
		else
		{				
			navigator.camera.getPicture(function(image_data)
			{
		    	button.hide();
		    	
				if (image.length > 0)
				{
					original.attr('src', "data:image/jpeg;base64," + image_data);

					image.attr('src', "data:image/jpeg;base64," + image_data);
					image.show();
			
					app.range.setValue(threshold_slider, threshold);
				}
		    },
		    function (message)
		    {
		    	console.log("camera.getPicture Error : " + message);
			    alert('Error : ' + message);
			},
			{
				quality: 60,
				sourceType: Camera.PictureSourceType.CAMERA,
				destinationType: Camera.DestinationType.DATA_URL,
				encodingType: Camera.EncodingType.PNG,
				mediaType: Camera.MediaType.PICTURE,
				targetWidth: 600,
				allowEdit : true
			});
		}
	});
	
	$$(page.el).find('#ocr-original').on('click', function (e)
	{
		image.attr('src', original.attr('src'));
	});

	$$(page.el).find('#ocr-color').on('click', function (e)
	{
		tools.get_color_filtered_image_data(image[0]).then(function(image_data)
		{
			image.attr('src', image_data);
		});
	});

	$$(page.el).find('#ocr-sharpen').on('click', function (e)
	{
		tools.get_sharpen_filtered_image_data(image[0]).then(function(image_data)
		{
			image.attr('src', image_data);
		});
	});

	$$(page.el).find('#ocr-threshold').on('click', function (e)
	{
		tools.get_filtered_image_data(original[0], map, app.range.getValue(black_slider), app.range.getValue(color_slider), app.range.getValue(threshold_slider)).then(function(image_data)
		{
			image.attr('src', image_data);
		});
	});

	black_slider.on('range:change', function (e, range)
	{
		tools.get_filtered_image_data(original[0], map, app.range.getValue(black_slider), app.range.getValue(color_slider), app.range.getValue(threshold_slider)).then(function(image_data)
		{
			image.attr('src', image_data);
		});
	});

	color_slider.on('range:change', function (e, range)
	{
		tools.get_filtered_image_data(original[0], map, app.range.getValue(black_slider), app.range.getValue(color_slider), app.range.getValue(threshold_slider)).then(function(image_data)
		{
			image.attr('src', image_data);
		});
	});

	threshold_slider.on('range:change', function (e, range)
	{
		tools.get_filtered_image_data(original[0], map, app.range.getValue(black_slider), app.range.getValue(color_slider), app.range.getValue(threshold_slider)).then(function(image_data)
		{
			image.attr('src', image_data);
		});
	});

	$$('#ocr-engine').click(function(event)
	{
		tools.get_image_areas_text(image[0], map).then(function(result)
		{
			console.log(result);
			alert(JSON.stringify(result));
		})
		.catch(function(error)
		{
			if (ws_defines.debug) console.log(error);
			alert(error);
		});
	});
}