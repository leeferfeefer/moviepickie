import React from "react";
import { MovieList, MovieListProps } from "../components/MovieList";
import { MovieListItem } from "../components/MovieListItem";
import { useNavigation } from "@react-navigation/native";
import { TabScreens } from "../components/BottomTabBar";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import {
    getNowPlaying,
    getPopular,
    getTopRated,
    getUpcoming,
} from "../services/TMDB.service";
import { LoadingIndicator } from "../components/FullScreenLoader";

const intialMovieCategory: MovieCategory = {
    movieResults: [],
    currentPage: 0,
};

export const NewScreen = (): React.JSX.Element => {
    const navigation = useNavigation();
    const [movieCategories, setMovieCategories] = React.useState<MovieCategories>({
        [MovieCategoryEnum.NowPlaying]: intialMovieCategory,
        [MovieCategoryEnum.Popular]: intialMovieCategory,
        [MovieCategoryEnum.TopRated]: intialMovieCategory,
        [MovieCategoryEnum.Upcoming]: intialMovieCategory,
    });

    const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const fetchMovieResults = React.useCallback(
        async (options: FetchMovieResultsOptions) => {
            const { isSubscribed, page } = options;
            setIsLoading(true);
            const newMovieResults =
                await retrieveMovieResultsMap[
                    movieCategoryNames[selectedIndex]
                ].retrieveResults(page);

            if (options.onRefresh) {
                console.log(
                    "Fetching refresh movie results for: ",
                    movieCategoryNames[selectedIndex],
                );
            } else {
                console.log(
                    "Fetching movie results for: ",
                    movieCategoryNames[selectedIndex],
                );
            }
            console.log("page: ", page);

            const movieResultsToMerge = options.onRefresh
                ? []
                : movieCategories[movieCategoryNames[selectedIndex]].movieResults;

            if (isSubscribed) {
                if (newMovieResults) {
                    setMovieCategories({
                        ...movieCategories,
                        [movieCategoryNames[selectedIndex]]: {
                            movieResults: [
                                ...movieResultsToMerge,
                                ...newMovieResults.results,
                            ],
                            currentPage: page,
                        },
                    });
                }
                setIsLoading(false);
            }
        },
        [movieCategories, selectedIndex],
    );

    // When refreshing, retrieve the first page results
    const onRefresh = React.useCallback(() => {
        console.log("refreshing...");
        return fetchMovieResults({
            isSubscribed: true,
            page: 1,
            onRefresh: true,
        });
    }, [fetchMovieResults]);

    // Fetch initial movie results when tapping on segmented control
    // do not retrieve results if there are already results retrieved
    React.useEffect(() => {
        let isSubscribed = true;

        if (
            movieCategories[movieCategoryNames[selectedIndex]].movieResults
                .length === 0
        ) {
            fetchMovieResults({ isSubscribed, page: 1 });
        }

        return () => {
            isSubscribed = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedIndex]);

    const segmentedControlChange = React.useCallback((index: number) => {
        setSelectedIndex(index);
        console.log("selectedMovieCategoryName: ", movieCategoryNames[index]);
    }, []);

    const showMovieDetails = React.useCallback(
        async (movieId: MovieResult["id"]) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            navigation.navigate("MovieDetail", {
                movieId,
                prevRoute: TabScreens.New,
            });
        },
        [navigation],
    );

    const loadMoreData = React.useCallback(() => {
        fetchMovieResults({
            isSubscribed: true,
            page: movieCategories[movieCategoryNames[selectedIndex]].currentPage + 1,
        });
    }, [movieCategories, fetchMovieResults, selectedIndex]);

    return (
        <>
            {isLoading && <LoadingIndicator />}
            <SegmentedControl
                values={movieCategoryNames}
                selectedIndex={selectedIndex}
                onChange={event => {
                    segmentedControlChange(event.nativeEvent.selectedSegmentIndex);
                }}
            />
            <MovieList
                onRefresh={onRefresh}
                data={
                    movieCategories[movieCategoryNames[selectedIndex]].movieResults
                }
                loadMoreData={loadMoreData}
                renderItem={movieResult => (
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

enum MovieCategoryEnum {
    NowPlaying = "Now Playing",
    Popular = "Popular",
    TopRated = "Top Rated",
    Upcoming = "Upcoming",
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
    }
>;
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
};

type FetchMovieResultsOptions = {
    isSubscribed: boolean;
    page: number;
    onRefresh?: boolean;
};
