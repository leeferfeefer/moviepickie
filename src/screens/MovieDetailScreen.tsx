import React from "react";
import { Text, StyleSheet, ScrollView, Image, TouchableOpacity, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { MovieDetails } from "../types/MovieDetail";
import { IMAGE_URI } from "../services/TMDB.service";
import { useMovieStore } from "../zustand/MovieStore";
// import Icon from '@react-native-vector-icons/ionicons';
import { TabScreens } from "../components/BottomTabBar";

export type MovieDetailScreenProps = {
    route: {
        params: {
            movie: MovieDetails;
            prevRoute: string;
        };
    };
};

export const MovieDetailScreen = (props: MovieDetailScreenProps): React.JSX.Element => {
    const { route } = props;
    const { movie, prevRoute } = route.params;
    const navigation = useNavigation();
    const [isWatched, setIsWatched] = React.useState(movie.watched);

    const addMovie = useMovieStore((state) => state.addMovie);
    const removeMovie = useMovieStore((state) => state.removeMovie);
    const toggleWatch = useMovieStore((state) => state.toggleWatch);
    const movies = useMovieStore((state) => state.movies);
    const isAdded = movies.some((m) => m.id === movie.id);
   
    React.useEffect(() => {
        navigation.setOptions({
            headerTitle: movie.title,
        });
    }, []);

    const toggleAdded = React.useCallback(() => {
        if (isAdded) {
            removeMovie(movie.id);
        } else {
            addMovie(movie);
        }
    }, [isAdded]);

    const toggleWatched = React.useCallback(() => {        
        if (!isAdded) {
            addMovie(movie);
        }
        toggleWatch(movie.id);
        setIsWatched(!isWatched);
    }, [isWatched]); 

    return (
        <ScrollView style={styles.container}>
            <Image
                source={{ uri: `${IMAGE_URI}${movie.poster_path}` }}
                style={styles.poster}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={toggleAdded}
                >
                    <Text style={styles.buttonText}>{isAdded ? "Remove Movie" : "Add Movie"}</Text>
                </TouchableOpacity>                
                <TouchableOpacity
                    style={styles.button}
                    onPress={toggleWatched}
                >
                    <Text style={styles.buttonText}>{isWatched ? "Unwatch" : "Watch"}</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.tagline}>{movie.tagline}</Text>
            <Text style={styles.overview}>{movie.overview}</Text>
            <Text style={styles.label}>Genres:</Text>
            <Text>{movie.genres.map(genre => genre.name).join(', ')}</Text>
            <Text style={styles.label}>Release Date:</Text>
            <Text>{new Date(movie.release_date).toLocaleDateString()}</Text>
            <Text style={styles.label}>Runtime:</Text>
            <Text>{movie.runtime} minutes</Text>
            <Text style={styles.label}>Production Companies:</Text>
            <Text>{movie.production_companies.map(company => company.name).join(', ')}</Text>
            <Text style={styles.label}>Vote Average:</Text>
            <Text>{movie.vote_average}</Text>
            <Text style={styles.label}>Vote Count:</Text>
            <Text style={styles.voteCount}>{movie.vote_count}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
    },
    poster: {
        height: 700,
        resizeMode: 'cover',
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    tagline: {
        fontSize: 16,
        fontStyle: 'italic',
        marginBottom: 10,
    },
    overview: {
        fontSize: 14,
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    voteCount: {
        marginBottom: 50
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: "space-between",
        marginVertical: 20,
    },
    button: {
        flex: 1,
        borderRadius: 5,
        borderWidth: 1,
        alignContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 20,
        padding: 10,
    }
});
