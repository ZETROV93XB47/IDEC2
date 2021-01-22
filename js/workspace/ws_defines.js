//! WS Defines

const WS_STORAGE_KEY_SERVER_URL = "server_url";
const WS_STORAGE_KEY_DEVICE_UUID = "device_uuid";
const WS_STORAGE_KEY_DEVICE_ID = "device_id";
const WS_STORAGE_KEY_USER_TOKEN = "token";
const WS_STORAGE_KEY_CURRENT_SERVER_ID = "current_server_id";
const WS_STORAGE_KEY_USER_INFOS = "user_infos";
const WS_STORAGE_KEY_ADMIN_CODE = 'admin_code';
const WS_STORAGE_KEY_SUPPORT_CODE = 'support_code';
const WS_STORAGE_KEY_USER_MODE = 'user_mode';

const WS_LOCAL_STORAGE_PREFIX = "ws_";

const WS_FILES_USER_INFOS_FILE_NAME = "user.json";

const WS_USER_INFOS_KEY_NAME = 'name';
const WS_USER_INFOS_KEY_EMAIL = 'email';

const WS_VALUE_DOWNLOAD_BASE64 = 1;

//! User mode

const WS_USER_MODE_USER = 'user';
const WS_USER_MODE_ADMINISTRATOR = 'admin';
const WS_USER_MODE_ASSISTANCE = 'support';

const WS_API_PARAM_TOKEN = 'token';

//! Device

const WS_DEVICE_INFO_TYPE = 'type';
const WS_DEVICE_INFO_CATEGORY = 'category';
const WS_DEVICE_INFO_SYSTEM = 'system';
const WS_DEVICE_INFO_BROWSER = 'browser';

//! Server connection

const WS_SERVER_CONNECTION_STATE_NO_CONNECTION = 'no';
const WS_SERVER_CONNECTION_STATE_BAD_CONNECTION = 'bad';
const WS_SERVER_CONNECTION_STATE_GOOD_CONNECTION = 'good';

//! Data model

const WS_DATAMODEL_ENTITY_SERVERS = 'servers';
const WS_DATAMODEL_ENTITY_PHOTOS = 'photos';
const WS_DATAMODEL_ENTITY_FILES = 'files';
const WS_DATAMODEL_ENTITY_NOTES = 'notes';
const WS_DATAMODEL_ENTITY_ENUMS = 'enums';
const WS_DATAMODEL_ENTITY_SYNCHRO = 'synchro_event';

//! Object model

const WS_OBJECT_PROPERTY_TYPE_UNIQUE_ID = 'unique_id';
const WS_OBJECT_PROPERTY_TYPE_ID = 'id';
const WS_OBJECT_PROPERTY_TYPE_STRING = 'string';
const WS_OBJECT_PROPERTY_TYPE_DATE = 'date';
const WS_OBJECT_PROPERTY_TYPE_TIME = 'time';
const WS_OBJECT_PROPERTY_TYPE_DATETIME = 'date_time';
const WS_OBJECT_PROPERTY_TYPE_INTEGER = 'int';
const WS_OBJECT_PROPERTY_TYPE_BOOLEAN = 'bool';
const WS_OBJECT_PROPERTY_TYPE_REAL = 'real';
const WS_OBJECT_PROPERTY_TYPE_JSON = 'json';
const WS_OBJECT_PROPERTY_TYPE_LINK = 'link';

const WS_OBJECT_PROPERTY_ID = 'id';
const WS_OBJECT_PROPERTY_SERVER = 'server';
const WS_OBJECT_PROPERTY_SERVER_ID = 'server_id';

const WS_OBJECT_PROPERTY_SYNC_TIMESTAMP = 'server_ts';
const WS_OBJECT_PROPERTY_SYNC_STATUS = 'sync_status';

const WS_OBJECT_TIMESTAMP_FORCE_UPDATE = 'force_update';

//! Database

const WS_DATABASE_TABLE_SERVERS = 'servers';
const WS_DATABASE_TABLE_PHOTOS = 'photos';
const WS_DATABASE_TABLE_FILES = 'files';
const WS_DATABASE_TABLE_NOTES = 'notes';
const WS_DATABASE_TABLE_ENUMS = 'enums';
const WS_DATABASE_TABLE_SYNCHRO = 'synchro_event';

//! Synchronization

