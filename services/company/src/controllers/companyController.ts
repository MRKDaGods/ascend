import authenticateToken, { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import { Request, Response } from "express";
import { createCompany, findCompanyById, updateCompanyProfile } from "../services/companyService";
import { error } from "console";

export const createCompanyProfile = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    const {name, description, industry, location, logoUrl} = req.body;
    try {
        const date = new Date();
        const company = await createCompany(name, description, logoUrl, location, industry, date, user_id);
        return res.status(200).json({
            success : true,
            data : {
                company : {
                    id : company?.id,
                    name : company?.company_name,
                    description : company?.description,
                    industry : company?.industry,
                    location : company?.location,
                    logoUrl : company?.logo_url,
                    createdAt : company?.created_at
                }
            },
            error : null
        });
    }catch(e){
        console.log(`Server error : ${e}`)
        return res.status(500).json({error : "Internal server error : "})
    }
}

export const updateCompany = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    const company_id = parseInt(req.params["companyId"], 10);
    const {description, industry, location, logoUrl} = req.body;
    try {
        const company = await findCompanyById(company_id);
        if(!company){
            return res.status(404).send();
        }
        if(company?.created_by !== user_id){
            return res.status(401).send();
        }
        const updated_company = await updateCompanyProfile(company_id, {location : location, description : description, industry : industry, logo_url : logoUrl});
               
        return res.status(200).json({
            success : true,
            data : {
                company : {
                    id : updated_company?.id,
                    name : updated_company?.company_name,
                    description : updated_company?.description,
                    industry : updated_company?.industry,
                    location : updated_company?.location,
                    logoUrl : updated_company?.logo_url,
                    createdAt : updated_company?.created_at
                }
            },
            error : null
        });
    }catch(e){
        console.log(`Server error : ${e}`)
        return res.status(500).json({error : "Internal server error : "})
    }
}