import db from "@shared/config/db";
import { Survey } from "@shared/models/survey";

export const insertSurvey = async (user_id : number, question : string, answers : Array<string>, user_choice : number, date : Date) : Promise<Survey|null> => {
    const result = await db.query("INSERT INTO payment_service.survey (user_id, question, answers, user_choice, date) VALUES ($1, $2, $3, $4, $5)", [user_id, question, answers, user_choice]);
    return result.rows.length > 0 ? result.rows[0] : null;
}

export const getSurvey = async (user_id : number, date : Date) : Promise<Survey|null> => {
    const result = await db.query("SELECT * FROM payment_service.survey WHERE user_id = $1 AND date = $2");
    return result.rows.length > 0 ? result.rows[0] : null;
}