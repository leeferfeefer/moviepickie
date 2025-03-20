type ActorCredits = {
    cast: ActorCast[];
    crew: ActorCast[];
    id: number;
};

type ActorCast = {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: OriginalLanguage;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    character?: string;
    credit_id: string;
    order?: number;
    department?: Department;
    job?: string;
};

enum Department {
    Directing = "Directing",
    Production = "Production",
    Writing = "Writing",
}

enum OriginalLanguage {
    En = "en",
    Pl = "pl",
    Pt = "pt",
}
