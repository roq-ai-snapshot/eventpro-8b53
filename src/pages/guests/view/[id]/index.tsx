import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getGuestById } from 'apiSdk/guests';
import { Error } from 'components/error';
import { GuestInterface } from 'interfaces/guest';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function GuestViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<GuestInterface>(
    () => (id ? `/guests/${id}` : null),
    () =>
      getGuestById(id, {
        relations: ['event'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Guest Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold" as="span">
              First Name:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.first_name}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Last Name:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.last_name}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Email:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.email}
            </Text>
            <br />
            {hasAccess('event', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Event:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/events/view/${data?.event?.id}`}>
                    {data?.event?.name}
                  </Link>
                </Text>
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
  entity: 'guest',
  operation: AccessOperationEnum.READ,
})(GuestViewPage);
