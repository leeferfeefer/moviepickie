import React from "react";
import { TextInput, StyleSheet } from "react-native";

export type SearchBarProps = {

    placeholder: string;

    onEnterPress?: (searchKeyword: string) => void;

    onChangeText?: (searchKeyword: string) => void;
};

export const SearchBar = (props: SearchBarProps): React.JSX.Element => {
    const { placeholder, onEnterPress } = props;
    const [search, setSearch] = React.useState<string>("");

    const onChangeText = React.useCallback((text: string) => {
        setSearch(text);
        props.onChangeText?.(text);
    }, [search]);

    const onSubmitEditing = React.useCallback(() => {
        if (onEnterPress && search) {
            onEnterPress(search);
        }
    }, [search]);

    return (
        <TextInput
            style={styles.searchBar}
            placeholder={placeholder}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
            value={search}
        />
    );
}

const styles = StyleSheet.create({
    searchBar: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        width: '100%',
        backgroundColor: 'white',
    },
});
