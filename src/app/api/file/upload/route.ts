
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { File } from "buffer";
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
    const formData = await req.formData()
    const file = formData.get('file')
    // const file = req.arrayBuffer()
    console.log(file)
    
    if(!file || !(file instanceof File)){
        return Response.json({status: 400, body: {error: 'No file found'}})
    }
    const csvString = await file.arrayBuffer()

    // const fileBuffer = await file.arrayBuffer()
    const decoder = new TextDecoder("utf-8");
    const csvString1 = decoder.decode(csvString);
    const csvObject = csvString1.split("\n").map((row) => row.split(","));
    const addApplication = csvObject.map((row) => {
        const [name, email, description, recomendations, status] = row;
        if(name === 'name') return null;
        return {
            name,
            email,
            description,
            recomendations,
            status,
        };
    });
    const filteredApplications = addApplication.filter((application) => application !== null);
    await db.application.createMany({
        data: filteredApplications,
        skipDuplicates: true,
    })
    return Response.json({status: 200, body: {message: 'File uploaded successfully'}})
    
}