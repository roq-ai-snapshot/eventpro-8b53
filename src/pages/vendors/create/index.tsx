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
import { createVendor } from 'apiSdk/vendors';
import { Error } from 'components/error';
import { vendorValidationSchema } from 'validationSchema/vendors';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { EventPlanningCompanyInterface } from 'interfaces/event-planning-company';
import { getEvents } from 'apiSdk/events';
import { EventInterface } from 'interfaces/event';
import { getEventPlanningCompanies } from 'apiSdk/event-planning-companies';
import { VendorInterface } from 'interfaces/vendor';

function VendorCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: VendorInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createVendor(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<VendorInterface>({
    initialValues: {
      name: '',
      contact_email: '',
      company_id: (router.query.company_id as string) ?? null,
      event_vendor: [],
    },
    validationSchema: vendorValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Vendor
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="contact_email" mb="4" isInvalid={!!formik.errors?.contact_email}>
            <FormLabel>Contact Email</FormLabel>
            <Input
              type="text"
              name="contact_email"
              value={formik.values?.contact_email}
              onChange={formik.handleChange}
            />
            {formik.errors.contact_email && <FormErrorMessage>{formik.errors?.contact_email}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<EventPlanningCompanyInterface>
            formik={formik}
            name={'company_id'}
            label={'Select Event Planning Company'}
            placeholder={'Select Event Planning Company'}
            fetcher={getEventPlanningCompanies}
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
  entity: 'vendor',
  operation: AccessOperationEnum.CREATE,
})(VendorCreatePage);
