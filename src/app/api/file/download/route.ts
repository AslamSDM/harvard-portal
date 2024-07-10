import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";


export async function GET(){
    const session = await getServerSession(authOptions)
    if(!session){
        return Response.json({status: 401, body: {error: 'Unauthorized'}})
    }
    const user = await db.user.findUnique({
        where: {email: session.user?.email??""}
    })
    if(!user || !user.isAdmin){
        return {status: 401, body: {error: 'Unauthorized'}}
    }
    const files = await db.application.findMany()
    const csv = 'id,name,email,description,recomendations,status\n' + files.map(file => {
        return `${file.id},${file.name},${file.email},${file.description},${file.recomendations??"NIL"},${file.status}`;
    }).join('\n');

    // Return CSV file as response
    return new Response(csv, {
        status: 200,
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="files.csv"'
        }
    });
}
    