const WS_SYNC_TABLE_MODE_TABLE = 'table';
const WS_SYNC_TABLE_MODE_RECORD = 'record';

const WS_SYNC_API_PROPERTY_SERVER_ID = WS_OBJECT_PROPERTY_SERVER_ID;

const WS_SYNC_PROPERTY_ID = WS_OBJECT_PROPERTY_TYPE_ID;
const WS_SYNC_PROPERTY_SERVER = WS_OBJECT_PROPERTY_SERVER;
const WS_SYNC_PROPERTY_SERVER_ID = WS_OBJECT_PROPERTY_SERVER_ID;
const WS_SYNC_PROPERTY_APP_ID = 'app_id';
const WS_SYNC_PROPERTY_ENTITY = 'entity';
const WS_SYNC_PROPERTY_TYPE = 'type';
const WS_SYNC_PROPERTY_ACTION = 'action';
const WS_SYNC_PROPERTY_DATA = 'data';

const WS_SYNC_TYPE_OBJECT = 'object';

const WS_SYNC_ACTION_ADD = 'add';
const WS_SYNC_ACTION_ADDED = 'added';
const WS_SYNC_ACTION_MODIFY = 'modify';
const WS_SYNC_ACTION_DELETE = 'delete';

//! Server properties

const WS_SERVER_PROPERTY_ID = WS_OBJECT_PROPERTY_ID;
const WS_SERVER_PROPERTY_URL = 'url';
const WS_SERVER_PROPERTY_TOKEN = 'token';
const WS_SERVER_PROPERTY_DEVICE_ID = 'device_id';
const WS_SERVER_PROPERTY_MAP = 'map';
const WS_SERVER_PROPERTY_DATA_MODEL = 'data_model';

//! Photos properties

const WS_PHOTO_PROPERTY_ID = WS_OBJECT_PROPERTY_ID;
const WS_PHOTO_PROPERTY_SERVER = WS_OBJECT_PROPERTY_SERVER;
const WS_PHOTO_PROPERTY_NAME = 'name';
const WS_PHOTO_PROPERTY_DATE = 'date';
const WS_PHOTO_PROPERTY_PATH = 'path';
const WS_PHOTO_PROPERTY_EDITED = 'edited';
const WS_PHOTO_PROPERTY_PATH_EDIT = 'path_edit';
const WS_PHOTO_PROPERTY_TRANSFORMATION = 'transformation';
const WS_PHOTO_PROPERTY_SIZE = 'size';
const WS_PHOTO_PROPERTY_TYPE = 'type';

//! Files properties

const WS_FILE_PROPERTY_ID = WS_OBJECT_PROPERTY_ID;
const WS_FILE_PROPERTY_SERVER = WS_OBJECT_PROPERTY_SERVER;
const WS_FILE_PROPERTY_SERVER_ID = WS_OBJECT_PROPERTY_SERVER_ID;
const WS_FILE_PROPERTY_PROPERTY_SYNC_TIMESTAMP = WS_OBJECT_PROPERTY_SYNC_TIMESTAMP;
const WS_FILE_PROPERTY_NAME = 'name';
const WS_FILE_PROPERTY_PATH = 'path';
const WS_FILE_PROPERTY_DATE = 'date';
const WS_FILE_PROPERTY_TYPE = 'type';
const WS_FILE_PROPERTY_EXTENSION = 'extension';
const WS_FILE_PROPERTY_SIZE = 'size';
const WS_FILE_PROPERTY_STATUS = 'status';
const WS_FILE_PROPERTY_HAS_FILE = 'has_file';
const WS_FILE_PROPERTY_RATTACHE_A = 'rattache_a';

const WS_FILE_PROPERTY_PHOTO_EDITED = 'edited';
const WS_FILE_PROPERTY_PHOTO_TRANSFORMATION = 'transformation';


const WS_FILE_KEY_IMAGE = 'image';
const WS_FILE_KEY_PDF = 'pdf';

const WS_FILE_KEY_ADD = 'add';
const WS_FILE_KEY_MODIFY = 'modify';

//! Notes properties

const WS_NOTE_PROPERTY_ID = WS_OBJECT_PROPERTY_ID;
const WS_NOTE_PROPERTY_SERVER = WS_OBJECT_PROPERTY_SERVER;
const WS_NOTE_PROPERTY_NAME = 'name';
const WS_NOTE_PROPERTY_TEXT = 'text';


const ASSISTANCE = "";