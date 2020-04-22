var osiri_rexs = new function()
{
    this.get_template_data = function ()
    {
        var promises = [];

        return ws_database.actions.find(OSIRI_ACTION_PROPERTY_ACTION + " = ?", [OSIRI_ACTION_ACTION_REX]).then(function(rex_actions)
		{
            function change_value(i, actions)
            {
                var action = actions[i];
                return osiri_projects.get_projet_name(action[OSIRI_ACTION_PROPERTY_PROJET]).then(function(name)
                {
                    // action[OSIRI_ACTION_PROPERTY_ETAPE] = osiri_projects.get_etape_name(action[OSIRI_ACTION_PROPERTY_PHASE], action[OSIRI_ACTION_PROPERTY_ETAPE]);
                    // action[OSIRI_ACTION_PROPERTY_PHASE] = osiri_actions.get_phase_as_string(action[OSIRI_ACTION_PROPERTY_PHASE]);
                    action.name = name;
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