import React from "react";
import {
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    View,
    ActivityIndicator,
    FlatList,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
    getMovieTrailerKeys,
    IMAGE_URI,
    getMovieCredits,
    getMovieDetails,
    getWatchProviders,
} from "../services/TMDB.service";
import { useMovieStore } from "../zustand/MovieStore";
import YoutubePlayer from "react-native-youtube-iframe";
import { TabScreens } from "../components/BottomTabBar";

type MovieDetailScreenProps = object;
type MovieDetailScreenRouteProp = RouteProp<
    {
        params: {
            movieDetails?: MovieDetails;
            movieId?: MovieResult["id"] | ActorCast["id"];
            prevRoute: string;
        };
    },
    "params"
>;

export const MovieDetailScreen = (
    _props: MovieDetailScreenProps,
): React.JSX.Element => {
    const navigation = useNavigation();
    const route = useRoute<MovieDetailScreenRouteProp>();
    const { movieId, movieDetails, prevRoute } = route.params;
    const [isTrailersLoading, setIsTrailersLoading] = React.useState(true);
    const [isMovieLoading, setIsMovieLoading] = React.useState(
        movieDetails ? false : true,
    );
    const [isCastLoading, setIsCastLoading] = React.useState(true);

    // if movieDetails is not passed in, fetch it
    React.useEffect(() => {
        if (movieId) {
            getMovie();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [movieId]);

    const getMovie = async () => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const movieDetails = await getMovieDetails(movieId!);
        if (movieDetails) {
            setMovie(movieDetails);
            setIsMovieLoading(false);
        }
    };

    const [movie, setMovie] = React.useState<MovieDetails | undefined>(movieDetails);
    const [isWatched, setIsWatched] = React.useState<boolean | undefined>(
        movie?.watched,
    );
    const [trailerKeys, setTrailerKeys] = React.useState<string[]>([]);
    const [actors, setActors] = React.useState<MovieCast[]>([]);
    const [loadingCastImages, setLoadingCastImages] = React.useState<{
        [key: string]: boolean;
    }>({});
    const [watchProviders, setWatchProviders] = React.useState<
        Providers | undefined
    >();
    const [isWatchProvidersLoading, setIsWatchProvidersLoading] =
        React.useState(true);

    const addMovie = useMovieStore(state => state.addMovie);
    const removeMovie = useMovieStore(state => state.removeMovie);
    const toggleWatch = useMovieStore(state => state.toggleWatch);
    const movies = useMovieStore(state => state.movies);
    const isAdded = movies.some(m => m.id === movie?.id);

    React.useEffect(() => {
        let isSubscribed = true;
        if (movie) {
            navigation.setOptions({
                headerTitle: movie.title,
            });

            if (prevRoute !== TabScreens.Watched) {
                getTrailers(isSubscribed);
            }

            getCredits(isSubscribed);
            getProviders(isSubscribed);
        }

        return () => {
            isSubscribed = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [movie]);

    const getTrailers = async (isSubscribed: boolean) => {
        const keys = await getMovieTrailerKeys(movie!.id);
        if (isSubscribed && keys) {
            setTrailerKeys(keys);
            setIsTrailersLoading(false);
        }
    };

    const getCredits = async (isSubscribed: boolean) => {
        const credits = await getMovieCredits(movie!.id);
        if (isSubscribed && credits) {
            setActors(credits.cast);
            setIsCastLoading(false);
        }
    };

    const getProviders = async (isSubscribed: boolean) => {
        const providers = await getWatchProviders(movie!.id);
        if (isSubscribed && providers) {
            setWatchProviders(providers);
            setIsWatchProvidersLoading(false);
        }
    };

    const toggleAdded = React.useCallback(() => {
        if (isAdded) {
            removeMovie(movie!.id);
        } else {
            addMovie(movie!);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdded]);

    const toggleWatched = React.useCallback(() => {
        if (!isAdded) {
            addMovie(movie!);
        }
        toggleWatch(movie!.id);
        setIsWatched(!isWatched);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isWatched]);

    const handleCastImageLoadStart = React.useCallback((id: string) => {
        setLoadingCastImages(prevState => ({ ...prevState, [id]: true }));
    }, []);

    const handleCastImageLoadEnd = React.useCallback((id: string) => {
        setLoadingCastImages(prevState => ({ ...prevState, [id]: false }));
    }, []);

    const navigateToActorDetail = React.useCallback(
        (castMember: MovieCast) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            navigation.navigate("ActorDetail", {
                actorId: castMember.id,
                actorName: castMember.name,
            });
        },
        [navigation],
    );

    return (
        <>
            <ActivityIndicator
                animating={isMovieLoading}
                size="large"
                style={styles.loadingIndicator}
            />
            {!isMovieLoading && (
                <ScrollView style={styles.container}>
                    <Image
                        source={{ uri: `${IMAGE_URI}${movie!.poster_path}` }}
                        style={styles.poster}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={toggleAdded}>
                            <Text style={styles.buttonText}>
                                {isAdded ? "Remove Movie" : "Add Movie"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={toggleWatched}>
                            <Text style={styles.buttonText}>
                                {isWatched ? "Unwatch" : "Watch"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.title}>{movie!.title}</Text>
                    <Text style={styles.tagline}>{movie!.tagline}</Text>
                    <Text style={styles.overview}>{movie!.overview}</Text>
                    <Text style={styles.label}>Genres:</Text>
                    <Text>{movie!.genres.map(genre => genre.name).join(", ")}</Text>
                    <Text style={styles.label}>Release Date:</Text>
                    <Text>{new Date(movie!.release_date).toLocaleDateString()}</Text>
                    <Text style={styles.label}>Runtime:</Text>
                    <Text>{movie!.runtime} minutes</Text>
                    <Text style={styles.label}>Production Companies:</Text>
                    <Text>
                        {movie!.production_companies
                            .map(company => company.name)
                            .join(", ")}
                    </Text>
                    <Text style={styles.label}>Vote Average:</Text>
                    <Text>{movie!.vote_average}</Text>
                    <Text style={styles.label}>Vote Count:</Text>
                    <Text style={styles.voteCount}>{movie!.vote_count}</Text>

                    <Text style={styles.label}>Watch Providers:</Text>
                    <View style={styles.watchProvidersContainer}>
                        <ActivityIndicator
                            animating={isWatchProvidersLoading}
                            size="small"
                            style={styles.trailerLoadingIndicator}
                        />
                        {(watchProviders?.rent ?? []).map(provider => (
                            <View
                                key={provider.provider_id}
                                style={styles.providerItem}>
                                <Image
                                    source={{
                                        uri: `${IMAGE_URI}${provider.logo_path}`,
                                    }}
                                    style={styles.providerLogo}
                                />
                            </View>
                        ))}
                    </View>

                    {prevRoute !== TabScreens.Watched && (
                        <>
                            <Text style={styles.label}>Trailers:</Text>
                            <View style={styles.trailerContainer}>
                                <ActivityIndicator
                                    animating={isTrailersLoading}
                                    size="small"
                                    style={styles.trailerLoadingIndicator}
                                />
                                {trailerKeys.length === 0 && !isTrailersLoading && (
                                    <Text>No trailers available</Text>
                                )}
                                {trailerKeys.length > 0 && !isTrailersLoading && (
                                    <ScrollView
                                        horizontal
                                        style={styles.videoContainer}>
                                        {trailerKeys.map((key, index) => (
                                            <View key={index} style={styles.trailer}>
                                                <YoutubePlayer
                                                    height={300}
                                                    videoId={key}
                                                    play={false}
                                                />
                                            </View>
                                        ))}
                                    </ScrollView>
                                )}
                            </View>
                        </>
                    )}

                    <Text style={styles.label}>Cast:</Text>
                    <ActivityIndicator
                        animating={isCastLoading}
                        size="small"
                        style={styles.castLoadingIndicator}
                    />
                    {!isCastLoading && (
                        <FlatList
                            data={actors}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => navigateToActorDetail(item)}>
                                    <View style={styles.castItem}>
                                        <View style={styles.imageContainer}>
                                            {loadingCastImages[item.id] && (
                                                <ActivityIndicator
                                                    style={styles.loadingIndicator}
                                                    size="small"
                                                    color="#0000ff"
                                                />
                                            )}
                                            <Image
                                                source={{
                                                    uri: `${IMAGE_URI}${item.profile_path}`,
                                                }}
                                                style={styles.castImage}
                                                onLoadStart={() =>
                                                    handleCastImageLoadStart(
                                                        item.id.toString(),
                                                    )
                                                }
                                                onLoadEnd={() =>
                                                    handleCastImageLoadEnd(
                                                        item.id.toString(),
                                                    )
                                                }
                                            />
                                        </View>
                                        <Text style={styles.castName}>
                                            {item.name}
                                        </Text>
                                        <Text style={styles.castCharacter}>
                                            {item.character}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.castList}
                        />
                    )}
                    <View style={styles.footer} />
                </ScrollView>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        alignContent: "center",
        alignItems: "center",
        borderRadius: 5,
        borderWidth: 1,
        flex: 1,
        marginHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 20,
    },
    buttonText: {
        fontSize: 20,
        padding: 10,
        textAlign: "center",
    },
    castCharacter: {
        color: "gray",
        fontSize: 12,
        textAlign: "center",
    },
    castImage: {
        borderRadius: 40,
        height: 80,
        marginBottom: 5,
        width: 80,
    },
    castItem: {
        alignItems: "center",
        marginRight: 10,
        width: 100,
    },
    castList: {
        marginTop: 20,
    },
    castLoadingIndicator: {
        transform: [{ translateX: -12 }, { translateY: -12 }],
    },
    castName: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
    },
    container: {
        backgroundColor: "white",
        flex: 1,
        padding: 10,
    },
    footer: {
        marginBottom: 50,
    },
    imageContainer: {
        height: 80,
        position: "relative",
        width: 80,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
    },
    loadingIndicator: {
        left: "50%",
        position: "absolute",
        top: "50%",
        transform: [{ translateX: -12 }, { translateY: -12 }],
    },
    overview: {
        fontSize: 14,
        marginBottom: 10,
    },
    poster: {
        height: 700,
        marginBottom: 10,
        resizeMode: "cover",
    },
    providerItem: {
        alignItems: "center",
        marginBottom: 10,
        marginRight: 10,
    },
    providerLogo: {
        borderRadius: 15,
        height: 30,
        marginBottom: 5,
        width: 30,
    },
    tagline: {
        fontSize: 16,
        fontStyle: "italic",
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 5,
    },
    trailer: {
        height: 200,
        marginRight: 10,
        width: 300,
    },
    trailerContainer: {
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    trailerLoadingIndicator: {
        transform: [{ translateX: -12 }, { translateY: -12 }],
    },
    videoContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    voteCount: {},
    watchProvidersContainer: {
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: 10,
    },
});
