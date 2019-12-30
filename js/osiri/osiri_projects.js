var osiri_projects = new function()
{
    this.get_template_data = function(phase, famille)
    {
        var self = this;
        var condition = OSIRI_PROJET_PROPERTY_PHASE + ' = ?';
        var binding = [phase];
        var promises = [];
    
        if (famille)
        {
            condition += ' AND ' + OSIRI_PROJET_PROPERTY_FAMILLE + ' = ?';
            binding.push(famille)
        }
    
        return ws_database.projets.find(condition, binding).then(function(projects)
        {
            function change_value(i, projects)
            {
                return self.get_collaborateur(projects[i][OSIRI_PROJET_PROPERTY_PILOTE]).then(function(name)
                {
                    projects[i][OSIRI_PROJET_PROPERTY_DATE_DEBUT] = ws_tools.get_date_as_string(projects[i][OSIRI_PROJET_PROPERTY_DATE_DEBUT]);

                    if( name == undefined) return self.get_collaborateur(projects[i][OSIRI_PROJET_PROPERTY_REFERENT_PRODUIT]).then(function(name)
                    {
                        projects[i].responsable = name;
                    });
                    projects[i].responsable = name;
                });
            }

            for (var i = 0; i<projects.length; i++)
            {
                promises.push(change_value(i, projects));
            }

            return Promise.all(promises).then(function(result)
            {
                return projects;
            });
        });
    }

    this.get_collaborateur = function(id)
    {
        return ws_database.collaborateurs.get_with_id(id).then(function(contact)
        {
            if (contact != null) return contact[OSIRI_COLLABORATEUR_PROPERTY_LASTNAME] + " " + contact[OSIRI_COLLABORATEUR_PROPERTY_FIRSTNAME];
        })
    }

    this.get_phase_color = function(phase)
	{
		switch (phase)
		{
			case OSIRI_PROJET_PHASE_KEYS_DEPLOIMENT :
				return OSIRI_COLOR_DEPLOIEMENT;
				
			case OSIRI_PROJET_PHASE_KEYS_PRESERIE :
				return OSIRI_COLOR_PRESEREIE;
				
			case OSIRI_PROJET_PHASE_KEYS_PROTOTYPE :
				return OSIRI_COLOR_PROTOTYPE;
				
			case OSIRI_PROJET_PHASE_KEYS_ETUDE :
				return OSIRI_COLOR_ETUDE;
				
			case OSIRI_PROJET_PHASE_KEYS_IDEE :
                return OSIRI_COLOR_IDEE;
                
            default :
                return '#FFFFF';
		}
		
    }

    this.get_etape_name = function(phase, etape)
	{
        if (phase == OSIRI_PROJET_PHASE_KEYS_DEPLOIMENT)
        {
           return this.get_deploiement_as_string(etape);
        }
        
        if (phase == OSIRI_PROJET_PHASE_KEYS_PRESERIE)
        {
            return this.get_preserie_as_string(etape);
        }

        if (phase == OSIRI_PROJET_PHASE_KEYS_PROTOTYPE)
        {
            return this.get_prototype_as_string(etape);
        }

        if (phase == OSIRI_PROJET_PHASE_KEYS_ETUDE)
        {
            return this.get_etude_as_string(etape);
        }

        if (phase == OSIRI_PROJET_PHASE_KEYS_IDEE)
        {
            return this.get_idee_as_string(etape);
        }

    }
    
    this.get_idee_as_string = function(etape)
    {
        switch (etape)
        {
            case OSIRI_PROJET_IDEE_ETAPE_DEMANDE :
                return 'Demande';
                
            case OSIRI_PROJET_IDEE_ETAPE_VALIDATION :
                return 'Validation';

            case OSIRI_PROJET_IDEE_ETAPE_KICK_OFF :
                return 'Kick-Off';
        }
    }

    this.get_etude_as_string = function(etape)
    {
        switch (etape)
        {
            case OSIRI_PROJET_ETUDE_ETAPE_ETUDE_DE_CONCEPTION :
                return 'Étude de conception';
                
            case OSIRI_PROJET_ETUDE_ETAPE_VALIDATION :
                return 'Validation';
                
            case OSIRI_PROJET_ETUDE_ETAPE_DEPLOIEMENT :
                return 'Déploiement';
        }
    }

    this.get_prototype_as_string = function(etape)
    {
        switch (etape)
        {
            case OSIRI_PROJET_PROTOTYPE_ETAPE_MISE_A_DISPOSITION :
                return 'Mise à disposition des prototypes';
            
            case OSIRI_PROJET_PROTOTYPE_ETAPE_CHOIX_CHANTIERS_TESTS :
                return 'Choix des chantiers tests et interlocuteurs REX';
            
            case OSIRI_PROJET_PROTOTYPE_ETAPE_CREATION_INTERLOCS_CHANTIERS :
                return 'Création chantiers et interlocuteurs';
            
            case OSIRI_PROJET_PROTOTYPE_ETAPE_TESTS_CHANTIERS :
                return 'Tests chantiers et REX';
            
            case OSIRI_PROJET_PROTOTYPE_ETAPE_VALIDATION_MODIFICATIONS :
                return 'Validation des modifications prototypes';
            
            case OSIRI_PROJET_PROTOTYPE_ETAPE_ETUDE_MODIFICATIONS :
                return 'Étude de modifications prototype';
            
            case OSIRI_PROJET_PROTOTYPE_ETAPE_VALIDATION :
                return 'Validation';
            
            case OSIRI_PROJET_PROTOTYPE_ETAPE_ORIENTATION :
                return 'Orientation';
        }
    }

    this.get_preserie_as_string = function(etape)
    {
        switch (etape)
        {
            case OSIRI_PROJET_PRESERIE_ETAPE_MISE_A_DISPOSITION :
                return 'Mise à disposition présérie';
            
            case OSIRI_PROJET_PRESERIE_ETAPE_CHOIX_CHANTIERS_TESTS :
                return 'Choix des chantiers tests et interlocuteurs REX';
            
            case OSIRI_PROJET_PRESERIE_ETAPE_CREATION_INTERLOCS_CHANTIERS :
                return 'Création chantiers et interlocuteurs';
            
            case OSIRI_PROJET_PRESERIE_ETAPE_TESTS_CHANTIERS :
                return 'Tests chantiers et REX';
            
            case OSIRI_PROJET_PRESERIE_ETAPE_VALIDATION_MODIFICATIONS :
                return 'Validation des modifications présérie';
            
            case OSIRI_PROJET_PRESERIE_ETAPE_ETUDE_MODIFICATIONS :
                return 'Étude de modifications présérie';
            
            case OSIRI_PROJET_PRESERIE_ETAPE_VALIDATION :
                return 'Validation';
        }
    }

    this.get_deploiement_as_string = function(etape)
    {
        switch (etape)
        {
            case OSIRI_PROJET_DEPLOIEMENT_ETAPE_MISE_A_DISPOSITION :
                return 'Mise à disposition et informations';
                
            case OSIRI_PROJET_DEPLOIEMENT_ETAPE_MISE_EN_PRODUCTION :
                return 'Mise en production';
                
            case OSIRI_PROJET_DEPLOIEMENT_ETAPE_PRODUCTION :
                return 'Déployé';
        }
    }

}

