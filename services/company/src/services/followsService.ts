import db from "@ascend/shared/src/config/db";
import { Follows } from "@shared/models/follows";

export const findFollowersOfCompany = async (company_id : number) : Promise<Array<Follows>> => {
    const result = await db.query("SELECT * FROM company_service.follows WHERE company_id = $1", [company_id]);
    return result.rows;
}

export const findCompaniesFollowedByUser = async (user_id : number) : Promise<Array<Follows>> => {
    const result = await db.query("SELECT * FROM company_service.follows WHERE follower_id = $1", [user_id]);
    return result.rows;
}

export const createFollowRelationShip = async (user_id : number, company_id : number, date : Date) : Promise<Follows> => {
    const result = await db.query("INSERT INTO company_service.follows (follower_id, company_id, created_at) VALUES ($1, $2, $3) RETURNING *", [user_id, company_id, date]);
    return result.rows[0];
}

export const deleteFollowRelationShip = async (user_id : number, company_id : number) : Promise<void> => {
    await db.query("DELETE FROM company_service.follows WHERE follower_id = $1 AND company_id = $2", [user_id, company_id]);
} 