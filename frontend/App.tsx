import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import SearchScreen from "./screens/SearchScreen";
import MyCoursesScreen from "./screens/MyCoursesScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CourseDetailScreen from "./screens/CourseDetailScreen";
import LearningScreen from "./screens/LearningScreen";
import RatingScreen from "./screens/RatingScreen";
import TeacherProfileScreen from "./screens/TeacherProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import { Text } from "react-native";
import EditProfileScreen from "./screens/EditProfileScreen";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        headerTitleAlign: "center",
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#00BDD6",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
          height: 60,
          paddingBottom: 5
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = focused ? "home" : "home-outline";
          else if (route.name === "Search") iconName = focused ? "search" : "search-outline";
          else if (route.name === "MyCourses") iconName = focused ? "book" : "book-outline";
          else if (route.name === "Profile") iconName = focused ? "person" : "person-outline";
          // else if (route.name === "coiurseDetail") iconName = focused ? "person" : "person-outline";

          return <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={22} color={color} />; // đảm bảo iconName luôn có giá trị mặc định
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="MyCourses" component={MyCoursesScreen} options={{ headerShown: true, title: "My Courses" }} />

      {/* <Tab.Screen name="coiurseDetail" component={CourseDetailScreen} options={{ headerShown: true, title: "coiurseDetail" }} /> */}

      <Tab.Screen
        name="Profile"
        component={UserProfileScreen}
        options={{
          headerShown: true,
          title: "User's Profile",
          headerRight: () => (
            <Menu>
              <MenuTrigger>
                <Ionicons
                  name="ellipsis-vertical"
                  size={22}
                  color="#333"
                  style={{ marginRight: 15 }}
                />
              </MenuTrigger>
              <MenuOptions
                customStyles={{
                  optionsContainer: {
                    padding: 5,
                    borderRadius: 8,
                    backgroundColor: "#fff",
                    elevation: 5,
                    marginTop: 25,
                    width: 160,
                  },
                }}
              >
                <MenuOption onSelect={() => console.log("Chỉnh sửa thông tin")}>
                  <Text style={{ padding: 8, fontSize: 15 }}>✏️ Chỉnh sửa thông tin</Text>
                </MenuOption>
                <MenuOption
                  onSelect={() =>
                    console.log("Đăng xuất")
                  }
                >
                  <Text style={{ padding: 8, color: "red", fontSize: 15 }}>🚪 Đăng xuất</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          ),
        }}
      />

    </Tab.Navigator>
  );
};


export default function App() {
  return (
    <SafeAreaProvider>
      <MenuProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="MainTabs">
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
            <Stack.Screen name="Learning" component={LearningScreen} />
            <Stack.Screen name="Rating" component={RatingScreen} />
            <Stack.Screen
              name="TeacherProfile"
              component={TeacherProfileScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </MenuProvider>
    </SafeAreaProvider>
  );
}