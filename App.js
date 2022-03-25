import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, FlatList,
  TouchableHighlight, TextInput, KeyboardAvoidingView } from 'react-native';
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
        data={movies}
        renderItem={({item}) => {
          return <Text style={styles.item}>{item.movieName}</Text>
        }}
      />
      <KeyboardAvoidingView style={styles.addMovieRow} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TextInput
          style={styles.input}
          onChangeText={setNewMovie}
          value={newMovie}
        />  
       <TouchableHighlight style={styles.addMovieButton} onPress={addMovie}>
          <Text style={styles.readMoviesListButtonText}>Add Movie</Text>
        </TouchableHighlight>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  view: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  readMoviesListButton: {
    backgroundColor: 'blue',
    height: 50,
    width: 100,
    justifyContent: 'space-around'
  },
  readMoviesListButtonText: {
    color: 'white',
    textAlign: 'center'
  }, 
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  input: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    padding: 10,
    flex: 1
  },
  addMovieRow: {  
    flexDirection: "row"
  },
  addMovieButton: {
    backgroundColor: 'blue',
    height: 39,
    margin: 10,
    width: 100,
    justifyContent: 'space-around'
  }
});

export default App;
