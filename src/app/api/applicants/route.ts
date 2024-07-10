import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";


export async function GET(req:Request){
    const session = await getServerSession(authOptions)
    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    if(!session){
        return Response.json({status: 401, body: {error: 'Unauthorized'}})
    }
    const user = await db.user.findUnique({
        where: {email: session.user?.email??""}
    })
    if(!user || !user.isAdmin){
        return Response.json({status: 401, body: {error: 'Unauthorized'}})
    }
    if(id){
        const application = await db.application.findUnique({
            where: {id:Number(id)}
        })
        return Response.json({status: 200, body: application})
    }
    const applicants = await db.application.findMany()
    return Response.json({status: 200, body: applicants})
}