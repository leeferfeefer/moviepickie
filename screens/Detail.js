import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Linking, Alert } from 'react-native';
import RealmService from '../services/Realm.service';
import { DeviceEventEmitter } from "react-native"
import TMDBService from '../services/TMDB.service';

const Detail = ({route}) => {
  const { selectedMovie, fromSearchList } = route.params; 
  const [ movieDetails , setMovieDetails ] = React.useState({});
  const [ isDetailsLoading, setIsDetailsLoading ] = React.useState(false);
  const [ isAdded, setIsAdded ] = React.useState(!fromSearchList);

  React.useEffect(() => {
    !isAdded && getMovieDetails().catch(() => {});
  }, []);

  const getMovieDetails = async () => {
    setIsDetailsLoading(true);
    const details = await TMDBService.getMovieDetails(selectedMovie.id);
    setIsDetailsLoading(false);
    setMovieDetails(details);
  };  

  const addMovie = async () => {
    const isSuccess = await RealmService.addMovie(selectedMovie);
    if (isSuccess) {
      DeviceEventEmitter.emit("movieListChanged");
      setIsAdded(!isAdded);
    } else {
      Alert.alert("Oopsie", "Unable to add movie");
    }
  };

  const removeMovie = async () => {
    const isSuccess = await RealmService.removeMovie(selectedMovie.id);
    if (isSuccess) {
      DeviceEventEmitter.emit("movieListChanged");
      setIsAdded(!isAdded);
    } else {
      Alert.alert("Oopsie", "Unable to remove movie");
    }
  };

  const openIMDB = () => {
    const imdbURL = `https://www.imdb.com/title/${movieDetails?.imdbId}`;
    Linking.canOpenURL(imdbURL).then(supported => {
      if (supported) {
        Linking.openURL(imdbURL);
      } else {
        console.log("Don't know how to open URI: " + imdbURL);
      }
    });
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        resizeMode="cover" 
        style={styles.backgroundImage} 
        source={{uri: `${TMDBService.IMAGE_URI}${selectedMovie.backdropPath}`}}
      />
      <View style={styles.detailsView}>
        <View style={{ backgroundColor: "rrgba(118, 116, 117, 0.35)"}}>
          <Text style={styles.descriptionText}>{`Genre: ${movieDetails?.genres?.join(", ")}`}</Text>
          <Text style={styles.descriptionText}>{selectedMovie.overview}</Text>
        </View>        
        <View style={{flexDirection: "row", flex: 1, backgroundColor: "rrgba(118, 116, 117, 0.35)"}}>
          <Text style={styles.descriptionText}>{`Release Date: ${selectedMovie.releaseDate}`}</Text>
          <Text style={styles.descriptionText}>{`Runtime: ${movieDetails?.runtime} mins`}</Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.addMovieButton} onPress={isAdded ? removeMovie : addMovie}>
            <Text style={styles.addMovieButtonText}>{isAdded ? "Remove" : "Add"}</Text>
          </TouchableOpacity>        
          {!isDetailsLoading && (
            <TouchableOpacity style={styles.addMovieButton} onPress={openIMDB}>
              <Text style={styles.addMovieButtonText}>Go to IMDB</Text>
            </TouchableOpacity>    
          )}
        </View>        
      </View>   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addMovieButton: {
    backgroundColor: 'rrgba(118, 116, 117, 0.35)',
    height: 39,
    margin: 10,
    width: 100,
    justifyContent: 'space-around',
  },
  detailsView: {
    flex: 1,
    position: "absolute",
    left: 0,
    bottom: 100,
    backgroundColor: "rrgba(118, 116, 117, 0.35)",
  },
  addMovieButtonText: {
    color: 'black',
    textAlign: 'center'
  }, 
  backgroundImage: {
    opacity: 0.3,
    width: "100%", 
    height: "100%"
  },
  descriptionText: {
    color: "black",
    padding: 20,
    fontSize: 15,
  },
  buttonRow: {
    flexDirection: "row"
  }
});

export default Detail;