var osiri_actions = new function()
{
    this.get_phase_as_string = function(phase)
	{
		switch (phase)
		{
			case OSIRI_PROJET_PHASE_KEYS_DEPLOIMENT :
				return 'Déploiement';
				
			case OSIRI_PROJET_PHASE_KEYS_PRESERIE :
				return 'Présérie';
				
			case OSIRI_PROJET_PHASE_KEYS_PROTOTYPE :
				return 'Prototype';
				
			case OSIRI_PROJET_PHASE_KEYS_ETUDE :
				return 'Étude';
				
			case OSIRI_PROJET_PHASE_KEYS_IDEE :
                return 'Idée';
                
            default :
                return 'phase inconnu';
		}
    }

    this.get_phase_as_string_ma = function(phase)
	{
		switch (phase)
		{
			case OSIRI_PROJET_PHASE_KEYS_DEPLOIMENT :
				return 'DEPLOIEMENT';
				
			case OSIRI_PROJET_PHASE_KEYS_PRESERIE :
				return 'PRESEIRE';
				
			case OSIRI_PROJET_PHASE_KEYS_PROTOTYPE :
				return 'PROTOTYPE';
				
			case OSIRI_PROJET_PHASE_KEYS_ETUDE :
				return 'ETUDE';
				
			case OSIRI_PROJET_PHASE_KEYS_IDEE :
                return 'IDEE';
                
            default :
                return 'INCONNU';
		}
    }
    
    this.get_template_data = function ()
    {
        var self = this;
        var promises = [];

        return ws_database.actions.all().then(function(actions)
        {
            function change_value(i, actions)
            {
                return osiri_projects.get_projet_name(actions[i][OSIRI_ACTION_PROPERTY_PROJET]).then(function(name)
                {
                    actions[i][OSIRI_ACTION_PROPERTY_PHASE] = self.get_phase_as_string(actions[i][OSIRI_ACTION_PROPERTY_PHASE]);
                    actions[i].nom = name;
                });
            }

            for (var i = 0; i<actions.length; i++)
            {
                promises.push(change_value(i, actions));
            }

            return Promise.all(promises).then(function(result)
            {
                return actions;
            });
        });
    }
}