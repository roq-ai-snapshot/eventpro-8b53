import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { eventPlanningCompanyValidationSchema } from 'validationSchema/event-planning-companies';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getEventPlanningCompanies();
    case 'POST':
      return createEventPlanningCompany();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEventPlanningCompanies() {
    const data = await prisma.event_planning_company
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'event_planning_company'));
    return res.status(200).json(data);
  }

  async function createEventPlanningCompany() {
    await eventPlanningCompanyValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.event?.length > 0) {
      const create_event = body.event;
      body.event = {
        create: create_event,
      };
    } else {
      delete body.event;
    }
    if (body?.team?.length > 0) {
      const create_team = body.team;
      body.team = {
        create: create_team,
      };
    } else {
      delete body.team;
    }
    if (body?.vendor?.length > 0) {
      const create_vendor = body.vendor;
      body.vendor = {
        create: create_vendor,
      };
    } else {
      delete body.vendor;
    }
    const data = await prisma.event_planning_company.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
