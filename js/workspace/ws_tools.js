//! Database

var ws_tools = new function()
{
	this.get_montant_as_string = function(montant, centimes)
	{
		var str = montant != undefined ? (centimes ? montant / 100 : montant) + " €" : "-,--";
		
		return str.replace('.', ',');
	}
    
    this.get_amount_as_string = function(amount, decimals)
    {
        var amount = (Math.round(amount*100)/100).toString();
        
        return amount.replace('.', ',');
    }
	
	this.toast = function(message, position, delais)
    {
	    if (position == undefined) position = 'bottom';
	    if (delais == undefined) delais = 2500;
	    
	    var toast = app.toast.create({
			text: message,
			position: position,
			closeTimeout: delais,
		});
		
		toast.open();
    }
    
	this.get_date_with_db_date = function(date)
	{
		return new Date(Date.parse(date.replace('-','/').replace('-','/')));
	}
	
	this.get_date_with_default_format = function(date)
	{
		if (date == undefined) date = new Date();
		if (typeof date === 'string') date = this.get_date_with_db_date(date);

		var day = "0" + date.getDate();
		var month = "0" + (date.getMonth() + 1);
		
		return date.getFullYear() + '-' + month.substr(-2) + '-' + day.substr(-2);
	}
	
	this.get_date_with_iso_format = function(date)
	{
		if (date == undefined) date = new Date();

		return date.toISOString().substring(0, 10);
	}
	
	this.get_date_as_string = function(date, long_year)
	{
		if (date == undefined) date = new Date();
		if (typeof date === 'string') date = this.get_date_with_db_date(date);
		if (long_year == undefined) long_year = false;

		var day = "0" + date.getDate();
		var month = "0" + (date.getMonth() + 1);
		var year = "0" + date.getFullYear();
		
		return day.substr(-2) + '/' + month.substr(-2) + '/' + (long_year ? date.getFullYear() : year.substr(-2));
	}
    
    this.get_date_as_string_y = function(date, long_year)
	{
        var new_date = new Date();
        if (long_year == undefined) long_year = false;
        
        new_date.setFullYear(date.substr(0, 4));
		new_date.setMonth((date.substr(5, 7).substr(0, 2))-1);
		new_date.setDate(date.substr(8, 9));
        
        var day = "0" + new_date.getDate();
		var month = "0" + (new_date.getMonth() + 1);
		var year = "0" + new_date.getFullYear();
		
		return day.substr(-2) + '/' + month.substr(-2) + '/' + (long_year ? new_date.getFullYear() : year.substr(-2));
        
    }
	
	this.get_time_with_default_format = function(date, seconds)
	{
		if (date == undefined) date = new Date();
		if (typeof date === 'string') date = this.get_date_with_db_date(date);

		var hours = "0" + date.getHours();
		var minutes = "0" + date.getMinutes();
		
		return hours.substr(-2) + ':' + minutes.substr(-2);
	}
	
	this.get_time_with_iso_format = function(date)
	{
		if (date == undefined) date = new Date();

		return date.toISOString().substring(12);
	}
	
	this.get_time_as_string = function(date, seconds)
	{
		if (date == undefined) date = new Date();
		if (typeof date === 'string') date = this.get_date_with_db_date(date);

		var hours = "0" + date.getHours();
		var minutes = "0" + date.getMinutes();
		
		return hours.substr(-2) + 'h' + minutes.substr(-2);
	}
    
    this.get_time_as_string_y = function(time, seconds)
	{
		if (time == undefined) time = new Date();

		var hours = time.substr(0, 2);
		var minutes = time.substr(3,2);
		
		return hours.substr(-2) + 'h' + minutes.substr(-2);
	}
    
	this.get_datetime_with_default_format = function(date)
	{
		if (date == undefined) date = new Date();
		if (typeof date === 'string') date = this.get_date_with_db_date(date);

		var day = "0" + date.getDate();
		var month = "0" + (date.getMonth() + 1);
		var hours = "0" + date.getHours();
		var minutes = "0" + date.getMinutes();
		var secondes = "0" + date.getSeconds();
		
		return date.getFullYear() + '-' + month.substr(-2) + '-' + day.substr(-2) + ' ' + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + secondes.substr(-2);
	}
	
	this.get_datetime_with_iso_format = function(date)
	{
		if (date == undefined) date = new Date();

		return date.toISOString();
	}
	
	this.get_date_as_string = function(date) //usefull
	{
		if (date == undefined) date = new Date();
		if (typeof date === 'string') date = this.get_date_with_db_date(date);

		var day = "0" + date.getDate();
		var month = "0" + (date.getMonth() + 1);
		
		return day.substr(-2) + '/' + month.substr(-2) + '/' + date.getFullYear();
	}
	
	this.get_datetime_as_string = function(date)
	{
		if (date == undefined) date = new Date();
		if (typeof date === 'string') date = this.get_date_with_db_date(date);

		var day = "0" + date.getDate();
		var month = "0" + (date.getMonth() + 1);
		var hours = "0" + date.getHours();
		var minutes = "0" + date.getMinutes();
		
		return day.substr(-2) + '/' + month.substr(-2) + '/' + date.getFullYear() + ' ' + hours.substr(-2) + 'h' + minutes.substr(-2);
	}
	
	this.base64_to_blob = function(b64Data, contentType, sliceSize)
	{
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize)
        {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            
            for (var i = 0; i < slice.length; i++)
            {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

		return new Blob(byteArrays, {type: contentType});
	}
	
	this.url_to_blob = function(url)
	{
		return new Promise(function(resolve, reject)
		{
			var xhr = new XMLHttpRequest();
			
			xhr.onload = function() { resolve(xhr.response); };			
			xhr.open('GET', url);
			xhr.responseType = 'blob';
			xhr.send();
		});
	}

	this.blob_to_base64 = function(blob)
	{
		return new Promise(function(resolve, reject)
		{
			var reader = new FileReader();
			
			reader.onloadend = function()
			{
				resolve(reader.result);
			}
			
			reader.onerror = function(error)
			{
				reject(error);
			}
			
			reader.readAsDataURL(blob);
		});
	}

	this.url_to_base64 = function(url)
	{
		var self = this;
		
		return this.url_to_blob(url).then(function(blob)
		{
			return self.blob_to_base64(blob);
		});
	}
	
	this.image_url_to_base64 = function(img)
	{
		var canvas = document.createElement("canvas");
		
		canvas.width = img.width;
		canvas.height = img.height;
		
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);
		
		return canvas.toDataURL("image/jpeg");
	}
	
	this.create_image = function()
	{
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		
		Filters.createImageData = function(w,h) {
		  return this.tmpCtx.createImageData(w,h);
		};
	}

	this.color_filter = function(image_data, black)
	{
		console.log("Image filter : color_filter");			
				
		var pixels = image_data.data;

		var total_r = 0;
		var total_g = 0;
		var total_b = 0;
	
		for (var i = 0; i < pixels.length; i += 4)
		{
			var r = pixels[i];
			var g = pixels[i+1];
			var b = pixels[i+2];
			
			if (r > black && g > black && b > black)
			{
				total_r += r;
				total_g += g;
				total_b += b;
			}
		}
		
		var total = total_r + total_g + total_b;
		var keep_r = total_r < total_g && total_r < total_b;
		var keep_g = total_g < total_r && total_g < total_b;
		var keep_b = total_b < total_r && total_b < total_g;
		
		console.log("  -> Red : " + Math.floor(100 * total_r / total) + " %, Green :  " + Math.floor(100 * total_g / total) + " %, Blue :  " + Math.floor(100 * total_b / total) + " %");			

		for (var i = 0; i < pixels.length; i += 4)
		{
			var r = pixels[i];
			var g = pixels[i+1];
			var b = pixels[i+2];
			
			var grey = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
			
			if (grey <= black)
			{
				pixels[i] = pixels[i+1] = pixels[i+2] = grey;
			}
			else if (keep_r)
			{
				pixels[i+1] = pixels[i+2] = r;
			}
			else if (keep_g)
			{
				pixels[i] = pixels[i+2] = g;
			}
			else if (keep_b)
			{
				pixels[i] = pixels[i+1] = b;
			}
		}

		return image_data;
	};

	this.threshold_filter = function(image_data, threshold, black)
	{
		console.log("Image filter : threshold_filter (" + threshold + ")");			
				
		var pixels = image_data.data;
		
		if (black == undefined) black = 180;
		if (threshold == undefined) black = 100;

		for (var i = 0; i < pixels.length; i += 4)
		{
			if (pixels[i] < 60)
			{
				pixels[i] = pixels[i+1] = pixels[i+2] = 0;
			}
			else if (pixels[i] >= threshold)
			{
				pixels[i] = pixels[i+1] = pixels[i+2] = 255;
			}
		}
		
		return image_data;
	};

	this.separate_color_bw_filter = function(image_data, black, color)
	{
		console.log("Image filter : separate_color_bw_filter (" + black + ", " + color + ")");			
			
		if (black == undefined) black = 120;
		if (color == undefined) color = 30;
			
		var pixels = image_data.data;
		var blacks = 0;
		var colors = 0;

		for (var i = 0; i < pixels.length; i += 4)
		{
			var r = pixels[i];
			var g = pixels[i+1];
			var b = pixels[i+2];
			
			var avg = (r + g + b) / 3;
			var grey = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
			
			if (r < black && g < black && b < black)
			{
				blacks += 1;
 				pixels[i] = pixels[i+1] = pixels[i+2] = 0;
			}
			else if ((r < avg - color) || (r > avg + color) || (g < avg - color) || (g > avg + color) || (b < avg - color) || (b > avg + color))
			{
				pixels[i] = pixels[i+1] = pixels[i+2] = 255;
				colors += 1;
			}
		}
	
		console.log("  -> Blacks : " + (100 * blacks / pixels.length) + " %, Greys :  " + Math.floor(100 * (pixels.length - blacks - colors) / pixels.length)
			+ " %, Colors :  " + Math.floor(100 * colors / pixels.length) + " %");			

		return image_data;
	};

	this.convolute_filter = function(image_data, weights)
	{
		console.log("Image filter : convolute_filter");			
				
		var sw = image_data.width;
		var sh = image_data.height;
		var src = image_data.data;

		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		var output = ctx.createImageData(sw, sh);
		var dst = output.data;

		var side = Math.round(Math.sqrt(weights.length));
		var halfSide = Math.floor(side / 2);

		var w = sw;
		var h = sh;
		
		for (var y = 0; y < h; y++)
		{
			for (var x = 0; x < w; x++)
			{
				var sy = y;
				var sx = x;
				var dstOff = (y * w + x) * 4;
				
				var r = 0, g = 0, b = 0, a = 0;

				for (var cy = 0; cy < side; cy++)
				{
					for (var cx = 0; cx < side; cx++)
					{
						var scy = sy + cy - halfSide;
						var scx = sx + cx - halfSide;
						
						if (scy >= 0 && scy < sh && scx >= 0 && scx < sw)
						{
							var srcOff = (scy * sw + scx) * 4;
							var wt = weights[cy * side + cx];
							
							r += src[srcOff] * wt;
							g += src[srcOff+1] * wt;
							b += src[srcOff+2] * wt;
						}
					}
				}
				
				dst[dstOff] = r;
				dst[dstOff+1] = g;
				dst[dstOff+2] = b;
				dst[dstOff+3] = 255;
			}
		}
		
		return output;
	};

	this.remove_points_filter = function(image_data)
	{
		console.log("Image filter : remove_points_filter");			
				
		var w = image_data.width;
		var h = image_data.height;
		var src = image_data.data;

		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		var output = ctx.createImageData(w, h);
		var dst = output.data;
		
		var is_black = function(x, y)
		{
			var offset = (y * w + x) * 4;
			
			return src[offset] < 20 && src[offset + 1] < 20 && src[offset + 2] < 20;
		}
		
		var is_white = function(x, y)
		{
			var offset = (y * w + x) * 4;
			
			return src[offset] > 230 && src[offset + 1] > 230 && src[offset + 2] > 230;
		}
		
		for (var y = 0; y < h; y++)
		{
			for (var x = 0; x < w; x++)
			{
				var offset = (y * w + x) * 4;

				if (y == 0 || y == h - 1 || x == 0 || x == w - 1)
				{
					dst[offset] = src[offset];
					dst[offset + 1] = src[offset + 1];
					dst[offset + 2] = src[offset + 2];
					dst[offset + 3] = 255;
				}
				else if (is_black(x, y) && is_white(x - 1, y - 1) && is_white(x, y - 1) && is_white(x + 1, y - 1) && is_white(x - 1, y) && is_white(x + 1, y)
					&& is_white(x - 1, y + 1) && is_white(x, y + 1) && is_white(x + 1, y + 1))
				{
					dst[offset] = 255;
					dst[offset + 1] = 255;
					dst[offset + 2] = 255;
					dst[offset + 3] = 255;
				}
				else
				{
					dst[offset] = src[offset];
					dst[offset + 1] = src[offset + 1];
					dst[offset + 2] = src[offset + 2];
					dst[offset + 3] = 255;
				}
			}
		}
		
		return output;
	};
	
	this.remove_big_points_filter = function(image_data)
	{
		console.log("Image filter : remove_big_points_filter");			
				
		var w = image_data.width;
		var h = image_data.height;
		var src = image_data.data;
		
		var is_black = function(x, y)
		{
			var offset = (y * w + x) * 4;
			
			return src[offset] < 20 && src[offset + 1] < 20 && src[offset + 2] < 20;
		}
		
		var is_white = function(x, y)
		{
			var offset = (y * w + x) * 4;
			
			return src[offset] > 230 && src[offset + 1] > 230 && src[offset + 2] > 230;
		}
		
		var rect_is_black = function(x, y, depth)
		{
			var half = Math.floor(depth / 2);
			
			for (var ry = y - half; ry < y + half; ry++) for (var rx = x - half; rx < x + half; rx++) if (!is_black(rx, ry)) return false;
			
			return true;
		}
		
		var rect_frame_is_white = function(x, y, inside, depth)
		{
			var half = Math.floor(inside / 2);
			
			for (var rx = x - half - depth; rx < x + half + depth; rx++) for (var ry = y - half - depth; ry < y - half        ; ry++) if (!is_white(rx, ry)) return false;
			for (var rx = x - half - depth; rx < x + half + depth; rx++) for (var ry = y + half        ; ry < y + half + depth; ry++) if (!is_white(rx, ry)) return false;
			for (var rx = x - half - depth; rx < x - half        ; rx++) for (var ry = y - half        ; ry < y + half        ; ry++) if (!is_white(rx, ry)) return false;
			for (var rx = x + half        ; rx < x + half + depth; rx++) for (var ry = y - half        ; ry < y + half        ; ry++) if (!is_white(rx, ry)) return false;

			return true;
		}

		var fill_rect = function(x, y, width, r, g, b, a)
		{
			var half = Math.floor(width / 2);
			
			for (var ry = y - half; ry < y + half; ry++) for (var rx = x - half; rx < x + half; rx++)
			{
				var offset = (ry * w + rx) * 4;
				
				src[offset + 0] = r;
				src[offset + 1] = g;
				src[offset + 2] = b;
				src[offset + 3] = a;
			}
		}

		var size = 7;
		var half_size = Math.floor(size / 2);

		var y = half_size;
		
		while (y < h - half_size)
		{
			var x = half_size;
			
			while (x < w - half_size)
			{
				if (x > 1 && y > 1 && x < w - 2 && y < h - 2 && rect_is_black(x, y, 5) && rect_frame_is_white(x, y, 5, 2))
				{
					fill_rect(x, y, 7, 255, 255, 255, 255);
				}

				if (++x >= w - half_size)
				{
					x = half_size;
					y += 1;
				}
			}
		}
		
		return image_data;
	};

	this.filter_image = function(img, threshold, grays, top, height)
	{
		if (top == undefined) top = 0;
		if (height == undefined) height = img.height;
		
		var canvas = document.createElement("canvas");
		
		canvas.width = img.width;
		canvas.height = height;
		
		var ctx = canvas.getContext("2d");
		
		ctx.drawImage(img, 0, -top);
		
		var image_data = ctx.getImageData(0, 0, img.width, img.height);
		
		//image_data = this.convolute_filter(image_data, [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9]);
		image_data = this.convolute_filter(image_data, [0, -1, 0, -1,  5, -1, 0, -1, 0]);
		image_data = this.threshold_filter(image_data, threshold);
		image_data = this.remove_big_points_filter(image_data);
		
		ctx.putImageData(image_data, 0, 0);
		
		return canvas;
	}

	this.map_filter = function(image_data, map)
	{
		console.log("Map filter : remove_big_points_filter");			
				
		var pixels = image_data.data;
		var coeff = image_data.height / map.height;

		var w = image_data.width;
		var h = image_data.height;

		for (var i = 0; i < map.areas.length; i++)
		{
			var top = map.areas[i].area.top * coeff;
			var left = map.areas[i].area.left * coeff;
			var height = map.areas[i].area.height * coeff;
			var width = map.areas[i].area.width * coeff;

			for (var y = top; y < top + height; y++) for (var x = left; x < left + width; x++)
			{
				var o = (y * w + x) * 4;
					
				pixels[o+3] = 0;
			}
		}

		for (var i = 0; i < pixels.length; i += 4)
		{
			if (pixels[i+3] == 0)
			{
				pixels[i+3] = 255;
			}
			else
			{
				pixels[i] = pixels[i+1] = pixels[i+2] = 130;
			}
		}
		
		return image_data;
	}

	this.get_sharpen_filtered_image_data = function(img)
	{
		var self = this;
		
		return new Promise(function(resolve, reject)
		{
			var image = new Image();
			
			image.onload = function()
			{ 
				var canvas = document.createElement("canvas");
				
				canvas.width = image.width;
				canvas.height = image.height;
				
				var ctx = canvas.getContext("2d");
				
				ctx.drawImage(image, 0, 0);
				
				var image_data = ctx.getImageData(0, 0, image.width, image.height);
				
				image_data = self.convolute_filter(image_data, [0, -1, 0, -1,  5, -1, 0, -1, 0]);
				
				ctx.putImageData(image_data, 0, 0);
				
				resolve(canvas.toDataURL("image/jpeg"));
			}
			
			image.src = img.src;
		});
	}

	this.get_color_filtered_image_data = function(img, black, color)
	{
		var self = this;
		
		return new Promise(function(resolve, reject)
		{
			var image = new Image();
			
			image.onload = function()
			{ 
				var canvas = document.createElement("canvas");
				
				canvas.width = image.width;
				canvas.height = image.height;
				
				var ctx = canvas.getContext("2d");
				
				ctx.drawImage(image, 0, 0);
				
				var image_data = ctx.getImageData(0, 0, image.width, image.height);
				
				image_data = self.separate_color_bw_filter(image_data, black, color);
				
				ctx.putImageData(image_data, 0, 0);
				
				resolve(canvas.toDataURL("image/jpeg"));			
			}
			
			image.src = img.src;
		});
	}

	this.get_threshold_filtered_image_data = function(img, threshold, black)
	{
		var self = this;
		
		return new Promise(function(resolve, reject)
		{
			var image = new Image();
			
			image.onload = function()
			{ 
				var canvas = document.createElement("canvas");
				
				canvas.width = image.width;
				canvas.height = image.height;
				
				var ctx = canvas.getContext("2d");
				
				ctx.drawImage(image, 0, 0);
				
				var image_data = ctx.getImageData(0, 0, image.width, image.height);
				
				image_data = self.threshold_filter(image_data, threshold, black);
				
				ctx.putImageData(image_data, 0, 0);
				
				resolve(canvas.toDataURL("image/jpeg"));			
			}
			
			if (typeof img === 'string')
			{
				image.src = img;
			}
			else
			{
				image.src = img.src;
			}
		});
	}

	this.get_filtered_image_data = function(img, map, black, color, threshold)
	{
		var self = this;
		
		return new Promise(function(resolve, reject)
		{
			var image = new Image();
			
			image.onload = function()
			{ 
				var canvas = document.createElement("canvas");
				
				canvas.width = image.width;
				canvas.height = image.height;
				
				var ctx = canvas.getContext("2d");
				
				ctx.drawImage(image, 0, 0);
				
				var image_data = ctx.getImageData(0, 0, image.width, image.height);
				
				image_data = self.map_filter(image_data, map);
				image_data = self.separate_color_bw_filter(image_data, black, color);
				image_data = self.color_filter(image_data, black);
				image_data = self.threshold_filter(image_data, threshold, black);
				
				ctx.putImageData(image_data, 0, 0);
				
				resolve(canvas.toDataURL("image/jpeg"));			
			}
			
			if (typeof img === 'string')
			{
				image.src = img;
			}
			else
			{
				image.src = img.src;
			}
		});
	}

	this.get_extra_filtered_image_data = function(img, threshold)
	{
		var self = this;
		
		return new Promise(function(resolve, reject)
		{
			var image = new Image();
			
			image.onload = function()
			{ 
				var canvas = document.createElement("canvas");
				
				canvas.width = image.width;
				canvas.height = image.height;
				
				var ctx = canvas.getContext("2d");
				
				ctx.drawImage(image, 0, 0);
				
				var image_data = ctx.getImageData(0, 0, image.width, image.height);
				
				image_data = self.threshold_filter(image_data, threshold);
				
				ctx.putImageData(image_data, 0, 0);
				
				resolve(canvas.toDataURL("image/jpeg"));			
			}
			
			image.src = img.src;
		});
	}

	this.get_image_text = function(img, char_blacklist)
	{
		var self = this;
		
		return new Promise(function(resolve, reject)
		{
			console.log("Call Tesseract");
			
			if (char_blacklist == undefined) char_blacklist = '!,?§$ÄÂÀËÊÉÖÔÜÛŸüûöô';
			
			Tesseract.recognize(img, { lang: 'fra', tessedit_char_blacklist: char_blacklist, tessedit_pageseg_mode:1 }).then(function(result)
			{
				console.log("Text : " + result.text);			

				resolve(result.text);
			})
			.catch(function(error)
			{
				if (ws_defines.debug) console.log(error);
				reject(error);
			});
		});
	}
	
	this.isEqual = function(a, b) 
	{
	    // Create arrays of property names
	    var aProps = Object.getOwnPropertyNames(a);
	    var bProps = Object.getOwnPropertyNames(b);
	
	    // If number of properties is different,
	    // objects are not equivalent
	    if (aProps.length != bProps.length) {
	        return false;
	    }
	
	    for (var i = 0; i < aProps.length; i++) {
	        var propName = aProps[i];
	
	        // If values of same property are not equal,
	        // objects are not equivalent
	        if (a[propName] !== b[propName]) {
	            return false;
	        }
	    }
	
	    // If we made it this far, objects
	    // are considered equivalent
	    return true;
	}
	
	this.cleanArray = function(array) 
	{
		var i, j, len = array.length, out = [], obj = {};
		
		for (i = 0; i < len; i++)
		{
			obj[array[i]] = 0;
		}
		
		for (j in obj)
		{
			out.push(parseInt(j)); 
		}
		
		return out;
	}
	
	this.get_image_areas_text = function(img, map)
	{
		var self = this;
		
		return new Promise(function(resolve, reject)
		{
			var image = new Image();
			
			image.onload = function()
			{ 
				var result = new Object();
				var promises = new Array();
				var black_list = map.setup.char_blacklist;
				var height = map.height;
				var coeff = image.height / height;
								
				promises.push(self.get_image_text(image, black_list).then(function(text)
				{
					result['all'] = text;
				})
				.catch(function(error)
				{
					if (ws_defines.debug) console.log(error);
					reject(error);
				}));				

				var canvas = document.createElement("canvas");
				canvas.width = image.width;
				canvas.height = image.height;
				
				var ctx = canvas.getContext("2d");
				ctx.drawImage(image, 0, 0);

				for (var i = 0; i < map.areas.length; i++)
				{
					promises.push(new Promise(function(resolve, reject)
					{
						var area_map = map.areas[i];
						var area_property = area_map.property;
						var area_top = area_map.area.top * coeff;
						var area_left = area_map.area.left * coeff;
						var area_height = area_map.area.height * coeff;
						var area_width = area_map.area.width * coeff;
					
						var area_img_data = ctx.getImageData(area_left, area_top, area_width, area_height);
						var area_canvas = document.createElement("canvas");
						var area_ctx = area_canvas.getContext("2d");
						
						area_canvas.width = area_width;
						area_canvas.height = area_height;
										
						area_ctx.putImageData(area_img_data, 0, 0);

						var area_result = new Object();
						var area_image = new Image();

						area_image.onload = function()
						{
/*
							area_result.name = area_map.name;
							area_result.property = area_map.property;
							area_result.image = area_image;
							
*/
							self.get_image_text(area_image, black_list).then(function(text)
							{
								area_result.text = text;
								
								result[area_property] = text;
								
								resolve();
							})
							.catch(function(error)
							{
								if (ws_defines.debug) console.log(error);
								reject(error);
							});
						}

						area_image.src = area_canvas.toDataURL("image/jpeg");
					}));
				}
				
				Promise.all(promises).then(function()
				{
					resolve(result);
				})
				.catch(function(error)
				{
					if (ws_defines.debug) console.log(error);
					reject(error);
				});
			};
			
			image.src = img.src;
		});
	}
}

//! Compatibility

if (Object.values == undefined)
{
	Object.values = function(object)
	{
		console.log("Object.values compatibility call");
		
		return Object.keys(object).map(function(key) { return object[key]; });
	};
};
