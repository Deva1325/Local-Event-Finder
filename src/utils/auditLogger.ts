import { AuditLogModel } from "../models";

interface AuditLogParams{
    user_id: number,
    action: string;
    entity_type: string;
    entity_id: number | null;
    description: string | null;
    ip_address: string | null;
}

export const logAudit = async ({user_id,action,entity_type,entity_id=null,description=null,ip_address=null}:AuditLogParams) => {
    try {
        await AuditLogModel.create({
            user_id,
            action,
            entity_type,
            entity_id,
            description,
            ip_address
        });   
    } catch (error) {
        console.error("Audit log error",error);
    }
}