import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getEventById } from 'apiSdk/events';
import { Error } from 'components/error';
import { EventInterface } from 'interfaces/event';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteEventScheduleById } from 'apiSdk/event-schedules';
import { deleteEventTeamById } from 'apiSdk/event-teams';
import { deleteEventVendorById } from 'apiSdk/event-vendors';
import { deleteGuestById } from 'apiSdk/guests';

function EventViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<EventInterface>(
    () => (id ? `/events/${id}` : null),
    () =>
      getEventById(id, {
        relations: ['event_planning_company', 'event_schedule', 'event_team', 'event_vendor', 'guest'],
      }),
  );

  const event_scheduleHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteEventScheduleById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const event_teamHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteEventTeamById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const event_vendorHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteEventVendorById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const guestHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteGuestById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Event Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold" as="span">
              Name:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.name}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Start Date:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.start_date as unknown as string}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              End Date:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.end_date as unknown as string}
            </Text>
            <br />
            {hasAccess('event_planning_company', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Event Planning Company:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/event-planning-companies/view/${data?.event_planning_company?.id}`}>
                    {data?.event_planning_company?.name}
                  </Link>
                </Text>
              </>
            )}
            {hasAccess('event_schedule', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Event Schedules:
                </Text>
                <NextLink passHref href={`/event-schedules/create?event_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>start_time</Th>
                        <Th>end_time</Th>
                        <Th>description</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.event_schedule?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.start_time as unknown as string}</Td>
                          <Td>{record.end_time as unknown as string}</Td>
                          <Td>{record.description}</Td>
                          <Td>
                            <NextLink passHref href={`/event-schedules/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/event-schedules/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => event_scheduleHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('event_team', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Event Teams:
                </Text>
                <NextLink passHref href={`/event-teams/create?event_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.event_team?.map((record) => (
                        <Tr key={record.id}>
                          <Td>
                            <NextLink passHref href={`/event-teams/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/event-teams/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => event_teamHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('event_vendor', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Event Vendors:
                </Text>
                <NextLink passHref href={`/event-vendors/create?event_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.event_vendor?.map((record) => (
                        <Tr key={record.id}>
                          <Td>
                            <NextLink passHref href={`/event-vendors/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/event-vendors/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => event_vendorHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('guest', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Guests:
                </Text>
                <NextLink passHref href={`/guests/create?event_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>first_name</Th>
                        <Th>last_name</Th>
                        <Th>email</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.guest?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.first_name}</Td>
                          <Td>{record.last_name}</Td>
                          <Td>{record.email}</Td>
                          <Td>
                            <NextLink passHref href={`/guests/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/guests/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => guestHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'event',
  operation: AccessOperationEnum.READ,
})(EventViewPage);
