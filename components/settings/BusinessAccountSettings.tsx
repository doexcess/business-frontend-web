import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { BusinessProfile } from '@/types/org';
import { FiPlus, FiEdit2, FiTrash2, FiBriefcase } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Input from '../ui/Input';
import Select from '../Select';
import { BUSINESS_INDUSTRIES, cn, getAvatar } from '@/lib/utils';
import Joi from 'joi';
import { toast } from 'react-hot-toast';
import {
  saveOrgInfo,
  setOnboardingStep,
  switchToOrg,
  fetchOrgs,
} from '@/redux/slices/orgSlice';
import { uploadImage } from '@/redux/slices/multimediaSlice';
import LoadingIcon from '../ui/icons/LoadingIcon';
import Avatar from '../ui/Avatar';
import Link from 'next/link';
import OnboardingAlert from '../OnboardingAlert';

const BUSINESS_SIZES = ['Small', 'Medium', 'Large'];

const businessSchema = Joi.object({
  business_name: Joi.string().required().min(2).max(100),
  industry: Joi.string()
    .required()
    .valid(...BUSINESS_INDUSTRIES),
  business_size: Joi.string()
    .required()
    .valid(...BUSINESS_SIZES.map((size) => size.toLowerCase())),
  location: Joi.string().required().min(2).max(100),
  state: Joi.string().required().min(2).max(50),
  country: Joi.string().required().min(2).max(50),
  logo_url: Joi.string().uri(),
});

const BusinessAccountSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orgs, org } = useSelector((state: RootState) => state.org);
  const [showAddModal, setShowAddModal] = useState(
    Boolean(orgs.length) ? false : true
  );
  const [selectedOrg, setSelectedOrg] = useState<BusinessProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    industry: '',
    business_size: '',
    location: '',
    state: '',
    country: '',
    logo_url: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Check if all required fields are filled
  const isFormValid = () => {
    return (
      formData.business_name.trim() !== '' &&
      formData.industry.trim() !== '' &&
      formData.business_size.trim() !== '' &&
      formData.location.trim() !== '' &&
      formData.state.trim() !== '' &&
      formData.country.trim() !== ''
      // &&
      // formData.logo_url !== ''
    );
  };

  // Update form data when selectedOrg changes
  useEffect(() => {
    if (selectedOrg) {
      setFormData({
        business_name: selectedOrg.business_name || '',
        industry: selectedOrg.industry || '',
        business_size: selectedOrg.business_size || '',
        location: selectedOrg.location || '',
        state: selectedOrg.state || '',
        country: selectedOrg.country || '',
        logo_url: selectedOrg.logo_url || '',
      });
      setLogoPreview(selectedOrg.logo_url || null);
    } else {
      setFormData({
        business_name: '',
        industry: BUSINESS_INDUSTRIES[0],
        business_size: BUSINESS_SIZES[0].toLowerCase(),
        location: '',
        state: '',
        country: '',
        logo_url: '',
      });
      setLogoPreview(null);
    }
  }, [selectedOrg]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  // Cleanup preview URL when component unmounts or modal closes
  const cleanupPreview = () => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
      setLogoPreview(null);
    }
  };

  const handleCloseModal = () => {
    cleanupPreview();
    setShowAddModal(false);
    setSelectedOrg(null);
    setLogoFile(null);
  };

  const handleEditOrg = (org: BusinessProfile) => {
    setSelectedOrg(org);
    setShowAddModal(true);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      let logoUrl = formData.logo_url;

      // Upload logo if a new file is selected
      if (logoFile) {
        const formData = new FormData();
        formData.append('image', logoFile);
        const response = await dispatch(
          uploadImage({ form_data: formData })
        ).unwrap();
        logoUrl = response.multimedia.url;
      }

      // Prepare data for API
      const businessData = {
        ...formData,
        logo_url: logoUrl,
        business_size: formData.business_size.toLowerCase(),
        industry: formData.industry,
      };

      console.log(businessData);

      // Validate form data
      const { error } = businessSchema.validate(businessData);
      if (error) {
        toast.error(error.details[0].message);
        return;
      }

      // Save business info
      await dispatch(saveOrgInfo(businessData)).unwrap();

      if (!selectedOrg && org?.onboarding_status?.current_step! < 1) {
        // Update the onboarding current step only for new businesses
        dispatch(setOnboardingStep(1));
      }

      // Fetch updated organizations
      await dispatch(fetchOrgs({}));

      // If editing, switch to the edited org, otherwise select the first org
      if (selectedOrg) {
        // For editing, we need to find the updated org in the list
        const updatedOrgs = await dispatch(fetchOrgs({})).unwrap();
        const updatedOrg = updatedOrgs.organizations.find(
          (o) => o.business_name === businessData.business_name
        );
        if (updatedOrg) {
          dispatch(switchToOrg(updatedOrg.id));
        }
        toast.success('Business account updated successfully');
      } else {
        // For new business, select the first org
        const orgs = await dispatch(fetchOrgs({})).unwrap();
        dispatch(switchToOrg(orgs.organizations[0].id));
        toast.success('Business account created successfully');
      }

      setShowAddModal(false);
      setSelectedOrg(null);
      setFormData({
        business_name: '',
        industry: '',
        business_size: '',
        location: '',
        state: '',
        country: '',
        logo_url: '',
      });
      setLogoFile(null);
    } catch (error) {
      toast.error(
        selectedOrg
          ? 'Failed to update business account'
          : 'Failed to create business account'
      );
      console.error('Error saving business account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='dark:border-gray-600 text-black-1 dark:text-white'>
      <CardHeader>
        <div className='flex flex-col md:flex-row gap-2 md:justify-between items-start md:items-center'>
          <CardTitle>Business Accounts</CardTitle>
          {orgs.length > 0 && (
            <Button
              variant='primary'
              onClick={() => setShowAddModal(true)}
              className='flex items-center gap-2'
            >
              <FiPlus className='w-4 h-4' />
              Add Business Account
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {orgs.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <div className='w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4'>
              <FiBriefcase className='w-8 h-8 text-gray-400' />
            </div>
            <h3 className='text-lg font-medium mb-2'>No Business Accounts</h3>
            <p className='text-gray-500 dark:text-gray-400 mb-6 max-w-sm'>
              Get started by creating your first business account. This will
              help you manage your business operations.
            </p>
            <Button
              variant='primary'
              onClick={() => setShowAddModal(true)}
              className='flex items-center gap-2'
            >
              <FiPlus className='w-4 h-4' />
              Create Business Account
            </Button>
          </div>
        ) : (
          <>
            {/* Business Accounts List */}
            <div className='grid gap-4'>
              {orgs.map((orgItem) => (
                <div
                  key={orgItem.id}
                  className={`p-4 rounded-lg border ${
                    orgItem.id === org?.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4'>
                    <div className='flex items-start gap-4'>
                      {orgItem.logo_url ? (
                        <Avatar
                          src={orgItem.logo_url}
                          alt={orgItem.business_name}
                          size='xl'
                        />
                      ) : (
                        <Avatar
                          src={getAvatar(
                            orgItem.logo_url,
                            orgItem.business_name
                          )}
                          alt={orgItem?.business_name}
                          size='xl'
                        />
                      )}
                      <div>
                        <div className='flex items-center gap-2'>
                          <h3 className='font-medium text-lg'>
                            {orgItem.business_name}
                          </h3>
                          {orgItem.id === org?.id && (
                            <span className='px-2 py-1 text-xs rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 font-medium'>
                              Current
                            </span>
                          )}
                        </div>
                        <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                          {orgItem.industry}
                        </p>
                        <div className='mt-2 flex flex-wrap gap-2'>
                          <span className='px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'>
                            {orgItem.business_size}
                          </span>
                          <span className='px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'>
                            {orgItem.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='flex gap-2 sm:flex-shrink-0'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleEditOrg(orgItem)}
                        className='flex items-center gap-1'
                      >
                        <FiEdit2 className='w-4 h-4' />
                        <span className='hidden sm:inline'>Edit</span>
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className='flex items-center gap-1 text-red-600 hover:text-red-700'
                      >
                        <FiTrash2 className='w-4 h-4' />
                        <span className='hidden sm:inline'>Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={showAddModal || !!selectedOrg}
          onClose={handleCloseModal}
          title={selectedOrg ? 'Edit Business Account' : 'Add Business Account'}
          className='m-2'
        >
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>
                Business Name
              </label>
              <Input
                type='text'
                name='business_name'
                placeholder='Enter business name'
                value={formData.business_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Industry</label>
              <Select
                name='industry'
                className='w-full'
                data={BUSINESS_INDUSTRIES}
                value={formData.industry || BUSINESS_INDUSTRIES[0]}
                onChange={(e: any) =>
                  setFormData({
                    ...formData,
                    industry: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>
                Business Size
              </label>
              <Select
                name='business_size'
                className='w-full'
                data={BUSINESS_SIZES}
                value={formData.business_size || BUSINESS_SIZES[0]}
                onChange={(e: any) =>
                  setFormData({
                    ...formData,
                    business_size: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Location</label>
              <Input
                type='text'
                name='location'
                placeholder='Enter business location'
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>
                State/Province
              </label>
              <Input
                type='text'
                name='state'
                placeholder='Enter state/province'
                value={formData.state}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Country</label>
              <Input
                type='text'
                name='country'
                placeholder='Enter country'
                value={formData.country}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Logo</label>
              <div className='space-y-2'>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleLogoChange}
                  className='block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-primary-main file:text-white
                    hover:file:bg-primary-main/90
                    dark:file:bg-primary-main dark:file:text-white'
                  required
                />
                {(logoPreview || selectedOrg?.logo_url) && (
                  <div className='mt-2'>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mb-2'>
                      Preview:
                    </p>
                    <div className='relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700'>
                      <img
                        src={logoPreview || selectedOrg?.logo_url}
                        alt='Logo preview'
                        className='w-full h-full object-cover'
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='flex justify-end mt-6 gap-3'>
            <Button
              variant='outline'
              onClick={handleCloseModal}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <div className='flex gap-3'>
              {selectedOrg && org?.id !== selectedOrg?.id && (
                <Button
                  variant='primary'
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className='flex items-center gap-2'>
                      <LoadingIcon />
                      Processing...
                    </div>
                  ) : (
                    'Select'
                  )}
                </Button>
              )}
              <Button
                variant={selectedOrg ? 'green' : 'primary'}
                onClick={handleSubmit}
                disabled={isLoading || !isFormValid()}
              >
                {isLoading ? (
                  <div className='flex items-center gap-2'>
                    <LoadingIcon />
                    Processing...
                  </div>
                ) : selectedOrg ? (
                  'Save'
                ) : (
                  'Add Business'
                )}
              </Button>
            </div>
          </div>
        </Modal>
      </CardContent>
    </Card>
  );
};

export default BusinessAccountSettings;
