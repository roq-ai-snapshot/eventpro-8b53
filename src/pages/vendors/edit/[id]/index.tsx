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
import { getVendorById, updateVendorById } from 'apiSdk/vendors';
import { Error } from 'components/error';
import { vendorValidationSchema } from 'validationSchema/vendors';
import { VendorInterface } from 'interfaces/vendor';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { EventPlanningCompanyInterface } from 'interfaces/event-planning-company';
import { getEventPlanningCompanies } from 'apiSdk/event-planning-companies';
import { eventVendorValidationSchema } from 'validationSchema/event-vendors';

function VendorEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<VendorInterface>(
    () => (id ? `/vendors/${id}` : null),
    () => getVendorById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: VendorInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateVendorById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<VendorInterface>({
    initialValues: data,
    validationSchema: vendorValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Vendor
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'vendor',
  operation: AccessOperationEnum.UPDATE,
})(VendorEditPage);
