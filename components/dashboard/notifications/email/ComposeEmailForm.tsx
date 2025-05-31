'use client';

import ActionConfirmationModal from '@/components/ActionConfirmationModal';
import Input from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ActionKind,
  notificationTemplates,
  NotificationType,
} from '@/lib/utils';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import useOrg from '@/hooks/page/useOrg';
import { ComposeEmailSchema } from '@/lib/schema/notification.schema';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { composeEmail } from '@/redux/slices/notificationSlice';
import toast from 'react-hot-toast';
import { MultiSelect } from '@/components/ui/MultiSelect';
import Image from 'next/image';
import ActionConfirmation from '@/components/ActionConfirmation';
import { Loader2 } from 'lucide-react';

// Dynamically load the CKEditor component
const CkEditor = dynamic(() => import('@/components/CkEditor'), { ssr: false });

const ComposeEmailForm = () => {
  const [template, setTemplate] = useState('custom');
  const [openModal, setOpenModal] = useState(false);

  const handleComposeForm = (e: any) => {
    e.preventDefault();
    setOpenModal(true);
  };

  return (
    <>
      <Suspense fallback={<div>Loading form...</div>}>
        <ComposeEmailFormContent
          template={template}
          setTemplate={setTemplate}
          openModal={openModal}
          setOpenModal={setOpenModal}
          handleComposeForm={handleComposeForm}
        />
      </Suspense>
    </>
  );
};

const defaultValue: {
  title: string;
  message: string;
  type: NotificationType;
  is_scheduled: boolean;
  recipients: string[];
} = {
  title: '',
  message: '',
  type: NotificationType.EMAIL,
  is_scheduled: false,
  recipients: [],
};

const ComposeEmailFormContent = ({
  template,
  setTemplate,
  openModal,
  setOpenModal,
  handleComposeForm,
}: any) => {
  const searchParams = useSearchParams();

  const dispatch = useDispatch<AppDispatch>();

  const { org: organization, loading } = useSelector(
    (state: RootState) => state.org
  );

  const organizationOwners: any = [];
  const orgOwnersLoading: any = true;

  const [isLoading, setIsLoading] = useState(false);

  const [body, setBody] = useState(defaultValue);

  const [editorData, setEditorData] = useState('');

  const organizationList = searchParams.has('orgId')
    ? [
        {
          value: loading ? '' : organization?.user_id!,
          label: loading ? '' : `${organization?.business_name!}`,
        },
      ]
    : organizationOwners.map((orgOwner: any) => ({
        value: orgOwnersLoading ? '' : orgOwner?.id!,
        label: orgOwnersLoading
          ? ''
          : `${orgOwner?.name!} - (${orgOwner?.email})`,
      }));

  const [selectedOrgUser, setSelectedOrgUser] = useState<string[]>([]);

  const [allowAction, setAllowAction] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setBody({ ...body, message: editorData, recipients: selectedOrgUser });

    const { error, value } = ComposeEmailSchema.validate({
      ...body,
    });

    // Handle validation results
    if (error) {
      throw new Error(error.details[0].message);
    }

    setOpenModal(true);
  };

  const handleComposeEmail = async () => {
    try {
      setIsLoading(true);

      const response: any = await dispatch(composeEmail(body));

      if (response.requestStatus === 'rejected') {
        throw new Error(response.payload);
      }

      // Clear form
      setBody({
        ...body,
        title: '',
        message: '',
      });

      toast.success(response?.payload?.message);
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
      setAllowAction(false);
    }
  };

  useEffect(() => {
    if (allowAction) {
      handleComposeEmail();
    }
  }, [allowAction]);

  return (
    <>
      <div className='flex flex-col lg:flex-row gap-2'>
        <form className='flex-1' onSubmit={handleSubmit}>
          <div className='space-y-6 p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700'>
            <h1 className='text-xl font-bold text-gray-900 dark:text-white'>
              Compose email
            </h1>
            <div>
              <label
                htmlFor='subject'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              >
                Subject
              </label>
              <Input
                type='text'
                name='subject'
                required={true}
                onChange={(e: any) =>
                  setBody({ ...body, title: e.target.value })
                }
                value={body.title}
              />
            </div>
            {/* <div>
              <label
                htmlFor='preheader'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              >
                Preheader
              </label>
              <Input type='text' name='preheader' />
            </div> */}
            {searchParams.get('type') === 'scheduled' && (
              <div>
                <label
                  htmlFor='schedule'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Schedule
                </label>
                <Input type='datetime-local' name='schedule' />
              </div>
            )}
            <div>
              <label
                htmlFor='template'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              >
                Template
              </label>
              <Select
                name='template'
                value={template}
                onValueChange={(value) => setTemplate(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select template' />
                </SelectTrigger>
                <SelectContent>
                  {notificationTemplates.map((template) => (
                    <SelectItem key={template} value={template}>
                      {template}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {searchParams.has('orgId') ? (
              <div>
                <label
                  htmlFor='organization'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Organization
                </label>

                <MultiSelect
                  options={organizationList}
                  onValueChange={setSelectedOrgUser}
                  defaultValue={selectedOrgUser}
                  placeholder='Select organization'
                  variant='inverted'
                  animation={2}
                  maxCount={3}
                />
              </div>
            ) : (
              <div>
                <label
                  htmlFor='organization'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Organization
                </label>

                <MultiSelect
                  options={organizationList}
                  onValueChange={setSelectedOrgUser}
                  defaultValue={selectedOrgUser}
                  placeholder='Select organization'
                  variant='inverted'
                  animation={2}
                  maxCount={3}
                />
              </div>
            )}

            {template === 'custom' && (
              <div>
                <label
                  htmlFor='body'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Body
                </label>

                {/* Suspense with fallback for CKEditor */}
                <Suspense fallback={<div>Loading editor...</div>}>
                  <CkEditor
                    editorData={editorData}
                    setEditorData={setEditorData}
                  />
                </Suspense>
              </div>
            )}

            <button
              type='submit'
              className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex gap-2'
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className='animate-spin' /> &nbsp;
                  Loading...
                </>
              ) : (
                <>Send</>
              )}
            </button>
            <ActionConfirmationModal
              openModal={openModal}
              setOpenModal={setOpenModal}
              allowAction={allowAction}
              setAllowAction={setAllowAction}
              action={ActionKind.FAVORABLE}
            />
          </div>
        </form>
        <div className='flex-1 border border-dashed rounded-lg'>
          <div className='space-y-6 p-4 rounded-lg shadow sm:p-6 md:p-8 w-full'>
            <div className='flex flex-col items-center justify-center pt-8 mx-auto pt:mt-0 '>
              <a
                href='#'
                className='flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white'
              >
                <Image
                  src={'/logo.png'}
                  width={150}
                  height={150}
                  alt='Logo'
                  className='m-auto block dark:hidden'
                  priority
                />
                <Image
                  src={'/logo-white.png'}
                  width={150}
                  height={150}
                  alt='Logo'
                  className='m-auto hidden dark:block'
                  priority
                />
              </a>

              <div className='mt-3 overflow-hidden'>
                <div dangerouslySetInnerHTML={{ __html: editorData }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComposeEmailForm;
