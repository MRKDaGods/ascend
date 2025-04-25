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

export const getReportedPosts = (page: number =1) => {
    return extApi.get("/admin/posts/reports", {params: {page}})
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
    extApi.patch(`/admin/posts/reports/${reportId}`, {status,
        comment: comment?? null,
    });
}


