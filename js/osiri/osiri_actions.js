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

        return ws_database.actions.all(undefined, 'ORDER BY phase ASC').then(function(actions)
        {
            function change_value(i, actions)
            {
                var action = actions[i];
                return osiri_projects.get_projet_name(action[OSIRI_ACTION_PROPERTY_PROJET]).then(function(name)
                {
                    action[OSIRI_ACTION_PROPERTY_DATE] = ws_tools.get_date_as_string(action[OSIRI_ACTION_PROPERTY_DATE]);
                    action[OSIRI_ACTION_PROPERTY_ETAPE] = osiri_projects.get_etape_name(action[OSIRI_ACTION_PROPERTY_PHASE], action[OSIRI_ACTION_PROPERTY_ETAPE]);
                    action[OSIRI_ACTION_PROPERTY_PHASE] = self.get_phase_as_string(action[OSIRI_ACTION_PROPERTY_PHASE]);
                    action.nom = name;
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

    this.get_revu_template_data = function ()
    {
        var self = this;
        var promises = [];

        return ws_database.actions.find(OSIRI_ACTION_PROPERTY_ACTION + " = ?", [OSIRI_ACTION_ACTION_REVU]).then(function(rex_actions)
		{
            function change_value(i, actions)
            {
                var action = actions[i];
                return osiri_projects.get_projet_name(action[OSIRI_ACTION_PROPERTY_PROJET]).then(function(name)
                {
                    action[OSIRI_ACTION_PROPERTY_DATE] = ws_tools.get_date_as_string(action[OSIRI_ACTION_PROPERTY_DATE]);
                    action[OSIRI_ACTION_PROPERTY_ETAPE] = osiri_projects.get_etape_name(action[OSIRI_ACTION_PROPERTY_PHASE], action[OSIRI_ACTION_PROPERTY_ETAPE]);
                    action[OSIRI_ACTION_PROPERTY_PHASE] = osiri_actions.get_phase_as_string(action[OSIRI_ACTION_PROPERTY_PHASE]);
                    action.nom = name;
                });
            }

            for (var i = 0; i<rex_actions.length; i++)
            {
                promises.push(change_value(i, rex_actions));
            }

            return Promise.all(promises).then(function(result)
            {
                return rex_actions;
            });
        });
    }
}