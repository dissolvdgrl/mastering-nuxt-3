import { PrismaClient } from '@prisma/client';
import protectedRoute from '~/server/utils/protectRoute';

const prisma = new PrismaClient();

// Endpoint that updates the progress of a lesson
export default defineEventHandler(async (event) => {
	// Only allow PUT, PATCH, POST requests
	assertMethod(event, ['PUT', 'PATCH', 'POST']);

	// Throw a 401 if there is no user logged in
	protectRoute(event);

	// Get route params
	const { chapterSlug, lessonSlug } = event.context.params;

	// Get lesson from DB
	const lesson = await prisma.lesson.findFirst({
		where: {
			slug: lessonSlug,
			Chapter: {
				slug: chapterSlug,
			},
		},
	});

	// If the lesson doesn't exist, throw a 404
	if (!lesson) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Lesson not found',
		})
	}

	// Get the completed value from the request body and update progress
	// Select based on the chapter and lesson slugs
	const { completed } = await readBody(event);

	// Get user email from the Supabase User is there is one
	const {
		user: {email: userEmail },
	} = event.context;

	// upsert = update/insert
	return prisma.lessonProgress.upsert({
		where: {
			lessonId_userEmail: {
				lessonId: lesson.id,
				userEmail,
			},
		},
		update: {
			completed,
		},
		create: {
			completed,
			userEmail,
			Lesson: {
				connect: {
					id: lesson.id,
				},
			},
		},
	});
});