import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getEventVendorById, updateEventVendorById } from 'apiSdk/event-vendors';
import { Error } from 'components/error';
import { eventVendorValidationSchema } from 'validationSchema/event-vendors';
import { EventVendorInterface } from 'interfaces/event-vendor';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { EventInterface } from 'interfaces/event';
import { VendorInterface } from 'interfaces/vendor';
import { getEvents } from 'apiSdk/events';
import { getVendors } from 'apiSdk/vendors';

function EventVendorEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<EventVendorInterface>(
    () => (id ? `/event-vendors/${id}` : null),
    () => getEventVendorById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: EventVendorInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateEventVendorById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<EventVendorInterface>({
    initialValues: data,
    validationSchema: eventVendorValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Event Vendor
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <AsyncSelect<EventInterface>
              formik={formik}
              name={'event_id'}
              label={'Select Event'}
              placeholder={'Select Event'}
              fetcher={getEvents}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <AsyncSelect<VendorInterface>
              formik={formik}
              name={'vendor_id'}
              label={'Select Vendor'}
              placeholder={'Select Vendor'}
              fetcher={getVendors}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'event_vendor',
  operation: AccessOperationEnum.UPDATE,
})(EventVendorEditPage);
