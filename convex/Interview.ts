import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const SavedInterviewQuestion =mutation({
  args: {
    questions: v.any(),
    uId: v.id("UserTable"),
    resumeUrl:v.optional(v.string()),
    jobTitle:v.optional(v.string()),
    jobDescription:v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const result = await ctx.db.insert("InterviewSessionTable", {
      interviewQuestions: args.questions,
      resumeUrl: args.resumeUrl,
      userId: args.uId,
      status: "draft",
      jobTitle:args.jobTitle,
      jobDescription:args.jobDescription,
      createdAt: Date.now(),
    });

    return result;
  },
});


export const GetInterviewQuestions=query({
  args:{
    interviewRecordId:v.id('InterviewSessionTable')
  },
  handler:async(ctx,args)=>{

    const result=await ctx.db.query('InterviewSessionTable')
    .filter((q)=>q.eq(q.field('_id'),args.interviewRecordId)).first();

    return result;
  },
});

export const SaveInterviewAnswersAndFeedback = mutation({
  args: {
    interviewRecordId: v.id('InterviewSessionTable'),
    userAnswers: v.any(),
    feedback: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.interviewRecordId, {
      userAnswers: args.userAnswers,
      feedback: args.feedback,
      status: "completed",
    });
    return "Success";
  }
});

export const GetAllInterviews = query({
  args: {
    userId: v.id('UserTable')
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.query('InterviewSessionTable')
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .order("desc")
      .collect();
    return result;
  }
});