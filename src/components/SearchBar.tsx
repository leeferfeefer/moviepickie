import React from "react";
import { TextInput, StyleSheet } from "react-native";

export type SearchBarProps = {
    placeholder: string;
    onEnterPress?: (searchKeyword: string) => void;
    onChangeText?: (searchKeyword: string) => void;
};

export const SearchBar = (props: SearchBarProps): React.JSX.Element => {
    const { placeholder, onEnterPress, onChangeText } = props;
    const [search, setSearch] = React.useState<string>("");

    const onTextChange = React.useCallback(
        (text: string) => {
            setSearch(text);
            onChangeText?.(text);
        },
        [onChangeText],
    );

    const onSubmitEditing = React.useCallback(() => {
        if (onEnterPress && search) {
            onEnterPress(search);
        }
    }, [onEnterPress, search]);

    return (
        <TextInput
            style={styles.searchBar}
            placeholder={placeholder}
            onChangeText={onTextChange}
            onSubmitEditing={onSubmitEditing}
            value={search}
        />
    );
};

const styles = StyleSheet.create({
    searchBar: {
        backgroundColor: "white",
        borderColor: "gray",
        borderWidth: 1,
        fontSize: 25,
        paddingLeft: 10,
        width: "100%",
    },
});
