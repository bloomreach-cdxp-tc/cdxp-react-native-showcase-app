/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {useState, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Alert,
  Pressable,
  Image,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import AppInboxButton from 'react-native-exponea-sdk/lib/AppInboxButton';

import Exponea from 'react-native-exponea-sdk';
import {LogLevel} from 'react-native-exponea-sdk/lib/ExponeaType';
import Configuration from 'react-native-exponea-sdk/lib/Configuration';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

// function Section({children, title}: SectionProps): JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// }

function App(): JSX.Element {
  useEffect(() => {
    checkExponeaConfigStatus();
    // Exponea.setAppInboxProvider({
    //   appInboxButton: {
    //     textOverride: 'Nix working!',
    //     textSize: '16sp',
    //     textWeight: 'bold',
    //   },
    //   detailView: {
    //     title: {
    //       textColor: '#262626',
    //       textSize: '20sp',
    //     },
    //     content: {
    //       textColor: '#262626',
    //       textSize: '16sp',
    //     },
    //     button: {
    //       textSize: '16sp',
    //       textColor: '#262626',
    //       backgroundColor: '#ffd500',
    //       borderRadius: '10dp',
    //     },
    //   },
    //   listView: {
    //     list: {
    //       backgroundColor: 'blue',
    //       item: {
    //         content: {
    //           textSize: '16sp',
    //           textColor: '#262626',
    //         },
    //       },
    //     },
    //   },
    // });
  }, []);
  const isDarkMode = false;

  const [buttonText, setButtonText] = useState('Initialize SDK');
  const [exponeaSDKStatus, setExponeaSDKStatus] = useState({
    running: false,
    text: 'not running',
    error: '',
    colorCode: '#fdeded',
  });

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const exponeaStatusBarBackgroundColor = {
    backgroundColor: exponeaSDKStatus.colorCode,
  };

  const initButtonsStyle = exponeaSDKStatus.running
    ? [styles.primaryButton, styles.disabledButton]
    : styles.primaryButton;

  const actionButtonsStyle = !exponeaSDKStatus.running
    ? [styles.primaryButton, styles.disabledButton]
    : styles.primaryButton;

  const configuration: Configuration = {
    projectToken: '6024ad14-6094-11eb-a71f-6aa7f2814bd1',
    authorizationToken:
      'jzxkj4ed9xm2ezt92137ldq4kya4275zr699myz6cew3mcmq6f2rcxuddu444sxw',
    baseUrl: 'https://api.eu1.exponea.com',
    // allowDefaultCustomerProperties: false,
    // advancedAuthEnabled: (advancedAuthKey || '').trim().length != 0,
    ios: {
      appGroup: 'group.react-native-showcase-app',
    },
    // android: {
    //   pushIconResourceName: 'push_icon',
    //   pushAccentColorRGBA: '161, 226, 200, 220',
    // },
  };

  async function checkExponeaConfigStatus() {
    try {
      if (await Exponea.isConfigured()) {
        console.log('Exponea SDK Config Check:', 'running');
        const exponeaCookie = await Exponea.getCustomerCookie();
        console.log('Cookie:', exponeaCookie);

        setExponeaSDKStatus({
          running: true,
          text: 'RUNNING',
          error: '',
          colorCode: '#edf7ed',
        });
      } else {
        await Exponea.setAppInboxProvider({
          appInboxButton: {
            textOverride: 'Custom Text',
            textSize: '16sp',
            textWeight: 'bold',
          },
          detailView: {
            title: {
              textColor: '#262626',
              textSize: '20sp',
            },
            content: {
              textColor: '#262626',
              textSize: '16sp',
            },
            button: {
              textSize: '16sp',
              textColor: '#262626',
              backgroundColor: '#ffd500',
              borderRadius: '10dp',
            },
          },
          listView: {
            list: {
              backgroundColor: 'blue',
              item: {
                content: {
                  textSize: '16sp',
                  textColor: '#262626',
                },
              },
            },
          },
        });
        console.log('Exponea SDK Config Check:', undefined);
        setExponeaSDKStatus({
          running: false,
          text: 'NOT RUNNING',
          error: '',
          colorCode: '#fdeded',
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function configureExponea(configuration: Configuration) {
    try {
      if (!(await Exponea.isConfigured())) {
        Exponea.configure(configuration);
        Exponea.setLogLevel(LogLevel.VERBOSE);
        checkExponeaConfigStatus();
      } else {
        console.log('Exponea SDK already configured.');
      }
    } catch (error) {
      console.log(error);
    }
  }

  function trackTestEvent() {
    Exponea.identifyCustomer(
      {registered: '123'}, // customer identifiers
      {}, // customer properties
    );
    if (exponeaSDKStatus.running) {
      console.log('Tracking test event...');
      Exponea.trackEvent('react_native_test_event', {
        success: true,
      });
    }
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={require('./src/assets/images/256.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>
              Bloomreach Engagement {'\n'} Showcase App
            </Text>
          </View>
          <View
            style={[styles.exponeaStatusBar, exponeaStatusBarBackgroundColor]}>
            <Text style={styles.exponeaStatusBarText}>
              Before performing any actions, please make sure that the SDK is
              initialized. {'\n\n'} Current Status:{' '}
              <Text style={styles.highlight}>{exponeaSDKStatus.text}</Text>
            </Text>
          </View>

          <View style={styles.buttonStack}>
            <Pressable
              style={initButtonsStyle}
              onPress={() => configureExponea(configuration)}>
              <Text style={styles.text}>Initialize SDK</Text>
            </Pressable>

            <Pressable style={actionButtonsStyle} onPress={trackTestEvent}>
              <Text style={styles.text}>Track Event</Text>
            </Pressable>

            <Pressable style={actionButtonsStyle}>
              <Text style={styles.text}>Update Customer</Text>
            </Pressable>
            <Pressable style={actionButtonsStyle}>
              <Text style={styles.text}>Send In-App Message</Text>
            </Pressable>
            <Pressable style={actionButtonsStyle}>
              <Text style={styles.text}>Send Notification</Text>
            </Pressable>
            {exponeaSDKStatus.running && (
              <AppInboxButton style={{width: '100%', height: 50}} />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  simpleTextView: {
    color: 'blue',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center', // Center the children vertically
    alignItems: 'center', // Center the children horizontally
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center', // Center the text
  },
  exponeaStatusBar: {
    marginBottom: 20,
    marginTop: 10,
    padding: 50,
    width: '100%', // Set width to 100% to make the box full-width
    // Adjust the height as needed
  },
  exponeaStatusBarText: {
    fontSize: 14,
    textAlign: 'center', // Center the text
  },

  highlight: {
    fontWeight: '700',
  },
  primaryButton: {
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#00b3db',
    margin: 10,
    disabled: true,
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
  buttonStack: {
    flex: 1, // This line will make the button stack take up all available space
    flexDirection: 'column',
    alignItems: 'center', // This line will center the buttons horizontally
    justifyContent: 'center',
    width: '100%', // This line will make the button stack take up 100% width
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});

export default App;