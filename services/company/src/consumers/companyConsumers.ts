import { GetCompanyFollowers, IsCompanyCreator } from "@shared/rabbitMQ";
import { findCompanyById } from "../services/companyService";
import { getCompanyFollowers } from "../controllers/companyController";
import { findFollowersOfCompany } from "../services/followsService";

export const handleIsCompanyCreator = async (payload : IsCompanyCreator.Request): Promise<IsCompanyCreator.Response|null> => {
    const {user_id , company_id} = payload;
    if(!user_id || !company_id){
        return null;
    }

    const company = await findCompanyById(company_id);
    if(!company){
        return null;
    }

    if(company.created_by === user_id){
        const response : IsCompanyCreator.Response = {
            is_company_creator : true
        };
        return response;
    }else{
        const response : IsCompanyCreator.Response = {
            is_company_creator : false
        };
        return response;
    }
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