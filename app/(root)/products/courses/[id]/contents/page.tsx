'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CourseProgressIndicator from '@/components/dashboard/product/course/CourseProgressIndicator';
import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ThemeDivBorder from '@/components/ui/ThemeDivBorder';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchModules,
  createBulkModule,
  updateBulkModule,
} from '@/redux/slices/courseSlice';
import {
  uploadImage,
  uploadDocument,
  uploadVideo,
} from '@/redux/slices/multimediaSlice';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Module as ApiModule } from '@/types/product';
import {
  CreateModulesProps,
  UpdateModulesProps,
} from '@/lib/schema/product.schema';
import { MultimediaType } from '@/lib/utils';

type Lesson = {
  id?: string;
  title: string;
  media?: File | null;
  mediaPreview?: string;
  mediaType?: MultimediaType;
  multimedia_id?: string;
  position?: number;
  isUploading?: boolean;
};

type Module = {
  id?: string;
  title: string;
  position?: number;
  lessons: Lesson[];
};

const CourseContent = () => {
  const { id: courseId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { org } = useSelector((state: RootState) => state.org);
  const { modules: existingModules, modulesLoading: loading } = useSelector(
    (state: RootState) => state.course
  );

  const [modules, setModules] = useState<Module[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const formatModules = (apiModules: ApiModule[]): Module[] => {
    return apiModules.map((module) => ({
      id: module.id,
      title: module.title,
      position: module.position,
      lessons: module.contents.map((content) => ({
        id: content.id,
        title: content.title,
        multimedia_id: content.multimedia_id,
        mediaPreview: content.multimedia?.url,
        mediaType: content.multimedia?.type,
        position: content.position,
      })),
    }));
  };

  useEffect(() => {
    if (courseId && org?.id) {
      dispatch(
        fetchModules({ business_id: org.id, course_id: courseId as string })
      );
    }
  }, [courseId, dispatch, org?.id]);

  useEffect(() => {
    if (existingModules.length > 0) {
      setModules(formatModules(existingModules));
      setIsEditing(true);
    } else {
      setModules([{ title: '', lessons: [{ title: '', media: null }] }]);
    }
  }, [existingModules]);

  const addModule = () => {
    setModules([
      ...modules,
      { title: '', lessons: [{ title: '', media: null }] },
    ]);
  };

  const addLesson = (moduleIndex: number) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons.push({
      title: '',
      media: null,
    });
    setModules(updatedModules);
  };

  const handleModuleChange = (index: number, field: string, value: string) => {
    const updatedModules = [...modules];
    updatedModules[index] = { ...updatedModules[index], [field]: value };
    setModules(updatedModules);
  };

  const handleLessonChange = (
    moduleIndex: number,
    lessonIndex: number,
    field: string,
    value: string
  ) => {
    const updatedModules = [...modules];
    const updatedLessons = [...updatedModules[moduleIndex].lessons];
    updatedLessons[lessonIndex] = {
      ...updatedLessons[lessonIndex],
      [field]: value,
    };
    updatedModules[moduleIndex].lessons = updatedLessons;
    setModules(updatedModules);
  };

  const handleMediaChange = async (
    moduleIndex: number,
    lessonIndex: number,
    file: File | null
  ) => {
    if (!file || !org?.id) return;

    setIsUploading(true);

    const updatedModules = [...modules];
    const updatedLessons = [...updatedModules[moduleIndex].lessons];

    let mediaType: MultimediaType = MultimediaType.DOCUMENT;
    if (file.type.startsWith('image')) {
      mediaType = MultimediaType.IMAGE;
    } else if (file.type.startsWith('video')) {
      mediaType = MultimediaType.VIDEO;
    }

    updatedLessons[lessonIndex] = {
      ...updatedLessons[lessonIndex],
      media: file,
      mediaType,
      mediaPreview: URL.createObjectURL(file),
      isUploading: true,
    };

    updatedModules[moduleIndex].lessons = updatedLessons;
    setModules(updatedModules);

    try {
      const formData = new FormData();
      formData.append(mediaType.toLowerCase(), file);

      let response: any;
      if (mediaType === MultimediaType.IMAGE) {
        response = await dispatch(
          uploadImage({ form_data: formData, business_id: org.id })
        );
      } else if (mediaType === MultimediaType.VIDEO) {
        response = await dispatch(
          uploadVideo({ form_data: formData, business_id: org.id })
        );
      } else {
        response = await dispatch(
          uploadDocument({ form_data: formData, business_id: org.id })
        );
      }

      if (response.type.endsWith('/rejected')) {
        throw new Error(response.payload?.message || 'Upload failed');
      }

      if (response.payload?.multimedia?.id) {
        setModules((prevModules) => {
          const newModules = [...prevModules];
          newModules[moduleIndex].lessons[lessonIndex] = {
            ...newModules[moduleIndex].lessons[lessonIndex],
            multimedia_id: response.payload.multimedia.id,
            isUploading: false,
          };
          return newModules;
        });
      }
    } catch (error) {
      toast.error('Failed to upload media');
      console.error('Media upload error:', error);
      setModules((prevModules) => {
        const newModules = [...prevModules];
        newModules[moduleIndex].lessons[lessonIndex].isUploading = false;
        return newModules;
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeModule = (index: number) => {
    if (modules.length <= 1) {
      toast.error('You must have at least one module');
      return;
    }
    const updatedModules = [...modules];
    updatedModules.splice(index, 1);
    setModules(updatedModules);
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    if (modules[moduleIndex].lessons.length <= 1) {
      toast.error('You must have at least one lesson per module');
      return;
    }
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons.splice(lessonIndex, 1);
    setModules(updatedModules);
  };

  const handleSave = async () => {
    if (!courseId || !org?.id) return;

    setIsSubmitting(true);
    try {
      const payload = {
        modules: modules.map((module, mIndex) => ({
          course_id: courseId,
          ...(module.id && { id: module.id }),
          title: module.title,
          position: mIndex + 1,
          contents: module.lessons.map((lesson, lIndex) => ({
            ...(lesson.id && { id: lesson.id }),
            title: lesson.title,
            multimedia_id: lesson.multimedia_id,
            position: lIndex + 1,
          })),
        })),
      };

      const action = isEditing
        ? updateBulkModule({
            credentials: payload as UpdateModulesProps,
            business_id: org.id,
          })
        : createBulkModule({
            credentials: payload as CreateModulesProps,
            business_id: org.id,
          });

      const response = await dispatch(action).unwrap();

      toast.success(response.message || 'Modules saved successfully');
      dispatch(
        fetchModules({ business_id: org.id, course_id: courseId as string })
      );
      router.push(`/products/courses/${courseId}/preview`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save modules');
      console.error('Save error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMediaPreview = (lesson: Lesson) => {
    if (lesson.isUploading) {
      return (
        <div className='mt-2 text-sm text-gray-500'>Uploading file...</div>
      );
    }

    if (!lesson.mediaPreview) return null;

    if (lesson.mediaType === MultimediaType.IMAGE) {
      return (
        <div className='mt-2'>
          <img
            src={lesson.mediaPreview}
            alt='Preview'
            className='w-40 h-auto rounded-md border'
          />
        </div>
      );
    } else if (lesson.mediaType === MultimediaType.VIDEO) {
      return (
        <div className='mt-2'>
          <video
            controls
            className='w-40 h-auto rounded-md border'
            src={lesson.mediaPreview}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Add course contents'
          enableBreadCrumb={true}
          layer2='Products'
          layer2Link='/products'
          layer3='Courses'
          layer3Link='/products/courses'
          layer4='Contents'
          enableBackButton={true}
          ctaButtons={
            <div className='flex gap-2 h-10'>
              <Button
                variant='primary'
                className='dark:text-white hover:bg-primary-800 hover:text-white'
                disabled={isSubmitting || loading || isUploading}
              >
                Next
              </Button>
            </div>
          }
        />

        <section className='mt-4'>
          <CourseProgressIndicator step={2} />
        </section>

        {loading ? (
          <div className='mt-6 text-center'>Loading modules...</div>
        ) : (
          <div className='mt-6 space-y-6'>
            {modules.map((module, mIndex) => (
              <ThemeDivBorder
                key={module.id || `new-module-${mIndex}`}
                className='border rounded-lg p-4 shadow-sm'
              >
                <h3 className='text-lg font-semibold mb-2'>
                  Module {mIndex + 1}
                </h3>
                <Input
                  placeholder='Module Title'
                  className='mb-4'
                  value={module.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleModuleChange(mIndex, 'title', e.target.value)
                  }
                />

                {module.lessons.map((lesson, lIndex) => (
                  <div
                    key={lesson.id || `new-lesson-${lIndex}`}
                    className='mb-6 pl-4 border-l-4 border-primary-main'
                  >
                    <h4 className='text-md font-medium mb-1'>
                      Lesson {lIndex + 1}
                    </h4>
                    <Input
                      placeholder='Lesson Title'
                      className='mb-2'
                      value={lesson.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleLessonChange(
                          mIndex,
                          lIndex,
                          'title',
                          e.target.value
                        )
                      }
                    />

                    <div className='mb-2'>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Upload Media (Video, Image, PDF)
                      </label>
                      <Input
                        type='file'
                        accept='video/*,image/*,application/pdf'
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleMediaChange(
                            mIndex,
                            lIndex,
                            e.target.files?.[0] || null
                          )
                        }
                        disabled={lesson.isUploading}
                      />
                      {renderMediaPreview(lesson)}
                      {module.lessons.length > 1 && (
                        <Button
                          variant='ghost'
                          className='text-red-500 dark:text-red-600 text-sm'
                          onClick={() => removeLesson(mIndex, lIndex)}
                          disabled={lesson.isUploading}
                        >
                          Remove Lesson
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <Button
                  variant='ghost'
                  className='text-primary-main dark:text-primary-faded mt-2'
                  onClick={() => addLesson(mIndex)}
                >
                  + Add Lesson
                </Button>
                {modules.length > 1 && (
                  <Button
                    variant='ghost'
                    className='text-red-600 dark:text-red-600 mt-2'
                    onClick={() => removeModule(mIndex)}
                  >
                    Remove Module
                  </Button>
                )}
              </ThemeDivBorder>
            ))}

            <div className='flex justify-between'>
              <Button
                variant='primary'
                onClick={addModule}
                disabled={isSubmitting || loading || isUploading}
              >
                + Add Module
              </Button>
              <Button
                variant='outline'
                className='border border-primary-main hover:bg-primary-800 hover:text-white dark:border-gray-600 dark:hover:bg-white dark:text-white dark:hover:text-gray-900'
                onClick={handleSave}
                disabled={isSubmitting || loading || isUploading}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default CourseContent;
