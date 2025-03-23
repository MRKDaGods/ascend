import db from "@shared/config/db";
import { Profile } from "@shared/models";

export const getProfile = async (userId: number): Promise<Profile | null> => {
  const profileResult = await db.query(
    "SELECT * FROM user_service.profiles WHERE user_id = $1",
    [userId]
  );

  // Found smth?
  if (profileResult.rows.length === 0) {
    return null;
  }

  const profile = profileResult.rows[0];

  // Education
  const educationResult = await db.query(
    "SELECT * FROM user_service.education WHERE user_id = $1",
    [userId]
  );
  profile.education = educationResult.rows;

  // Experience
  const experienceResult = await db.query(
    "SELECT * FROM user_service.experience WHERE user_id = $1",
    [userId]
  );
  profile.experience = experienceResult.rows;

  // Projects
  const projectResult = await db.query(
    "SELECT * FROM user_service.projects WHERE user_id = $1",
    [userId]
  );
  profile.projects = projectResult.rows;

  // Courses
  const courseResult = await db.query(
    "SELECT * FROM user_service.courses WHERE user_id = $1",
    [userId]
  );
  profile.courses = courseResult.rows;

  // Skills
  const skillResult = await db.query(
    "SELECT s.* FROM user_service.skills s JOIN user_service.user_skills us ON s.id = us.skill_id WHERE us.user_id = $1",
    [userId]
  );
  profile.skills = skillResult.rows;

  // Interests
  const interestResult = await db.query(
    "SELECT i.* FROM user_service.interests i JOIN user_service.user_interests ui ON i.id = ui.interest_id WHERE ui.user_id = $1",
    [userId]
  );
  profile.interests = interestResult.rows;

  // Contact Info
  const contactInfoResult = await db.query(
    "SELECT * FROM user_service.contact_info WHERE user_id = $1",
    [userId]
  );
  profile.contact_info = contactInfoResult.rows[0] || undefined;

  return profile;
};

