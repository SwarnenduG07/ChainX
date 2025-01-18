import 'dotenv/config'
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Match exact Notion database property names from the schema
interface NotionProperties {
  title: string;
  rich_text: string;  
  date: string;       
}

export async function saveToNotion(databaseId: string, emailData: any[]) {
  console.log(`Starting Notion save for ${emailData.length} emails to database ${databaseId}`);
  
  try {
    const database = await notion.databases.retrieve({ database_id: databaseId });
    console.log("Database schema:", database.properties);
    
    for (const email of emailData) {
      try {
        console.log("Saving email:", email.subject);
        
        let dateString = new Date().toISOString();
        try {
          const timestamp = parseInt(email.internalDate);
          if (!isNaN(timestamp)) {
            dateString = new Date(timestamp).toISOString();
          }
        } catch (error) {
          console.warn("Error parsing date:", error);
        }

        await notion.pages.create({
          parent: { database_id: databaseId },
          properties: {
            // Using exact property names from  database schema
            "title": {
              title: [{ text: { content: email.subject || "No Subject" } }]
            },
            "rich_text": {
              rich_text: [{ text: { content: email.snippet || "No Content" } }]
            },
            "date": {
              date: { start: dateString }
            }
          }
        });
        console.log("Successfully saved email to Notion");
      } catch (error: any) {
        console.error("Failed to save to Notion:", error);
      }
    }
  } catch (error) {
    console.error("Failed to access Notion database:", error);
    throw error;
  }
}