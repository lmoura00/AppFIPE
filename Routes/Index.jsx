import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { One } from '../Pages/1'
import { Two } from '../Pages/2'
import { Three } from '../Pages/3'
import { Four } from '../Pages/4'
import { Home } from '../Pages/Home'



const {Navigator, Screen} = createNativeStackNavigator()

export function Routes(){
    return(
        <NavigationContainer>
            <Navigator>
                <Screen name='Home' component={Home} options={{headerShown:false}}/>
                <Screen name='One' component={One} options={{headerShown:false}}/>
                <Screen name='Two' component={Two} options={{headerShown:false}}/>
                <Screen name='Three' component={Three} options={{headerShown:false}}/>
                <Screen name='Four' component={Four} options={{headerShown:false}}/>
            </Navigator>
        </NavigationContainer>
    )
}