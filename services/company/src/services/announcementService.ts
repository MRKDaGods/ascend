import db from "@ascend/shared/src/config/db";
import { Announcement } from "@shared/models/announcement";

export const findAnnouncementById = async (id: number) : Promise<Announcement|null> => {
    const result = await db.query("SELECT * FROM company_service.announcement WHERE announcement_id = $1", [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
}

export const findAnnouncementsByCompanyId = async (company_id: number) : Promise<Array<Announcement>> => {
    const result = await db.query("SELECT * FROM company_service.announcement WHERE company_id = $1", [company_id]);
    return result.rows;
}

export const createAnnouncement = async (
    company_id : number,
    user_id : number,
    created_at : Date,
    content : string
) : Promise<Announcement> => {
    const result = await db.query("INSERT INTO company_service.announcement (company_id, posted_by, created_at, content) VALUES ($1, $2, $3, $4) RETURNING *", [company_id, user_id, created_at, content]);
    return result.rows[0];
}

export const findAnnouncementsPostedByUserId = async (user_id: number) : Promise<Array<Announcement>> => {
    const result = await db.query("SELECT * FROM company_service.announcement WHERE posted_by = $1", [user_id]);
    return result.rows;
}

export const findAnnouncementsCreatedAt = async (date : Date) : Promise<Array<Announcement>> => {
    const result = await db.query("SELECT * FROM company_service.announcement WHERE DATE(created_at) = $1", [date])
    return result.rows;
}

export const findAnnouncementsCreatedBefore = async (date : Date) : Promise<Array<Announcement>> => {
    const result = await db.query("SELECT * FROM company_service.announcement WHERE DATE(created_at) < $1", [date])
    return result.rows;
}


export const findAnnouncementsCreatedAfter = async (date : Date) : Promise<Array<Announcement>> => {
    const result = await db.query("SELECT * FROM company_service.announcement WHERE DATE(created_at) > $1", [date])
    return result.rows;
}


export const findAnnouncementsCreatedBetween = async (date1 : Date, date2 : Date) : Promise<Array<Announcement>> => {
    const result = await db.query("SELECT * FROM company_service.announcement WHERE DATE(created_at) >= $1 AND DATE(created_at) <= $2", [date1, date2])
    return result.rows;
}

export const deleteAnnouncement = async (id : number) : Promise<void> => {
    await db.query("DELETE FROM company_service.announcement WHERE announcement_id = $1", [id]);
}

