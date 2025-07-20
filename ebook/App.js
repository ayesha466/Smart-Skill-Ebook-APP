import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './screens/Splashscreen';
import Getstarted from './screens/Getstarted'; 
import LoginScreen from './screens/Loginscreen';
import Forgetpassword from './screens/Forgetpassword';
import Verifyemailscreen from './screens/Verifyemailscreen';
import Resetpasswordscreen from './screens/Resetpasswordscreen';
import Signupscreen from './screens/Signupscreen';
import Choosemodescreen from './screens/Choosemodescreen';
import Bookreadscreen from './screens/Bookreadscreen';
import Bookwritescreen from './screens/Bookwritescreen';
import Profilescreen from './screens/Profilescreen';
import Aicreatebook from './screens/Aicreatebook';
import Aireadbook from './screens/Aireadbook';
import Ebooktitle from './screens/Ebooktitle';
import Beginwrite from './screens/Beginwrite';
import Trendingbooks from './screens/Trendingbooks';
import ReadBook from './screens/ReadBook';
import Categorybooks from './screens/Categorybooks';
import Readaisuggest from './screens/ReadAisuggest';
import TemplateScreen from './screens/Templatescreen';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splashscreen" component={SplashScreen} />
        <Stack.Screen name="Getstarted" component={Getstarted} />
        <Stack.Screen name="Loginscreen" component={LoginScreen} />
        <Stack.Screen name="Forgetpassword" component={Forgetpassword} />
        <Stack.Screen name="Verifyemailscreen" component={Verifyemailscreen} />
        <Stack.Screen name="Resetpasswordscreen" component={Resetpasswordscreen } />
        <Stack.Screen name="Signupscreen" component={Signupscreen} />
        <Stack.Screen name="Choosemodescreen" component={Choosemodescreen} />
        <Stack.Screen name="Bookreadscreen" component={Bookreadscreen} />
        <Stack.Screen name="Bookwritescreen" component={Bookwritescreen} />
        <Stack.Screen name="Profilescreen" component={Profilescreen} />
        <Stack.Screen name="Aicreatebook" component={Aicreatebook} />
        <Stack.Screen name="Aireadbook" component={Aireadbook} />
        <Stack.Screen name="Ebooktitle" component={Ebooktitle} />
        <Stack.Screen name="Beginwrite" component={Beginwrite} />
        <Stack.Screen name="Trendingbooks" component={Trendingbooks} />
        <Stack.Screen name="ReadBook" component={ReadBook} />
        <Stack.Screen name="Categorybooks" component={Categorybooks} />
        <Stack.Screen name="Readaisuggest" component={Readaisuggest} />
        <Stack.Screen name="TemplateScreen" component={TemplateScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

