import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        picture: v.string(),
        uid: v.string(),
    },
    handler: async(ctx, args) => {
        // if user is already there
        const user = await ctx.db.query('users').filter((q) => q.eq(q.field('email'), args.email)).collect();
        console.log(user);
        // if no user exists
        if(user?.length === 0) {
            const userId = await ctx.db.insert('users', {
                name: args.name,
                picture: args.picture,
                email: args.email,
                uid: args.uid
            });
            console.log('userId : ', userId);
            return userId;
        }

    }
})

export const GetUser = query({
    args: {
        email: v.string()
    },
    handler: async(ctx, args) => {
        const user = await ctx.db.query('users').filter((q) => q.eq(q.field('email'), args.email)).collect();
        console.log(user);
        return user[0];
    }
})