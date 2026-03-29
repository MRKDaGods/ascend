import { Services } from "@shared/index";
import db from "@shared/config/db";
import { Announcement } from "@shared/models/announcement";
import { callRPC, CompanyAnnouncementCreatedPayload, CompanyAnnouncementUpdatedPayload, Events, FileDeletePayload, FilePresignedUrlPayload, FileUploadPayload, getRPCQueueName, publishEvent } from "@shared/rabbitMQ";

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
  

export const createAnnouncement = async (company_id : number, user_id : number, created_at : Date, content : string, announcement_photos : Array<any>, announcement_video : any) : Promise<Announcement> => {
    let result;
    let image_ids : Array<number> = [];
    let video_id;
    let file_service_queue;

    if(announcement_photos){
      let announcement_photo_payload : FileUploadPayload.Request;
      for(const announcement_photo of announcement_photos){
          announcement_photo_payload  = {
              user_id : user_id,
              file_buffer : announcement_photo.buffer,
              file_name : announcement_photo.file_name,
              file_size : announcement_photo.file_size,
              mime_type : announcement_photo.mime_type
          };
          if(announcement_photo.context){
              announcement_photo_payload['context'] = announcement_photo.context;
          }
        

          file_service_queue = getRPCQueueName(Services.FILE, Events.FILE_UPLOAD_RPC);
          let announcementPhotoResponse = await callRPC<FileUploadPayload.Response>(file_service_queue, announcement_photo_payload, 10000);
          image_ids.push(announcementPhotoResponse.file_id);
      }  
    }
    
    if(announcement_video){

      file_service_queue = getRPCQueueName(Services.FILE, Events.FILE_UPLOAD_RPC);
      let announcement_video_payload : FileUploadPayload.Request = {
        user_id : user_id,
        file_buffer : announcement_video.buffer,
        file_name : announcement_video.file_name,
        file_size : announcement_video.file_size,
        mime_type : announcement_video.mime_type
      };
      
      if(announcement_video.context){
        announcement_video_payload['context'] = announcement_video.context;
      }
      const announcementVideoResponse = await callRPC<FileUploadPayload.Response>(file_service_queue, announcement_video_payload, 10000);
      video_id = announcementVideoResponse.file_id;
    }

    if(announcement_video){
        result = await db.query("INSERT INTO company_service.announcement (company_id, posted_by, created_at, content, image_ids, video_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [company_id, user_id, created_at, content, image_ids, video_id]);
    }else{
      result = await db.query("INSERT INTO company_service.announcement (company_id, posted_by, created_at, content, image_ids, video_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [company_id, user_id, created_at, content, image_ids, null]);
    }
    

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
  return result.rows.length > 0 ? parseInt(result.rows[0].count) : 0;
}

export const deleteAnnouncement = async (id : number, image_ids : Array<number> , video_id : number|undefined) : Promise<boolean> => {
  let delete_payload : FileDeletePayload;
  for(const image_id of image_ids){
      delete_payload = {
        file_id : image_id
      };
      await publishEvent(Events.FILE_DELETE, delete_payload);
  }

  if(video_id && video_id !== -1){
    delete_payload = {
      file_id : video_id
    }
    await publishEvent(Events.FILE_DELETE, delete_payload);
  }
  const result = await db.query("DELETE FROM company_service.announcement WHERE announcement_id = $1 RETURNING *", [id]);
  return result.rows.length > 0;
};

export const updateAnnouncement = async (id : number, user_id : number, company_id : number, updated_at : Date, {content, new_announcement_photos, old_image_ids, deleted_image_ids , new_announcement_video, old_video_id} : { content : string|undefined , new_announcement_photos : Array<any>|undefined , old_image_ids : Array<number> , deleted_image_ids : Array<number>|undefined, new_announcement_video : any|undefined , old_video_id : number|undefined }) : Promise<Announcement|null> => {
  let result;
  let file_service_queue;

  let counter : number = 0;
  let db_query : string = "UPDATE company_service.announcement SET ";
  let parameters : Array<any> = [];
  let updateAnnouncementPayload : any = {
    announcement_id : id,
    company_id : company_id,
    updated_at : updated_at,
    posted_by : user_id
  };
  let new_image_ids : Array<number> = old_image_ids;
  let new_video_id;

  let  delete_payload : FileDeletePayload;
  if(deleted_image_ids){
    for(const deleted_image_id of deleted_image_ids){
        delete_payload = {
          file_id : deleted_image_id
        };
        await publishEvent(Events.FILE_DELETE, delete_payload);
    }
    new_image_ids = new_image_ids.filter(
      image_id => !deleted_image_ids.includes(image_id)
    );
    
  }
  if(new_announcement_photos){
    let announcementPhotoResponse;
    let announcement_photo_payload : FileUploadPayload.Request;
    for(const announcement_photo of new_announcement_photos){
        announcement_photo_payload  = {
            user_id : user_id,
            file_buffer : announcement_photo.buffer,
            file_name : announcement_photo.file_name,
            file_size : announcement_photo.file_size,
            mime_type : announcement_photo.mime_type
        };
        if(announcement_photo.context){
            announcement_photo_payload['context'] = announcement_photo.context;
        }
    
        file_service_queue = getRPCQueueName(Services.FILE, Events.FILE_UPLOAD_RPC);
        announcementPhotoResponse = await callRPC<FileUploadPayload.Response>(file_service_queue, announcement_photo_payload, 10000);
        new_image_ids.push(announcementPhotoResponse.file_id);
    }
  
  }

  if(deleted_image_ids || new_announcement_photos){
    counter += 1;
    db_query += `image_ids = $${counter}, `;
    parameters.push(new_image_ids);
  }

  if(new_announcement_video){
    if(old_video_id && old_video_id !== -1){
        const delete_payload : FileDeletePayload = {
          file_id : old_video_id
        };
        await publishEvent(Events.FILE_DELETE, delete_payload);
    }
    

    let new_announcement_video_payload : FileUploadPayload.Request  = {
      user_id : user_id,
      file_buffer : new_announcement_video.buffer,
      file_name : new_announcement_video.file_name,
      file_size : new_announcement_video.file_size,
      mime_type : new_announcement_video.mime_type
    };
    if(new_announcement_video.context){
        new_announcement_video_payload['context'] = new_announcement_video.context;
    }
  
    file_service_queue = getRPCQueueName(Services.FILE, Events.FILE_UPLOAD_RPC);
    const announcementVideoResponse = await callRPC<FileUploadPayload.Response>(file_service_queue, new_announcement_video_payload, 10000);    
    new_video_id = announcementVideoResponse.file_id;

    counter += 1;
    db_query += `video_id = $${counter}, `;
    parameters.push(new_video_id);
  }else if(new_announcement_video === ""){
    if(old_video_id){
      const delete_payload : FileDeletePayload = {
        file_id : old_video_id
      };
      await publishEvent(Events.FILE_DELETE, delete_payload);
    }

    counter += 1;
    db_query += `video_id = $${counter}, `;
    parameters.push(null);
  }
  
  if(content){
    counter += 1;
    db_query += `content = $${counter}, `;
    parameters.push(content);
    updateAnnouncementPayload.new_content = content;
  }


  db_query = db_query.substring(0, db_query.lastIndexOf(","));

  counter += 1;
  db_query += ` WHERE announcement_id = $${counter} RETURNING *`;
  parameters.push(id);

  console.log(db_query);
  result = await db.query(db_query, parameters);

  await publishEvent(Events.COMPANY_ANNOUNCEMENT_UPDATED, updateAnnouncementPayload);
  console.log(`from update service ${result.rows[0]}`);
  return result.rows.length > 0 ? result.rows[0] : null;
};
