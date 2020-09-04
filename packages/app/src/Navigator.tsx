import React, { Component } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
    NavigationContainer,
    DrawerActions,
    NavigationHelpersContext,
    useNavigationBuilder,
    TabRouter,
    TabActions
} from '@react-navigation/native';
import { createMaterialTopTabNavigator,MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';

// import Login from './components/Login/Login';

// import Signup from './components/Signup/Signup';
// import Loading from './components/Loading/Loading';
import Profile from './components/profile/ProfilePage';
import Live from './components/Live/Live';
import Poll from './components/Poll/Poll';
// import ProfileMenu from './components/Menu/ProfileMenu';
// import PollMenu from './components/Menu/PollMenu';


// const AuthStack = FluidNavigator(
//   {
//     Home: { screen: Home },
//     // Login: { screen: Login },
//     // Signup: { screen: Signup }
//   },
//   {
//     initialRouteName: 'Home'
//   }
// );

// function TabNavigator({
//   initialRouteName,
//   children,
//   screenOptions,
//   tabBarStyle,
//   contentStyle,
// }) {
//   const { state, navigation, descriptors } = useNavigationBuilder(TabRouter, {
//     children,
//     screenOptions,
//     initialRouteName,
//   });

//   return (
//     <NavigationHelpersContext.Provider value={navigation}>
//       <View style={[{ flexDirection: 'row' }, tabBarStyle]}>
//         {state.routes.map(route => (
//           <TouchableOpacity
//             key={route.key}
//             onPress={() => {
//               const event = navigation.emit({
//                 type: 'tabPress',
//                 target: route.key,
//                 canPreventDefault: true,
//               });

//               if (!event.defaultPrevented) {
//                 navigation.dispatch({
//                   ...TabActions.jumpTo(route.name),
//                   target: state.key,
//                 });
//               }
//             }}
//             style={{ flex: 1 }}
//           >
//             <Text>{descriptors[route.key].options.title || route.name}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//       <View style={[{ flex: 1 }, contentStyle]}>
//         {descriptors[state.routes[state.index].key].render()}
//       </View>
//     </NavigationHelpersContext.Provider>
//   );
// }

export type MainTabsParams = {
    Live: { address: string };
    Profile: {};
    Poll: {};
};


export type MainTabsProps = MaterialTopTabScreenProps<MainTabsParams, 'Live'>;

const MainTabNavigator = createMaterialTopTabNavigator<MainTabsParams>();
export function MainTabsStack({ address }: MainTabsParams["Live"]) {
    return (
        <MainTabNavigator.Navigator
            initialRouteName={'Live'}
            tabBarOptions={{ style: { display: 'none' } }}
        >
            <MainTabNavigator.Screen name="Profile" component={Profile} />
            <MainTabNavigator.Screen
                name="Live"
                component={Live}
                initialParams={{ address }}
            />
            <MainTabNavigator.Screen name="Poll" component={Poll} />
        </MainTabNavigator.Navigator>
    );
}

//     initialRouteName: 'Live',
//     defaultNavigationOptions: {
//       gesturesEnabled: false,
//       tabBarVisible: false
//     }
//   }
// );

// const ProfileDrawer = createDrawerNavigator();

// function ProfileDrawerNav() {
//   return (
//     <ProfileDrawer.Navigator
//       drawerposition={'left'}
//       edgeWidth={1000}
//       drawerLockMode={'lock-closed'}
//       swipeEnabled={false}
//       drawerContent={props => (
//         <ProfileMenu
//           style={{backgroundColor: 'transparent', opacity: 0.99}}
//           {...props}
//         />
//       )}>
//       <ProfileDrawer.Screen name="Main" component={MainTabsNav} />
//     </ProfileDrawer.Navigator>
//   );
// }

// {
//   Main: { screen: MainTabNavigator }
// },
//   {
//     drawerPosition: 'left',
//     drawerLockMode: 'locked-closed',
//     drawerOpenRoute: 'ProfileMenuOpen',
//     drawerCloseRoute: 'ProfileMenuClose',
//     drawerToggleRoute: 'ProfileMenuToggle',
//     edgeWidth: 1000,
//     contentComponent: props => (
//       <ProfileMenu
//         style={{ backgroundColor: 'transparent', opacity: 0.99 }}
//         {...props}
//       />
//     )
//   }
// );

// const PollDrawer = createDrawerNavigator();

// export function PollDrawerNav() {
//   return (
//     <PollDrawer.Navigator
//       drawerPosition={'right'}
//       edgeWidth={1000}
//       swipeEnabled={false}
//       drawerContent={props => (
//         <PollMenu
//           style={{backgroundColor: 'transparent', opacity: 0.99}}
//           {...props}
//         />
//       )}
//       getCustomActionCreators={(route, stateKey) => ({
//         openTopLevelDrawer: () => DrawerActions.openDrawer({key: stateKey}),
//         closeTopLevelDrawer: () => DrawerActions.closeDrawer({key: stateKey}),
//       })}>
//       <PollDrawer.Screen name="FirstDrawer" component={ProfileDrawerNav} />
//     </PollDrawer.Navigator>
//   );
// }
// {
//   FirstDrawer: { screen: ProfileDrawer }
// },
//   {
//     defaultNavigationOptions: {},
//     // initialRouteName: 'FirstDrawer',
//     drawerPosition: 'right',
//     getCustomActionCreators: (route, stateKey) => ({
//       openTopLevelDrawer: () => DrawerActions.openDrawer({ key: stateKey }),
//       closeTopLevelDrawer: () => DrawerActions.closeDrawer({ key: stateKey })
//     }),
//     drawerLockMode: 'locked-closed',
//     drawerOpenRoute: 'PollMenuOpen',
//     drawerCloseRoute: 'PollMenuClose',
//     drawerToggleRoute: 'PollMenuToggle',
//     edgeWidth: 1000,
//     contentComponent: props => (
//       <PollMenu
//         style={{ backgroundColor: 'transparent', opacity: 0.99 }}
//         {...props}
//       />
//     )
//   }
// );
