// utils/collaborativeFilter.js
import { Rating } from "../models/Rating.js";
import { create, all } from "mathjs";

const math = create(all);

export const getRecommendations = async (userId) => {
  const ratings = await Rating.find().lean();

  const userRatings = {};
  const courseRatings = {};

  ratings.forEach(({ user, courseId, rating }) => {
    if (!userRatings[user]) userRatings[user] = {};
    userRatings[user][courseId] = rating;

    if (!courseRatings[courseId]) courseRatings[courseId] = {};
    courseRatings[courseId][user] = rating;
  });

  const currentUserRatings = userRatings[userId];
  if (!currentUserRatings) return [];

  const scores = {};
  const similaritySums = {};

  for (const otherUser in userRatings) {
    if (otherUser === userId) continue;

    const sim = cosineSimilarity(currentUserRatings, userRatings[otherUser]);

    if (sim <= 0) continue;

    for (const course in userRatings[otherUser]) {
      if (!currentUserRatings[course]) {
        scores[course] =
          (scores[course] || 0) + userRatings[otherUser][course] * sim;
        similaritySums[course] = (similaritySums[course] || 0) + sim;
      }
    }
  }

  const rankings = Object.keys(scores)
    .map((courseId) => ({
      courseId,
      score: scores[courseId] / similaritySums[courseId],
    }))
    .sort((a, b) => b.score - a.score);

  return rankings;
};

function cosineSimilarity(ratings1, ratings2) {
  const common = Object.keys(ratings1).filter((id) => id in ratings2);
  if (common.length === 0) return 0;

  const dotProduct = common.reduce(
    (sum, id) => sum + ratings1[id] * ratings2[id],
    0
  );
  const magnitude1 = Math.sqrt(
    common.reduce((sum, id) => sum + ratings1[id] ** 2, 0)
  );
  const magnitude2 = Math.sqrt(
    common.reduce((sum, id) => sum + ratings2[id] ** 2, 0)
  );

  if (magnitude1 === 0 || magnitude2 === 0) return 0;

  return dotProduct / (magnitude1 * magnitude2);
}
