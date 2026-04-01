import { AuditLogModel } from "../models";

interface AuditLogParams{
    userId: number,
    action: string;
    entityType: string;
    entityId: number | null;
    description: string | null;
    ipAddress: string | null;
}

export const logAudit = async ({userId,action,entityType,entityId=null,description=null,ipAddress=null}:AuditLogParams) => {
    try {
        await AuditLogModel.create({
            user_id: userId,
            action,
            entity_type: entityType,
            entity_id: entityId,
            description,
            ip_address: ipAddress
        });   
    } catch (error) {
        console.error("Audit log error",error);
    }
}