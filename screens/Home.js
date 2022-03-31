import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, FlatList,
  TextInput, KeyboardAvoidingView, TouchableOpacity, Button, Image } from 'react-native';
import RealmService from '../services/Realm.service';
import TMDBService from '../services/TMDB.service';
import { useHeaderHeight } from '@react-navigation/elements';
import { DeviceEventEmitter } from "react-native"

export default Home = ({ navigation }) => {
  const [movies, setMovies] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");

  const [isSearchListVisible, setIsSearchListVisible] = React.useState(false);
  const [searchMovies, setSearchMovies] = React.useState([])
  const searchField = React.useRef(null);

  // TODO: Replace this with Redux
  DeviceEventEmitter.addListener("movieListChanged", () => {
    readMovies();
    setSearchText("");
    // navigation.goBack();
  });

  const readMovies = async () => {
    const realmMovies = await RealmService.getMovies();
    setMovies(realmMovies);
  };

  const showMovieDetail = (movie) => {
    navigation.navigate("Detail", { selectedMovie: movie, fromSearchList: isSearchListVisible });
  };

  const renderListItem = ({item}) => {  
    return (
      <TouchableOpacity style={styles.listItem} onPress={() => showMovieDetail(item)}>
        <Image style={{width: 50, height: 50}} source={{uri: `${TMDBService.IMAGE_URI}${item.posterPath}`}}/>
        <Text style={styles.listItemText}>{item.title}</Text>      
      </TouchableOpacity>
    );   
  }

  const onSearchInput = async (input) => {
    setSearchText(input);

    // only get a list of movies if more than 2 letters
    if (input.length > 2) {
      const searchMoviesResult = await TMDBService.searchMovies(input);
      setSearchMovies(searchMoviesResult);
    }    
  };

  React.useEffect(() => {
    RealmService.openRealm().then(() => {
      readMovies().catch(() => {});
    }).catch(() => {});  
    return () => {
      console.log("unmount?");
      RealmService.closeRealm();      
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />
      <FlatList
        style={{backgroundColor: "white", flex: 1, width: "100%"}}
        data={isSearchListVisible ? searchMovies : movies}
        renderItem={renderListItem}
      />
      <KeyboardAvoidingView 
        style={styles.addMovieRow} 
        keyboardVerticalOffset={useHeaderHeight()}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TextInput
          ref={searchField}
          style={styles.input}
          onChangeText={onSearchInput}
          value={searchText}
          placeholder="Search for a movie"
          onFocus={() => {
            setIsSearchListVisible(true);
            navigation.setOptions({
              title: "Search",
              headerRight: () => (
                <Button 
                  onPress={() => {
                    navigation.setOptions({ title: "List", headerRight: undefined })
                    setIsSearchListVisible(false);
                    searchField.current.blur();
                    setSearchText("");
                  }}     
                  title="Cancel"              
                /> 
              ),
            });
          }}
        />  
      </KeyboardAvoidingView>      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray",
    alignItems: "center", 
    justifyContent: "center"
  },
  view: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  listItem: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "lightgray",
    flexDirection: "row",
    alignItems: "center"
  },
  listItemText: {
    padding: 10,
    fontSize: 18, 
    height: 44,
    color: "black"
  },
  input: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    padding: 10,
    flex: 1,
    backgroundColor: "white",
    borderRadius: 5
  },
  addMovieRow: {  
    flexDirection: "row",
    backgroundColor: "lightgray"
  },
  cancelButton: {
    backgroundColor: 'transparent',
    height: 39,
    margin: 10,
    width: 100,
    justifyContent: 'space-around',
  },
  cancelButtonText: {
    color: 'blue',
    textAlign: 'center'
  }
});