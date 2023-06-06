import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { eventValidationSchema } from 'validationSchema/events';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getEvents();
    case 'POST':
      return createEvent();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEvents() {
    const data = await prisma.event
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'event'));
    return res.status(200).json(data);
  }

  async function createEvent() {
    await eventValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.event_schedule?.length > 0) {
      const create_event_schedule = body.event_schedule;
      body.event_schedule = {
        create: create_event_schedule,
      };
    } else {
      delete body.event_schedule;
    }
    if (body?.event_team?.length > 0) {
      const create_event_team = body.event_team;
      body.event_team = {
        create: create_event_team,
      };
    } else {
      delete body.event_team;
    }
    if (body?.event_vendor?.length > 0) {
      const create_event_vendor = body.event_vendor;
      body.event_vendor = {
        create: create_event_vendor,
      };
    } else {
      delete body.event_vendor;
    }
    if (body?.guest?.length > 0) {
      const create_guest = body.guest;
      body.guest = {
        create: create_guest,
      };
    } else {
      delete body.guest;
    }
    const data = await prisma.event.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