export const createOrUpdateProfile = async (
  userId: number,
  profileData: Partial<Profile> & { first_name: string; last_name: string }
): Promise<Profile> => {
  const {
    first_name,
    last_name,
    industry,
    location,
    bio,
    privacy,
    show_school,
    show_current_company,
    website,
    additional_name,
    name_pronunciation,
    skills,
    education,
    experience,
    interests,
    projects,
    courses,
    contact_info,
  } = profileData;

  const get = <T>(value: T | undefined, defaultValue: T): T => {
    return value === undefined ? defaultValue : value;
  };

  const profile = await getProfile(userId);
  if (profile) {
    // Update defined fields
    await db.query(
      `UPDATE user_service.profiles 
         SET first_name = $1, last_name = $2, industry = $3, location = $4, bio = $5, 
             privacy = $6, show_school = $7, show_current_company = $8, website = $9, 
             additional_name = $10, name_pronunciation = $11 
         WHERE user_id = $12`,
      [
        first_name,
        last_name,
        get(industry, profile.industry),
        get(location, profile.location),
        get(bio, profile.bio),
        get(privacy, profile.privacy),
        get(show_school, profile.show_school),
        get(show_current_company, profile.show_current_company),
        get(website, profile.website),
        get(additional_name, profile.additional_name),
        get(name_pronunciation, profile.name_pronunciation),
        userId,
      ]
    );
  } else {
    await db.query(
      `INSERT INTO user_service.profiles 
         (user_id, first_name, last_name, industry, location, bio, privacy, show_school, show_current_company, website, additional_name, name_pronunciation) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        userId,
        first_name,
        last_name,
        industry,
        location,
        bio,
        privacy || "public",
        get(show_school, true),
        get(show_current_company, true),
        website,
        additional_name,
        name_pronunciation,
      ]
    );
  }

  // Update skills
  if (skills) {
    // Clear existing skills
    await db.query("DELETE FROM user_service.user_skills WHERE user_id = $1", [
      userId,
    ]);

    // Create new skills if they dont exist, and assign their ids
    for (const skill of skills) {
      const skillResult = await db.query(
        "SELECT id FROM user_service.skills WHERE name = $1",
        [skill.name]
      );

      if (skillResult.rows.length === 0) {
        // Create new skill
        const skillResult = await db.query(
          "INSERT INTO user_service.skills (name) VALUES ($1) RETURNING id",
          [skill.name]
        );
        skill.id = skillResult.rows[0].id;
      } else {
        skill.id = skillResult.rows[0].id;
      }
    }

    for (const skill of skills) {
      await db.query(
        "INSERT INTO user_service.user_skills (user_id, skill_id) VALUES ($1, $2)",
        [userId, skill.id]
      );
    }
  }

  // Update education
  if (education) {
    // Clear existing education
    await db.query("DELETE FROM user_service.education WHERE user_id = $1", [
      userId,
    ]);

    for (const edu of education) {
      await db.query(
        "INSERT INTO user_service.education (user_id, school, degree, field_of_study, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          userId,
          edu.school,
          edu.degree,
          edu.field_of_study,
          edu.start_date,
          edu.end_date,
        ]
      );
    }
  }

  // Update experience
  if (experience) {
    // Clear existing experience
    await db.query("DELETE FROM user_service.experience WHERE user_id = $1", [
      userId,
    ]);

    for (const exp of experience) {
      await db.query(
        "INSERT INTO user_service.experience (user_id, company, position, start_date, end_date, description) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          userId,
          exp.company,
          exp.position,
          exp.start_date,
          exp.end_date,
          exp.description,
        ]
      );
    }
  }

  // Update interests
  if (interests) {
    // Clear existing interests
    await db.query(
      "DELETE FROM user_service.user_interests WHERE user_id = $1",
      [userId]
    );

    // Create new interests if they dont exist, and assign their ids
    for (const interest of interests) {
      const interestResult = await db.query(
        "SELECT id FROM user_service.interests WHERE name = $1",
        [interest.name]
      );

      if (interestResult.rows.length === 0) {
        // Create new interest
        const interestResult = await db.query(
          "INSERT INTO user_service.interests (name) VALUES ($1) RETURNING id",
          [interest.name]
        );
        interest.id = interestResult.rows[0].id;
      } else {
        interest.id = interestResult.rows[0].id;
      }
    }

    for (const interest of interests) {
      await db.query(
        "INSERT INTO user_service.user_interests (user_id, interest_id) VALUES ($1, $2)",
        [userId, interest.id]
      );
    }
  }

  // Update projects
  if (projects) {
    // Clear existing projects
    await db.query("DELETE FROM user_service.projects WHERE user_id = $1", [
      userId,
    ]);

    for (const project of projects) {
      await db.query(
        "INSERT INTO user_service.projects (user_id, name, description, start_date, end_date, url) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          userId,
          project.name,
          project.description,
          project.start_date,
          project.end_date,
          project.url,
        ]
      );
    }
  }

  // Update courses
  if (courses) {
    // Clear existing courses
    await db.query("DELETE FROM user_service.courses WHERE user_id = $1", [
      userId,
    ]);

    for (const course of courses) {
      await db.query(
        "INSERT INTO user_service.courses (user_id, name, provider, completion_date) VALUES ($1, $2, $3, $4)",
        [userId, course.name, course.provider, course.completion_date]
      );
    }
  }

  // Update contact info
  if (contact_info) {
    // Clear existing contact info
    await db.query("DELETE FROM user_service.contact_info WHERE user_id = $1", [
      userId,
    ]);

    await db.query(
      "INSERT INTO user_service.contact_info (user_id, profile_url, email, phone, phone_type, address, birthday) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        userId,
        contact_info.profile_url,
        contact_info.email,
        contact_info.phone,
        contact_info.phone_type,
        contact_info.address,
        contact_info.birthday,
      ]
    );
  }

  return getProfile(userId) as Promise<Profile>;
};

export const checkProfileExists = async (userId: number): Promise<boolean> => {
  const result = await db.query(
    "SELECT * FROM user_service.profiles WHERE user_id = $1",
    [userId]
  );

  return result.rows.length > 0;
};
