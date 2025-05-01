import { body, query, param, ValidationChain, Meta, oneOf } from "express-validator";

const imageFileValidation = (value: any, { req, location, path }: Meta) => {
    const { buffer, file_name, file_size, mime_type, context } = req.body[`${path}`];
    if (!buffer) {
        throw new Error(`'${path}.buffer' is required`);
    } else if (!file_name) {
        throw new Error(`'${path}.file_name' is required`);
    } else if (!file_size) {
        throw new Error(`'${path}.file_size' is required`);
    } else if (!mime_type) {
        throw new Error(`'${path}.mime_type' is required`);
    }



    const size = parseInt(file_size);
    if (Number.isNaN(size) || size < 0) {
        throw new Error(`'${path}.file_size' can't be negative`);
    }

    if (size > 5 * 1024 * 1024) {
        throw new Error(`'${path}.file_size' maximum allowed size is 5 MB`);
    }

    if (file_name === "") {
        throw new Error(`'${path}.file_name' cannot be an empty string`);
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(mime_type)) {
        throw new Error(`'${path}.mime_type' can only be JPG or PNG`);
    }

    try {
        Buffer.from(buffer, 'base64').toString('base64') === buffer.replace(/\s/g, '');
    } catch (e) {
        throw new Error(`'${path}.buffer' must be a base64 string`);
    }

    if (context && context !== "profile_photo") {
        throw new Error("invalid context");
    }

    return true;
}

const videoFileValidation = (value: any, { req, location, path }: Meta) => {
    const { buffer, file_name, file_size, mime_type, context } = req.body[`${path}`];
    if (!buffer) {
        throw new Error(`'${path}.buffer' is required`);
    } else if (!file_name) {
        throw new Error(`'${path}.file_name' is required`);
    } else if (!file_size) {
        throw new Error(`'${path}.file_size' is required`);
    } else if (!mime_type) {
        throw new Error(`'${path}.mime_type' is required`);
    }



    const size = parseInt(file_size);
    if (Number.isNaN(size) || size < 0) {
        throw new Error(`'${path}.file_size' can't be negative`);
    }

    if (size > 5 * 1024 * 1024 * 1024) {
        throw new Error(`'${path}.file_size' maximum allowed size is 5 GB`);
    }

    if (file_name === "") {
        throw new Error(`'${path}.file_name' cannot be an empty string`);
    }

    const allowedTypes = ["video/mp4"];
    if (!allowedTypes.includes(mime_type)) {
        throw new Error(`'${path}.mime_type' can only be video/mp4`);
    }

    try {
        Buffer.from(buffer, 'base64').toString('base64') === buffer.replace(/\s/g, '');
    } catch (e) {
        throw new Error(`'${path}.buffer' must be a base64 string`);
    }

    if (context && context !== "profile_photo") {
        throw new Error("invalid context");
    }

    return true;
}

const updateVideoFileValidation = (value: any, { req, location, path }: Meta) => {
    if (value === "") {
        return true;
    }
    const { buffer, file_name, file_size, mime_type, context } = req.body[`${path}`];
    if (!buffer) {
        throw new Error(`'${path}.buffer' is required`);
    } else if (!file_name) {
        throw new Error(`'${path}.file_name' is required`);
    } else if (!file_size) {
        throw new Error(`'${path}.file_size' is required`);
    } else if (!mime_type) {
        throw new Error(`'${path}.mime_type' is required`);
    }



    const size = parseInt(file_size);
    if (Number.isNaN(size) || size < 0) {
        throw new Error(`'${path}.file_size' can't be negative`);
    }

    if (size > 5 * 1024 * 1024 * 1024) {
        throw new Error(`'${path}.file_size' maximum allowed size is 5 GB`);
    }

    if (file_name === "") {
        throw new Error(`'${path}.file_name' cannot be an empty string`);
    }

    const allowedTypes = ["video/mp4"];
    if (!allowedTypes.includes(mime_type)) {
        throw new Error(`'${path}.mime_type' can only be video/mp4`);
    }

    try {
        Buffer.from(buffer, 'base64').toString('base64') === buffer.replace(/\s/g, '');
    } catch (e) {
        throw new Error(`'${path}.buffer' must be a base64 string`);
    }

    if (context && context !== "profile_photo") {
        throw new Error("invalid context");
    }

    return true;
}


export const createCompanyValidation: ValidationChain[] = [
    body("name").exists().withMessage("'name' is required").isString()
        .trim().notEmpty().withMessage("'name' cannot be empty")
        .isLength({ min: 3, max: 50 }).withMessage("'name' length must be between 3 and 50"),


    body("industry").exists().withMessage("'industry' is required").isString()
        .trim().notEmpty().withMessage("'industry' cannot be empty")
        .isLength({ max: 50 }).withMessage("'industry' length cannot exceede 50"),

    body("description").exists().withMessage("'description' is required").isString()
        .trim().notEmpty().withMessage("'description' cannot be empty"),

    body("profile_photo").exists().withMessage("'profile_photo' is required").custom(imageFileValidation),

    body("cover_photo").exists().withMessage("'cover_photo' is required").custom(imageFileValidation),

    body("location").exists().withMessage("'location' is required").isString().trim()
        .notEmpty().withMessage("'location' cannot be empty")
        .isLength({ max: 50 }).withMessage("'location' length cannot exceede 50")
];

export const companyIdValidation: ValidationChain[] = [
    param("companyId").isInt({ min: 1 }).withMessage("'companyId' can only be a positive integer")
];

