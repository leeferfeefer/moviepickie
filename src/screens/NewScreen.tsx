import React from 'react';
import { StyleSheet, RefreshControl } from "react-native";
import { MovieList } from '../components/MovieList';
import { MovieListItem } from '../components/MovieListItem';
import { useNavigation } from '@react-navigation/native';
import { TabScreens } from "../components/BottomTabBar";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { MovieResult, MovieResults } from '../types/MovieResult';
import { getMovieDetails, getNowPlaying, getPopular, getTopRated, getUpcoming } from '../services/TMDB.service';
import { LoadingIndicator } from '../components/FullScreenLoader';

// const movieCategories = ['Now Playing', 'Popular', 'Top Rated', 'Upcoming'] as const;
// type MovieCategory = typeof movieCategories[number];

enum MovieCategoryEnum {
    NowPlaying = 'Now Playing',
    Popular = 'Popular',
    TopRated = 'Top Rated',
    Upcoming = 'Upcoming',
}

const movieCategoryNames = Object.values(MovieCategoryEnum);

type MovieCategories = {
    [MovieCategoryEnum.NowPlaying]: MovieCategory;
    [MovieCategoryEnum.Popular]: MovieCategory;
    [MovieCategoryEnum.TopRated]: MovieCategory;
    [MovieCategoryEnum.Upcoming]: MovieCategory;
};

type MovieCategory = {
    movieResults: MovieResult[];
    currentPage: number;
};

type RetrieveMovieResultsMap = Record<
    keyof MovieCategories,
    {
        retrieveResults: (page: number) => Promise<MovieResults | undefined>;
    }>;
const retrieveMovieResultsMap: RetrieveMovieResultsMap = {
    [MovieCategoryEnum.NowPlaying]: {
        retrieveResults: getNowPlaying,
    },
    [MovieCategoryEnum.Popular]: {
        retrieveResults: getPopular,
    },
    [MovieCategoryEnum.TopRated]: {
        retrieveResults: getTopRated,
    },
    [MovieCategoryEnum.Upcoming]: {
        retrieveResults: getUpcoming,
    },
}

export const NewScreen = (): React.JSX.Element => {
    const navigation = useNavigation();
    const [movieCategories, setMovieCategories] = React.useState<MovieCategories>({
        [MovieCategoryEnum.NowPlaying]: {
            movieResults: [],
            currentPage: 1,
        },
        [MovieCategoryEnum.Popular]: {
            movieResults: [],
            currentPage: 1,
        },
        [MovieCategoryEnum.TopRated]: {
            movieResults: [],
            currentPage: 1,
        },
        [MovieCategoryEnum.Upcoming]: {
            movieResults: [],
            currentPage: 1,
        },
    });

    const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const selectedMovieCategoryName = movieCategoryNames[selectedIndex];
    const selectedMovieCategory = movieCategories[selectedMovieCategoryName];

    // pull down to refresh...
    // need to including paging logic

    const onRefresh = React.useCallback(() => {
        fetchMovieResults(selectedMovieCategoryName, true);
    }, [selectedIndex]);

    // Fetch initial movie results when tapping on segmented control
    // do not retrieve results if there are already results retrieved
    React.useEffect(() => {
        let isSubscribed = true;

        if (selectedMovieCategory.movieResults.length === 0) {
            fetchMovieResults(selectedMovieCategoryName, isSubscribed);
        }

        return () => {
            isSubscribed = false;
        };
    }, [selectedIndex]);

    const fetchMovieResults = async (selectedMovieCategoryName: MovieCategoryEnum, isSubscribed: boolean) => {
        setIsLoading(true);

        const newMovieResults = await retrieveMovieResultsMap[selectedMovieCategoryName].retrieveResults(selectedMovieCategory.currentPage);

        if (isSubscribed) {
            if (newMovieResults) {
                setMovieCategories({
                    ...movieCategories, 
                    [selectedMovieCategoryName]: {
                        ...movieCategories[selectedMovieCategoryName],
                        movieResults: [
                            ...movieCategories[selectedMovieCategoryName].movieResults, 
                            ...newMovieResults.results,
                        ],
                    },                                
                });
            }
            setIsLoading(false);
        }
    };

    const segmentedControlChange = async (index: number) => {
        setSelectedIndex(index);
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
                values={movieCategoryNames}
                selectedIndex={selectedIndex}
                onChange={(event) => {
                    segmentedControlChange(event.nativeEvent.selectedSegmentIndex);
                }}
            />
            <MovieList
                onRefresh={onRefresh}
                data={selectedMovieCategory.movieResults}
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