type WatchProvidersResult = {
    id: number;
    results: CountryResults;
};

type CountryResults = {
    US: Providers;
};

type Providers = {
    link: string;
    rent: ProviderInfo[];
    buy: ProviderInfo[];
    flatrate?: ProviderInfo[];
};

type ProviderInfo = {
    logo_path: string;
    provider_id: number;
    provider_name: string;
    display_priority: number;
};