export const updateCompanyValidation: ValidationChain[] = [
    body("name").optional().isString()
        .trim().notEmpty().withMessage("'name' cannot be empty")
        .isLength({ min: 3, max: 50 }).withMessage("'name' length must be between 3 and 50"),

    body("industry").optional().isString()
        .trim().notEmpty().withMessage("'industry' cannot be empty")
        .isLength({ max: 50 }).withMessage("'industry' length cannot exceede 50"),

    body("description").optional().isString()
        .trim().notEmpty().withMessage("'description' cannot be empty"),

    body("profile_photo").optional().custom(imageFileValidation),

    body("cover_photo").optional().custom(imageFileValidation),

    body("location").optional().isString().trim()
        .notEmpty().withMessage("'location' cannot be empty")
        .isLength({ max: 50 }).withMessage("'location' length cannot exceede 50")
];

export const createAnnouncementValidation: ValidationChain[] = [
    body("content").optional().isString().trim()
        .notEmpty().withMessage("'content' cannot be empty"),

    body("announcement_video").optional().custom(videoFileValidation),

    body("deleted_image_ids").optional().isArray().withMessage("'deleted_image_ids' must be an array")
    .bail()
    .custom((value) => {
      const allPositiveIntegers = value.every(
        (id : any) => Number.isInteger(id) && id > 0
      );
      if (!allPositiveIntegers) {
        throw new Error("all elements of 'deleted_image_ids' must be positive integers");
      }
      return true;
    }),

    body("announcement_photos").optional().isArray().withMessage("'announcement_photos' must be an array")
        .bail()
        .custom((items: Array<any>) => {
            {
                for (const item of items) {
                    const { buffer, file_name, file_size, mime_type, context } = item;
                    if (!buffer) {
                        throw new Error(`'announcement_photo.buffer' is required`);
                    } else if (!file_name) {
                        throw new Error(`'announcement_photo.file_name' is required`);
                    } else if (!file_size) {
                        throw new Error(`'announcement_photo.file_size' is required`);
                    } else if (!mime_type) {
                        throw new Error(`'announcement_photo.mime_type' is required`);
                    }



                    const size = parseInt(file_size);
                    if (Number.isNaN(size) || size < 0) {
                        throw new Error(`'announcement_photo.file_size' can't be negative`);
                    }

                    if (size > 5 * 1024 * 1024) {
                        throw new Error(`'announcement_photo.file_size' maximum allowed size is 5 MB`);
                    }

                    if (file_name === "") {
                        throw new Error(`'announcement_photo.file_name' cannot be an empty string`);
                    }

                    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
                    if (!allowedTypes.includes(mime_type)) {
                        throw new Error(`'announcement_photo.mime_type' can only be JPG or PNG`);
                    }

                    try {
                        Buffer.from(buffer, 'base64').toString('base64') === buffer.replace(/\s/g, '');
                    } catch (e) {
                        throw new Error(`'announcement_photo.buffer' must be a base64 string`);
                    }

                    if (context && context !== "profile_photo") {
                        throw new Error("invalid context");
                    }
                }

                return true;
            }
        })
];

export const updateAnnouncementValidation: ValidationChain[] = [
    body("content").optional().isString().trim()
        .notEmpty().withMessage("'content' cannot be empty"),

    body("announcement_video").optional().custom(updateVideoFileValidation),

    body("announcement_photos").optional().isArray().withMessage("'announcement_photos' must be an array")
    .bail().custom((items: any) => {
            {
                for (const item of items) {
                    const { buffer, file_name, file_size, mime_type, context } = item;
                    if (!buffer) {
                        throw new Error(`'announcement_photo.buffer' is required`);
                    } else if (!file_name) {
                        throw new Error(`'announcement_photo.file_name' is required`);
                    } else if (!file_size) {
                        throw new Error(`'announcement_photo.file_size' is required`);
                    } else if (!mime_type) {
                        throw new Error(`'announcement_photo.mime_type' is required`);
                    }



                    const size = parseInt(file_size);
                    if (Number.isNaN(size) || size < 0) {
                        throw new Error(`'announcement_photo.file_size' can't be negative`);
                    }

                    if (size > 5 * 1024 * 1024) {
                        throw new Error(`'announcement_photo.file_size' maximum allowed size is 5 MB`);
                    }

                    if (file_name === "") {
                        throw new Error(`'announcement_photo.file_name' cannot be an empty string`);
                    }

                    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
                    if (!allowedTypes.includes(mime_type)) {
                        throw new Error(`'announcement_photo.mime_type' can only be JPG or PNG`);
                    }

                    try {
                        Buffer.from(buffer, 'base64').toString('base64') === buffer.replace(/\s/g, '');
                    } catch (e) {
                        throw new Error(`'announcement_photo.buffer' must be a base64 string`);
                    }

                    if (context && context !== "profile_photo") {
                        throw new Error("invalid context");
                    }
                }
                return true;
            }
        })
];

export const announcementIdValidation: ValidationChain[] = [
    param("announcementId").isInt({ min: 1 }).withMessage("'announcementId' can only be a positive integer")
];

export const limitAndPageValidation: ValidationChain[] = [
    query("limit").optional().isInt({ min: 0 }).withMessage("'limit' can only be a non-negative integer"),

    query("page").if(query("limit").exists().withMessage("missing 'limit' query parameter"))
        .isInt({ min: 1 }).withMessage("'page' can only be a positive integer")
];



