import api from "./api";

export async function me() {
    return api.get("/auth/me");
}

export async function login(data:any){
    return api.post("/auth/login",data);
}

export async function register(data:any){
    return api.post("/auth/register",data);
}

export async function logout(){
    return api.post("/auth/logout");
}
