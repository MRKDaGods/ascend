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
    const result = await db.query("INSERT INTO company_serivce.company (company_name, description, logo_url, location, industry, created_at, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [company_name, description, logo_url, location, industry, created_at, created_by]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
}

export const findCompaniesCreatedByUser = async (user_id: number) : Promise<Array<Company>> => {
    const result = await db.query("SELECT * FROM company_service.company WHERE created_by = $1", [user_id]);
    return result.rows; 
}


export const findCompaniesByKeyword = async (keywords : {[key : string] : any}) : Promise<Array<Company>> => {
    const {description, location, industry} = keywords;
    let counter : number = 0;
    let db_query : string = "SELECT * FROM company_service.company WHERE ";
    let parametrs : Array<string> = [];

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

    db_query = db_query.substring(0, db_query.lastIndexOf("AND"));

    const result = await db.query(db_query, parametrs);
    return result.rows;
}


export const updateCompanyProfile = async (company_id : number, keywords : {[key : string] : any}) : Promise<Company | null> => {
    const {description, location, industry, logo_url} = keywords;
    let counter : number = 0;
    let db_query : string = "UPDATE company_service.company SET ";
    let parametrs : Array<any> = [];

    if(description){
        counter += 1;
        db_query += `description = ${counter} , `;
        parametrs.push(description);
    }

    if(location){
        counter += 1;
        db_query += `location = ${counter} , `;
        parametrs.push(location);
    }
    if(industry){
        counter += 1;
        db_query += `industry = ${counter} , `;
        parametrs.push(industry);
    }

    if(logo_url){
        counter += 1;
        db_query += `logo_url = ${counter} , `;
        parametrs.push(logo_url);
    }

    db_query = db_query.substring(0, db_query.lastIndexOf(","));

    counter += 1;
    db_query += ` WHERE company_id = ${counter}`;
    parametrs.push(company_id);

    const result = await db.query(db_query, parametrs);
    return result.rows.length > 0 ? result.rows[0] : null;
}


export const findCompaniesCreatedAt = async (date : Date) : Promise<Array<Company>> => {
    const result = await db.query("SELECT * FROM company_service.company WHERE DATE(created_at) = $1", [date])
    return result.rows;
}

export const findCompaniesCreatedBefore = async (date : Date) : Promise<Array<Company>> => {
    const result = await db.query("SELECT * FROM company_service.company WHERE DATE(created_at) < $1", [date])
    return result.rows;
}


export const findCompaniesCreatedAfter = async (date : Date) : Promise<Array<Company>> => {
    const result = await db.query("SELECT * FROM company_service.company WHERE DATE(created_at) > $1", [date])
    return result.rows;
}


export const findCompaniesCreatedBetween = async (date1 : Date, date2 : Date) : Promise<Array<Company>> => {
    const result = await db.query("SELECT * FROM company_service.company WHERE DATE(created_at) >= $1 AND DATE(created_at) <= $2", [date1, date2])
    return result.rows;
}

export const deleteCompany = async (id : number) : Promise<void> => {
    await db.query("DELETE FROM company_service.company WHERE company_id = $1", [id]);
}