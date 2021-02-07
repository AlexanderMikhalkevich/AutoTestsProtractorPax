export default interface User {
    id?: number;
    firstName: string;
    lastName: string;
    nick: string;
    email: string;
    password?: string;
}