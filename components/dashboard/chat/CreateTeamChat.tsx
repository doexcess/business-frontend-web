import React, { useEffect, useState } from 'react';
import Input from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/textarea';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContacts } from '@/redux/slices/chatSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/ImageUploader';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { socketService } from '@/lib/services/socketService';

interface CreateTeamChatProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    token: string | null;
}

const CreateTeamChat: React.FC<CreateTeamChatProps> = ({ open, setOpen, token }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { org } = useSelector((state: RootState) => state.org);
    const { contacts, contactsLoading } = useSelector((state: RootState) => state.chat);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    const membersList = contacts.map((member) => ({
        value: member.id,
        label: `${member.name} (${member.email})`,
    }));

    const [body, setBody] = useState({
        name: '',
        description: '',
        multimedia_id: '',
        members: [] as { member_id: string }[],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBody((prev) => ({ ...prev, [name]: value }));
    };

    const handleMembersChange = (values: string[]) => {
        setSelectedMembers(values);
        setBody((prev) => ({
            ...prev,
            members: values.map((id) => ({ member_id: id })),
        }));
    };

    const handleSubmit = async () => {

        if (!body.name || !body.multimedia_id || body.members.length === 0) {
            return toast.error('Please fill in all required fields');
        }

        try {
            const res = await socketService.createGroupChat({
                token: token!,
                name: body.name,
                description: body.description,
                multimedia_id: body.multimedia_id,
                members: body.members,
            });
            
            console.log(res)

            toast.success('Group chat created successfully');
            setOpen(false);
        } catch (err: any) {
            toast.error(err || 'Failed to create group chat');
        }
    };


    useEffect(() => {
        if (org?.id) {
            dispatch(fetchContacts(org.id));
        }
    }, [org?.id, dispatch]);

    return (
        <Modal
            isOpen={open}
            onClose={() => setOpen(false)}
            title="Create Teams Chat"
            className="max-w-2xl text-gray-800 dark:text-gray-200"
        >
            <div className="space-y-4">
                {/* Team Name */}
                <div>
                    <label className="text-sm font-medium mb-1 block">
                        Team Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="text"
                        name="name"
                        className="w-full rounded-md py-3"
                        value={body.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Upload Image */}
                <div>
                    <label className="text-sm font-medium mb-1 block">
                        Upload Image <span className="text-red-500">*</span>
                    </label>
                    <ImageUploader
                        businessId={org?.id}
                        onUploaded={(result) => {
                            setBody((prev) => ({
                                ...prev,
                                multimedia_id: result.multimedia.id,
                            }));
                        }}
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <Textarea
                        rows={3}
                        name="description"
                        placeholder="Enter description"
                        className="w-full rounded-md px-4 py-3"
                        value={body.description}
                        onChange={handleChange}
                    />
                </div>

                {/* Select Members */}
                <div>
                    <label className="text-sm font-medium mb-1 block">
                        Select Members <span className="text-red-500">*</span>
                    </label>

                    <MultiSelect
                        options={membersList}
                        onValueChange={handleMembersChange}
                        defaultValue={selectedMembers}
                        placeholder="Select members"
                        variant="inverted"
                    />

                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-primary-main text-white rounded-md">
                        Create
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CreateTeamChat;
