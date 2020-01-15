var osiri_photos = new function()
{
    this.take_photo = function(camera_type)
	{
		if (app.device.desktop)
		{
			return Promise.resolve(ws_defines.SAMPLE_IMAGE);
		}
		else return new Promise(function(resolve, reject)
		{
			navigator.camera.getPicture(function(image_data)
			{
				return resolve(image_data);
			},
			function (message)
			{
				if (ws_defines.debug) console.log("camera.getPicture error : " + message);
				return reject(message);
			},
			osiri_photos.setOptions(camera_type)
			);
		});
	}

    this.setOptions = function(srcType)
	{
	    var options = 
	    {
		    quality: ws_defines.CAMERA_QUALITY,
			sourceType: srcType,
			destinationType: Camera.DestinationType.DATA_URL,
			encodingType: Camera.EncodingType.JPEG,
			mediaType: Camera.MediaType.PICTURE,
			allowEdit : true
	    }
		return options;
	}
}