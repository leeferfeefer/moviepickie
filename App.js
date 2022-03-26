import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, FlatList,
  TouchableHighlight, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import RealmService from './services/Realm.service';

const App = () => {
  const [movies, setMovies] = React.useState([]);
  const [newMovie, setNewMovie] = React.useState("");

  const readMovies = async () => {
    const realmMovies = await RealmService.getMovies();
    const transformedMovies = realmMovies.map(transformRealmMovie);
    console.log("transformedMovies", transformedMovies)
    setMovies(transformedMovies);
  };

  const transformRealmMovie = (realmMovie) => {
    return {
      movieName: realmMovie.movie_name,
      key: realmMovie._id
    };
  };

  const addMovie = () => {
    RealmService.addMovie(newMovie).then(isSuccess => {
      if (isSuccess) {
        readMovies();
        setNewMovie("");
      }
    });
  };

  const showMovieDetail = () => {

  };

  const renderListItem = ({item}) => {  
    return (
      // <Text style={styles.item}>
      //   {item.movieName}
      // </Text>
      <TouchableOpacity style={styles.listItem} onPress={showMovieDetail}>
        <Text style={styles.listItemText}>{item.movieName}</Text>
      </TouchableOpacity>
    );   
  }

  React.useEffect(() => {
    RealmService.openRealm().then(() => {
      readMovies().catch(() => {});
    }).catch(() => {});  
    return () => {
      RealmService.closeRealm();      
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />
      <FlatList
        style={{backgroundColor: "white"}}
        data={movies}
        renderItem={renderListItem}
      />
      <KeyboardAvoidingView style={styles.addMovieRow} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TextInput
          style={styles.input}
          onChangeText={setNewMovie}
          value={newMovie}
          placeholder="Add a movie"
        />  
       <TouchableOpacity style={styles.addMovieButton} onPress={addMovie}>
          <Text style={styles.addMovieButtonText}>Add</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray"
  },
  view: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listItem: {
    width: "100%",
    borderBottomWidth: 1,
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
    backgroundColor: "gray"
  },
  addMovieButton: {
    backgroundColor: 'blue',
    height: 39,
    margin: 10,
    width: 100,
    justifyContent: 'space-around',
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 1
  },
  addMovieButtonText: {
    color: 'white',
    textAlign: 'center'
  }, 
});

export default App;
