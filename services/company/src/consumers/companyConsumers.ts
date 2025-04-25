import { GetCompanyFollowers, GetCompanyProfile } from "@shared/rabbitMQ";
import { findCompanyById } from "../services/companyService";
import { getCompanyFollowers } from "../controllers/companyController";
import { findFollowersOfCompany } from "../services/followsService";

export const handleGetCompanyProfile = async (payload : GetCompanyProfile.Request): Promise<GetCompanyProfile.Response|null> => {
    const {company_id} = payload;
    if(!company_id){
        return {
            company : null
        };
    }

    const company = await findCompanyById(company_id);
    const response : GetCompanyProfile.Response = {
        company : company
    };
    return response;
    
};

export const handleGetCompanyFollowers = async (payload : GetCompanyFollowers.Request) : Promise<GetCompanyFollowers.Response|null> => {
    const { company_id } = payload;

    if(!company_id){
        return null;
    }
    try{
        const followers = await findFollowersOfCompany(company_id);
        const response : GetCompanyFollowers.Response = {
            company_followers : followers
        };
        return response;
    }catch{ // no company with such id
        return null;
    }
};