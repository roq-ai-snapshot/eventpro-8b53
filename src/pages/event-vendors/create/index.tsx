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
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createEventVendor } from 'apiSdk/event-vendors';
import { Error } from 'components/error';
import { eventVendorValidationSchema } from 'validationSchema/event-vendors';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { EventInterface } from 'interfaces/event';
import { VendorInterface } from 'interfaces/vendor';
import { getEvents } from 'apiSdk/events';
import { getVendors } from 'apiSdk/vendors';
import { EventVendorInterface } from 'interfaces/event-vendor';

function EventVendorCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: EventVendorInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createEventVendor(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<EventVendorInterface>({
    initialValues: {
      event_id: (router.query.event_id as string) ?? null,
      vendor_id: (router.query.vendor_id as string) ?? null,
    },
    validationSchema: eventVendorValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Event Vendor
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'event_vendor',
  operation: AccessOperationEnum.CREATE,
})(EventVendorCreatePage);
