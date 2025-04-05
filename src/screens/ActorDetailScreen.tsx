import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import {
    getActorCredits,
    getActorDetails,
    IMAGE_URI,
} from "../services/TMDB.service";
import { useNavigation } from "@react-navigation/native";

type ActorDetailScreenRouteProp = RouteProp<
    {
        params: {
            actorId: MovieCast["id"];
            actorName: MovieCast["name"];
        };
    },
    "params"
>;
type ActorDetailScreenProps = object;

export const ActorDetailScreen = (
    _props: ActorDetailScreenProps,
): React.JSX.Element => {
    const navigation = useNavigation();
    const route = useRoute<ActorDetailScreenRouteProp>();
    const { actorId, actorName } = route.params;
    const [actorDetails, setActorDetails] = React.useState<
        ActorDetails | undefined
    >();
    const [actorCredits, setActorCredits] = React.useState<
        ActorCredits | undefined
    >();
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [loadingMovieImages, setLoadingMovieImages] = React.useState<{
        [key: string]: boolean;
    }>({});

    React.useEffect(() => {
        navigation.setOptions({
            headerTitle: actorName,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        let isSubscribed = true;
        getDetails(isSubscribed);
        getCredits(isSubscribed);
        return () => {
            isSubscribed = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actorId]);

    const getDetails = async (isSubscribed: boolean) => {
        setIsLoading(true);
        const details = await getActorDetails(actorId);
        if (isSubscribed) {
            setActorDetails(details);
            setIsLoading(false);
        }
    };

    const getCredits = async (isSubscribed: boolean) => {
        setIsLoading(true);
        const credits = await getActorCredits(actorId);
        if (isSubscribed) {
            setActorCredits(credits);
            setIsLoading(false);
        }
    };

    const handleMovieImageLoadStart = React.useCallback((id: string) => {
        setLoadingMovieImages(prevState => ({ ...prevState, [id]: true }));
    }, []);

    const handleMovieImageLoadEnd = React.useCallback((id: string) => {
        setLoadingMovieImages(prevState => ({ ...prevState, [id]: false }));
    }, []);

    const navigateToMovieDetail = React.useCallback(
        (movieId: ActorCast["id"]) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            navigation.navigate("MovieDetail", {
                movieId,
                prevRoute: "ActorDetail",
            });
        },
        [navigation],
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!actorDetails) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load actor details.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Image
                source={{ uri: `${IMAGE_URI}${actorDetails.profile_path}` }}
                style={styles.profileImage}
            />
            <Text style={styles.name}>{actorDetails.name}</Text>
            <Text style={styles.label}>Biography:</Text>
            {actorDetails.homepage && (
                <>
                    <Text style={styles.label}>Homepage:</Text>
                    <Text>{actorDetails.homepage}</Text>
                </>
            )}
            <Text style={styles.biography}>{actorDetails.biography}</Text>
            <Text style={styles.label}>Birthday:</Text>
            <Text>{actorDetails.birthday}</Text>
            {actorDetails.deathday && (
                <>
                    <Text style={styles.label}>Deathday:</Text>
                    <Text>{actorDetails.deathday}</Text>
                </>
            )}
            <Text style={styles.label}>Place of Birth:</Text>
            <Text>{actorDetails.place_of_birth}</Text>
            <Text style={styles.label}>Known For:</Text>
            <Text>{actorDetails.known_for_department}</Text>
            <Text style={styles.label}>Also Known As:</Text>
            <Text>{actorDetails.also_known_as.join(", ")}</Text>

            <Text style={styles.label}>Movies:</Text>
            <FlatList
                data={actorCredits?.cast}
                keyExtractor={(_item, index) => `${index}`}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigateToMovieDetail(item.id)}>
                        <View style={styles.movieItem}>
                            <View style={styles.imageContainer}>
                                {loadingMovieImages[item.id] && (
                                    <ActivityIndicator
                                        style={styles.loadingIndicator}
                                        size="small"
                                        color="#0000ff"
                                    />
                                )}
                                <Image
                                    source={{
                                        uri: `${IMAGE_URI}${item.poster_path}`,
                                    }}
                                    style={styles.movieImage}
                                    onLoadStart={() =>
                                        handleMovieImageLoadStart(item.id.toString())
                                    }
                                    onLoadEnd={() =>
                                        handleMovieImageLoadEnd(item.id.toString())
                                    }
                                />
                            </View>
                            <Text style={styles.movieTitle}>{item.title}</Text>
                            <Text style={styles.movieCharacter}>
                                {item.character}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.movieList}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    biography: {
        fontSize: 14,
        marginBottom: 10,
    },
    container: {
        backgroundColor: "white",
        flex: 1,
        padding: 10,
    },
    errorContainer: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
    },
    errorText: {
        color: "red",
        fontSize: 18,
    },
    imageContainer: {
        alignItems: "center",
        height: 120,
        position: "relative",
        width: 100,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
    },
    loadingContainer: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
    },
    loadingIndicator: {
        left: "50%",
        position: "absolute",
        top: "50%",
        transform: [{ translateX: -12 }, { translateY: -12 }],
    },
    movieCharacter: {
        color: "gray",
        fontSize: 12,
        textAlign: "center",
    },
    movieImage: {
        borderRadius: 5,
        height: 120,
        marginBottom: 5,
        width: 80,
    },
    movieItem: {
        alignItems: "center",
        marginRight: 10,
        width: 100,
    },
    movieList: {
        marginBottom: 50,
        marginTop: 20,
    },
    movieTitle: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    profileImage: {
        height: 400,
        marginBottom: 10,
        resizeMode: "cover",
        width: "100%",
    },
});
