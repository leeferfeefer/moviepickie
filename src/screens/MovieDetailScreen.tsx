import React from "react";
import { Text, StyleSheet, ScrollView, Image } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { MovieDetails } from "../types/MovieDetail";
import { IMAGE_URI } from "../services/TMDB.service";

export type MovieDetailScreenProps = {
    route: {
        params: {
            movie: MovieDetails;
        };
    };
};

export const MovieDetailScreen = (props: MovieDetailScreenProps): React.JSX.Element => {
    const { route } = props;
    const movie = route.params.movie;
    const navigation = useNavigation();

    React.useEffect(() => {
        navigation.setOptions({
            headerTitle: movie.title,
        });
    }, []);

    return (
        <ScrollView style={styles.container}>
            <Image
                source={{ uri: `${IMAGE_URI}${movie.poster_path}` }}
                style={styles.poster}
            />
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
        width: '100%',
        height: 300,
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
    }
});
