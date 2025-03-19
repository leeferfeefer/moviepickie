import React from 'react';
import Icon from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { useMovieStore } from '../zustand/MovieStore';

export const RandomMovieHeaderButton = (): React.JSX.Element => {
    const navigation = useNavigation();
    const movies = useMovieStore((state) => state.movies);
    const unwatchedMovies = movies.filter((movie) => !movie.watched);
    
    const randomButtonPressed = () => {
        if (unwatchedMovies.length > 0) {
            const randomMovie = unwatchedMovies[Math.floor(Math.random() * unwatchedMovies.length)];
            // @ts-ignore
            navigation.navigate('MovieDetail', { movie: randomMovie, prevRoute: 'Unwatched' });
        }
    }

    return <Icon
        name="dice-outline"
        size={30}
        color="black"
        style={{ marginRight: 20 }}
        onPress={randomButtonPressed}
    />
};

