export interface LoginEmail{
    email:string | undefined
}
export interface LoginCode{
    email:string | undefined;
    otp:any;
}
export interface CreateProfile{
    first_name: string;
    last_name: string;
    birth_day: any;
    phone_number: any;
}