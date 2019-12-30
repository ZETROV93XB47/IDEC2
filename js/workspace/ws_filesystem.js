//! Database

var ws_filesystem = new function()
{
	this.file_system = undefined;
	
	this.open = function()
	{
		var self = this;
		
		return new Promise(function(resolve, reject) 
		{
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(file_system)
			{
				self.file_system = file_system;
				resolve();
			},
			function(e)
			{
                self.errorHandler(e);
				reject(e);
			});
		});
	}
    
    this.errorHandler = function(e)
    {
        var msg = '';

        switch (e.code)
        {
            case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'QUOTA_EXCEEDED_ERR';
                break;
            case FileError.NOT_FOUND_ERR:
                msg = 'NOT_FOUND_ERR';
                break;
            case FileError.SECURITY_ERR:
                msg = 'SECURITY_ERR';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                msg = 'INVALID_MODIFICATION_ERR';
                break;
            case FileError.INVALID_STATE_ERR:
                msg = 'INVALID_STATE_ERR';
                break;
            default:
                msg = 'Unknown Error';
                break;
        };
        
        console.log('Error: ' + msg);
    }
    
	this.get_root = function()
	{
		return cordova.file.dataDirectory;
	}
	
	this.get_root_url = function()
	{
		return new Promise(function(resolve, reject)
		{
			window.resolveLocalFileSystemURL(this.get_root(), function(dirEntry)
			{
				resolve(dirEntry.nativeURL);
			});
		});
	}
	
	this.clear = function(path)
	{
		var self = this;
		
		return new Promise(function(resolve, reject) 
		{			
			self.get_directory(undefined, path).then(function(dir)
			{
				var reader = dir.createReader();
				var promises = [];
				
				reader.readEntries(function(entries)
				{
					for (var i = 0; i < entries.length; i++)
					{
						entries[i].filesystem = self.file_system;
					
						console.log("Clear item : " + entries[i].toURL());

						if (entries[i].isDirectory)
						{
							promises.push(self.delete_directory(entries[i]));
						}
						else if (entries[i].isFile)
						{
							promises.push(self.delete_file(entries[i]));
						}
					}
				},
				function(error)
				{
					reject(error);
				});
				
				return Promise.all(promises);
			})
			.then(function()
			{
				resolve();
			})
			.catch(function(error)
			{
				if (ws_defines.debug) console.log(error);
				reject(error);
			});
		});
	}

	//! Directories
	
	this.directory_exists = function(directory, path)
	{
		var self = this;

		return new Promise(function(resolve, reject) 
		{
			self.get_directory(directory, path).then(function(entry)
			{
				resolve(entry);
			})
			.catch(function(error)
			{
				if (ws_defines.debug) console.log(error);
				resolve(false);
			});
		});
	}
	
	this.create_directory = function(directory, path)
	{
		var self = this;
		
		if (this.file_system == undefined) debugger;		
		if (directory == undefined) directory = this.file_system.root;

		var create_sub_directory = function(directory, name)
		{
			return new Promise(function(resolve, reject)
			{
				directory.getDirectory(name, { create : true, exclusive : false }, function(entry)
				{
					resolve(entry);
				}, 
				function(error)
				{
					reject(error);
				});
			});
		}
		
		return new Promise(function(resolve, reject) 
		{
			if (path == undefined || path == "")
			{
				resolve(directory);
			}
			else
			{
				var dirs = path.split("/");				
	
				create_sub_directory(directory, dirs.shift()).then(function(entry)
				{
					if (dirs.length == 0)
					{
						resolve(entry);
					}
					else
					{
						self.create_directory(entry, dirs.join("/")).then(function(entry)
						{
							resolve(entry);
						})
						.catch(function(error)
						{
							if (ws_defines.debug) console.log(error);
							reject(error);
						});
					}
				})
				.catch(function(error)
				{
					if (ws_defines.debug) console.log(error);
					reject(error);
				});
			}
		});
	}
	
	this.get_directory = function(directory, path)
	{
		var self = this;
		
		if (directory == undefined)
		{
			directory = this.file_system.root;
		
			console.log("Root : " + directory.toURL());
		}

		var get_sub_directory = function(directory, name)
		{
			return new Promise(function(resolve, reject)
			{
				directory.getDirectory(name, { create : false }, function(entry)
				{
					resolve(entry);
				}, 
				function(error)
				{
					reject(error);
				});
			});
		}
		
		return new Promise(function(resolve, reject) 
		{
			if (path == undefined || path == "")
			{
				resolve(directory);
			}
			else
			{
				var dirs = path.split("/");				
	
				get_sub_directory(directory, dirs.shift()).then(function(entry)
				{
					if (dirs.length == 0)
					{
						resolve(entry);
					}
					else
					{
						self.create_directory(entry, dirs.join("/")).then(function(entry)
						{
							resolve(entry);
						})
						.catch(function(error)
						{
							if (ws_defines.debug) console.log(error);
							reject(error);
						});
					}
				})
				.catch(function(error)
				{
					if (ws_defines.debug) console.log(error);
					reject(error);
				});
			}
		});
	}

	this.get_directory_url = function(directory)
	{
		var self = this;

		return new Promise(function(resolve, reject) 
		{			
			resolve(directory.toURL());
		});
	}
		
	this.get_directory_parent = function(directory)
	{
		var self = this;

		return new Promise(function(resolve, reject) 
		{
			directory.getParent(function(parent)
			{
				resolve(parent);
			},
			function(error)
			{
				reject(error);
			});
		});
	}

	this.get_directory_items = function(directory, path)
	{
		var self = this;
		
		return new Promise(function(resolve, reject) 
		{
			self.get_directory(directory, path).then(function(dir)
			{
				var reader = dir.createReader();
								
				reader.readEntries(function(entries)
				{
					for (var i = 0; i < entries.length; i++) entries[i].filesystem = self.file_system;
					
					resolve(entries);
				},
				function(error)
				{
					reject(error);
				});
			})
			.catch(function(error)
			{
				if (ws_defines.debug) console.log(error);
				reject(error);
			});
		});
	}

	this.delete_directory = function(directory, path)
	{
		var self = this;
		
		return new Promise(function(resolve, reject) 
		{
			self.get_directory(directory, path).then(function(dir)
			{
				if (dir === false)
				{
					resolve();
				}
				else dir.removeRecursively(function()
				{
					if (ws_defines.debug) console.log("Directory recursively removed : " + dir.fullPath);			

					resolve();
				},
				function(error)
			    {
					if (ws_defines.debug) console.log("Error while removing recursively directory " + dir.fullPath + " : ", error);			

				    reject(error);
				});
			})
			.catch(function(error)
			{
				if (ws_defines.debug) console.log(error);
				reject(error);
			});
		});
	}
	
	this.log_directory = function(directory, path, recursive, level)
	{
		var self = this;
		
		if (level == undefined) level = 0;
		if (recursive == undefined) recursive = true;
		
		return new Promise(function(resolve, reject) 
		{			
			var offset = "";				
			for (var j = 0; j < level; j++) offset += "      ";
											
			if (directory != undefined && path != undefined)
			{
				console.log(offset + "Directory : " + directory.name + ", path : " + path);
			}
			else if (path != undefined)
			{
				console.log(offset + "Directory : " + path);
			}
			else if (directory != undefined)
			{
				console.log(offset + "Directory : " + directory.name);
			}
			else
			{
				console.log(offset + "Directory : root");
			}
			
			self.get_directory(directory, path).then(function(dir)
			{
				return new Promise(function(resolve, reject) 
				{
					var reader = dir.createReader();
					
					reader.readEntries(function(entries)
					{
						for (var i = 0; i < entries.length; i++) entries[i].filesystem = self.file_system;
					
						resolve(entries);
					},
					function(error)
					{
						if (error.code == FileError.NOT_FOUND_ERR)
						{
							resolve(null);
						}
						else
						{
							reject(error);
						}
					});
				});
			})
			.then(function(entries)
			{
				var promises = new Array();

				var handle_entry = function(index)
				{
					if (entries.length == 0 || index >= entries.length)
					{
						resolve();
					}
					else if (entries[index].isDirectory && recursive === true)
					{
						self.log_directory(undefined, entries[index].fullPath, recursive, level + 1).then(function()
						{
							handle_entry(index + 1);
						});
					}
					else
					{
						if (entries[index].isFile) console.log(offset + "      " + "File : " + entries[index].name + " (" + entries[index].fullPath + ")");
						
						handle_entry(index + 1);
					};
				}
				
				handle_entry(0);			
			})
			.then(function()
			{
				resolve();
			})
			.catch(function(error)
			{
				if (ws_defines.debug) console.log(error);
				reject(error);
			});
		});
	}
	
	//! Files

	this.get_file = function(directory, name)
	{
		var self = this;

		return new Promise(function(resolve, reject) 
		{
			var items = name.split("/");
			var path = undefined;
			
			if (items.length > 0)
			{
				name = items.pop();
				path = items.join("/");
			}

			self.get_directory(directory, path).then(function(dir)
			{
				dir.getFile(name, { create: false }, function(entry)
				{
					if (ws_defines.debug) console.log("Get file success : " + entry.fullPath);
				
					resolve(entry);
				}, 
				function(error)
				{
					reject(error);
				});
			})
			.catch(function(error)
			{
				if (ws_defines.debug) console.log(error);
				reject(error);
			});
		});
	}

	this.get_file_url = function(file)
	{
		var self = this;

		return new Promise(function(resolve, reject) 
		{			
			resolve(file.toURL());
		});
	}
		
	this.get_file_parent = function(file)
	{
		var self = this;

		return new Promise(function(resolve, reject) 
		{
			file.getParent(function(parent)
			{
				resolve(parent);
			},
			function(error)
			{
				reject(error);
			});
		});
	}
	
	this.read_file = function(file)
	{
		var self = this;

		return new Promise(function(resolve, reject) 
		{
			file.file(function(file)
			{
		        var reader = new FileReader();
		
			    reader.onloadend = function(event)
			    {
				    resolve(reader.result)
				};
		
				reader.onerror = function(error)
				{
					reject(error);
			    };
	
		        reader.readAsText(file);

		    },
		    function(error)
		    {
				reject(error);
			});
		});
	}
	
	this.read_file_as_data_url = function(file)
	{
		var self = this;

		return new Promise(function(resolve, reject) 
		{
			file.file(function(file)
			{
		        var reader = new FileReader();
		
			    reader.onloadend = function(event)
			    {
				    resolve(reader.result)
				};
		
				reader.onerror = function(error)
				{
					reject(error);
			    };
	
		        reader.readAsDataURL(file);

		    },
		    function(error)
		    {
				reject(error);
			});
		});
	}
	
	this.read_file_as_array_buffer = function(file)
	{
		var self = this;

		return new Promise(function(resolve, reject) 
		{
			file.file(function(file)
			{
		        var reader = new FileReader();
		
			    reader.onloadend = function(event)
			    {
				    resolve(reader.result)
				};
		
				reader.onerror = function(error)
				{
					reject(error);
			    };
	
		        reader.readAsArrayBuffer(file);

		    },
		    function(error)
		    {
				reject(error);
			});
		});
	}
	
	this.read_file_as_binary_string = function(file)
	{
		var self = this;

		return new Promise(function(resolve, reject) 
		{
			file.file(function(file)
			{
		        var reader = new FileReader();
		
			    reader.onloadend = function(event)
			    {
				    resolve(reader.result)
				};
		
				reader.onerror = function(error)
				{
					reject(error);
			    };
	
		        reader.readAsBinaryString(file);

		    },
		    function(error)
		    {
				reject(error);
			});
		});
	}
	
	this.write_file = function(directory, name, data)
	{
		var self = this;

		return new Promise(function(resolve, reject) 
		{
			var items = name.split("/");
			var path = undefined;
			var file = undefined;
			
			if (items.length > 0)
			{
				name = items.pop();
				path = items.join("/");
			}

			self.create_directory(directory, path).then(function(dir)
			{
				return new Promise(function(resolve, reject)
				{
					dir.getFile(name, { create: true, exclusive: false }, function(entry)
					{
						resolve(entry);
					}, 
					function(error)
					{
						reject(error);
					});
				});
			})
			.then(function(fileEntry)
			{
				file = fileEntry;
				
				return new Promise(function(resolve, reject)
				{
					file.createWriter(function(writer)
					{
						resolve(writer);
					}, 
					function(error)
					{
						reject(error);
					});
				});
			})
			.then(function(writer)
			{
				writer.onwriteend = function()
				{
					resolve(file);
    			};

				writer.onerror = function(error)
				{
					reject(error);
    			};

				writer.write(data);
			})
			.catch(function(error)
			{
				if (ws_defines.debug) console.log(error);
				reject(error);
			});
		});
	}

	this.delete_file = function(file)
	{
		var self = this;

		return new Promise(function(resolve, reject) 
		{
			file.remove(function()
			{
				if (ws_defines.debug) console.log("File deleted : " + file.fullPath);
			
				resolve(file);
			}, 
			function(error)
			{
				if (ws_defines.debug) console.log("Failed to delete file " + name + " : ", error);
				
				reject(error);
			});
		});
	}
	
	//! Temporary
	
	this.create_temporary_file = function(name)
	{
		return new Promise(function(resolve, reject) 
		{
			window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function(filesystem)
			{
			    createFile(filesystem.root, name, false);
			    resolve();			
			},
			function(error)
			{
				reject(error);
			});
		});
	}
	
	//! Tests
	
	this.test = function(name)
	{
		var self = this;

		return new Promise(function(resolve, reject) 
		{
			self.write_file(undefined, 'essai/test.txt', 'Essai').then(function(file)
			{
				return self.read_file(file);
			})
			.then(function(data)
			{
				alert(data);
			})
			.catch(function(error)
			{
				if (ws_defines.debug) console.log(error);					
				reject(error);
			});			
		});
	}
}