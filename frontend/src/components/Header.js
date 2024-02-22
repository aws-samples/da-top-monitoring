import { Authenticator } from "@aws-amplify/ui-react";
import { applyMode, Mode } from '@cloudscape-design/global-styles';
import { configuration } from '../pages/Configs';

import TopNavigation from '@cloudscape-design/components/top-navigation';

const i18nStrings = {
  searchIconAriaLabel: 'Search',
  searchDismissIconAriaLabel: 'Close search',
  overflowMenuTriggerText: 'More',
  overflowMenuTitleText: 'All',
  overflowMenuBackIconAriaLabel: 'Back',
  overflowMenuDismissIconAriaLabel: 'Close menu',
};

const profileActions = [
      { type: 'button', id: 'profile', text: 'AppVersion : ' + configuration["apps-settings"]["release"]},
      {
        type: 'menu-dropdown',
        id: 'preferences',
        text: 'Preferences',
        items: [
          { type: 'button', id: 'themeDark', text: 'Theme Dark' },
          { type: 'button', id: 'themeLight', text: 'Theme Light'},
        ]
      },
      {
        type: 'menu-dropdown',
        id: 'support-group',
        text: 'Support',
        items: [
          {id: 'documentation',text: 'Documentation'},
          { id: 'feedback', text: 'Feedback' },
          { id: 'support', text: 'Customer support' },
        ],
      }
];


export default function App() {
  
  
  const handleClickMenu = ({detail}) => {
            console.log(detail);
            
            switch (detail.id) {
              
              case 'themeDark':
                  applyMode(Mode.Dark);
                  localStorage.setItem("themeMode", "dark");
                  break;
                
              case 'themeLight':
                    applyMode(Mode.Light);
                    localStorage.setItem("themeMode", "light");
                    break;
                
              
            }

    };
    
    

  return (
         
         <Authenticator>
          {({ signOut, user }) => (
              
            <>
    
                    <div id="h" style={{ position: 'sticky', top: 0, zIndex: 1002 }}>
                          <TopNavigation
                                  i18nStrings={i18nStrings}
                                  identity={{
                                    href: '/',
                                    title:  configuration['apps-settings']['application-title'] 
                                  }}
                                  utilities={[
                                    {
                                      type: 'button',
                                      iconName: 'notification',
                                      ariaLabel: 'Notifications',
                                      badge: true,
                                      disableUtilityCollapse: true,
                                    },
                                    { type: 'button', iconName: 'settings', title: 'Settings', ariaLabel: 'Settings' },
                                    {
                                      type: 'menu-dropdown',
                                      text:  user.signInUserSession.idToken.payload.email /* "myuser@example.com" */,
                                      iconName: 'user-profile',
                                      items: profileActions,
                                      onItemClick : handleClickMenu
                                    },
                                    {
                                      type: 'button',
                                      text: 'Sign out',
                                      onClick : signOut,
                                      variant : "primary-button"
                                    },
                                  ]}
                          />
                      </div>
                    
                      
      
          </>
    
    )}
    </Authenticator>
    
    
    
  );
}

