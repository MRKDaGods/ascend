import { Services } from "@ascend/shared";
import db from "@ascend/shared/src/config/db";
import { Company } from "@shared/models/company";
import { callRPC, Events, FileDeletePayload, FilePresignedUrlPayload, FileUploadPayload, getRPCQueueName } from "@shared/rabbitMQ";

export const findCompanyById = async (id : number) : Promise<Company | null> => {
    const result = await db.query("SELECT * FROM company_service.company WHERE company_id=$1", [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

export const findCompanyByName = async (name : string) : Promise<Company | null> => {
    const result = await db.query("SELECT * FROM company_service.company WHERE company_name=$1", [name]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

export const createCompany = async ({
    company_name ,
    description ,
    profile_photo,
    cover_photo,
    location,
    industry,
    created_at,
    created_by,
    company_domain_name
} : {company_name : string, description : string, profile_photo : any, cover_photo : any, location : string, industry : string, created_at : Date, created_by : number, company_domain_name : string}
) : Promise<Company | null> => {
    let file_service_queue = getRPCQueueName(Services.FILE, Events.FILE_UPLOAD_RPC);
    let profile_photo_payload : FileUploadPayload.Request = {
        user_id : created_by,
        file_buffer : profile_photo.buffer,
        file_name : profile_photo.file_name,
        file_size : profile_photo.file_size,
        mime_type : profile_photo.mime_type
    };
    if(profile_photo.context){
        profile_photo_payload['context'] = profile_photo.context;
    }

    let cover_photo_payload : FileUploadPayload.Request = {
        user_id : created_by,
        file_buffer : cover_photo.buffer,
        file_name : cover_photo.file_name,
        file_size : cover_photo.file_size,
        mime_type : cover_photo.mime_type
    };
    if(cover_photo.context){
        cover_photo_payload['context'] = cover_photo.context;
    }

    const profilePhotoResponse = await callRPC<FileUploadPayload.Response>(file_service_queue, profile_photo_payload, 10000);
    const coverPhotoResponse = await callRPC<FileUploadPayload.Response>(file_service_queue, cover_photo_payload, 10000);

    file_service_queue = getRPCQueueName(Services.FILE, Events.FILE_URL_RPC);
    const profilePhotoURLResponse = await callRPC<FilePresignedUrlPayload.Response>(file_service_queue, { file_id : profilePhotoResponse.file_id }, 10000);
    const coverPhotoURLResponse = await callRPC<FilePresignedUrlPayload.Response>(file_service_queue, { file_id : coverPhotoResponse.file_id }, 10000);

    const result = await db.query("INSERT INTO company_service.company (company_name, description, profile_photo_url, cover_photo_url, location, industry, created_at, created_by, profile_photo_id, cover_photo_id, company_domain_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
        [company_name, description, profilePhotoURLResponse.presigned_url, coverPhotoURLResponse.presigned_url , location, industry, created_at, created_by, profilePhotoResponse.file_id, coverPhotoResponse.file_id, company_domain_name]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
};

export const findCompaniesCreatedByUser = async (user_id: number,  limit: number = -1,  offset: number = 0): Promise<Array<Company>> => {
    const query = limit === -1 
      ? "SELECT * FROM company_service.company WHERE created_by = $1" 
      : "SELECT * FROM company_service.company WHERE created_by = $1 LIMIT $2 OFFSET $3";
    const params = limit === -1 ? [user_id] : [user_id, limit, offset * limit];
    const result = await db.query(query, params);
    return result.rows;
};
  


export const findCompaniesByKeyword = async (keywords : {[key : string] : any}, limit : number = -1, offset : number = 0) : Promise<Array<Company>> => {
    const {description, location, industry, company_domain_name} = keywords;
    let counter : number = 0;
    let db_query : string = "SELECT * FROM company_service.company WHERE ";
    let parametrs : Array<any> = [];

    if(description){
        counter += 1;
        db_query += `description = ${description} AND `;
        parametrs.push(description);
    }

    if(location){
        counter += 1;
        db_query += `location = ${location} AND `;
        parametrs.push(location);
    }

    if(industry){
        counter += 1;
        db_query += `industry = ${industry} AND `;
        parametrs.push(industry);
    }

    if(company_domain_name){
        counter += 1;
        db_query += `company_domain_name = ${company_domain_name} AND `;
        parametrs.push(company_domain_name);
    }

    db_query = limit === -1 
    ? db_query 
    : db_query+` LIMIT ${counter+1} OFFSET ${counter+2}`;

    const params = limit === -1 ? parametrs : parametrs.concat([limit, offset * limit]);

    const result = await db.query(db_query, parametrs);
    return result.rows;
};


export const updateCompanyProfile = async (company_id : number, user_id : number, keywords : {[key : string] : any}) : Promise<Company | null> => {
    const {description, location, industry, profile_photo, cover_photo, profile_photo_id, cover_photo_id, company_domain_name} = keywords;
    let counter : number = 0;
    let db_query : string = "UPDATE company_service.company SET ";
    let parameters : Array<any> = [];

    if(description){
        counter += 1;
        db_query += `description = $${counter} , `;
        parameters.push(description);
    }

    if(location){
        counter += 1;
        db_query += `location = $${counter} , `;
        parameters.push(location);
    }

    if(industry){
        counter += 1;
        db_query += `industry = $${counter} , `;
        parameters.push(industry);
    }

    if(company_domain_name){
        counter += 1;
        db_query += `company_domain_name = $${counter} , `;
        parameters.push(company_domain_name);
    }

    let file_service_queue ;

    if(profile_photo){
        file_service_queue = getRPCQueueName(Services.FILE, Events.FILE_DELETE);
        await callRPC<FileDeletePayload>(file_service_queue, {file_id : profile_photo_id}, 10000);

        file_service_queue = getRPCQueueName(Services.FILE, Events.FILE_UPLOAD_RPC); 
        let profile_photo_payload : FileUploadPayload.Request = {
            user_id : user_id,
            file_buffer : profile_photo.buffer,
            file_name : profile_photo.file_name,
            file_size : profile_photo.file_size,
            mime_type : profile_photo.mime_type
        };
        if(profile_photo.context){
            profile_photo_payload['context'] = profile_photo.context;
        }
        const profilePhotoResponse = await callRPC<FileUploadPayload.Response>(file_service_queue, profile_photo_payload, 10000);
        file_service_queue = getRPCQueueName(Services.FILE, Events.FILE_URL_RPC);
        const profilePhotoURLResponse = await callRPC<FilePresignedUrlPayload.Response>(file_service_queue, { file_id : profilePhotoResponse.file_id }, 10000);
        counter += 1;
        db_query += `profile_photo_url = $${counter} , `;
        parameters.push(profilePhotoURLResponse.presigned_url);
        counter += 1;
        db_query += `profile_photo_id = $${counter}`
        parameters.push(profilePhotoResponse.file_id)
    }

    if(cover_photo){
        file_service_queue = getRPCQueueName(Services.FILE, Events.FILE_DELETE);
        await callRPC<FileDeletePayload>(file_service_queue, { file_id : cover_photo_id }, 10000);

        file_service_queue = getRPCQueueName(Services.FILE, Events.FILE_UPLOAD_RPC);
        let cover_photo_payload : FileUploadPayload.Request = {
            user_id : user_id,
            file_buffer : cover_photo.buffer,
            file_name : cover_photo.file_name,
            file_size : cover_photo.file_size,
            mime_type : cover_photo.mime_type
        };
        if(cover_photo.context){
            cover_photo_payload['context'] = cover_photo.context;
        }
        const coverPhotoResponse = await callRPC<FileUploadPayload.Response>(file_service_queue, cover_photo_payload, 10000);
        file_service_queue = getRPCQueueName(Services.FILE, Events.FILE_URL_RPC);
        const coverPhotoURLResponse = await callRPC<FilePresignedUrlPayload.Response>(file_service_queue, { file_id : coverPhotoResponse.file_id }, 10000);
        counter += 1;
        db_query += `cover_photo_url = $${counter} , `;
        parameters.push(coverPhotoURLResponse.presigned_url);
        counter += 1;
        db_query += `cover_photo_id = $${counter} , `;
        parameters.push(coverPhotoURLResponse.file_id);
    }

    db_query = db_query.substring(0, db_query.lastIndexOf(","));

    counter += 1;
    db_query += ` WHERE company_id = $${counter} RETURNING *`;
    parameters.push(company_id);

    const result = await db.query(db_query, parameters);
    return result.rows.length > 0 ? result.rows[0] : null;
};

export const findCompaniesCreatedAt = async (date: Date,  limit: number = -1,  offset: number = 0): Promise<Array<Company>> => {
    const query = limit === -1 
      ? "SELECT * FROM company_service.company WHERE DATE(created_at) = $1" 
      : "SELECT * FROM company_service.company WHERE DATE(created_at) = $1 LIMIT $2 OFFSET $3";
    const params = limit === -1 ? [date] : [date, limit, offset * limit];
    const result = await db.query(query, params);
    return result.rows;
};
  
export const findCompaniesCreatedBefore = async (date: Date,  limit: number = -1,  offset: number = 0): Promise<Array<Company>> => {
    const query = limit === -1 
      ? "SELECT * FROM company_service.company WHERE DATE(created_at) < $1" 
      : "SELECT * FROM company_service.company WHERE DATE(created_at) < $1 LIMIT $2 OFFSET $3";
    const params = limit === -1 ? [date] : [date, limit, offset * limit];
    const result = await db.query(query, params);
    return result.rows;
};
  
export const findCompaniesCreatedAfter = async ( date: Date,  limit: number = -1,  offset: number = 0): Promise<Array<Company>> => {
    const query = limit === -1 
      ? "SELECT * FROM company_service.company WHERE DATE(created_at) > $1" 
      : "SELECT * FROM company_service.company WHERE DATE(created_at) > $1 LIMIT $2 OFFSET $3";
    const params = limit === -1 ? [date] : [date, limit, offset * limit];
    const result = await db.query(query, params);
    return result.rows;
};
  
export const findCompaniesCreatedBetween = async (date1: Date,  date2: Date,  limit: number = -1,  offset: number = 0): Promise<Array<Company>> => {
    const query = limit === -1 
      ? "SELECT * FROM company_service.company WHERE DATE(created_at) BETWEEN $1 AND $2" 
      : "SELECT * FROM company_service.company WHERE DATE(created_at) BETWEEN $1 AND $2 LIMIT $3 OFFSET $4";
    const params = limit === -1 ? [date1, date2] : [date1, date2, limit, offset * limit];
    const result = await db.query(query, params);
    return result.rows;
};
  
export const deleteCompany = async (id : number, {profile_photo_id = -1, cover_photo_id = -1} : {profile_photo_id : number , cover_photo_id : number}) : Promise<boolean> => {
    const file_service_queue = getRPCQueueName(Services.FILE, Events.FILE_DELETE);
    if(profile_photo_id !== -1){
        await callRPC<FileDeletePayload>(file_service_queue, {file_id : profile_photo_id}, 10000);
    }

    if(cover_photo_id !== -1){
        await callRPC<FileDeletePayload>(file_service_queue, {file_id : cover_photo_id}, 10000);
    }
    const result = await db.query("DELETE FROM company_service.company WHERE company_id = $1 RETURNING *", [id]);
    return result.rows.length > 0;
};