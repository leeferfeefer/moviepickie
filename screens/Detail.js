import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import RealmService from '../services/Realm.service';
import { DeviceEventEmitter } from "react-native"

const Detail = ({route}) => {

  const { selectedMovie, fromSearchList } = route.params; 

  const addMovie = async () => {
    const isSuccess = await RealmService.addMovie(selectedMovie);
    if (isSuccess) {
      // TODO: Replace this with Redux
      DeviceEventEmitter.emit("movieAdded");
    } else {
      // show alert of failure here
    }
  };

  return (
    <View style={styles.container}>
      {fromSearchList && (
        <TouchableOpacity style={styles.addMovieButton} onPress={addMovie}>
          <Text style={styles.addMovieButtonText}>Add</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1
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

export default Detail;