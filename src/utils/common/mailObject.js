import { MAIL_ID } from "../../config/serverConfig.js";

export const workspaceJoinMail=function(workspace){
   return{
     from:MAIL_ID,
     subject:"you have been added to workspace",
     text:`Congractulations you have been added to workspace ${workspace.name}`
   }
}