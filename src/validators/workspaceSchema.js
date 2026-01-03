import {z} from 'zod'

export const createWorkSpaceSchema=z.object({
    name:z.string().min(0).max(50)
});

export const addMemberToWorkspaceSchema=z.object({
    memberId:z.string()
});

export const addChannelToWorkspaceSchema=z.object({
    channelName:z.string()
})