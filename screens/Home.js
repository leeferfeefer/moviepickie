import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, FlatList,
  TextInput, KeyboardAvoidingView, TouchableOpacity, Button, Image, Switch } from 'react-native';
import RealmService from '../services/Realm.service';
import TMDBService from '../services/TMDB.service';
import { useHeaderHeight } from '@react-navigation/elements';
import { DeviceEventEmitter } from "react-native"



const Locations = {
  List: "LIST",
  External: "EXTERNAL"
};

export default Home = ({ navigation }) => {
  const [tempMovies, setTempMovies] = React.useState([]);
  const [movies, setMovies] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");
  const [searchLocation, setSearchLocation] = React.useState(Locations.List);
  const searchField = React.useRef(null);

  DeviceEventEmitter.addListener("movieListChanged", () => {
    readMovies();
  });

  const readMovies = async () => {
    try {
      await RealmService.openRealm();   
      const realmMovies = await RealmService.getMovies();
      setMovies(realmMovies);
    } catch (error) {
      console.log("Could not read movies from Realm");
    };
    RealmService.openRealm().then(() => {
      readMovies().catch(() => {});
    }).catch(() => {});  
    return () => {
    }
  };

  React.useEffect(() => {
    const isSubscribed = true;
    readMovies(isSubscribed);    
    return () => {
      isSubscribed = false;
      RealmService.closeRealm();      
    }
  }, []);

  const showMovieDetail = (movie) => {
    searchField.current?.blur();
    navigation.navigate("Detail", { selectedMovie: movie, fromSearchList: isSearchingList() });
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
    let searchMoviesResult;
    if (isSearchFromList) {
      searchMoviesResult = movies?.filter(movie => movie.title.includes(input));
    } else {
      // only get a list of movies if more than 2 letters
      if (input.length > 2) {
        searchMoviesResult = await TMDBService.searchMovies(input);
      }
    }    
    console.log("Results: ", searchMoviesResult)
    if (searchMoviesResult?.length > 1) {
      setSearchMovies(searchMoviesResult);  
    }         
  };

  const searchInputOnFocus = () => {   
    navigation.setOptions({
      title: "Search",
      headerRight: () => (
        <Button 
          onPress={() => {
            // resetUI();
          }}     
          title="Cancel"              
        /> 
      ),
    });
  }

  switchMovies = () => {
    const temp = tempMovies;
    setTempMovies(movies);
    setMovies(temp);
  };

  const isSearchingList = () => {
    return searchLocation === Locations.List;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />
      <FlatList
        style={{backgroundColor: "white", flex: 1, width: "100%"}}
        data={movies}
        renderItem={renderListItem}
      />
      {/* <KeyboardAvoidingView 
        style={styles.addMovieRow} 
        keyboardVerticalOffset={useHeaderHeight()}
        behavior={Platform.OS === "ios" ? "padding" : "height"}> */}
        <TextInput
          ref={searchField}
          style={styles.input}
          onChangeText={onSearchInput}
          value={searchText}
          placeholder={`Search for a movie ${isSearchingList() ? "within list" : "online"}`}
          onFocus={searchInputOnFocus}
        />  
        <Switch
          style={{margin: 10}}
          trackColor={{ false: "#81b0ff", true: "#767577"}}
          thumbColor={isSearchingList() ? "#f4f3f4" : "#f5dd4b"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => {
            switchMovies();
            switchLocations();
            searchField.current?.blur();
            setSearchText("");
            navigation.setOptions({ title: "List", headerRight: undefined });
          }}
          value={isSearchingList()}
      />
      {/* </KeyboardAvoidingView>       */}
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
    backgroundColor: "lightgray",
    alignItems: "center"
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