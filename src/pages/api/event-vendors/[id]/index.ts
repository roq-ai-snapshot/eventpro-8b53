import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { eventVendorValidationSchema } from 'validationSchema/event-vendors';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.event_vendor
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getEventVendorById();
    case 'PUT':
      return updateEventVendorById();
    case 'DELETE':
      return deleteEventVendorById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEventVendorById() {
    const data = await prisma.event_vendor.findFirst(convertQueryToPrismaUtil(req.query, 'event_vendor'));
    return res.status(200).json(data);
  }

  async function updateEventVendorById() {
    await eventVendorValidationSchema.validate(req.body);
    const data = await prisma.event_vendor.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteEventVendorById() {
    const data = await prisma.event_vendor.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
