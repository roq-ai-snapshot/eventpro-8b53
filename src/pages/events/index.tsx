import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button, Link } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getEvents, deleteEventById } from 'apiSdk/events';
import { EventInterface } from 'interfaces/event';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function EventListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<EventInterface[]>(
    () => '/events',
    () =>
      getEvents({
        relations: [
          'event_planning_company',
          'event_schedule.count',
          'event_team.count',
          'event_vendor.count',
          'guest.count',
        ],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteEventById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Event
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('event', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/events/create`}>
            <Button colorScheme="blue" mr="4">
              Create
            </Button>
          </Link>
        )}
        {error && <Error error={error} />}
        {deleteError && <Error error={deleteError} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>name</Th>
                  <Th>start_date</Th>
                  <Th>end_date</Th>
                  {hasAccess('event_planning_company', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>event_planning_company</Th>
                  )}
                  {hasAccess('event_schedule', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>event_schedule</Th>
                  )}
                  {hasAccess('event_team', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>event_team</Th>}
                  {hasAccess('event_vendor', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>event_vendor</Th>
                  )}
                  {hasAccess('guest', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>guest</Th>}
                  {hasAccess('event', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && <Th>Edit</Th>}
                  {hasAccess('event', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>View</Th>}
                  {hasAccess('event', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && <Th>Delete</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.name}</Td>
                    <Td>{record.start_date as unknown as string}</Td>
                    <Td>{record.end_date as unknown as string}</Td>
                    {hasAccess('event_planning_company', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link
                          as={NextLink}
                          href={`/event-planning-companies/view/${record.event_planning_company?.id}`}
                        >
                          {record.event_planning_company?.name}
                        </Link>
                      </Td>
                    )}
                    {hasAccess('event_schedule', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.event_schedule}</Td>
                    )}
                    {hasAccess('event_team', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.event_team}</Td>
                    )}
                    {hasAccess('event_vendor', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.event_vendor}</Td>
                    )}
                    {hasAccess('guest', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.guest}</Td>
                    )}
                    {hasAccess('event', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/events/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('event', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/events/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('event', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Button onClick={() => handleDelete(record.id)}>Delete</Button>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'event',
  operation: AccessOperationEnum.READ,
})(EventListPage);
