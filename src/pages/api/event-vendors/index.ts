import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { eventVendorValidationSchema } from 'validationSchema/event-vendors';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getEventVendors();
    case 'POST':
      return createEventVendor();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEventVendors() {
    const data = await prisma.event_vendor
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'event_vendor'));
    return res.status(200).json(data);
  }

  async function createEventVendor() {
    await eventVendorValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.event_vendor.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
