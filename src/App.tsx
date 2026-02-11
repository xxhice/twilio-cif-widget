import {
  FluentProvider,
  webDarkTheme,
  webLightTheme,
  Text,
} from '@fluentui/react-components';
import AppContainer from './components/AppContainer';
import { useEffect, useState } from 'react';
import { Bootstrapper } from './bootstrapper/Bootstrapper';
import { Strings } from './constants/Strings';
import './css/styles.css';
import { LocalStorageConstants } from './constants/LocalStorageConstants';

const App: React.FC = () => {
  const darkModeLocalStorageValue = localStorage.getItem(
    LocalStorageConstants.DARK_MODE
  );
  const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>(
    darkModeLocalStorageValue === 'true'
  );
  const [bootstrapperReady, setBootstrapperReady] = useState<boolean>(false);
   useEffect(() => {
    // if (!Utils.isCIFAvailable()) {
    //   // for debug purposes
    //   setBootstrapperReady(true);
    //   return;
    // }

    Bootstrapper.getInstance()
      .init()
      .then(() => {
        setBootstrapperReady(true);
      });
  }, []);

  return (
    <FluentProvider
      theme={darkModeEnabled ? webDarkTheme : webLightTheme}
      style={{ height: '100vh' }}
    >
      {bootstrapperReady ? (
        <AppContainer
          darkMode={darkModeEnabled}
          onDarkModeToggle={setDarkModeEnabled}
        />
      ) : (
        <Text className="dots">{Strings.SETTING_UP_PROVIDER}</Text>
      )}
    </FluentProvider>
  );
};

export default App;
