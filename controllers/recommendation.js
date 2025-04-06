import { Rating } from "../models/Rating.js";
import { Courses } from "../models/Courses.js";

export const getCourseRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;

    const userRatings = await Rating.find({ user: userId });

    if (userRatings.length === 0) {
      return res
        .status(200)
        .json({ message: "No ratings found", recommendations: [] });
    }

    const allRatings = await Rating.find({}).populate("courseId");

    const courseScores = {};

    for (const rating of allRatings) {
      if (!rating.courseId || rating.user.equals(userId)) continue;

      const score = courseScores[rating.courseId._id] || { total: 0, count: 0 };
      score.total += rating.rating;
      score.count += 1;
      courseScores[rating.courseId._id] = score;
    }

    const recommendations = Object.entries(courseScores)
      .map(([id, score]) => ({
        courseId: id,
        averageRating: score.total / score.count,
      }))
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 5);

    const courses = await Courses.find({
      _id: { $in: recommendations.map((r) => r.courseId) },
    });

    res.status(200).json({ recommendations: courses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
