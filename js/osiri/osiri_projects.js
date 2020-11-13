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

    this.get_projet_name = function(id)
    {
        return ws_database.projets.get_with_id(id).then(function(projet)
        {
            if (projet != null) return projet[OSIRI_PROJET_PROPERTY_NOM];
        })
    }

    this.get_projet = function(id)
    {
        return ws_database.projets.get_with_id(id);
    }

    this.get_projets_search_list_template_data = function(projets)
	{
        // var result = [];
        var self = this;
        var promises = [];

		if (projets)
		{
			projets.sort((a,b) => (a[OSIRI_PROJET_PROPERTY_NOM] > b[OSIRI_PROJET_PROPERTY_NOM]) ? 1 : (a[OSIRI_PROJET_PROPERTY_NOM] < b[OSIRI_PROJET_PROPERTY_NOM] ? -1 : 0 ));
		}
        
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

        for (var i = 0; i<projets.length; i++)
        {
            promises.push(change_value(i, projets));
        }

        return Promise.all(promises).then(function(result)
        {
            return projets;
        });
	}

    this.get_phase_color = function(phase)
	{
		switch (phase)
		{
			case OSIRI_PROJET_PHASE_KEYS_DEPLOIMENT :
				return OSIRI_PHASE_COLOR_DEPLOIEMENT;
				
			case OSIRI_PROJET_PHASE_KEYS_PRESERIE :
				return OSIRI_PHASE_COLOR_PRESEREIE;
				
			case OSIRI_PROJET_PHASE_KEYS_PROTOTYPE :
				return OSIRI_PHASE_COLOR_PROTOTYPE;
				
			case OSIRI_PROJET_PHASE_KEYS_ETUDE :
				return OSIRI_PHASE_COLOR_ETUDE;
				
			case OSIRI_PROJET_PHASE_KEYS_IDEE :
                return OSIRI_PHASE_COLOR_IDEE;
                
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

    this.get_mes_projets_template_data = function ()
    {
        var self = this;
        var promises = [];

        return ws_database.projets.find(OSIRI_PROJET_PROPERTY_MES_PROJETS + " = ?", [1]).then(function(mes_projets)
		{
            function change_value(i, mes_projets)
            {
                return self.get_collaborateur(mes_projets[i][OSIRI_PROJET_PROPERTY_PILOTE]).then(function(name)
                {
                    mes_projets[i][OSIRI_PROJET_PROPERTY_DATE_DEBUT] = ws_tools.get_date_as_string(mes_projets[i][OSIRI_PROJET_PROPERTY_DATE_DEBUT]);
                    mes_projets[i][OSIRI_PROJET_PROPERTY_ETAPE] = osiri_projects.get_etape_name(mes_projets[i][OSIRI_PROJET_PROPERTY_PHASE], mes_projets[i][OSIRI_PROJET_PROPERTY_ETAPE]);
                    mes_projets[i][OSIRI_PROJET_PROPERTY_PHASE] = osiri_actions.get_phase_as_string(mes_projets[i][OSIRI_PROJET_PROPERTY_PHASE]);

                    if( name == undefined) return self.get_collaborateur(mes_projets[i][OSIRI_PROJET_PROPERTY_REFERENT_PRODUIT]).then(function(name)
                    {
                        mes_projets[i].responsable = name;
                    });
                    mes_projets[i].responsable = name;
                });
            }

            for (var i = 0; i<mes_projets.length; i++)
            {
                promises.push(change_value(i, mes_projets));
            }

            return Promise.all(promises).then(function(result)
            {
                mes_projets.sort((a,b) => (a[OSIRI_PROJET_PROPERTY_NOM] > b[OSIRI_PROJET_PROPERTY_NOM]) ? 1 : (a[OSIRI_PROJET_PROPERTY_NOM] < b[OSIRI_PROJET_PROPERTY_NOM] ? -1 : 0 ));
                
                return mes_projets;
            });
        });
    }

    //! phase change

    this.get_phase_change_template_data = function ()
    {
        var self = this;
        var promises = [];

        return ws_database.phase_changes.all(undefined, 'ORDER BY vers DESC').then(function(phase_changes)
        {
            function change_value(i, phase_changes)
            {
                return osiri_projects.get_projet_name(phase_changes[i][OSIRI_PHASE_CHANGE_PROPERTY_PROJET]).then(function(name)
                {
                    phase_changes[i][OSIRI_PHASE_CHANGE_PROPERTY_DATE] = ws_tools.get_date_as_string(phase_changes[i][OSIRI_PHASE_CHANGE_PROPERTY_DATE]);
                    phase_changes[i].nom = name;
                });
            }

            for (var i = 0; i<phase_changes.length; i++)
            {
                promises.push(change_value(i, phase_changes));
            }

            return Promise.all(promises).then(function(result)
            {
                return phase_changes;
            });
        });
    }

    //! last event

    this.get_last_event_template_data = function ()
    {
        var self = this;
        var promises = [];

        return ws_database.last_events.all(undefined, 'ORDER BY date DESC').then(function(last_events)
        {
            function change_value(i, last_events)
            {
                return osiri_projects.get_projet_name(last_events[i][OSIRI_LAST_EVENT_PROPERTY_PROJET]).then(function(name)
                {
                    last_events[i][OSIRI_LAST_EVENT_PROPERTY_DATE] = ws_tools.get_date_as_string(last_events[i][OSIRI_LAST_EVENT_PROPERTY_DATE]);
                    last_events[i].nom = name;
                });
            }

            for (var i = 0; i<last_events.length; i++)
            {
                promises.push(change_value(i, last_events));
            }

            return Promise.all(promises).then(function(result)
            {
                return last_events;
            });
        });
    }

}

