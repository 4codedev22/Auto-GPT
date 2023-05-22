export interface Payload {
    data: {
        account_id: number;
        username: string;
        authorities?: string[];
        contracts?: number[];
    };
    exp?: number;
}
