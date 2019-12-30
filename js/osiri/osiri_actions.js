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
				return 'Etude';
				
			case OSIRI_PROJET_PHASE_KEYS_IDEE :
                return 'Idée';
                
            default :
                return 'phase inconnu';
		}
		
    }
    
    this.get_template_data = function ()
    {
        var self = this;
        
        return ws_database.actions.all().then(function(actions)
        {
            for (var i = 0; i<actions.length; i++)
            {
                actions[i][OSIRI_ACTION_PROPERTY_PHASE] = self.get_phase_as_string(actions[i][OSIRI_ACTION_PROPERTY_PHASE]);
            }

            return actions;
        });
    }
}