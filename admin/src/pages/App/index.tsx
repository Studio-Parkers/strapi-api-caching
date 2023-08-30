import React from "react";
import {Switch, Route} from "react-router-dom";
import {AnErrorOccurred} from "@strapi/helper-plugin";

import HomePage from "../HomePage";
import pluginId from "../../pluginId";

const App = ()=>
{
    return (
        <div>
            <Switch>
                <Route path={`/plugins/${pluginId}`} component={HomePage} exact />
                <Route component={AnErrorOccurred} />
            </Switch>
        </div>
    );
};

export default App;