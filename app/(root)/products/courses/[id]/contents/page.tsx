'use client';

import React, { useState } from 'react';
import CourseProgressIndicator from '@/components/dashboard/course/CourseProgressIndicator';
import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';

type Lesson = {
  title: string;
  content: string;
  media?: File | null;
  mediaPreview?: string;
};

type Module = {
  title: string;
  lessons: Lesson[];
};

const CourseContent = () => {
  const [modules, setModules] = useState<Module[]>([
    { title: '', lessons: [{ title: '', content: '', media: null }] },
  ]);

  const addModule = () => {
    setModules([
      ...modules,
      { title: '', lessons: [{ title: '', content: '', media: null }] },
    ]);
  };

  const addLesson = (moduleIndex: number) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons.push({
      title: '',
      content: '',
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
    const updatedModules = [...modules] as any;
    updatedModules[moduleIndex].lessons[lessonIndex][field as keyof Lesson] =
      value;
    setModules(updatedModules);
  };

  const handleMediaChange = (
    moduleIndex: number,
    lessonIndex: number,
    file: File | null
  ) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons[lessonIndex].media = file;

    // Optional preview for images/videos
    if (file && file.type.startsWith('image')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatedModules[moduleIndex].lessons[lessonIndex].mediaPreview =
          reader.result as string;
        setModules(updatedModules);
      };
      reader.readAsDataURL(file);
    } else {
      updatedModules[moduleIndex].lessons[lessonIndex].mediaPreview = '';
      setModules(updatedModules);
    }
  };

  const handleSave = () => {
    console.log('Modules to Save:', modules);
    // You can replace this with an API call and handle file uploads using FormData.
  };

  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Add course contents'
          enableBreadCrumb={true}
          layer2='Products'
          layer3='Courses'
          layer4='Contents'
          enableBackButton={true}
          ctaButtons={
            <div className='flex gap-2 h-10'>
              <Button
                variant='outline'
                className='border border-primary-main hover:bg-primary-800 dark:border-gray-600 dark:hover:bg-white dark:text-white dark:hover:text-gray-900'
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                variant='primary'
                className='dark:text-white hover:bg-primary-800 hover:text-white'
              >
                Next
              </Button>
            </div>
          }
        />

        <section className='mt-4'>
          <CourseProgressIndicator step={2} />
        </section>

        <div className='mt-6 space-y-6'>
          {modules.map((module, mIndex) => (
            <div key={mIndex} className='border rounded-lg p-4 shadow-sm'>
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
                  key={lIndex}
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
                  <Textarea
                    placeholder='Lesson Content'
                    className='mb-2'
                    value={lesson.content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleLessonChange(
                        mIndex,
                        lIndex,
                        'content',
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
                    />
                    {lesson.mediaPreview && (
                      <div className='mt-2'>
                        <img
                          src={lesson.mediaPreview}
                          alt='Preview'
                          className='w-40 h-auto rounded-md border'
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <Button
                variant='ghost'
                className='text-primary-main mt-2'
                onClick={() => addLesson(mIndex)}
              >
                + Add Lesson
              </Button>
            </div>
          ))}

          <Button variant='secondary' onClick={addModule}>
            + Add Module
          </Button>
        </div>
      </div>
    </main>
  );
};

export default CourseContent;
