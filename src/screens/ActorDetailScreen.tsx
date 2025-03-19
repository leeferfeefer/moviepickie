import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { getActorCredits, getActorDetails, IMAGE_URI } from '../services/TMDB.service';
import { useNavigation } from '@react-navigation/native';

type ActorDetailScreenRouteProp = RouteProp<{
    params: {
        actorId: number,
        actorName: string,
    }
}, 'params'>;
type ActorDetailScreenProps = {};

export const ActorDetailScreen = (_props: ActorDetailScreenProps): React.JSX.Element => {
    const navigation = useNavigation();
    const route = useRoute<ActorDetailScreenRouteProp>();
    const { actorId, actorName } = route.params;
    const [actorDetails, setActorDetails] = React.useState<ActorDetails | undefined>();
    const [actorCredits, setActorCredits] = React.useState<ActorCredits | undefined>();
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        navigation.setOptions({
            headerTitle: actorName,
        });
    }, []);

    React.useEffect(() => {
        const fetchActorDetails = async () => {
            setIsLoading(true);
            const details = await getActorDetails(actorId);
            setActorDetails(details);
            setIsLoading(false);
        };

        const fetchActorCredits = async () => {
            setIsLoading(true);
            const credits = await getActorCredits(actorId);
            setActorCredits(credits);
            setIsLoading(false);
        };

        fetchActorDetails();
        fetchActorCredits();
    }, [actorId]);

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
            <Text>{actorDetails.also_known_as.join(', ')}</Text>

            <Text style={styles.label}>Movies:</Text>
            <FlatList
                data={actorCredits?.cast}
                keyExtractor={(item, index) => `${index}`}
                renderItem={({ item }) => (
                    <View style={styles.movieItem}>
                        <Image
                            source={{ uri: `${IMAGE_URI}${item.poster_path}` }}
                            style={styles.movieImage}
                        />
                        <Text style={styles.movieTitle}>{item.title}</Text>
                        <Text style={styles.movieCharacter}>{item.character}</Text>
                    </View>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.movieList}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
    profileImage: {
        width: '100%',
        height: 400,
        resizeMode: 'cover',
        marginBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    biography: {
        fontSize: 14,
        marginBottom: 10,
    },
    movieList: {
        marginTop: 20,
        marginBottom: 50,
    },
    movieItem: {
        marginRight: 10,
        alignItems: 'center',
        width: 100,
    },
    movieImage: {
        width: 80,
        height: 120,
        borderRadius: 5,
        marginBottom: 5,
    },
    movieTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    movieCharacter: {
        fontSize: 12,
        color: 'gray',
    },
});