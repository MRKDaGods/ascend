import { extApi } from "@/api";

type createAdminProps = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
   
}
export const getUsersCount = (duration = "day")=>{
    return extApi.get("/admin/users/count", {params: {duration}})
}

export const getJobsCount = (duration="day")=>{
    return extApi.get("/admin/jobs/count", {params: {duration}})
}

export const getPostsCount = (duration="day")=>{
    return extApi.get("/admin/posts/count", {params: {duration}})
}

export const getConnectionsCount = (duration="day")=>{
    return extApi.get("/admin/connections/count", {params: {duration}})
}

export const getReportedPostsCount = (duration="day")=>{
    return extApi.get("/admin/posts/count", {params: {duration}})
}

export const getReportedJobsCount = (duration="day")=>{
    return extApi.get("/admin/jobs/reports/count", {params: {duration}})
}

export const getFollowsCount = (duration="day")=>{
    return extApi.get("/admin/follows/count", {params: {duration}})
}

{/*gets reported posts without report info*/}
export const getReportedPosts = (page: number =1) => {
    return extApi.get("/admin/posts/reported", {params: {page}})
}

export const deletePost = (postId: number) => {
    return extApi.delete(`/admin/posts/${postId}`)
}

export const updatePostReport = (
    reportId: number,
    status: "pending" | "reviewed" | "resolved" | "rejected",
    comment?: string  
) => 
{
    return extApi.patch(`/admin/posts/reports/${reportId}`, {status,
        comment: comment?? null,
    });
}

export const getReportedJobs = (page: number =1) => {
    return extApi.get("/admin/jobs/reported", {params: {page}})
}

    export const updateJobReport = (
        reportId: number,
        status: "pending" | "reviewed" | "resolved" | "rejected",
    ) => {
        return extApi.patch(`/admin/jobs/reports/${reportId}`, {status});
    }

    export const deleteJob = (jobId: number) => {
        return extApi.delete(`/admin/jobs/${jobId}`)
    }

    export const getPostReports = (postId:number,page:number=1)=>{
        return extApi.get(`/admin/posts/${postId}/reports`,{params: {page}})
    }

    export const getBannedUsers = () => {
        return extApi.get("/auth/banned")
    }

    export const deleteUser = (userId: number) => {
        console.log(userId);
        return extApi.post("/auth/admin-delete-user",  { user_id: userId } )
        
    }

    export const unbanUser = (userId: number) => {
        return extApi.post("/auth/unban-user",  { user_id: userId } )
    }

    export const getUserReports = ()=>{
        return extApi.get("/auth/admin-get-user-reports");
    }

    export const banUser = (userId:number)=>{
        return extApi.post("/auth/ban-user",  { user_id: userId } );
    }

    export const deleteReport = (reportId:number)=>{
        return extApi.post("/auth/admin-delete-user-report",  { report_id: reportId } )

    }

    export const getJobReports = (JobId:number,page:number=1)=>{
        return extApi.get(`/admin/jobs/${JobId}/reports`,{params: {page}})
    }

    export const createAdminUser = ({firstName,lastName,email,password}:createAdminProps) => {
        return extApi.post("/auth/admin-create-user", {
            first_name: firstName,
            last_name: lastName,
            email:email,
            password:password,
        });
    }