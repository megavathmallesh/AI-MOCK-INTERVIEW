import { mutation } from "./_generated/server";
import{ v } from "convex/values";
export const CreateUser=mutation({
args:{ 
    name:v.string(),
    imageUrl:v.string(),
    email:v.string()
},
handler:async(ctx,args)=>{
    // if your already exist
    const user=await ctx.db.query('UserTable').filter(
        q=>q.eq(q.field('email'),args.email)).collect();

        // if not then insert new user
        if(user?.length===0){
            const data={
                name:args.name,
                imageUrl:args?.imageUrl,
                email:args.email

            }
           const result= await ctx.db.insert('UserTable',{
                ...data
            });
            console.log(result);
            return {
                ...data,
                _id: result
            };
        }
        return user[0];
}
});