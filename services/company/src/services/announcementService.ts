import db from "@ascend/shared/src/config/db";
import { Announcement } from "@shared/models/announcement";

export const findAnnouncementById = async (id: number) : Promise<Announcement|null> => {
    const result = await db.query("SELECT * FROM company_service.announcement WHERE announcement_id = $1", [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
}

export const findAnnouncementsByCompanyId = async ( company_id: number,  limit: number = -1,  offset: number = 0): Promise<Array<Announcement>> => {
    const query = limit === -1 
      ? "SELECT * FROM company_service.announcement WHERE company_id = $1" 
      : "SELECT * FROM company_service.announcement WHERE company_id = $1 LIMIT $2 OFFSET $3";
    const params = limit === -1 ? [company_id] : [company_id, limit, offset * limit];
    const result = await db.query(query, params);
    return result.rows;
  };
  

export const createAnnouncement = async (company_id : number, user_id : number, created_at : Date, content : string) : Promise<Announcement> => {
    const result = await db.query("INSERT INTO company_service.announcement (company_id, posted_by, created_at, content) VALUES ($1, $2, $3, $4) RETURNING *", [company_id, user_id, created_at, content]);
    return result.rows[0];
};

export const findAnnouncementsPostedByUserId = async ( user_id: number,  limit: number = -1,  offset: number = 0): Promise<Array<Announcement>> => {
    const query = limit === -1 
      ? "SELECT * FROM company_service.announcement WHERE posted_by = $1" 
      : "SELECT * FROM company_service.announcement WHERE posted_by = $1 LIMIT $2 OFFSET $3";
    const params = limit === -1 ? [user_id] : [user_id, limit, offset * limit];
    const result = await db.query(query, params);
    return result.rows;
};
  
export const findAnnouncementsCreatedAt = async (date: Date,  limit: number = -1,  offset: number = 0): Promise<Array<Announcement>> => {
    const query = limit === -1 
      ? "SELECT * FROM company_service.announcement WHERE DATE(created_at) = $1" 
      : "SELECT * FROM company_service.announcement WHERE DATE(created_at) = $1 LIMIT $2 OFFSET $3";
    const params = limit === -1 ? [date] : [date, limit, offset * limit];
    const result = await db.query(query, params);
    return result.rows;
};
  
export const findAnnouncementsCreatedBefore = async (date: Date, limit: number = -1,  offset: number = 0): Promise<Array<Announcement>> => {
    const query = limit === -1 
      ? "SELECT * FROM company_service.announcement WHERE DATE(created_at) < $1" 
      : "SELECT * FROM company_service.announcement WHERE DATE(created_at) < $1 LIMIT $2 OFFSET $3";
    const params = limit === -1 ? [date] : [date, limit, offset * limit];
    const result = await db.query(query, params);
    return result.rows;
};
  
export const findAnnouncementsCreatedAfter = async (date: Date,  limit: number = -1,  offset: number = 0): Promise<Array<Announcement>> => {
    const query = limit === -1 
      ? "SELECT * FROM company_service.announcement WHERE DATE(created_at) > $1" 
      : "SELECT * FROM company_service.announcement WHERE DATE(created_at) > $1 LIMIT $2 OFFSET $3";
    const params = limit === -1 ? [date] : [date, limit, offset * limit];
    const result = await db.query(query, params);
    return result.rows;
};
  
export const findAnnouncementsCreatedBetween = async (date1: Date,  date2: Date,  limit: number = -1,  offset: number = 0): Promise<Array<Announcement>> => {
    const query = limit === -1 
      ? "SELECT * FROM company_service.announcement WHERE DATE(created_at) BETWEEN $1 AND $2" 
      : "SELECT * FROM company_service.announcement WHERE DATE(created_at) BETWEEN $1 AND $2 LIMIT $3 OFFSET $4";
    const params = limit === -1 ? [date1, date2] : [date1, date2, limit, offset * limit];
    const result = await db.query(query, params);
    return result.rows;
};


export const findNumberOfAnnouncements = async (company_id : number) : Promise<Number> =>{
  const result = await db.query("SELECT COUNT(*) FROM company_service.announcement WHERE company_id = $1", [company_id]);
  return result.rows[0];
}

export const deleteAnnouncement = async (id : number) : Promise<boolean> => {
  const result = await db.query("DELETE FROM company_service.announcement WHERE announcement_id = $1 RETURNING *", [id]);
  return result.rows.length > 0;
};

