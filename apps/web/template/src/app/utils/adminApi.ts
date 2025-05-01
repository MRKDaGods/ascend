import { extApi } from "@/api";

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
    return extApi.get("/admin/jobs/reports", {params: {page}})
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
