import { Alert } from "react-native";

export const logError = (message: string, error: string | Error | unknown) => {
    let errorMsg: string;
    if (typeof error === "string") {
        errorMsg = error;
    } else if (error instanceof Error) {
        errorMsg = `${error.name}: ${error.message}`;
    } else {
        errorMsg = tryStringify(error);
    }
    const fullMessage = `${message} Cause: ${errorMsg}`;
    if (__DEV__) {
        console.log(fullMessage);
    } else {
        Alert.alert(fullMessage);
    }
};

const tryStringify = (data: unknown) => {
    try {
        return JSON.stringify(data);
    } catch {
        return "[Unable to stringify data]";
    }
};
