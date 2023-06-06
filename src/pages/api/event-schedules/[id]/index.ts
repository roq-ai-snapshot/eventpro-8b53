import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { eventScheduleValidationSchema } from 'validationSchema/event-schedules';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.event_schedule
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getEventScheduleById();
    case 'PUT':
      return updateEventScheduleById();
    case 'DELETE':
      return deleteEventScheduleById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEventScheduleById() {
    const data = await prisma.event_schedule.findFirst(convertQueryToPrismaUtil(req.query, 'event_schedule'));
    return res.status(200).json(data);
  }

  async function updateEventScheduleById() {
    await eventScheduleValidationSchema.validate(req.body);
    const data = await prisma.event_schedule.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteEventScheduleById() {
    const data = await prisma.event_schedule.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
