'use client';

import React, { useState, useEffect } from 'react';
import PageHeading from '@/components/PageHeading';

import { IoMdTrash } from 'react-icons/io';
import { Button } from '@/components/ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { deleteTicket } from '@/redux/slices/ticketSlice';
import toast from 'react-hot-toast';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import EditTicketForm from '@/components/dashboard/product/ticket/EditTicketForm';
import useTicket from '@/hooks/page/useTicket';
import ActionConfirmationModal from '@/components/ActionConfirmationModal';

const EditTicket = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { ticket } = useTicket();

  const { org } = useSelector((state: RootState) => state.org);

  const [deleteTicketOpenModal, setDeleteTicketOpenModal] = useState(false);
  const [allowAction, setAllowAction] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteTicketNavigation = async () => {
    try {
      setIsSubmitting(true);

      // Submit logic here
      const response: any = await dispatch(
        deleteTicket({
          id: ticket?.id!,
          business_id: org?.id!,
        })
      );

      if (response.type === 'product-ticket-crud/:id/delete/rejected') {
        throw new Error(response.payload.message);
      }

      toast.success('Ticket deleted successfully!');
      router.push(`/products/tickets`);
    } catch (error: any) {
      console.error('Submission failed:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (allowAction) {
      handleDeleteTicketNavigation();
      setAllowAction(false);
    }
  }, [allowAction]);

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Edit Ticket'
          enableBreadCrumb={true}
          layer2='Products'
          layer3='Tickets'
          layer4='Edit Ticket'
          layer3Link='/products/tickets'
          enableBackButton={true}
          ctaButtons={
            ticket?.ticket.purchased_tickets!?.length === 0 ? (
              <div className='flex-shrink-0 self-start mb-2'>
                <Button
                  variant='red'
                  className='flex gap-1'
                  onClick={() => setDeleteTicketOpenModal(true)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className='flex items-center justify-center'>
                      <LoadingIcon />
                      Processing...
                    </span>
                  ) : (
                    <>
                      <IoMdTrash />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <></>
            )
          }
        />

        <EditTicketForm />

        <ActionConfirmationModal
          body={`Are you sure you want to delete your ticket - ${ticket?.title}`}
          openModal={deleteTicketOpenModal}
          setOpenModal={setDeleteTicketOpenModal}
          allowAction={allowAction}
          setAllowAction={setAllowAction}
        />
      </div>
    </main>
  );
};

export default EditTicket;
