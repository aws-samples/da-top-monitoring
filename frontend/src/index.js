import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

//-- Libraries
import '@cloudscape-design/global-styles/index.css';
import { Amplify } from "aws-amplify";
import { AmplifyProvider, Authenticator } from "@aws-amplify/ui-react";
import { StrictMode } from "react";
import Axios from "axios";

//-- Pages
import Authentication from "./pages/Authentication";
import Home from "./pages/Home";
import Logout from "./pages/Logout";
import SmclustersEMR01 from "./pages/Sm-clustersEMR-01";
import EmrEc201 from "./pages/Sm-emr-ec2-01";
import EmrEc202 from "./pages/Sm-emr-ec2-02";
import EmrEc203 from "./pages/Sm-emr-ec2-03";
import SmAppUpdate from "./pages/Sm-appUpdate";


//-- Components
import ProtectedApp from "./components/ProtectedApp";

import { applyMode,  Mode } from '@cloudscape-design/global-styles';

if (localStorage.getItem("themeMode") === null ){
    localStorage.setItem("themeMode", "dark");
}

if (localStorage.getItem("themeMode") == "dark")
    applyMode(Mode.Dark);
else
    applyMode(Mode.Light);
    


Axios.get(`/aws-exports.json`,).then((data)=>{

    var configData = data.data;
    Amplify.configure({
                    Auth: {
                      region: configData.aws_region,
                      userPoolId: configData.aws_cognito_user_pool_id,
                      userPoolWebClientId: configData.aws_cognito_user_pool_web_client_id,
                    },
    });
                  
    const rootElement = document.getElementById("root");
    render(
      <StrictMode>
        <AmplifyProvider>
          <Authenticator.Provider>
              <BrowserRouter>
                <Routes>
                    <Route path="/" element={<ProtectedApp><Home /> </ProtectedApp>} />
                    <Route path="/emr/clusters/" element={<ProtectedApp><SmclustersEMR01 /> </ProtectedApp>} />
                    <Route path="/emr/sm-emr-ec2-01/" element={<ProtectedApp><EmrEc201 /> </ProtectedApp>} />
                    <Route path="/emr/sm-emr-ec2-02/" element={<ProtectedApp><EmrEc202 /> </ProtectedApp>} />
                    <Route path="/emr/sm-emr-ec2-03/" element={<ProtectedApp><EmrEc203 /> </ProtectedApp>} />
                    <Route path="/authentication" element={<Authentication />} />
                    <Route path="/logout" element={<ProtectedApp><Logout /> </ProtectedApp>} />
                    <Route path="/updates" element={<ProtectedApp><SmAppUpdate /> </ProtectedApp>} />
                </Routes>
              </BrowserRouter>
          </Authenticator.Provider>
        </AmplifyProvider>
      </StrictMode>,
      rootElement
    );

})
.catch((err) => {
    console.log('API Call error : ./aws-exports.json' );
    console.log(err)
});
              
              

