export interface SuccessResponse<T> {
    '@context': string;
    '@metadataEtag': string;
    '@count'?: number;
    value: T;
}
