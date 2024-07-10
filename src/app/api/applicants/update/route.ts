
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function POST(req:Request){

    const session = await getServerSession(authOptions)
    if(!session){
        return Response.json({status: 401, body: {error: 'Unauthorized'}})
    }
    const user = await db.user.findUnique({
        where: {email: session.user?.email??""}
    })
    if(!user || !user.isAdmin){
        return Response.json({status: 401, body: {error: 'Unauthorized'}})
    }
    const {id, status} = await req.json()
    const applicant = await db.application.findUnique({
        where: {id:Number(id)}
    })
    if(!applicant){
        return Response.json({status: 404, body: {error: 'Applicant not found'}})
    }
    const update =await db.application.update({
        where: {id: applicant.id},
        data: {status}
    })
    return Response.json({status: 200, body: {message: 'Applicant updated successfully'},data:update})
}