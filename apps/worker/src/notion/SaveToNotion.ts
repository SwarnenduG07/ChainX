import 'dotenv/config'
import { Client } from "@notionhq/client";

// Fix typo in env variable name
const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function saveToNotion(databaseId: string, emailData: any[]) {
  console.log(`Starting Notion save for ${emailData.length} emails to database ${databaseId}`);
  
  for (const email of emailData) {
    try {
      console.log("Saving email:", email.subject);
      
      // Safely handle the date conversion
      let dateString;
      try {
        // Gmail returns timestamp in milliseconds
        const timestamp = parseInt(email.internalDate);
        if (!isNaN(timestamp)) {
          dateString = new Date(timestamp).toISOString();
        } else {
          dateString = new Date().toISOString(); // Fallback to current date
        }
      } catch (error) {
        console.warn("Error parsing date:", error);
        dateString = new Date().toISOString();
      }

      await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          Name: {
            title: [{ text: { content: email.subject || "No Subject" } }]
          },
          content: {
            rich_text: [{ text: { content: email.snippet || "No Content" } }]
          },
          Date: {
            date: { start: dateString }
          }
        }
      });
      console.log("Successfully saved email to Notion");
    } catch (error) {
      console.error("Failed to save to Notion:", error);
    }
  }
}