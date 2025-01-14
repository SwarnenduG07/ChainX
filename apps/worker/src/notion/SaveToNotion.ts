import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function saveToNotion(databaseId: any, emailData: any) {
   for(const email of emailData) {
    await notion.pages.create({
      parent: {database_id: databaseId},
      properties: {
        Name: {
           title: [
            {
              text: {
                content: email.subject || "No Subject",
              },
            },
           ],
        },
        content :{
          rich_text: [
              {
                text: {
                  content: email.snippet || "No Content",
                },
              },
          ],
        },
        Date: {
          date: {
            start : new Date(email.internalDate).toISOString(),
          },
        },
      },
    });
   }  
}