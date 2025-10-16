import { db } from './db';

interface AuditLogData {
  companyId?: string;
  userId?: string;
  entityType: string;
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'EXPORT';
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(data: AuditLogData) {
  try {
    await db.auditLog.create({
      data: {
        companyId: data.companyId,
        userId: data.userId,
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action,
        oldValues: data.oldValues || null,
        newValues: data.newValues || null,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  } catch (error) {
    console.error('Audit log error:', error);
    // Don't throw - audit logging shouldn't break the main flow
  }
}

export function getClientInfo(request: Request) {
  const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  return { ipAddress, userAgent };
}
