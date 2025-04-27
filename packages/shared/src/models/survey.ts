
/**
 * Interface representing a feature purchase by a user
 * @interface
 * @property {number} user_id 
 * @property {string} question
 * @property {Array<string>} answers
 * @property {number} user_choice
 * @property {Date} date 
 */
export interface Survey {
    user_id : number;
    question : string;
    answers : Array<string>;
    user_choice : number;
    date : Date; 
};
