import { useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { Formik, Form } from 'formik';
import Input from '@/components/Input';
import ImageUpload from '@/components/ImageUpload';

const ListingSchema = Yup.object().shape({
  title: Yup.string().trim().required(),
  description: Yup.string().trim().required(),
  price: Yup.number().positive().integer().min(1).required(),
  guests: Yup.number().positive().integer().min(1).required(),
  beds: Yup.number().positive().integer().min(1).required(),
  baths: Yup.number().positive().integer().min(1).required(),
});

const ListingForm = ({
  initialValues = null,
  redirectPath = '',
  buttonText = 'Submit',
  onSubmit = () => null,
}) => {
  const router = useRouter();

  const [disabled, setDisabled] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialValues?.image ?? '');

  const upload = async image => {
    // TODO: Upload image to remote storage
  };

  const handleOnSubmit = async (values = null) => {
    let toastId;
    try {
      setDisabled(true);
      toastId = toast.loading('Submitting...');
      // Submit data
      if (typeof onSubmit === 'function') {
        await onSubmit({ ...values, image: imageUrl });
      }
      toast.success('Successfully submitted', { id: toastId });
      // Redirect user
      if (redirectPath) {
        router.push(redirectPath);
      }
    } catch (e) {
      toast.error('Unable to submit', { id: toastId });
      setDisabled(false);
    }
  };

  const { image, ...initialFormValues } = initialValues ?? {
    image: '',
    title: '',
    description: '',
    price: 0,
    guests: 1,
    beds: 1,
    baths: 1,
  };

  return (
    <div>
      <div className="mb-8 max-w-md">
        <ImageUpload
          initialImage={{ src: image, alt: initialFormValues.title }}
          onChangePicture={upload}
        />
      </div>

      <Formik
        initialValues={initialFormValues}
        validationSchema={ListingSchema}
        validateOnBlur={false}
        onSubmit={handleOnSubmit}
      >
        {({ isSubmitting, isValid }) => (
          <Form className="space-y-8">
            <div className="space-y-6">
              <Input
                name="title"
                type="text"
                label="Title"
                placeholder="Entire rental unit - Amsterdam"
                disabled={disabled}
              />

              <Input
                name="description"
                type="textarea"
                label="Description"
                placeholder="Very charming and modern apartment in Amsterdam..."
                disabled={disabled}
                rows={5}
              />

              <Input
                name="price"
                type="number"
                min="0"
                label="Price per night"
                placeholder="100"
                disabled={disabled}
              />

              <div className="flex space-x-4">
                <Input
                  name="guests"
                  type="number"
                  min="0"
                  label="Guests"
                  placeholder="2"
                  disabled={disabled}
                />
                <Input
                  name="beds"
                  type="number"
                  min="0"
                  label="Beds"
                  placeholder="1"
                  disabled={disabled}
                />
                <Input
                  name="baths"
                  type="number"
                  min="0"
                  label="Baths"
                  placeholder="1"
                  disabled={disabled}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={disabled || !isValid}
                className="bg-rose-600 text-white py-2 px-6 rounded-md focus:outline-none focus:ring-4 focus:ring-rose-600 focus:ring-opacity-50 hover:bg-rose-500 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-rose-600"
              >
                {isSubmitting ? 'Submitting...' : buttonText}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

ListingForm.propTypes = {
  initialValues: PropTypes.shape({
    image: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    guests: PropTypes.number,
    beds: PropTypes.number,
    baths: PropTypes.number,
  }),
  redirectPath: PropTypes.string,
  buttonText: PropTypes.string,
  onSubmit: PropTypes.func,
};

export default ListingForm;
