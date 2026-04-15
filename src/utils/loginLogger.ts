import LoginLogModel from "../models/LoginLogModel";



export const createLoginLog = async (userId:number | null,ip: string| null) => {
    try {
        const logs=await LoginLogModel.create({
            user_id: userId,
            ip_address: ip
        });

        return logs.login_log_id;

    } catch (error) {   
        console.log("Login log error",error);
    }
}

export const updateLogoutLog = async (logId:number) => {
    try {
        await LoginLogModel.update(
            {
                logout_time: new Date(),
                is_logout: true
            },
            {
                where: { login_log_id: logId }
            }
        );
    } catch (error) {
        console.log("logout log error",error);
    }
}
