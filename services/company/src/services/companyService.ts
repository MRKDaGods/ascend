import db from "@ascend/shared/src/config/db";
import { Company } from "@shared/models/company";

export const findCompanyById = async (id : number) : Promise<Company | null> => {
    const result = await db.query("SELECT * FROM company_service.company WHERE company_id=$1", [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
}

export const findCompanyByName = async (name : string) : Promise<Company | null> => {
    const result = await db.query("SELECT * FROM company_service.company WHERE company_name=$1", [name]);
    return result.rows.length > 0 ? result.rows[0] : null;
}

export const createCompany = async (
    company_name : string,
    description : string,
    logo_url : string,
    location : string,
    industry : string,
    created_at : Date,
    created_by : number
) : Promise<Company | null> => {
    const result = await db.query("INSERT INTO company_service.company (company_name, description, logo_url, location, industry, created_at, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [company_name, description, logo_url, location, industry, created_at, created_by]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
}

export const findCompaniesCreatedByUser = async (user_id: number,  limit: number = -1,  offset: number = 0): Promise<Array<Company>> => {
    const query = limit === -1 
      ? "SELECT * FROM company_service.company WHERE created_by = $1" 
      : "SELECT * FROM company_service.company WHERE created_by = $1 LIMIT $2 OFFSET $3";
    const params = limit === -1 ? [user_id] : [user_id, limit, offset * limit];
    const result = await db.query(query, params);
    return result.rows;
  };
  


export const findCompaniesByKeyword = async (keywords : {[key : string] : any}, limit : number = -1, offset : number = 0) : Promise<Array<Company>> => {
    const {description, location, industry} = keywords;
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

    db_query = limit === -1 
    ? db_query 
    : db_query+` LIMIT ${counter+1} OFFSET ${counter+2}`;

    const params = limit === -1 ? parametrs : parametrs.concat([limit, offset * limit]);

    const result = await db.query(db_query, parametrs);
    return result.rows;
}


export const updateCompanyProfile = async (company_id : number, keywords : {[key : string] : string}) : Promise<Company | null> => {
    const {description, location, industry, logo_url} = keywords;
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

    if(logo_url){
        counter += 1;
        db_query += `logo_url = $${counter} , `;
        parameters.push(logo_url);
    }

    db_query = db_query.substring(0, db_query.lastIndexOf(","));

    counter += 1;
    db_query += ` WHERE company_id = $${counter} RETURNING *`;
    parameters.push(company_id);

    const result = await db.query(db_query, parameters);
    console.log("sent query");
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
  
export const deleteCompany = async (id : number) : Promise<boolean> => {
    const result = await db.query("DELETE FROM company_service.company WHERE company_id = $1 RETURNING *", [id]);
    return result.rows.length > 0;
}