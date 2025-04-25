
/**
 * Interface representing a feature purchase by a user
 * @interface
 * @property {number} user_id 
 * @property {string} question
 * @property {Array<string>} responses
 * @property {number} user_choice
 */
export interface Survey {
    user_id : number,
    question : string,
    
};
