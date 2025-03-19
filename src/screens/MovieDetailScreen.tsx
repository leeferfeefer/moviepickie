import React from "react";
import { Text, StyleSheet, ScrollView, Image, TouchableOpacity, View, ActivityIndicator, FlatList } from "react-native";
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { getMovieTrailerKeys, IMAGE_URI, getMovieCredits } from "../services/TMDB.service";
import { useMovieStore } from "../zustand/MovieStore";
import YoutubePlayer from "react-native-youtube-iframe";
import { TabScreens } from "../components/BottomTabBar";

type MovieDetailScreenProps = {};
type MovieDetailScreenRouteProp = RouteProp<{
    params: {
        movie: MovieDetails;
        prevRoute: string;
    }
}, 'params'>;

export const MovieDetailScreen = (_props: MovieDetailScreenProps): React.JSX.Element => {
    const navigation = useNavigation();
    const route = useRoute<MovieDetailScreenRouteProp>();
    const { movie, prevRoute } = route.params;

    const [isWatched, setIsWatched] = React.useState(movie.watched);
    const [isLoading, setIsLoading] = React.useState(false);
    const [trailerKeys, setTrailerKeys] = React.useState<string[]>([]);
    const [actors, setActors] = React.useState<MovieCast[]>([]);
    const [loadingCastImages, setLoadingCastImages] = React.useState<{ [key: string]: boolean }>({});

    const addMovie = useMovieStore((state) => state.addMovie);
    const removeMovie = useMovieStore((state) => state.removeMovie);
    const toggleWatch = useMovieStore((state) => state.toggleWatch);
    const movies = useMovieStore((state) => state.movies);
    const isAdded = movies.some((m) => m.id === movie.id);

    React.useEffect(() => {
        let isSubscribed = true;
        navigation.setOptions({
            headerTitle: movie.title,
        });
        if (prevRoute !== TabScreens.Watched) {
            getTrailers(isSubscribed);
        }

        getCredits(isSubscribed);

        return () => {
            isSubscribed = false;
        };
    }, []);

    const getTrailers = async (isSubscribed: boolean) => {
        setIsLoading(true);
        const keys = await getMovieTrailerKeys(movie.id);
        if (isSubscribed && keys) {
            setTrailerKeys(keys);
            setIsLoading(false);
        }
    };

    const getCredits = async (isSubscribed: boolean) => {
        setIsLoading(true);
        const credits = await getMovieCredits(movie.id);
        if (isSubscribed && credits) {
            setActors(credits.cast);
            setIsLoading(false);
        }
    }

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

    const handleCastImageLoadStart = (id: string) => {
        setLoadingCastImages((prevState) => ({ ...prevState, [id]: true }));
    };

    const handleCastImageLoadEnd = (id: string) => {
        setLoadingCastImages((prevState) => ({ ...prevState, [id]: false }));
    };

    const navigateToActorDetail = (castMember: MovieCast) => {
        // @ts-ignore
        navigation.navigate('ActorDetail', {
            actorId: castMember.id,
            actorName: castMember.name,
        });
    };

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

            {prevRoute !== TabScreens.Watched && (
                <>
                    <Text style={styles.label}>Trailers:</Text>
                    <View style={styles.trailerContainer}>
                        <ActivityIndicator
                            animating={isLoading}
                            size="small"
                        />
                        {trailerKeys.length === 0 && !isLoading && (
                            <Text>No trailers available</Text>
                        )}
                        {trailerKeys.length > 0 && !isLoading && (
                            <ScrollView horizontal style={styles.videoContainer}>
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
            <FlatList
                data={actors}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigateToActorDetail(item)}>
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
                                    source={{ uri: `${IMAGE_URI}${item.profile_path}` }}
                                    style={styles.castImage}
                                    onLoadStart={() => handleCastImageLoadStart(item.id.toString())}
                                    onLoadEnd={() => handleCastImageLoadEnd(item.id.toString())}
                                />
                            </View>
                            <Text style={styles.castName}>{item.name}</Text>
                            <Text style={styles.castCharacter}>{item.character}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.castList}
            />
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
    },
    trailerContainer: {
        marginTop: 20,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    trailer: {
        width: 300,
        height: 200,
        marginRight: 10,
    },
    videoContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    castList: {
        marginTop: 20,
        marginBottom: 50,
    },
    castItem: {
        marginRight: 10,
        alignItems: 'center',
        width: 100,
    },
    imageContainer: {
        position: 'relative',
        width: 80,
        height: 80,
    },
    castImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 5,
    },
    castName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    castCharacter: {
        fontSize: 12,
        color: 'gray',
    },
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -12 }, { translateY: -12 }],
    },
});
