import React from 'react';
import { StyleSheet, Text } from "react-native";
import { MovieDetails } from '../types/MovieDetail';
import { MovieList } from '../components/MovieList';
import { MovieListItem } from '../components/MovieListItem';
import { useNavigation } from '@react-navigation/native';
import { TabScreens } from "../components/BottomTabBar";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { MovieResult, MovieResults } from '../types/MovieResult';
import { getMovieDetails, getNowPlaying, getPopular, getTopRated, getUpcoming } from '../services/TMDB.service';
import { LoadingIndicator } from '../components/FullScreenLoader';

const movieCategories = ['Now Playing', 'Popular', 'Top Rated', 'Upcoming'] as const;

// Step 2: Create a type from the array
type MovieCategory = typeof movieCategories[number];

// Step 3: Define the enum using the type
enum MovieCategoryEnum {
    NowPlaying = 'Now Playing',
    Popular = 'Popular',
    TopRated = 'Top Rated',
    Upcoming = 'Upcoming',
}

const values = Object.values(MovieCategoryEnum);

export const NewScreen = (): React.JSX.Element => {
    const navigation = useNavigation();
    const [movieResults, setMovieResults] = React.useState<MovieResult[]>([]);
    const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const segmentedControlChange = async (index: number) => {
        setSelectedIndex(index);
        setIsLoading(true);

        let movieResults: MovieResults | undefined;
        switch (values[index]) {
            case MovieCategoryEnum.NowPlaying:
                movieResults = await getNowPlaying();
                break;
            case MovieCategoryEnum.Popular:
                movieResults = await getPopular();
                break;
            case MovieCategoryEnum.TopRated:
                movieResults = await getTopRated();
                break;
            case MovieCategoryEnum.Upcoming:
                movieResults = await getUpcoming();
                break;
        }

        if (movieResults) {
            setMovieResults(movieResults.results);
        }
        setIsLoading(false);
    };

    const showMovieDetails = React.useCallback(async (movieId: MovieResult["id"]) => {
        setIsLoading(true);
        const movieDetails = await getMovieDetails(movieId);
        setIsLoading(false);
        if (movieDetails) {
            console.log(movieDetails);
            // @ts-ignore
            navigation.navigate('Detail', { movie: movieDetails, prevRoute: TabScreens.FindNewMovie });
        }
    }, []);

    return (
        <>
            {isLoading && <LoadingIndicator />}
            <SegmentedControl
                values={values}
                selectedIndex={selectedIndex as number}
                onChange={(event) => {
                    segmentedControlChange(event.nativeEvent.selectedSegmentIndex);
                }}
            />
            <MovieList
                data={movieResults}
                renderItem={(movieResult: MovieResult) => (
                    <MovieListItem
                        title={movieResult.title}
                        posterPath={movieResult.poster_path}
                        onPress={() => showMovieDetails(movieResult.id)}
                    />
                )}
            />
        </>
    );
};

const styles = StyleSheet.create({});