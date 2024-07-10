import { db } from "@/lib/db"
import { hash } from "bcrypt"



export async function POST(req:Request){
    const request = await req.json()
    const {email,username, password} = request
    if(!email || !password){
        return Response.json({status: 400, body: {error: 'email and password are required'}})
    }
    const user = await db.user.findUnique({
        where: {email}
    })
    if(user){
        return Response.json({status: 400, body: {error: 'User already exists'}})
    }
    const hashedPassword = await hash(password, 10)
    const newUser = await db.user.create({
        data: {
            email,
            username,
            password: hashedPassword
        }
    })
    console.log(newUser)
    return Response.json({status: 200, body: newUser})
}