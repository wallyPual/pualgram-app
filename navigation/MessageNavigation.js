import { createStackNavigator } from 'react-navigation';
import Messages from '../screens/Messages/Messages';
import Message from '../screens/Messages/Message/Message';
import { stackStyles } from './config';

export default createStackNavigator(
  {
    Messages,
    Message
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        ...stackStyles
      },
      headerTintColor: 'black',
      headerBackTitle: null
    },
    headerLayoutPreset: 'center'
  }
);
