'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import CourseProgressIndicator from '@/components/dashboard/course/CourseProgressIndicator';
import VideoPlayer from '@/components/VideoPlayer';
import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import ThemeDivBorder from '@/components/ui/ThemeDivBorder';
import { useConfettiStore } from '@/hooks/use-confetti-store'; // adjust path as needed

type Lesson = {
  title: string;
  content: string;
  mediaPreview?: string;
};

type Module = {
  title: string;
  lessons: Lesson[];
};

const sampleModules: Module[] = [
  {
    title: 'Getting Started',
    lessons: [
      {
        title: 'Welcome to the course',
        content:
          'This is an introduction to what you will learn in this course.',
        mediaPreview: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      },
      {
        title: 'Installation Setup',
        content: 'Let’s get your environment ready for development.',
        mediaPreview:
          'https://via.placeholder.com/600x400.png?text=Installation+Screenshot',
      },
    ],
  },
  {
    title: 'Core Concepts',
    lessons: [
      {
        title: 'Understanding Props and State',
        content: 'We explain React props vs state and how to use them.',
        mediaPreview:
          'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
    ],
  },
];

const CoursePreview = () => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(
    sampleModules[0].lessons[0]
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const confetti = useConfettiStore();

  const handlePublish = () => {
    confetti.onOpen();
  };

  const getMediaType = (url?: string) => {
    if (!url) return 'none';
    if (url.endsWith('.pdf')) return 'pdf';
    if (url.match(/\.(jpeg|jpg|png|gif|webp)$/i)) return 'image';
    if (url.endsWith('.mp4') || url.endsWith('.m3u8')) return 'video';
    return 'none';
  };

  const mediaType = getMediaType(selectedLesson?.mediaPreview);

  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Preview your course'
          enableBreadCrumb={true}
          layer2='Products'
          layer3='Courses'
          layer4='Preview'
          enableBackButton={true}
          ctaButtons={
            <div className='flex gap-2 h-10'>
              <Button
                variant='outline'
                className='border border-primary-main hover:bg-primary-800 hover:text-white dark:border-gray-600 dark:hover:bg-white dark:text-white dark:hover:text-gray-900'
              >
                Save
              </Button>
              <Button
                variant='primary'
                className='dark:text-white hover:bg-primary-800 hover:text-white'
                onClick={handlePublish}
              >
                Publish
              </Button>
            </div>
          }
        />

        <section className='mt-4 mb-6'>
          <CourseProgressIndicator step={3} />
        </section>

        {/* Mobile Toggle Button */}
        <div className='md:hidden flex justify-between items-center mb-4 dark:text-white'>
          <Button
            variant='outline'
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className='flex items-center gap-2'
          >
            <Menu className='w-5 h-5' />
            <span>{isSidebarOpen ? 'Hide Lessons' : 'Show Lessons'}</span>
          </Button>
        </div>

        <div className='flex flex-col md:grid md:grid-cols-4 gap-6'>
          {/* Sidebar */}
          <aside
            className={`
    md:col-span-1 bg-white dark:bg-gray-900 border dark:border-gray-600 rounded-md p-4 max-h-[80vh] overflow-y-auto
    ${isSidebarOpen ? 'block' : 'hidden'} md:block
  `}
          >
            {sampleModules.map((module, mIdx) => (
              <div key={mIdx} className='mb-4'>
                <h3 className='font-bold mb-2 text-primary-main text-lg'>
                  Module {mIdx + 1}: {module.title}
                </h3>
                <ul className='space-y-1'>
                  {module.lessons.map((lesson, lIdx) => (
                    <li
                      key={lIdx}
                      onClick={() => {
                        setSelectedLesson(lesson);
                        setIsSidebarOpen(false); // Close on mobile
                      }}
                      className={`cursor-pointer px-3 py-2 rounded hover:bg-primary-50 dark:hover:bg-gray-800 transition dark:text-white ${
                        selectedLesson?.title === lesson.title
                          ? 'bg-primary-100 dark:bg-primary-800'
                          : ''
                      }`}
                    >
                      <div className='relative'>
                        <span
                          className='block text-ellipsis overflow-hidden whitespace-nowrap'
                          title={lesson.title} // Tooltip for full text on hover
                        >
                          {lesson.title}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          {/* Main Content */}
          <ThemeDivBorder className='md:col-span-3 bg-white dark:bg-gray-900 dark:border-gray-600 border rounded-md p-4 md:p-6'>
            {selectedLesson && (
              <>
                <h2 className='text-xl md:text-2xl font-semibold mb-2'>
                  {selectedLesson.title}
                </h2>
                <p className='text-sm mb-4'>{selectedLesson.content}</p>

                <div className='rounded-lg overflow-hidden'>
                  {mediaType === 'pdf' && (
                    <iframe
                      src={selectedLesson.mediaPreview}
                      title='PDF Preview'
                      className='w-full h-[300px] md:h-[500px]'
                    />
                  )}
                  {mediaType === 'image' && (
                    <img
                      src={selectedLesson.mediaPreview}
                      alt='Lesson Media'
                      className='w-full max-h-[300px] md:max-h-[500px] object-contain'
                    />
                  )}
                  {mediaType === 'video' && selectedLesson.mediaPreview && (
                    <VideoPlayer src={selectedLesson.mediaPreview} />
                  )}
                  {mediaType === 'none' && <p>No media preview available.</p>}
                </div>
              </>
            )}
          </ThemeDivBorder>
        </div>
      </div>
    </main>
  );
};

export default CoursePreview;
