import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import AddMovieModal from './components/AddMovieModal';
import RealmService from './services/Realm.service';

const App = () => {
  const [isAddMovieModalVisible, setIsAddMovieModalVisible] = useState(false);

  const readMovies = async () => {
    await RealmService.getMovies();
  };

  const showAddMovieModal = () => {
    setIsAddMovieModalVisible(true);
  };

  const saveMovie = async (movieName) => {
    console.log("movieName: ", movieName);
    const isSuccess = await RealmService.addMovie(movieName);
    if (!isSuccess) {
      // show alert here
      console.log("Could not save... try again");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />
      <View style={styles.view}>
        <TouchableHighlight style={styles.readMoviesListButton} onPress={readMovies}>
          <Text style={styles.readMoviesListButtonText}>Read Movies</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.readMoviesListButton} onPress={showAddMovieModal}>
          <Text style={styles.readMoviesListButtonText}>Add Movie</Text>
        </TouchableHighlight>
        <AddMovieModal isVisible={isAddMovieModalVisible} setIsVisible={setIsAddMovieModalVisible} onCloseCallback={saveMovie}/>
      </View>
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
  }
});

export default App;
