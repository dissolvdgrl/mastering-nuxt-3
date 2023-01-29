import { CourseOutline, ChapterOutline, LessonOutline } from "~/server/api/course/meta.get";

// export default async () => useFetchWithCache<CourseOutline>('/api/course/meta');

// Fix for path problem
export type LessonOutlineWithPath = LessonOutline & {
	path: string
};

export type ChapterOutlineWithPath = ChapterOutline & {
	lessons: LessonOutlineWithPath[]
}

export default async () => {
	const course = await useFetchWithCache<CourseOutline>("/api/course/meta");

	const chapterOutline = course.value.chapters.reduce(
		(prev: ChapterOutline[], next: ChapterOutline) => {
			const lessons: LessonOutlineWithPath[] = next.lessons.map((lesson) => ({
				title: lesson.title,
				slug: lesson.slug,
				number: lesson.number,
				path: `/course/chapter/${next.slug}/lesson/${lesson.slug}`,
			}));

			const chapter = {
				title: next.title,
				slug: next.slug,
				number: next.number,
				lessons,
			};

			return [...prev, chapter];
		},
		[]
	);

	course.value.chapters = chapterOutline;

	return course;
};