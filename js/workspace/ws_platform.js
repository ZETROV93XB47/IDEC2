// Platform

const PLATFORM_DEVICE_TYPE_IOS = 'ios';
const PLATFORM_DEVICE_TYPE_ANDROID = 'android';
const PLATFORM_DEVICE_TYPE_WINDOWS_PHONE = 'windows_phone';
const PLATFORM_DEVICE_TYPE_DESKTOP = 'desktop';
const PLATFORM_DEVICE_TYPE_PWA = 'pwa';

const PLATFORM_DEVICE_CATEGORY_SMARTPHONE = 'smartphone';
const PLATFORM_DEVICE_CATEGORY_TABLET = 'tablet';
const PLATFORM_DEVICE_CATEGORY_DESKTOP = 'desktop';
const PLATFORM_DEVICE_CATEGORY_WATCH = 'watch';
const PLATFORM_DEVICE_CATEGORY_MUSIC_PLAYER = 'music_player';
const PLATFORM_DEVICE_CATEGORY_TV = 'tv';

const PLATFORM_SYSTEM_IOS = 'ios';
const PLATFORM_SYSTEM_MACOS = 'macos';
const PLATFORM_SYSTEM_ANDROID = 'android';
const PLATFORM_SYSTEM_WINDOWS = 'windows';

const PLATFORM_BROWSER_SAFARI = 'safari';
const PLATFORM_BROWSER_CHROME = 'chrome';
const PLATFORM_BROWSER_IE = 'ie';
const PLATFORM_BROWSER_EDGE = 'edge';

const PLATFORM_CONFIG_KEY_DEVICE_NAME = 'device_name';
const PLATFORM_CONFIG_KEY_DEVICE_TYPE = 'device_type';
const PLATFORM_CONFIG_KEY_MODEL = 'model';
const PLATFORM_CONFIG_KEY_MANUFACTURER = 'manufacturer';
const PLATFORM_CONFIG_KEY_SERIAL = 'serial';
const PLATFORM_CONFIG_KEY_UUID = 'uuid';
const PLATFORM_CONFIG_KEY_SYSTEM = 'system';
const PLATFORM_CONFIG_KEY_BROWSER = 'browser';
const PLATFORM_CONFIG_KEY_OS_NAME = 'os_name';
const PLATFORM_CONFIG_KEY_OS_VERSION = 'os_version';
const PLATFORM_CONFIG_KEY_SCREEN_WIDTH = 'screen_width';
const PLATFORM_CONFIG_KEY_SCREEN_HEIGHT = 'screen_height';
const PLATFORM_CONFIG_KEY_PIXEL_RATIO = 'pixel_ratio';

const PLATFORM_UNDEFINED = '';

const REST_MOBILE_DEVICE_PROPERTY_TYPE = 'type';
const REST_MOBILE_DEVICE_PROPERTY_CATEGORY = 'category';
const REST_MOBILE_DEVICE_PROPERTY_SYSTEM = 'system';
const REST_MOBILE_DEVICE_PROPERTY_BROWSER = 'browser';

var ws_platform = new function()
{
	this.get_device_type = function()
	{
		if (ws_engine.is_pwa())
		{
			return PLATFORM_DEVICE_TYPE_IOS;
		}
		else if (app.device.ios)
		{
			return PLATFORM_DEVICE_TYPE_IOS;
		}
		else if (app.device.android)
		{
			return PLATFORM_DEVICE_TYPE_ANDROID;
		}
		else if (app.device.windowsPhone)
		{
			return PLATFORM_DEVICE_TYPE_WINDOWS_PHONE;
		}
		else if (app.device.desktop)
		{
			return PLATFORM_DEVICE_TYPE_DESKTOP;
		}
		
		return PLATFORM_UNDEFINED;
	}
	
	this.get_device_name = function()
	{
		if (ws_engine.is_pwa())
		{
			return "PWA";
		}
		else if (app.device.desktop)
		{
			return "Desktop";
		}

		return device.model;
	}
	
	this.get_device_model = function()
	{
		if (ws_engine.is_pwa())
		{
			return "PWA";
		}
		else if (app.device.desktop)
		{
			return "Desktop";
		}

		return device.model;
	}
	
	this.get_device_category = function()
	{
		if (app.device.ipad)
		{
			return PLATFORM_DEVICE_CATEGORY_TABLET;
		}
		else if (app.device.ipod)
		{
			return PLATFORM_DEVICE_CATEGORY_MUSIC_PLAYER;
		}
		else if (app.device.iphone)
		{
			return PLATFORM_DEVICE_CATEGORY_SMARTPHONE;
		}
		else if (app.device.android)
		{
			return PLATFORM_DEVICE_CATEGORY_SMARTPHONE;
		}
		else if (app.device.desktop)
		{
			return PLATFORM_DEVICE_CATEGORY_DESKTOP;
		}
		
		return PLATFORM_UNDEFINED;
	}
	
	this.get_system = function()
	{
		if (app.device.ipad || app.device.ipod || app.device.iphone || app.device.iphoneX)
		{
			return PLATFORM_SYSTEM_IOS;
		}
		else if (app.device.macos)
		{
			return PLATFORM_SYSTEM_MACOS;
		}
		else if (app.device.windows)
		{
			return PLATFORM_SYSTEM_WINDOWS;
		}
		else if (app.device.android)
		{
			return PLATFORM_SYSTEM_ANDROID;
		}
		
		return PLATFORM_UNDEFINED;
	}
	
	this.get_browser = function()
	{
		if (app.device.ipad || app.device.ipod || app.device.iphone || app.device.iphoneX || app.device.macos)
		{
			return PLATFORM_BROWSER_SAFARI;
		}
		else if (app.device.android)
		{
			return PLATFORM_BROWSER_CHROME;
		}
		else if (app.device.edge)
		{
			return PLATFORM_BROWSER_EDGE;
		}
		else if (app.device.ie || app.device.windows)
		{
			return PLATFORM_BROWSER_IE;
		}
		else
		{
			return PLATFORM_UNDEFINED;
		}
	}

	this.get_config = function()
	{
		var config = {};
		
		try
		{
			config[PLATFORM_CONFIG_KEY_DEVICE_TYPE] = this.get_device_name();
			config[PLATFORM_CONFIG_KEY_DEVICE_TYPE] = this.get_device_type();
			config[PLATFORM_CONFIG_KEY_MODEL] = this.get_device_model();
			config[PLATFORM_CONFIG_KEY_MANUFACTURER] = device.manufacturer;
			config[PLATFORM_CONFIG_KEY_SERIAL] = device.serial;
			config[PLATFORM_CONFIG_KEY_UUID] = device.uuid;
			config[PLATFORM_CONFIG_KEY_SYSTEM] = this.get_system();
			config[PLATFORM_CONFIG_KEY_BROWSER] = this.get_browser();
			config[PLATFORM_CONFIG_KEY_OS_NAME] = app.device.os;
			config[PLATFORM_CONFIG_KEY_OS_VERSION] = app.device.osVersion;
			config[PLATFORM_CONFIG_KEY_SCREEN_WIDTH] = $("#app").width();
			config[PLATFORM_CONFIG_KEY_SCREEN_HEIGHT] = $("#app").height();
			config[PLATFORM_CONFIG_KEY_PIXEL_RATIO] = app.device.pixelRatio;
		}
		catch(error)
		{
			if (ws_defines.debug) console.log(error);
		};
				
		return config;
	}
}
