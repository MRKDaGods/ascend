import db from "@ascend/shared/src/config/db";
import { Follows } from "@shared/models/follows";

export const findFollowersOfCompany = async (company_id : number, limit : number = -1, offset : number = 0) : Promise<Array<Follows>> => {
    let result;
    if(limit === -1){
        result = await db.query("SELECT * FROM company_service.follows WHERE company_id = $1", [company_id]);
    }else{
        result = await db.query("SELECT * FROM company_service.follows WHERE company_id = $1 LIMIT $2 OFFSET $3", [company_id, limit, offset*limit])
    }
    return result.rows;
}

export const findNumberOfFollowersOfCompany = async (company_id : number) : Promise<number> => {
    const result = await db.query("SELECT COUNT(*) FROM company_service.follows WHERE company_id = $1", [company_id]);
    return result.rows[0];
}

export const findCompaniesFollowedByUser = async (user_id : number, limit : number = -1, offset : number = 0) : Promise<Array<Follows>> => {
    let result;
    if(limit === -1){
        result = await db.query("SELECT * FROM company_service.follows WHERE follower_id = $1", [user_id]);
    }else{
        result = await db.query("SELECT * FROM company_service.follows WHERE follower_id = $1 LIMIT $2 OFFSET $3", [user_id, limit, limit*offset]);
    }
    return result.rows;
};

export const createFollowRelationShip = async (user_id : number, company_id : number, date : Date, first_name : string, last_name : string, profile_photo_url : string = "") : Promise<boolean> => {
    let params : Array<any>;
    if(profile_photo_url === ""){
        params = [user_id, company_id, date, first_name, last_name, null];
    }else{
        params = [user_id, company_id, date, first_name, last_name, profile_photo_url];
    }
    console.log(params);
    const result = await db.query("INSERT INTO company_service.follows (follower_id, company_id, created_at, first_name, last_name, profile_picture_url) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (follower_id, company_id) DO NOTHING RETURNING *", params);
    return result.rows.length > 0;
};

export const deleteFollowRelationShip = async (user_id : number, company_id : number) : Promise<boolean> => {
    const result = await db.query("DELETE FROM company_service.follows WHERE follower_id = $1 AND company_id = $2 RETURNING *", [user_id, company_id]);
    return result.rows.length > 0;
};